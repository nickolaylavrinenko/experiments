
var _ = require('underscore');
var base = require('./base');
var BaseView = base.BaseView;
var FadingMixIn = base.FadingMixIn;
var template = require('../templates/profile.ejs');


//var ProfileView = BaseView.extend(FadingMixIn)
//						  .extend({
var ProfileView = BaseView.extend({

  template: template,

});


module.exports = ProfileView;