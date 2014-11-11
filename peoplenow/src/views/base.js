
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var constants = require('../constants');


/*
 *	Base content view
 */
var BaseView = Backbone.View.extend({

	template: null,
	controls: {},
	router: null,

	initialize: function(options) {
		var _super = this._super;
		if( !options || !options.router ) {
			throw 'Router must be provided to view constructor';
		}
		this.router = options.router;
		return _super.apply(this, arguments);
	},

	render: function(attributes) {
		if( this.isAttached() ) {
			this.detach();
		}
		if( _.isFunction(this.template) ) {
			this.$el = $('<div>').html(this.template(attributes));
		}
		return this;
	},

	initControls: function(options){
		var _this = this;
		options = options || {};
		_.each(_this.controls, function(constructor, class_name){
			_this.$('.' + class_name + ':not(.init-block)').each(function(ind, item){
				item = _this.$(item);
				item.addClass('init-block');
				var control = new constructor(item.first(), options[class_name] || {});
				item.data('init-block', control);
			});
		});
		return _this;
	},

  /*
   *	returns jQuery promise object
   */
	attach: function(container) {
    container = $(container);
    var deferred = $.Deferred();
    if( container.length && !this.isAttached() ) {
    	container.html(this.$el);
    	this.bindEvents();
    	deferred.resolve();
    } else {
    	deferred.resolve();
    }
    return deferred;
	},

  /*
   *	returns jQuery promise object
   */
	detach: function() {
    var deferred = $.Deferred();
		if( this.isAttached() ) {
			this.unbindEvents();
			this.$el.detach();
			deferred.resolve();
		} else {
    	deferred.resolve();
    }
    return deferred;
	},

	isAttached: function() {
		return this.$el.length 
						&& this.$el.parent('body').length 
							? true: false;
	},

	bindEvents: function() {
		// Empty
	},

	unbindEvents: function() {
		// Empty
	},

	remove: function() {
		var _super = this._super;
		var _arguments = arguments;
		if( this.isAttached() ) {
			this.unbindEvents();
			_supper.apply(this, _arguments);
		}
	},

	wrapLinks: function(router) {
		this.$el.length && router.wrapLinks(this.$el);
		return this;
	},

	unwrapLinks: function() {
		//?
	},
	
});


var EmptyView = BaseView.extend({

	render: function(attributes) {
		this.$el = $('<div>');
		return this;
	},

});


var FadingMixIn = {

	render: function(attributes){
		var _super = this._super;
		_super.apply(this, arguments);
		this.$el.css({'display': 'none'});
		return this;
	},

	/*
   *	returns jQuery promise object
   */
	attach: function(container) {
		var _super = this._super;
		var _arguments = arguments;
		var _this = this;
		var deferred = $.Deferred();
		_super.apply(_this, _arguments).done(function(){
			_this.$el.fadeIn(function(){
				deferred.resolve();
			});
		});
		return deferred;
	},

	/*
   *	returns jQuery promise object
   */
	detach: function() {
		var _super = this._super;
		var _arguments = arguments;
		var _this = this;
		var deferred = $.Deferred();
		_this.$el.fadeOut(function(){
			_super.apply(_this, _arguments).done(function(){
				deferred.resolve();
			});
		});
		return deferred;
	},

	remove: function() {
		var _super = this._super;
		var _arguments = arguments;
		var _this = this;
		_this.$el.fadeOut(function(){
			_super.apply(_this, _arguments);
		});
	},

};


module.exports = {
	'BaseView': BaseView,
	'FadingMixIn': FadingMixIn,
	'EmptyView': EmptyView,
};