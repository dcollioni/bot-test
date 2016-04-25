"use strict";

var request = require("request"),
    Promise = require("bluebird"),
    config = require('./../config/config.js')();

class ChatController {
  say(text) {
    var deferred = Promise.defer();

    if (!text) {
      return deferred.reject();
    }

    text = encodeURIComponent(text.trim());

    request({
      url: config.api.baseUrl + "/say/" + text,
      qs: { limit_results: 10, support_entity_list: true },
      method: 'GET',
    }, function(error, response, body) {
      if (error) {
        console.log('Error saying: ', error);
        return deferred.reject();
      }
      else if (response.body.error) {
        console.log('Error saying: ', response.body.error);
        return deferred.reject();
      }
      console.log('response.body', response.body);
      console.log('body', body);
      deferred.resolve(response.body);
    });

    return deferred.promise;
  }
}

module.exports = new ChatController();
