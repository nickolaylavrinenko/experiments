
var _ = require('underscore');
var base = require('./base');
var BaseView = base.BaseView;
var FadingMixIn = base.FadingMixIn;
var template = require('../templates/send_message.ejs');


var SendMessageView = BaseView.extend(FadingMixIn)
						  .extend({

  template: template,

});


module.exports = SendMessageView;