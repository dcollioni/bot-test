"use strict";

var request = require("request"),
    Promise = require("bluebird"),
    _ = require("underscore"),
    config = require('./../config/config.js');

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
      url: config.api.baseUrl + "/externalDeliveries/create",
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
