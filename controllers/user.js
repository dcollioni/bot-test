"use strict";

var request = require("request"),
    Promise = require("bluebird"),
    config = require('./../config/config.js')();

class UserController {
  findOrCreate(userId, userFb) {
    var deferred = Promise.defer();

    var user = {
      external_id: userId,
      source: "Messenger",
      created_at: new Date(),
      name: userFb ? userFb.first_name + ' ' + userFb.last_name : '',
      picture: userFb ? userFb.profile_pic : ''
    };

    request({
      url: config.api.baseUrl + "/users/create",
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
      url: config.messenger.graphUrl + '/' + userId + "?fields=first_name,last_name,profile_pic&access_token=" + config.messenger.token,
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
}

module.exports = new UserController();
