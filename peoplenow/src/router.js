
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');

var constants = require('./constants');
var EmptyView = require('./views/base').EmptyView;
var IndexView = require('./views/index');
var SendMessageView = require('./views/send_message');
var ProfileView = require('./views/profile');


var Router = Backbone.Router.extend({

  // queue to handle routes coherently
  queue : null,
  auth: new Backbone.Model(),
  container: null,

  _cache: {},
  _active: null,

  initialize: function(options) {

    this.queue = options.queue;
    this.container = $(options.container);
    this.auth.set(options.auth, {silent: true});
    // add emty view as active
    this._active = new EmptyView();
    this._active.render()
                .attach(this.container);
    this.bindEvents();

  },

  bindEvents: function(){

    this.listenTo(this.auth, 'change', this._on_auth_changed_handler);

  },

  /*
   * Routes handlers hook
   */
  execute: function(callback, args) {
    // check auth
    if( !this.checkAuth() ) {
      this.queue.skipAll();
      this.queue.add(this, this.indexHandler);
      return;
    }
    // add callback to queue
    if( _.isFunction(callback) ){
      this.queue.add(this, callback, args);
    }
  },

  /******************** URL-map *********************/

  routes: {
    '': 'indexHandler',
    'index(/)': 'indexHandler',
    'profile(/)': 'profileHandler',
    'send_message(/)': 'sendMessageHandler',
  },

  /****************** URL-callbacks *****************/

  /*
   * every callback returns promise object
   */

  indexHandler: function(){

    var deferred = $.Deferred();
    var view_name = '/';
    var router = this;
    var container = this.container;

    // get view
    var view = this._cache[view_name];
    if( !view ) {
      view = new IndexView();
      this._cache[view_name] = view;
    }
    // detach previous view and attach new
    if( view !== this._active ) {
      console.log('routing: index page');
      this._active
          .detach()
          .done(function(){
            view.render()
              .wrapLinks(router)
              .attach(container)
              .done(function(){
                router._active = view;
                router.navigate(view_name, {trigger: false, replace: false})
                deferred.resolve();
              });
          });
    } else {
      router.navigate(view_name, {trigger: false, replace: false})
      deferred.resolve();
    }
    return deferred;

  },

  profileHandler: function(){

    var deferred = $.Deferred();
    var view_name = 'profile';
    var router = this;
    var container = this.container;

    // get view
    var view = this._cache[view_name];
    if( !view ) {
      view = new ProfileView();
      this._cache[view_name] = view;
    }
    // detach previous view and attach new
    if( view !== this._active ) {
      console.log('routing: profile');
      this._active
          .detach()
          .done(function(){
            view.render()
              .wrapLinks(router)
              .attach(container)
              .done(function(){
                router._active = view;
                router.navigate(view_name, {trigger: false, replace: false})
                deferred.resolve();
              });
          });
    } else {
      router.navigate(view_name, {trigger: false, replace: false})
      deferred.resolve();
    }
    return deferred;

  },

  sendMessageHandler: function(){

    var deferred = $.Deferred();
    var view_name = 'send_messgae';
    var router = this;
    var container = this.container;

    // get view
    var view = this._cache[view_name];
    if( !view ) {
      view = new SendMessageView();
      this._cache[view_name] = view;
    }
    // detach previous view and attach new
    if( view !== this._active ) {
      console.log('routing: send message page');
      this._active
          .detach()
          .done(function(){
            view.render()
              .wrapLinks(router)
              .attach(container)
              .done(function(){
                router._active = view;
                router.navigate(view_name, {trigger: false, replace: false})
                deferred.resolve();
              });
          });
    } else {
      router.navigate(view_name, {trigger: false, replace: false})
      deferred.resolve();
    }
    return deferred;

  },

  /****************** Other methods *****************/

  checkAuth: function() {
    var result = false;
    if( !_.isEmpty(this.auth.attributes)
          && this.auth.get('status') === 'connected'
            && this.auth.get('id') ) {
      result = true;
    }
    return result;
  },

  /*
   * returns jQuery promise object
   */
  // logoutUser: function() {
  //   var deferred = $.Deferred();
  //   FB.logout(function(){
  //     deferred.resolve();
  //   });
  //   return deferred;
  // },

  updateAuthData: function(object) {

    var _this = this;

    if( !_.isEmpty(object) ){
      // set new values
      this.auth.set(object);
      // unset values which not specified
      exists_keys = _(object).keys();
      to_remove_keys = _(this.auth.omit(exists_keys)).keys();
      _(to_remove_keys).each(function(key){
        if( key ) {
          _this.auth.unset(key);
        }
      });
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
    });
  },

  /*
   * modify all links, to pass them through router
   */
  wrapLinks: function(container){
    var _this= this;
    var container = container ? $(container) : $(document.body);
    var links = container.find('a').filter(function(){
        var element = $(this);
        if( element.hasClass('no-proc') ) {
            return false;
        }
        var href = element.attr('href');
        //TODO need a regexp to check the path
        return _.isString(href) && href != "#" && href != "?";
    });

    links.off('click');
    links.on('click', function(e) {
      _this._on_link_clicked_handler(e);
    });

  },

  unwrapLinks: function(container){
    var container = container ? $(container) : $(document.body);
    var links = container.find('a').filter(function(){
        var element = $(this);
        if( element.hasClass('no-proc') ) {
            return false;
        }
        var href = element.attr('href');
        //TODO need a regexp to check the path
        return _.isString(href) && href != "#" && href != "?";
    });

    links.off('click');
  },
  
  _on_link_clicked_handler: function(e) {
    e.preventDefault();
    el = $(e.target);
    this.navigate(el.attr('href'),
                    {trigger: true, replace: false});
  },

  _on_auth_changed_handler: function() {
    if( !_.isEmpty(this.auth.changed)
          && !this.checkAuth() ) {
      this.navigate('', {trigger: true, replace: false});
    }
  },

});


module.exports = Router;