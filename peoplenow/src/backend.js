
var _ = require('underscore');
var $ = require('jquery');
var structures = require('./structures');
var utils = require('./utils');
var genUID = require('gen-uid');

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
              var user = (_.isArray(response.data) && response.data.length) ?
                response.data[0] : null;
              deferred.resolve(user);  
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

/*
 * returns jQuery promise object
 */
loadUserTags = function(fbuid) {
  var deferred = $.Deferred();
  findUserByFBId(fbuid)
    .fail(function(error){
      deferred.reject(error);
    })
    .done(function(user){
      // get tags from user
      var tags = (user && _.isString(user.tags)) ? user.tags.trim(): '';
      tags = utils.csvToArray(tags);
      deferred.resolve(tags);
    });
  return deferred;
};

/*
 * returns jQuery promise object
 */
loadAllTags = function() {
  var deferred = $.Deferred();
  Backendless.Persistence
    .of(structures.Tags)
    .find(new Backendless.Async(
            function(response){
              // get tags from response
              var tags_array = response.data || [];
              // var tags_hash = {};
              // _(tags_array).each(function(tag){
              //   if( _.isString(tag.title)
              //         && tag.title.trim() ) {
              //       tags_hash[tag.title.trim().toLowerCase()] = tag.title.trim();
              //   }
              // });
              var tags_data = [];
              _(tags_array).each(function(tag){
                if( _(tag.title).isString()
                      && tag.title.trim() ) {
                    value = tag.title.trim().toLowerCase();
                    title = tag.title.trim();
                    tags_data.push({'id': value,
                                    'text': title});
                }
              });
              deferred.resolve(tags_data);
            },
            function(error){
              deferred.reject(error);
            }
          )
    );
  return deferred;
};

/*
 *  returns jQuery promise
 */
saveTags = function(fbuid, tags) {
  tags = tags || '';
  var deferred = $.Deferred();
  // find user to update
  findUserByFBId(fbuid)
    .fail(function(error){
      deferred.reject(error);
    }).done(function(user){
      if( user && user.fbuid === fbuid ) {
        user.tags = tags;
        // update user in backend
        Backendless.Persistence
                   .of(structures.CustomUser)
                   .save(user,
                         new Backendless.Async(
                           function(){
                             deferred.resolve();
                           },
                           function(error){
                             deferred.reject(error);
                           }));
      }
    });   
  return deferred;
};

/*
 *  returns jQuery promise
 */
sendMessage = function(messages, tags, user_uid) {
  messages = utils.forceArray(messages);
  tags = utils.forceArray(tags);
  user_uid = utils.forceString(user_uid);
  all_deferreds = [];
  if( tags.length && messages.length && user_uid ) {
    _(messages).each(function(text){
      var message = JSON.stringify({'text': text,
                                    'message_uid': genUID.token(),
                                    'user_uid': user_uid});
      _(tags).each(function(channel){
        if( channel && message ) {
          var deferred = $.Deferred();
          all_deferreds.push(deferred);
          Backendless
            .Messaging
            .publish(
                channel,
                message,
                null,
                null,
                new Backendless.Async(
                  function(response) {
                    deferred.resolve(response);
                  }, function(error) {
                    deferred.reject(error);
                  }
                ));
        }
      });
    });
  }
  return $.when.apply($, all_deferreds);
};


module.exports = {
  'findUserByFBId': findUserByFBId,
  'registerUser': registerUser,
  'loadUserTags': loadUserTags,
  'loadAllTags': loadAllTags,
  'saveTags': saveTags,
  'sendMessage': sendMessage,
};