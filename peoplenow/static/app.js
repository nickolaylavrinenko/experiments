
//var $ = require('jquery');
//var _ = require('lodash');

//console.log('>>> jquery', $);

var add_user = function(conf) {
	console.log('Register user ', conf);
	if ( conf.name && conf.password ) {
		user = new Backendless.User();
		user.name = conf.name;
		user.password = conf.password;
		if( conf.email ) {
			user.email = conf.email;
		}
		Backendless.UserService.register(user);
	}
};


var error_handler = Backendless.Async(
  function (subscription) {
    /* success */
  },
  function (response) {
  	console.warn('error occured!');
  }
);


var subscribe_to_channel = function(channel_name) {
	if( channel_name ) {
		var options = null;
		var callback = function(data){
			if (data && data.messages ) {
				display_messages(channel_name, data.messages);
			}
		};
		return Backendless.Messaging
							.subscribe(channel_name,
								         callback,
								         options,
								         error_handler);
	}
};


var push_to_channel = function(channel_name, messages) {
	if( messages && !_(messages).isArray() ) {
		messages = [messages];
	}
	if( channel_name && _(messages).isArray() && messages.length ) {
		var deliveryOps = new DeliveryOptions({
         pushPolicy: "PUSHONLY"
   	});
		_(messages).each(function(message){
			Backendless.Messaging
								.publish(channel_name,
												 message,
												 null,
												 deliveryOps,
												 error_handler);
		});
	}
};


var display_messages = function(channel_name, messages) {
	if ( channel_name && _(messages).isArray() && messages.length ) {
		_(messages).each(function(message){
			window.alert('channel: "' + channel_name + '", mew message: "' + message + '"');
		});
	}
};


$(function(){

	console.log('Application started');

  window.config = {
		APP_ID: '6D4C958D-0C09-359A-FF05-12C556EC6000',
		JS_KEY: 'E9758161-B979-FCF4-FF5F-11E67F2F1F00',
		APP_VERSION: 'v1',
	}

  // innit app
	Backendless.initApp(config.APP_ID, config.JS_KEY, config.APP_VERSION);

});