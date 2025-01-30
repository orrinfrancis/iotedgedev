'use strict';

const minewTransmitter = require('./MinewTransmitter.js')

var Transport = require('azure-iot-device-mqtt').Mqtt;
var Client = require('azure-iot-device').ModuleClient;
var Message = require('azure-iot-device').Message;
const express = require('express');
const http = require('http');
let app = express();
app.use(express.json());


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

        // Express configuration
        let expressRoute = "/minew"
        app.post(expressRoute, (req, res) => {
          const processed = minewTransmitter.handleTransmission(req.body);
          if (processed) {
            for (const data of processed) {
              if (data) {
                pipeMessage(client, data.frame.type, JSON.stringify(data))
              }
            }
          }
          res.sendStatus(200);
        });
        console.log(`Express is listening on ${expressRoute}`);

        // Barnowl configuration
        // console.log('Initializing BarnOwl...');
        // let barnowl = new Barnowl({ enableMixing: true });
        // let options = {
        //   app: app, express: express, route: "/minew",
        //   isPreOctetStream: false
        // }; // Set true for G1 firmware v2/3
        // barnowl.addListener(BarnowlMinew, {}, BarnowlMinew.HttpListener, options);
        // barnowl.on('raddec', (raddec) => {
        //   console.log(raddec);
        //   pipeMessage(client, raddec)
        // });
        // console.log(`BarnOwl is listening on ${options.route}`);

        let server = http.createServer(app);
        server.listen(3001, function () { console.log('Server is listening on port 3001'); });
      }
    });
  }
});

function pipeMessage(client, output, msg) {
  client.sendOutputEvent(output, new Message(msg), printResultFor('Sending received message'));
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
