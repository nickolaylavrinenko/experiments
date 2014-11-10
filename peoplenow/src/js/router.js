
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var constants = require('./constants');

var Router = Backbone.Router.extend({

  // queue to handle routes coherently
  queue : null,
  auth: new Backbone.Model(),

  initialize: function(options) {
    this.queue = options.queue;
    if( !_.isEmpty(options.auth) ) {
      this.auth.set(options.auth);  
    }
    this.listenTo(this.auth, 'change', this._on_auth_changed_handler);
  },

  /*
   * Routes handlers decorator
   */
  execute: function(callback, args) {
    // check auth
    if( !this.checkAuth() ) {
      this.queue.skipAll();
      this.queue.add(this, this.logoutHandler);
      this.queue.add(this, this.loginHandler);
      this.queue.add(this, callback, args);
    }
    // add callback to queue
    if( _.isFunction(callback) ){
      this.queue.add(this, callback, args);
    }
  },


  /******************** URL-map *********************/


  routes: {
    '': 'indexHandler',
    'profile(/)': 'profileHandler',
  },


  /****************** URL-callbacks *****************/

  /*
   * every callback returns promise object
   */


  indexHandler: function(){

    console.log('routing: start app');

    var deferred = $.Deferred();

    //TODO handler logic 

    return deferred;

  },

  profileHandler: function(){

    console.log('routing: profile');

    var deferred = $.Deferred();

    //TODO handler logic 

    return deferred;

  },


  /****************** Other methods *****************/


  checkAuth: function() {
    console.log('>>>>', this.auth.attributes);
    var result = false;
    if( !_.isEmpty(this.auth.attributes)
          && this.auth.get('status') === 'connected'
            && this.auth.get('userId') ) {
      result = true;
    }
    return result;
  },

  updateAuthData: function(object) {
    if( !_.isEmpty(object) ){
      this.auth.set(object);
    }
  },

  /*
   * call this method in app init script
   */
  startRouting : function() {
    Backbone.history.stop();
    Backbone.history.start({
        pushState: true,
        hashChange: true,
        root: '/',
        //silent: true,
    });
  },

  /*
   * modify all links, to pass them through router
   */
  setupLinks: function(container){
    var container = container ? $(container) : $(document.body);
    var links = container.find('a').filter(function(){
        var element = $(this);
        if( element.hasClass('no-proc') ) {
            return false;
        }
        var href = element.attr('href');
        //TODO need a regexp to check the path
        return href && href != "" && href != "#";
    });

    // link may has other handlers, so we must turn off appropriate handler (see .../js/calendar.js)
    links.off(constants.click_event, this._on_link_clicked_handler);
    links.on(constants.click_event, this._on_link_clicked_handler);
  },
  
  _on_link_clicked_handler: function(e) {
    e.preventDefault();
    this.navigateTo($(this).attr('href'),
                    {trigger: true, replace: false});
  },

  _on_auth_changed_handler: function() {
    console.log('router: auth parameters changed', arguments);
    var changed = this.auth.changedAttributes();
    if( !_.isEmpty(changed)
          && !this.checkAuth() ) {
      // redirect to index page fot login
      this.navigate('', {trigger: true, replace: false});
    }
  },

});


module.exports = Router;