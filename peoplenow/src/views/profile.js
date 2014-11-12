
var $ = require('jquery');
var _ = require('underscore');
var backend = require('../backend');
var base = require('./base');
var BaseView = base.BaseView;
var FadingMixIn = base.FadingMixIn;
var template = require('../templates/profile.ejs');
var TagsSelect = require('../controls/tagsSelect');


var ProfileView = BaseView.extend(FadingMixIn)
						  .extend({

  template: template,
  controls: {
  	'tags-input': TagsSelect,
  },

  bindEvents: function() {
    // bind submit event
    var submit = this.$('.submit-button').first(),
        form = submit.parent('form'),
        _this = this;
    if( submit.length && form.length ) {
      submit.on('click', function(e){
        e.preventDefault();
        var tags = form[0].tags ? form[0].tags.value : '';
        backend.saveTags(_this.router.auth.get('id'), tags.trim())
          .fail(function(error){
            alert("Error");
          })
          .done(function(){
            alert("Saved");
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

  /*
   * returns jQuery promise object
   */
  loadUserTags: function(fbuid) {
  	return backend.loadUserTags(fbuid);
  },

});


module.exports = ProfileView;