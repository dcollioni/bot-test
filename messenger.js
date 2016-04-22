"use strict";

var request = require("request");
var Promise = require("bluebird");

var tokenTrid = "CAAHp6HIb7KwBALm6gIKxdoxHiZBEMpUQWZCqn1iWi7WvaFtZCtzZCSpNl2I4xIfSjk0BcL9iz0dckX7XzPnz20fZAgAhRxRmpfgQG1rwvU3c4G0KtJ3aSaIwPDLwYbVcJT8GdtKqltmFemsrwY4hjXIYIlsaXK2GJPLwHZCgVWEfESUuLExhzGobrvCH9DVmuzCRIlGHZB4mgZDZD";
var tokenSplZak = "CAADH99bPVBUBABUOgWkZBuJivN4atcLc7yrGG5a8vHmvlyhRhDEch6PJH1xCzDIh08bSBIZCfqh1AeUvN2NbVbzkpZBCTLNAFY3xfvJEbe8LETcLs2H2bmgT3ECxbOm9ZCxe6IZADVEmmfSNNWYE4eGFlyfMfGzqpQ8b1ZB8U8HIcKe99LmPQbIfg3rdvv1r2RGqv9KjCH6gZDZD";
var token = tokenTrid;

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
