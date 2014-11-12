
var $ = require('jquery');
var _ = require('underscore');
var backend = require('../backend');
var base = require('./base');
var utils = require('../utils');
var BaseView = base.BaseView;
var FadingMixIn = base.FadingMixIn;
var template = require('../templates/send_message.ejs');
var TagsSelect = require('../controls/tagsSelect');


var SendMessageView = BaseView.extend(FadingMixIn)
						  .extend({

  template: template,
  controls: {
  	'tags-select': TagsSelect,
  },

  bindEvents: function() {
    // bind submit event
    var submit = this.$('.submit-button').first(),
        form = submit.parent('form'),
        _this = this;
    if( submit.length && form.length ) {
      submit.on('click', function(e){
        e.preventDefault();
        // get data from form
        var tags = form[0].tags ? form[0].tags.value : '';
        tags = utils.csvStringToArray(tags);
        var message = form[0].message ? form[0].message.value : '';
        backend.sendMessage(message, tags)
          .fail(function(error){
            alert("Error");
          })
          .done(function(){
            alert("Sended");
          })
      });
    }
  },

  unbindEvents: function() {
    this.$('.submit-button').first().off('click');
  },

  /*
   * returns jQuery promise object
   */
  loadAllTags: function() {
  	return backend.loadAllTags();
  },

});


module.exports = SendMessageView;