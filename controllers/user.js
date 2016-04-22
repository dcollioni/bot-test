"use strict";

var request = require("request");
var Promise = require("bluebird");

var baseApiUrl = "http://splchat-alpha.herokuapp.com";
var fbGraphUrl = "https://graph.facebook.com/v2.6/";

class UserController {
  findOrCreate(userId, user) {
    var deferred = Promise.defer();

    var user = {
      external_id: userId,
      source: "Messenger",
      created_at: new Date(),
      name: user ? user.first_name + ' ' + user.last_name : '',
      picture: user ? user.profile_pic : ''
    };

    request({
      url: baseApiUrl + "/users/create",
      method: 'POST',
      json: user
    }, function(error, response, body) {
      if (error) {
        console.log('Error creating user: ', error);
        return deferred.reject();
      }
      else if (response.body.error) {
        console.log('Error: ', response.body.error);
        return deferred.reject();
      }
      deferred.resolve(body);
    });

    return deferred.promise;
  }

  getFromFb(userId) {
    var deferred = Promise.defer();

    request({
      url: fbGraphUrl + userId + "?fields=first_name,last_name,profile_pic&access_token=" + token,
      method: "GET"
    }, function (error, response, body) {
      if (error || response.body.error) {
        return deferred.reject();
      }
      var user = JSON.parse(body);
      deferred.resolve(user);
    });

    return deferred.promise;
  }
};

module.exports = new UserController();
