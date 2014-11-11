
var _ = require('underscore');
var $ = require('jquery');


/*
 *  returns jQuery promise object
 */
var findUserByFBId = function(fbuid) {

  var deferred = $.Deferred();
  var query = {
    condition: ("fbuid = '" + fbuid + "'"),
  };

  Backendless.Persistence
    .of(structures.CustomUser)
    .find(query,
          new Backendless.Async(
            function(response){
              deferred.resolve(response);
            },
            function(error){
              deffered.reject(error);
            }
          )
    );

  return deferred;

};


/*
 *  returns jQuery promise object
 */
var registerUser = function(user_options) {

  var deferred = $.Deferred();

  if( !_.isEmpty(user_options)
        && 'id' in user_options
          && 'name' in user_options) {
    var user = {
      'fbuid': user_options.id,
      'name': user_options.name,
    };
    if( 'email' in user_options ){
      user['email'] = user_options.email;
    }
    console.log('app: register user ', user.name, user.email || '');
    Backendless.Persistence
        .of(structures.CustomUser)
        .save(user,
              new Backendless.Async(
                function(){
                  deferred.resolve();
                },
                function(error){
                  deferred.reject(error);
                }
              ));
  } else {
    deferred.reject();  
  }

  return deferred;
    
};

loadAllTags = function() {
  var deferred = $.Deferred();
  Backendless.Persistence
    .of(structures.Tags)
    .find(new Backendless.Async(
            function(response){
              // get tags from response
              var tags = _(response.data || [])
                  .map(function(tag){
                    return (_.isString(tag.title) && tag.title.trim()) ?
                        tag.title : '';
                  });
              // filter empty tags
              tags = _(tags).filter(function(tag){
                return !!tag.trim();
              });
              deferred.resolve(tags);
            },
            function(error){
              deffered.reject(error);
            }
          )
    );
  return deferred;
};


module.exports = {
  'findUserByFBId': findUserByFBId,
  'registerUser': registerUser,
  'loadAllTags': loadAllTags
};