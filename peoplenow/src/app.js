
// patch backbone extend method
require('./backbone_patch');
require('./styles/style.css');

var $ = require('jquery');
var _ = require('underscore');
var config = require('./config');
var constants = require('./constants');
var structures = require('./structures');
var errors = require('./errors');
var utils = require('./utils');
var Router = require('./router');
var backend = require('./backend');


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
var getAuthStatus = window.checkLoginState = function(callback){

  var auth_options = {};

  // get status data from FB
  FB.getLoginStatus(function(status) {

  	if( !_.isEmpty(status.authResponse) ) {
  		auth_options = _.extend(auth_options, status.authResponse);
  	}
		if( status && status.status ) {
			auth_options.status = status.status;
		}
		if( auth_options.status !== 'connected' ) {
			$('#auth-status').text('Please, log into app with Facebook');
		}

		// get profile data from FB
		FB.api('/me', function(profile) {
		  if( !_.isEmpty(profile) ) {
		    auth_options = _.extend(auth_options, profile);
		  }
		  if( _.isString(auth_options.name) ) {
				$('#auth-status').text(auth_options.name);
			}
		  if( _.isFunction(callback) ) {
				callback(auth_options);
			}
		});

	});

};


var initApp = function(auth_options) {

	var queue = new utils.Queue({'start': true});
	var container = $(constants.APP_CONTENT_SELECTOR).first();
	if( !container.length ){
		throw "Can't find application container element in DOM";
	}

	// init app router
	var router = new Router({
		queue: queue,
		auth: auth_options,
		container: container,
	});
	router.wrapLinks();
	router.startRouting();

	// update auth data from Facebook periodically
	setInterval(function(){
		getAuthStatus(function(auth_options){
			router.updateAuthData(auth_options)
		});
	}, constants.AUTH_REFRESH_INTERVAL);

	console.log('app: started');
	console.log('app: user ' + (router.checkAuth() ? 'authorized': 'not authorized') );

	//TODO temporary expose something to global context
	//TODO remove
	window.router = router;
	window.auth_options = router.auth;
	window.$ = $;
	window._ = _;

};


// DOM loaded

$(function(){

	// init facebook SDK and check get auth
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

			// init backendless
			Backendless.initApp(config.BACKENDLESS_APP_ID,
													config.BACKENDLESS_JS_KEY,
													config.BACKENDLESS_APP_VERSION);

			// authorized user
			if( auth_options.status
				    	&& auth_options.status === 'connected'
				    				&& auth_options.id ) {

				backend.findUserByFBId(auth_options.id)
					.fail(function(error){
						throw 'Cant fetch users from Backendless';
					})
					.done(function(response){
						user = (_.isArray(response.data) && response.data.length) ?
				  				response.data[0] : null;
				  	// user not found in Backendless
			  		if( !user ) {
			  			backend.registerUser(auth_options)
			  				.fail(function(error){
			  					throw 'Cant register user in Backendless';
			  				})
			  				.done(function(){
			  					initApp(auth_options);
			  				})
			  		}
					});

			}

			initApp(auth_options);

		});
	});
});
