'use strict';

var Transport = require('azure-iot-device-mqtt').Mqtt;
var Client = require('azure-iot-device').ModuleClient;
var Message = require('azure-iot-device').Message;
const { createLogger, format, transports } = require('winston')
const LokiTransport = require('winston-loki');

// Create a logger for Loki
const options = {
  transports: [
    new LokiTransport({
      host: "http://loki.local",
      json: true,
      format: format.json(),
      onConnectionError: (err) => console.error(err),
    })
  ]
};
const logger = createLogger(options);

Client.fromEnvironment(Transport, function (err, client) {
  if (err) {
    throw err;
  } else {
    client.on('error', function (err) {
      throw err;
    });

    // connect to the Edge instance
    client.open(function (err) {
      if (err) {
        throw err;
      } else {
        console.log('Grafana forwarder module initialized');

        // Act on input messages to the module.
        client.on('inputMessage', function (inputName, msg) {
          pipeMessage(client, inputName, msg);
        });
      }
    });
  }
});

// This function just pipes the messages without any change.
function pipeMessage(client, inputName, msg) {
  client.complete(msg, printResultFor('Receiving message'));

  if (inputName === 'forward') {
    var message = msg.getBytes().toString('utf8');
    if (message) {
      // Decode and forward message to loki
      const json = JSON.parse(message);
      logger.info(json);
    }
  }
}

// Helper function to print results in the console
function printResultFor(op) {
  return function printResult(err, res) {
    if (err) {
      console.log(op + ' error: ' + err.toString());
    }
    if (res) {
      console.log(op + ' status: ' + res.constructor.name);
    }
  };
}
