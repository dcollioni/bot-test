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

      // request({
      //   url: "https://graph.facebook.com/v2.6/" + sender + "?fields=first_name,last_name,profile_pic&access_token=" + token,
      //   method: "GET"
      // }, function (error, response, body) {
      //   var user = JSON.parse(body);
      //   console.log(user.first_name);
      //   console.log(user.last_name);
      // });

    	if (event.message && event.message.text) {
      		text = event.message.text;
          text = encodeURIComponent(text.trim());

          request({
            url: "http://splchat-alpha.herokuapp.com/say/" + text,
            qs: { limit_results: 10, support_entity_list: true },
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

              var messagesToSend = [];

              var textMsgs = _.filter(msgs, function(m) { return m.type === 'text'; });
              messagesToSend.push(textMsgs);

              var entityList = _.find(msgs, function(m) { return m.type === 'entity-list'; });
              if (entityList) {
                var elements = _.map(entityList.value, function(entity) {
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
                  var entities = { type: 'entities', value: elements };
                  messagesToSend.push(entities);
                }
              }
              dispatch(sender, messagesToSend);
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

function dispatch (sender, messages) {
  if (!messages || messages.length == 0) {
    return;
  }
  var msg = messages.shift();

  switch (msg.type) {
    case 'text':
        var text = msg.value; // replaceMacros(user, msg.value);
        messenger.sendTextMessage(sender, text).then(function() {
          dispatch(sender, messages);
        });
      break;

    case 'entities':
        var elements = msg.value;
        messenger.sendCardMessages(sender, elements).then(function() {
          dispatch(sender, messages);
        });
      break;

    default:
      return;
  }
}

function replaceMacros(user, text) {
    var regex = /\[#[^\]]*\]/gi;
    var regexRemoveTerm = /[,\s]+?\[#[^\]]*\]/gi;
    var terms = [];
    var x;

    while ((x = regex.exec(text)) !== null)
        terms.push(x[0]);

    terms.forEach(function(term) {
        var value;

        switch (term) {
            case "[#nome]":
                if (user) {
                    value = (user.name || '').split(' ')[0].trim();
                }
                break;
        }

        if (value) {
            text = text.replace(term, value);
        }
        else {
            text = text.replace(regexRemoveTerm, '');
        }
    });

    return text;
}
