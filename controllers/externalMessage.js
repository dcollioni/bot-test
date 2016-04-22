"use strict";

var request = require("request");
var Promise = require("bluebird");

var baseApiUrl = "http://splchat-alpha.herokuapp.com";

class ExternalMessageController {
  create(text, user) {
    var deferred = Promise.defer();

    var message = {
      sender: {
        source: user ? user.source : "Messenger",
        external_id: user ? user.external_id : "bot"
      },
      text: text,
      created_at: new Date()
    };

    if (user) {
      message.sender.id = user._id;
    }

    request({
      url: baseApiUrl + "/externalMessages/create",
      method: 'POST',
      json: message
    }, function(error, response, body) {
      if (error) {
        console.log('Error creating external message: ', error);
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
};

module.exports = new ExternalMessageController();
