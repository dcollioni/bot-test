"use strict";

var request = require("request");
var Promise = require("bluebird");
var _ = require("underscore");

var tokenTrid = "CAAHp6HIb7KwBALm6gIKxdoxHiZBEMpUQWZCqn1iWi7WvaFtZCtzZCSpNl2I4xIfSjk0BcL9iz0dckX7XzPnz20fZAgAhRxRmpfgQG1rwvU3c4G0KtJ3aSaIwPDLwYbVcJT8GdtKqltmFemsrwY4hjXIYIlsaXK2GJPLwHZCgVWEfESUuLExhzGobrvCH9DVmuzCRIlGHZB4mgZDZD";
var tokenSplZak = "CAADH99bPVBUBABUOgWkZBuJivN4atcLc7yrGG5a8vHmvlyhRhDEch6PJH1xCzDIh08bSBIZCfqh1AeUvN2NbVbzkpZBCTLNAFY3xfvJEbe8LETcLs2H2bmgT3ECxbOm9ZCxe6IZADVEmmfSNNWYE4eGFlyfMfGzqpQ8b1ZB8U8HIcKe99LmPQbIfg3rdvv1r2RGqv9KjCH6gZDZD";
var token = tokenTrid;

var baseApiUrl = "http://splchat-alpha.herokuapp.com";

class ExternalDeliveryController {
  create(entities, user, searchTerm) {
    var deferred = Promise.defer();

    var delivery = {
      source: "Messenger",
      recipient: {
        id: user._id,
        source: user.source,
        external_id: user.external_id
      },
      entity_list: _.map(entities, function(entity) {
        return {
          type: entity.type,
          key: entity.key,
          name: entity.name
        }
      }),
      search_term: searchTerm,
      created_at: new Date()
    };

    request({
      url: baseApiUrl + "/externalDeliveries/create",
      method: 'POST',
      json: delivery
    }, function(error, response, body) {
      if (error) {
        console.log('Error creating external delivery: ', error);
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

module.exports = new ExternalDeliveryController();
