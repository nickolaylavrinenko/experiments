
var Backbone = require('backbone');
var _ = require('underscore');

/*
 * Change backbone extend method with John Resig inheritence template.
 */

// Wrap an optional error callback with a fallback error event.
var wrapError = function(model, options) {
    var error = options.error;
    options.error = function(resp) {
        if (error) error(model, resp, options);
        model.trigger('error', model, resp, options);
    };
};


// difine new extend method
var extend = function(protoProps, staticProps) {
    var parent = this;
    var child;
    var fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && _.has(protoProps, 'constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ return parent.apply(this, arguments); };
    }

    // Add static properties to the constructor function, if supplied.
    _.extend(child, parent, staticProps);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    var Surrogate = function(){ this.constructor = child; };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate;

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) {

        // John Resig inheritence template with setting _supper method
        for (var name in protoProps) {
            // Check if we're overwriting an existing function
            child.prototype[name] = typeof protoProps[name] === "function" &&
                typeof parent.prototype[name] === "function" && fnTest.test(protoProps[name]) ?
                    (function(name, fn){
                        return function() {
                            var tmp = this._super;
                           
                            // Add a new ._super() method that is the same method
                            // but on the super-class
                            this._super = parent.prototype[name];
                           
                            // The method only need to be bound temporarily, so we
                            // remove it when we're done executing
                            var ret = fn.apply(this, arguments);        
                            this._super = tmp;
                           
                            return ret;
                        };
                    })(name, protoProps[name]) :
                    protoProps[name];
        }
    }

    return child;
};

// populate defaned new extend method against backbone structures
Backbone.Model.extend = 
Backbone.Collection.extend = 
Backbone.Router.extend = 
Backbone.View.extend = 
Backbone.History.extend = 
                          extend;
