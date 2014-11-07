
var $ = require('jquery');
var _ = require('lodash');
var config = require('./config');
var structures = require('./structures');
var errors = require('./errors');


window.subscribe_to_channel = function(channels) {
	if( channels && !_(channels).isArray ) {
		channels = [channels];
	}
	if( _(channels).isArray() && channels.length ) {
		
		_(channels).each(function(channel){
			var options = null;
			var callback = function(data){
				if (data && data.messages ) {
					display_messages(channel.trim(), data.messages);
				}
			};
			Backendless.Messaging
							.subscribe(channel.trim(),
								         callback,
								         options,
								         errors.handler);
		});
		
	}
};

window.display_messages = function(channel_name, messages) {
	if ( channel_name && _(messages).isArray() && messages.length ) {
		_(messages).each(function(message){
			window.alert('channel: "' + channel_name + '", mew message: "' + message + '"');
		});
	}
};


$(function(){

	// innit backendless
	Backendless.initApp(config.APP_ID,
											config.JS_KEY,
											config.APP_VERSION);

	// init app blocks
	var blocks = _.assign(
		require('./userRegisterForm'),
		require('./sendMessageForm')
	);
	_(blocks).each(function(constructor, class_name){
		$('.' + class_name + ':not(.init-block)').each(function(ind, item){
			item = $(item);
			item.addClass('init-block');
			item.data('init-block', new constructor(item.first()));
		});
	});

  // get tags
  // var callback = Backendless.Async(
  // 	function(data){
  // 		console.log('>>> tags response success', data);
  // 	},
  // 	function(error){
  // 		console.log('>>> tags response error', error);
  // 	}
  // );
  // var users = Backendless.Persistence.of(structures.CustomUser).find(callback);
  // console.log('>>> users return', users);

	console.log('Application started');

});