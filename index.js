var express = require('express'),
    bodyParser = require('body-parser'),
    config = require('./config/config.js')(),
    messengerController = require('./controllers/messenger.js'),
    userController = require('./controllers/user.js'),
    externalMessageController = require('./controllers/externalMessage.js'),
    externalDeliveryController = require('./controllers/externalDelivery.js'),
    chatController = require('./controllers/chat.js'),
    _ = require("underscore"),
    app = express();

app.use(bodyParser.json());
app.set('port', config.app.port);

app.get('/', function(request, response) {
	response.send('Ok');
});

app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === config.messenger.verifyToken) {
		res.send(req.query['hub.challenge']);
	}
	res.send('Error, wrong validation token');
});

app.post('/webhook/', function (req, res) {
	var messaging_events = req.body.entry[0].messaging;
  var inputs = [];
	for (var i = 0; i < messaging_events.length; i++) {
  	var event = req.body.entry[0].messaging[i];
  	var sender = event.sender.id;

    if (event.message && event.message.text) {
      inputs.push({
        sender: sender,
        text: event.message.text
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

  handle(inputs);

	res.sendStatus(200);
});

app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});

function handle(inputs) {
  if (!inputs || inputs.length === 0) {
    return;
  }

  var input = inputs.shift(),
      sender = input.sender,
      text = input.text;

  userController.getFromFb(sender).then(function(user) {
    console.log('fb user', user);

    if (!user || user.error) {
      handle(inputs);
      return;
    }

    userController.findOrCreate(sender, user).then(function(mongoUser) {
      console.log('mongo user', mongoUser);

      externalMessageController.create(text, mongoUser);

      chatController.say(text).then(function(msgs) {
        msgs = JSON.parse(msgs);
        console.log(msgs);
        var messagesToSend = [];

        _.each(_.filter(msgs, function(m) { return m.type === 'text' }), function(m) {
          messagesToSend.push(m);
        });

        _.each(_.filter(msgs, function(m) { return m.type === 'question' }), function(m) {
          if (m.value.type === 'text') {
            messagesToSend.push({
              type:  m.value.type,
              value: m.value.text
            });
          }
        });

        messagesToSend.forEach(function(m) {
          externalMessageController.create(m.value);
        });

        var entities = _.filter(msgs, function(m) { return m.type === 'entity'; });
        var entityList = _.find(msgs, function(m) { return m.type === 'entity-list'; });

        if (entityList) {
          entities = _.union(entityList.value, entities);
        }

        if (entities.length > 0) {
          var elements = _.map(entities, function(entity) {
            return {
              "title": entity.value.name,
              "subtitle": entity.value.description,
              "image_url": entity.value.arts ?
                entity.value.arts["2x1"] || entity.value.arts["2x2"]
                : config.s3.cardImage,
              "buttons": [{
                "type": "web_url",
                "url": "http://superplayer.fm/player?source=messenger&playing=" + entity.value.key,
                "title": "Ouvir"
              }]
            };
          });

          if (elements.length > 0) {
            var entitiesMsg = { type: 'entities', value: elements };
            messagesToSend.push(entitiesMsg);

            externalMessageController.create(JSON.stringify(entitiesMsg));
            externalDeliveryController.create(_.map(entities, function(e) { return e.value; }), mongoUser, text);
          }
        }

        dispatch(sender, messagesToSend, user);
        handle(inputs);
      });
    });
  });
}

function dispatch (sender, messages, user) {
  if (!messages || messages.length === 0) {
    return;
  }

  var msg = messages.shift();
  switch (msg.type) {
    case 'text':
        var text = replaceMacros(user, msg.value);
        messengerController.sendTextMessage(sender, text).then(function() {
          dispatch(sender, messages);
        });
      break;

    case 'entities':
        var elements = msg.value;
        messengerController.sendCardMessages(sender, elements).then(function() {
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

  while ((x = regex.exec(text)) !== null) {
    terms.push(x[0]);
  }

  terms.forEach(function(term) {
    var value;
    switch (term) {
        case "[#nome]":
            if (user) {
                value = (user.first_name || '').split(' ')[0].trim();
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
