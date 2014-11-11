
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
  	'tags-select-field': TagsSelect,
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
  	var deferred = $.Deferred();
  	backend.findUserByFBId(fbuid)
  		.fail(function(error){
  			deferred.reject(error);
  		})
  		.done(function(response){
        // get tags from response
  			user = (_.isArray(response.data) && response.data.length) ?
				  				response.data[0] : null;
        var tags = (user && _.isString(user.tags)) ? user.tags.trim(): '';
        tags = tags.split(',');
        // filter empty
        tags = _(tags).filter(function(tag){
          return !!tag.trim();
        });
        deferred.resolve(tags);
  		});
  	return deferred;
  },

});


module.exports = ProfileView;