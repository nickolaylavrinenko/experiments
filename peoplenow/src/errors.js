
var _ = require('underscore');

var handler = Backendless.Async(
  function (data) {
    /* success */
  },
  function (error) {
    if( !_(error).isEmpty() && error.statusCode) {
      console.warn('Error occured, code - ' + (error.statusCode || 'NO') +
         ', message - ' + (error.message || 'NO'));                        
    }
  }
);


module.exports = {
    handler: handler,
};