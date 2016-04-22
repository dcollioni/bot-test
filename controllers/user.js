"use strict";

var request = require("request");
var Promise = require("bluebird");

var baseApiUrl = "http://splchat-alpha.herokuapp.com";

class UserController {
  findOrCreate(senderId) {
    var deferred = Promise.defer();

    var user = {
      external_id: senderId,
      source: "Facebook",
      created_at: new Date()
    };

    request({
      url: baseApiUrl + "/users/create",
      method: 'POST',
      json: user
    }, function(error, response, body) {
      console.log('findOrCreate body:', body);

      if (error) {
        console.log('Error creating user: ', error);
        return deferred.reject();
      }
      else if (response.body.error) {
        console.log('Error: ', response.body.error);
        return deferred.reject();
      }
      deferred.resolve();
    });

    return deferred.promise;
  }
};

module.exports = new UserController();
