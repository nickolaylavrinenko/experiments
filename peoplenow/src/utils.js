
var _ = require('underscore');
var $ = require('jquery');


/*
 * Use Queue object to execute several code snippets (functions) sequentially
 * options:
 *         options.start - boolean - whether to start queue while initializing or not
 *         options.length - number - queue length
 */
var Queue = function(options){
  var _start = false,
    options = options || {};
  // obtain given options
  if( typeof options.start === 'boolean' ){
    _start = options.start;
  }
  if( typeof options.length === 'number' 
              && options.length > 0 ) {
    this._length = options.length;
  }
  // init queue
  this._timerId = 0;
  this._iterationPeriod = 0;
  this._queue = [];
  // start queue processing
  if( _start ) {
    this.start();
  }
};

/*
 * context	- required - function context
 * fn	- required - function to add to queue, function must return jQuery promise object
 * args	- optional - function arguments to pass while invoking it (arg || [arg, arg, ...])
 */
Queue.prototype.add = function(context, fn, args) {
  if( typeof fn === 'function' && context ){
    // check queue length
    if( this._length && this._queue.length >= this._length ) { 
      var last_task = this._queue[this._queue.length-1];
      return last_task['promise'] || $.Deferred().resolve();
    }
    var task = { 'fn': fn };
    // function context
    if( !context ) {
      context = window;
    }
    task['context'] = context;
    // function arguments
    args = args || [];
    if( !_.isArray(args) 
                && typeof args['length'] === 'undefined' 
                        && typeof args['0'] === 'undefined' ) {
      args = [args];
    }
    task['args'] = args;
    // function promise object
    task['promise'] = $.Deferred();
    // add task to queue
    this._queue.push(task);
    return task['promise'];
  }
};

Queue.prototype.start = function() {
  if( this._timerId ) return false;
  var _this = this;
  (function iteration(){

    var deferred = $.Deferred();
    _this._current_deferred = deferred;

    // planning next iteration
    deferred.done(function(){
      _this._timerId = window.setTimeout(iteration, _this._iterationPeriod);
    });

    // process queue item
    if( _this._queue.length > 0 ) {

      var task = _this._queue.shift();
      _this._current_task = task;

      // parse task object
      var fn = task['fn'],
        context = task['context'],
        args = task['args'],
        fn_promise = task['promise'];

      // apply func
      var func_result = fn.apply(context, args);
      if( !_.isObject(func_result) || !('done' in func_result) ) {
        throw new Error(' Given to queue function must return promise object.');
      }
      func_result.done(function(){
        deferred.resolve();
        fn_promise.resolve();
      });

    } else {
      deferred.resolve();
    }
  })();
};

Queue.prototype.stop = function() {
  window.clearTimeout(this._timerId);
  this._timerId = 0;
};

Queue.prototype.skipCurrent = function() {
  if( typeof this._current_deferred !== 'undefined' ) {
    this._current_deferred.resolve();
    this._current_task['promise'].resolve();
  }
};

Queue.prototype.skipAll = function() {
  if( this._queue.length > 0 ){
    // resolve functions promise objects
    _(this._queue).each(function(task){
        task['promise'].resolve();
    });
    // clear the queue
    this._queue = [];
  }
};

csvToArray = function(string) {
  var result = [];
  if( _.isString(string) && string.trim() ) {
    result = string.split(',');
    // filter empty
    result = _(result).filter(function(item){
      return !!item.trim();
    });
  }
  return result;
};

arrayToCsv = function(array) {
  var result = '';
  if( _.isArray(array) ) {
    result = array.join(',');
  }
  return result;
};

forceArray = function(value) {
  if( !value ) {
    value = [];
  }
  if( value && !_(value).isArray() ) {
    value = [value];
  }
  return value;
};

forceString = function(something) {
  return something ? ('' + something) : '';
};

/*  Date formatting  */

isValidDate : function(date) {
  return ( date 
               && date instanceof Date
                    && date.getTime() !== NaN  ) 
         ? true : false;
},

// returns time string in format: HH:MM:SS
getTimeFullString : function(date) {
    return this.isValidDate(date) 
                   ? [("0"+date.getHours()).slice(-2), 
                      ("0"+date.getMinutes()).slice(-2),
                      ("0"+date.getSeconds()).slice(-2)].join(":")
                   : "";
},


module.exports = {
  'Queue': Queue,
  'csvToArray': csvToArray,
  'arrayToCsv': arrayToCsv,
  'forceArray': forceArray,
  'forceString': forceString,
  'isValidDate': isValidDate,
  'getTimeFullString': getTimeFullString,
};