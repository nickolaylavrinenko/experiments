
require('../styles/style.css');

var $ = require('jquery');
var _ = require('underscore');
var errors = require('./errors');
var constants = require('./constants');


var SendMessageForm = function(el) {
	this.form = $(el);
	this.initForm();
};

SendMessageForm.prototype.initForm = function() {
	var that = this;
	if( this.form ) {
		this.form.find('.submit-button')
					   .on('click', function(ev){
					   	 ev.preventDefault();
						 	 that._handle_submit(ev);
						 });
	}
};

SendMessageForm.prototype._handle_submit = function(ev) {
	var message = this.form[0].message.value;
	var tags = [];
	_(this.form[0].tags.options).each(function(option){
		option && option.selected && tags.push(option.value.toLowerCase());
	});
	if( message && tags.length ) {
		this.sendMessage(tags, message);
	}
	
};

SendMessageForm.prototype.sendMessage = function(tags, messages) {
	if( messages && !_(messages).isArray() ) {
		messages = [messages];
	}
	if( tags && !_(tags).isArray() ) {
		tags = [tags];
	}
	if( tags && messages ) {
		console.log('Send messages', tags, messages);
		_(tags).each(function(channel){
			_(messages).each(function(message){
				if( channel && message ) {
					Backendless.Messaging
																.publish(channel,
																				 message,
																				 null,
																				 null,
																				 errors.handler);
				}
			});
		});
	}
};


module.exports = {
	'send-message-form': SendMessageForm,
};