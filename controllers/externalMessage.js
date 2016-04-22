"use strict";

var request = require("request");
var Promise = require("bluebird");

var tokenTrid = "CAAHp6HIb7KwBALm6gIKxdoxHiZBEMpUQWZCqn1iWi7WvaFtZCtzZCSpNl2I4xIfSjk0BcL9iz0dckX7XzPnz20fZAgAhRxRmpfgQG1rwvU3c4G0KtJ3aSaIwPDLwYbVcJT8GdtKqltmFemsrwY4hjXIYIlsaXK2GJPLwHZCgVWEfESUuLExhzGobrvCH9DVmuzCRIlGHZB4mgZDZD";
var tokenSplZak = "CAADH99bPVBUBABUOgWkZBuJivN4atcLc7yrGG5a8vHmvlyhRhDEch6PJH1xCzDIh08bSBIZCfqh1AeUvN2NbVbzkpZBCTLNAFY3xfvJEbe8LETcLs2H2bmgT3ECxbOm9ZCxe6IZADVEmmfSNNWYE4eGFlyfMfGzqpQ8b1ZB8U8HIcKe99LmPQbIfg3rdvv1r2RGqv9KjCH6gZDZD";
var token = tokenTrid;

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
