"use strict";

var request = require("request");
var Promise = require("bluebird");

var tokenTrid = "CAAHp6HIb7KwBAJxahAYNoXuef5LvY4uMcBZCAtKArS9nTaRe8e5N9LmMDse8MBZC7JJEJoPNiZB24IoZBYFh7U63TeA17T2rHzLF41Baxv4eu7A0gs2zHnTuKL6ResLDzwx4CINvehEsPKl1YO7J0TqYoNiYclS2QkI7ufT2fZATwhxYhOrJYW98b41z97A6s0CsarsYNfgZDZD";
var tokenSplZak = "CAADH99bPVBUBABUOgWkZBuJivN4atcLc7yrGG5a8vHmvlyhRhDEch6PJH1xCzDIh08bSBIZCfqh1AeUvN2NbVbzkpZBCTLNAFY3xfvJEbe8LETcLs2H2bmgT3ECxbOm9ZCxe6IZADVEmmfSNNWYE4eGFlyfMfGzqpQ8b1ZB8U8HIcKe99LmPQbIfg3rdvv1r2RGqv9KjCH6gZDZD";
var token = tokenTrid;

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
