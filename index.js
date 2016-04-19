var express = require('express');
var bodyParser = require('body-parser');
var messenger = require('./messenger.js');
var request = require("request");
var _ = require("underscore");
var app = express();

var token = "CAAHp6HIb7KwBAC0zjikZBaZBQ9XlctZCvbyxhpfms4fRwNw3BSLa5wpNyXubacndbZBW4wM8RuM6bQTCgtMHxs0sIvzFVhSlrVwgdkXvonDZC1Bh27EwSZBc7qeIE6HAvmqoiiKHk1wSYGNRoYipnzZBDChZCLDtDrk2GidihioWjFBKhe9BxLZAyoWpOGejrdXZCWU1aZBWNIZBEAZDZD";

app.use(bodyParser.json());
app.set('port', (process.env.PORT || 5000));

app.get('/', function(request, response) {
	response.send('Ok');
});

app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === 'superplayer_lets_rock') {
		res.send(req.query['hub.challenge']);
	}
	res.send('Error, wrong validation token');
});

app.post('/webhook/', function (req, res) {
  	messaging_events = req.body.entry[0].messaging;
  	for (i = 0; i < messaging_events.length; i++) {
    	event = req.body.entry[0].messaging[i];
    	sender = event.sender.id;

      request({
        url: "https://graph.facebook.com/v2.6/" + sender + "?fields=first_name,last_name,profile_pic&access_token=" + token,
        method: "GET"
      }, function (error, response, body) {
        var user = JSON.parse(body);
        console.log(user.first_name);
        console.log(user.last_name);
      });

    	if (event.message && event.message.text) {
      		text = event.message.text;
          text = encodeURIComponent(text.trim());

          request({
            url: "http://ec2-54-226-237-234.compute-1.amazonaws.com/say/" + text,
            method: 'GET',
          }, function(error, response, body) {
            if (error) {
              console.log('Error saying: ', error);
              return;
            }
            else if (response.body.error) {
              console.log('Error saying: ', response.body.error);
              return;
            }

            if (response.body) {
              var msgs = JSON.parse(response.body);
              console.log(msgs);

              var textMsgs = _.filter(msgs, function(m) { return m.type === 'text'; });
              var entityMsgs = _.filter(msgs, function(m) { return m.type === 'entity'; });

              for (var j = 0; j < textMsgs.length; j++) {
                var msg = textMsgs[j];
                messenger.sendTextMessage(sender, msg.value);
              }

              var elements = _.map(entityMsgs, function(entity) {
                return {
                  "title": entity.value.name,
                  "subtitle": entity.value.description,
                  "image_url": entity.value.arts ?
                    entity.value.arts["2x1"] || entity.value.arts["2x2"]
                    : null,
                  "buttons": [{
                    "type": "web_url",
                    "url": "http://superplayer.fm/player?playing=" + entity.value.key,
                    "title": "Ouvir"
                  }]
                };
              });

              if (elements.length > 0) {
                messenger.sendCardMessages(sender, elements);
              }
            }
          });
    	}
      else if (event.postback) {
        // var info = JSON.parse(event.postback.payload);
        // console.log(info.type, info.key);

        // text = JSON.stringify(event.postback);
        // messenger.sendTextMessage(sender, "Postback received: "+text.substring(0, 200));
        continue;
      }
  	}
	res.sendStatus(200);
});

app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});
