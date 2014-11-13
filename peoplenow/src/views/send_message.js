
var $ = require('jquery');
var _ = require('underscore');
var backend = require('../backend');
var base = require('./base');
var utils = require('../utils');
var config = require('../config');
var BaseView = base.BaseView;
var FadingMixIn = base.FadingMixIn;
var LocalStorageMixIn = base.LocalStorageMixIn;
var template = require('../templates/send_message.ejs');
var TagsSelect = require('../controls/tagsSelect');


var SendMessageView = BaseView.extend(FadingMixIn)
                              .extend(LocalStorageMixIn)
						                  .extend({

  formStorageKey: 'send_message.form',
  template: template,
  controls: {
  	'tags-input': TagsSelect,
  },

  render: function(attributes) {
    var _super = this._super;
    var _arguments = arguments;
    _super.apply(this, _arguments);
    this.loadFormFromStorage();
    return this;
  },

  bindEvents: function() {

    var submit = this.$('.submit-button');
    var clear = this.$('.clear-button');
    var form = submit.closest('.form');
    var _this = this;

    // bind submit event
    if( submit.length && form.length ) {
      submit.on('click', function(e){
        e.preventDefault();
        // get data from form
        var tags = form[0].tags ? form[0].tags.value : '';
        tags = utils.csvToArray(tags);
        var message = form[0].message ? form[0].message.value : '';
        // send message
        if( message && tags.length ) {
          backend.sendMessage(message, tags)
            .fail(function(error){
              alert("Error");
            })
            .done(function(){
              alert("Sended");
              _this.clearForm();
            });
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
      
    // bind save form interval
    if( !this._save_form_interval_id ) {
      this._save_form_interval_id = window.setInterval(function(){
        _this.saveFormToStorage();
      }, config.SAVE_FORM_INTERVAL);
    }

  },

  unbindEvents: function() {

    // unbind buttons clicks
    this.$('.submit-button').first().off('click');
    this.$('.clear-button').first().off('click');

    // unbind save form interval
    if( this._save_form_interval_id ) {
      window.clearInterval(this._save_form_interval_id);
      delete this._save_form_interval_id;
    }

  },

  saveFormToStorage: function() {

    var submit = this.$('.submit-button').first();
    var form = submit.parent('form');
    if( form.length ) {
      var data = JSON.stringify(form.serializeArray());
      if( data ) {
        this.setToStorage(this.formStorageKey, data);
      }
    }
  },

  loadFormFromStorage: function() {

    var submit = this.$('.submit-button').first();
    var form = submit.parent('form');
    var _this = this;

    if( form.length ) {
      // load form data
      var data = _this.getFromStorage(_this.formStorageKey) || '{}';
      try {
        data = $.parseJSON(data);
      } catch(e) {
        data = {};
      }
      // set form inputs
      if( !_.isEmpty(data) ) {
        _(data).each(function(options){
          var key = options.name;
          var value = options.value;
          if( key && value ) {
            var input = form[0][key];
            if( input ) {
              input.value = value;
            }
          }
        });
      }
    }

  },

  clearForm: function() {

    var submit = this.$('.submit-button');
    var form = this.$('.form');;
    var _this = this;

    if( form.length ) {
      // clear form inputs
      form.find('.input').val('');
      form.find('.tags-input').select2('val', []);
      // remove form data from storage
      _this.removeFromStorage(_this.formStorageKey);
    }

  },

  /*
   * returns jQuery promise object
   */
  loadAllTags: function() {
  	return backend.loadAllTags();
  },

});


module.exports = SendMessageView;