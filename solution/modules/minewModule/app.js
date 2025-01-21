'use strict';

var Transport = require('azure-iot-device-mqtt').Mqtt;
var Client = require('azure-iot-device').ModuleClient;
var Message = require('azure-iot-device').Message;
var Barnowl = require('barnowl');
var BarnowlMinew = require('barnowl-minew');
const express = require('express');
const http = require('http');

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
        console.log('IoT Hub module client initialized');

        console.log('Initializing BarnOwl...');
        let barnowl = new Barnowl({ enableMixing: true });

        // for production
        console.log('Starting HTTP server...');
        let app = express();
        let server = http.createServer(app);
        server.listen(3001, function () { console.log('Listening on port 3001'); });

        let options = {
          app: app, express: express, route: "/minew",
          isPreOctetStream: false
        }; // Set true for G1 firmware v2/3

        barnowl.addListener(BarnowlMinew, {}, BarnowlMinew.HttpListener, options);
        // for testing
        // barnowl.addListener(BarnowlMinew, {}, BarnowlMinew.TestListener, {});
        console.log('BarnOwl is listening on /minew for messages.');

        barnowl.on('raddec', (raddec) => {
          console.log(raddec);
          // pipeMessage(raddec)
        });

        // // Act on input messages to the module.
        // client.on('inputMessage', function (inputName, msg) {
        //   pipeMessage(client, inputName, msg);
        // });
      }
    });
  }
});

// This function just pipes the messages without any change.
// function pipeMessage(client, inputName, msg) {
//   client.complete(msg, printResultFor('Receiving message'));

//   if (inputName === 'input1') {
//     var message = msg.getBytes().toString('utf8');
//     if (message) {
//       var outputMsg = new Message(message);
//       client.sendOutputEvent('output1', outputMsg, printResultFor('Sending received message'));
//     }
//   }
// }

function pipeMessage(client, msg) {
  // client.complete(msg, printResultFor('Receiving message'));

  if (msg) {
    client.sendOutputEvent('output1', new Message(msg), printResultFor('Sending received message'));
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
