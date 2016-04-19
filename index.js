var express = require('express');
var bodyParser = require('body-parser');
var messenger = require('./messenger.js');
var request = require("request");
var app = express();

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

    	if (event.message && event.message.text) {
      		text = event.message.text;
          text = encodeURIComponent(text.trim());

          request({
            url: "http://ec2-54-226-237-234.compute-1.amazonaws.com/say/" + text,
            method: 'GET',
          }, function(error, response, body) {
            if (error) {
              console.log('Error saying: ', error);
            }
            else if (response.body.error) {
              console.log('Error saying: ', response.body.error);
            }
            console.log(response.body);
          });

          // if (text === 'Generic') {
          //   messenger.sendGenericMessage(sender);
          //   continue;
          // }

      		messenger.sendTextMessage(sender, text + " pra você também!");
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
