
/*
 *	Base content view
 */
var BaseView = Backbone.View.extend({

	template: null,

	initialize: function(options){

	},

	render: function(attributes){

		if( this.isAttached() ) {
			this.detach();
		}
		if( _.isFunction(this.template) ) {
			this.$el = $('<div>').html(this.template(attributes));
		}
		return this;

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

		return this.$el.length && this.$el.parents('body') ? true: false;

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
	
});

var FadingMixIn = {

	/*
   *	returns jQuery promise object
   */
	attach: function(container) {
		//TODO
	},

	/*
   *	returns jQuery promise object
   */
	detach: function() {
		//TODO
	},

};


module.exports = {
	'BaseView': BaseView,
	'FadingMixIn': FadingMixIn,
};