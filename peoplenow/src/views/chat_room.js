
var _ = require('underscore');
var $ = require('jquery');
var base = require('./base');
var config = require('../config');
var utils = require('../utils');
var BaseView = base.BaseView;
var FadingMixIn = base.FadingMixIn;
var pageTemplate = require('../templates/chat_room.ejs');
var messageLeftTemplate = require('../templates/chat_message_left.ejs');
var messageRightTemplate = require('../templates/chat_message_right.ejs');


var ChatRoomView = BaseView.extend(FadingMixIn)
						  .extend({

  template: pageTemplate,
  room_id: null,
  room_path: null,
  ws: null,
  messages_container_selector: '.messages',
  SERVICE_OPERATIONS: {
  	GET_HISTORY: '_get_history',
  },

  initialize: function(options) {

  	var _super = this._super;
  	this.room_id = options.room_id;
  	this.room_path = options.room_path;
  	return _super.apply(this, arguments);

  },

  /*
   *	returns jQuery promise object
   */
	attach: function(container) {

    var _super = this._super;
    var _this = this;
    var _arguments = arguments;
    return $.when(_super.apply(_this, _arguments),
    							_this.loadHistory());

	},

  /*
   *	returns jQuery promise object
   */
	detach: function() {

    var _super = this._super;
    this.closeWebSocket();
    return _super.apply(this, arguments);

	},

	bindEvents: function() {

		var _this = this;
    var submit = this.$('.submit-button');
    var clear = this.$('.clear-button');
    var form = submit.closest('.form');

    // bind submit event
    if( submit.length && form.length ) {
      submit.on('click', function(e){
        e.preventDefault();
        // send message
        var message = form[0].message ? form[0].message.value : '';
        if( message ) {
          _this.sendMessage(message);
          _this.clearForm();
        }
      });
    }

    // bind clear event
    if( clear.length ) {
      clear.on('click', function(e){
        e.preventDefault();
        _this.clearForm();
      });
    }

  },

  scrollHistory: function() {

    //

  },

  unbindEvents: function() {

    // unbind buttons clicks
    this.$('.submit-button').of('click');
    this.$('.clear-button').of('click');

  },

  clearForm: function() {

    var submit = this.$('.submit-button');
    var form = this.$('.form');
    var _this = this;

    if( form.length ) {
      form.find('.message-input').val('');
    }

  },

  sendMessage: function(text) {
  	
  	var _this = this;
  	var user_name = _this.router.auth.get('name');
  	var now = new Date();
  	var timestamp = utils.forceString(now.getTime());

  	_this.getWebSocket().done(function(ws){
	  	if( text && user_name 
	  				&& timestamp && ws ) {
	  		
	  		var message = { user_name: user_name,
	  									  text: text,
	  									  timestamp: timestamp };
	  		ws.send(JSON.stringify(message));
	  	}
	  });

  },

	/*
   *	returns jQuery promise object
   */
  loadHistory: function() {

  	var _this = this;

  	// load history via sending service message to chat
  	this.getWebSocket().done(function(ws){
  		if( ws ) {
  			var service_message = {
  				operation: _this.SERVICE_OPERATIONS.GET_HISTORY,
  			};
  			ws.send(JSON.stringify(service_message));
  		}
  	});

  },

  _message_listener: function(event) {

  	var message = event.data;
  	message = $.parseJSON(message);
    if( message.timestamp ) {
      message.timestamp = new Date(message.timestamp);
    }

  	if( _.isObject(message)
  		 			&& !_.isEmpty(message)
  							&& message.user_name
  									&& message.text 
  											&& message.timestamp ) {
  		// render message
  		var message_html = '';
      console.log('>>> received message', this.router.auth, message);
  		if( message.name === this.router.auth.get('name') ) {
  			message_html = messageLeftTemplate(message);
  		} else {
  			message_html = messageRightTemplate(message);
  		}
  		// append to chat
      $(message_html)
          .appendTo($(this.messages_container_selector))
          .fadeIn(700);
      // scroll chat
      $(document).scrollTop(document.body.scrollHeight);
  	}

  },	

  /*
   *	returns jQuery promise object
   */
  getWebSocket: function(){

  	var deferred = $.Deferred();
  	var _this = this;
  	var listen_message_func = function(event){
			_this._message_listener(event);
	  };

	  // ws is opened
  	if( _this._checkWebSocket() ) {
  		// set on message received callback
  		if( !_this.ws.onmessage ) {
  			_this.ws.onmessage = listen_message_func;
  		}
  		deferred.resolve(_this.ws);
  	// ws is closed - connect to ws
  	} else {
  		_this._openWebSocket().done(function(ws){
  			// set on message received callback
  			if( ws && !ws.onmessage ) {
	  			ws.onmessage = listen_message_func;
	  		}
	  		deferred.resolve(ws);
  		});
  	}
  	return deferred;

  },

	/*
   *	returns jQuery promise object
   */
  _openWebSocket: function() {

  	var _this = this;
  	var deferred = $.Deferred();
  	var connected = false;
  	var url = "ws://" + config.WS_HOST + ":"
  										+ config.WS_PORT + this.room_path;
  	for(i=0; i<5; i++){
	  	try {
	  		_this.ws = new WebSocket(url);
	  		_this.ws.onopen = function(){		  		
	  			console.log('chat room: connected to websocket', url);
		  		deferred.resolve(_this.ws);
	  		};
	  		connected = true;
	  		break;	
	  	} catch(ex) {
	  		connected = false;
	  	}
		}
		if( !connected || !_this.ws ) {
			throw "Can't connect to chat room \"" + url + "\" via websocket";
		}
		return deferred;

  },

  _checkWebSocket: function(){

  	return (this.ws && this.ws instanceof WebSocket
  						&& this.ws.readyState === WebSocket.OPEN) ? true : false;

  },

  closeWebSocket: function() {

  	if( this._checkWebSocket() ) {
  		this.ws.close();
  		this.ws = null;
  	}

  },

});


module.exports = ChatRoomView;