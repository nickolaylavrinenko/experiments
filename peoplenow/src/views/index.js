
var base = require('./base')
var BaseView = base.BaseView;
var FadingMixIn = base.FadingMixIn;
var template = require('../templates/index.ejs');


//var IndexView = BaseView.extend(FadingMixIn)
//						  .extend({
var IndexView = BaseView.extend({

//  template: template,

});


module.exports = {
	'IndexView': IndexView,
};