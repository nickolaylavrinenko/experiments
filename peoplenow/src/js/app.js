
require('../styles/style.css')

var $ = require('jquery');
var _ = require('underscore');
var config = require('./config');
var structures = require('./structures');
var errors = require('./errors');
var utils = require('./utils');
var Router = require('./router');


// window.subscribe_to_channel = function(channels) {
// 	if( channels && !_(channels).isArray ) {
// 		channels = [channels];
// 	}
// 	if( _(channels).isArray() && channels.length ) {
		
// 		_(channels).each(function(channel){
// 			var options = null;
// 			var callback = function(data){
// 				if (data && data.messages ) {
// 					display_messages(channel.trim(), data.messages);
// 				}
// 			};
// 			Backendless.Messaging
// 							.subscribe(channel.trim(),
// 								         callback,
// 								         options,
// 								         errors.handler);
// 		});
		
// 	}
// };

// window.display_messages = function(channel_name, messages) {
// 	if ( channel_name && _(messages).isArray() && messages.length ) {
// 		_(messages).each(function(message){
// 			window.alert('channel: "' + channel_name + '", mew message: "' + message + '"');
// 		});
// 	}
// };


/*
 *
 */
var getAuthStatus = function(callback){

  var auth_options = {};

  FB.getLoginStatus(function(response) {

  	if( !_.isEmpty(response.authResponse) ) {
  		_.extend(auth_options, response.authResponse);
  	}
		if( response && response.status ) {
			auth_options.status = response.status;
			if( response.status === 'connected' ) {
				FB.api('/me', function(response) {
				  if( !_.isEmpty(response) ) {
				    _.extend(auth_options, response);
				  }
				  if( _.isFunction(callback) ) {
						callback(auth_options);
						return;
					}
				});

			}
		}
	  if( _.isFunction(callback) ) {
			callback(auth_options);
			return;
		}
	  
	});

};

// DOM loaded

$(function(){

	// init app global queue
	var queue = new utils.Queue({'start': true});

	// init facebook SDK
  $.ajaxSetup({ cache: true });
  $.getScript(config.FB_SDK_URL, function(){
    FB.init({
      appId: config.FB_APP_ID,
      cookie     : true,  // enable cookies to allow the server to access 
                          // the session
	    xfbml      : true,  // parse social plugins on this page
	    version    : 'v2.1' // use version 2.1
    });     
    $('#fb-login-button').removeAttr('disabled');
		getAuthStatus(function(auth_options){

			// innit backendless
			Backendless.initApp(config.APP_ID,
													config.JS_KEY,
													config.APP_VERSION);

			// init app blocks
			var blocks = _.extend({},
				require('./userRegisterForm'),
				require('./sendMessageForm')
			);
			_.each(blocks, function(constructor, class_name){
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

			// test for ejs
			//template = require('../templates/test.ejs');

			// init app router
			var router = new Router({
				queue: queue,
				auth: auth_options,
			});
			router.startRouting();
			setInterval(function(){
				getAuthStatus(function(auth_options){
					router.updateAuthData(auth_options)
				});
			}, 30000);


			console.log('Application started');

			//TODO temporary expose something to global context
			//TODO remove
			window.router = router;
			window.auth_options = router.auth;

		});
	});
});