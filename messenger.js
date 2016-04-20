"use strict";

var request = require("request");
var Promise = require("bluebird");

var token = "CAAHp6HIb7KwBANkiB6Qkicu3ETD1htwW0HRf3LgbXYg8gsVj9DiPWRoeqZC9unJYzZCgBhow5kxXkRrZCdvwvba0ilSgTaav1aT6aZConK8nVo1hEKI46ZADcAqtDuaHfZA3BFqQjWmKGgbmVXAeMlDBWuA7kHKwgMoDGWN7GzXZCqYZAknZCdRiYjBXMNMvZBn2m6KXmM5yTJKAZDZD";

class Messenger {
  sendTextMessage(sender, text) {
    var deferred = Promise.defer();

    var messageData = {
      text:text
    };
    request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: { access_token: token },
      method: 'POST',
      json: {
        recipient: {id:sender},
        message: messageData,
      }
    }, function(error, response, body) {
      if (error) {
        console.log('Error sending message: ', error);
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

  sendGenericMessage(sender) {
    var messageData = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [{
            "title": "First card",
            "subtitle": "Element #1 of an hscroll",
            "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
            "buttons": [{
              "type": "web_url",
              "url": "https://superplayer.fm/player?playing=para-programar",
              "title": "Programando"
            }, {
              "type": "postback",
              "title": "Postback",
              "payload": '{ "key": "para-programar", "type": "playlist" }',
            }],
          },{
            "title": "Second card",
            "subtitle": "Element #2 of an hscroll",
            "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
            "buttons": [{
              "type": "postback",
              "title": "Postback",
              "payload": "Payload for second element in a generic bubble",
            }],
          }]
        }
      }
    };
    request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token:token},
      method: 'POST',
      json: {
        recipient: {id:sender},
        message: messageData,
      }
    }, function(error, response, body) {
      if (error) {
        console.log('Error sending message: ', error);
      } else if (response.body.error) {
        console.log('Error: ', response.body.error);
      }
    });
  }

  sendCardMessages(sender, elements) {
    var deferred = Promise.defer();

    var messageData = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": elements
        }
      }
    };
    request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token:token},
      method: 'POST',
      json: {
        recipient: {id:sender},
        message: messageData,
      }
    }, function(error, response, body) {
      if (error) {
        console.log('Error sending message: ', error);
        return deferred.reject();
      } else if (response.body.error) {
        console.log('Error: ', response.body.error);
        return deferred.reject();
      }
      return deferred.resolve();
    });
    return deferred.promise;
  }
};

module.exports = new Messenger();
