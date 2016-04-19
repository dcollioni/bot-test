"use strict";

var request = require("request");

var token = "CAAHp6HIb7KwBAC0zjikZBaZBQ9XlctZCvbyxhpfms4fRwNw3BSLa5wpNyXubacndbZBW4wM8RuM6bQTCgtMHxs0sIvzFVhSlrVwgdkXvonDZC1Bh27EwSZBc7qeIE6HAvmqoiiKHk1wSYGNRoYipnzZBDChZCLDtDrk2GidihioWjFBKhe9BxLZAyoWpOGejrdXZCWU1aZBWNIZBEAZDZD";

class Messenger {
  sendTextMessage(sender, text) {
    var messageData = {
      text:text
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
};

module.exports = new Messenger();