
var _ = require('underscore');
var _ = require('jquery');
var base = require('./base');
var BaseView = base.BaseView;
var FadingMixIn = base.FadingMixIn;
var template = require('../templates/chat_room.ejs');


var ChatRoomView = BaseView.extend(FadingMixIn)
						  .extend({

  template: template,

});


module.exports = ChatRoomView;