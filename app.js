//jshint esversion:6

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const https = require('https');

const zone = require('./zone');
// console.log(zone);

const app = express();

var stateSelected = "hi";
// var states = Object.keys(zone);
// console.log(states);
// if(stateSelected != "hi") {
//   var zonesName = Object.keys(zoneDivision[stateSelected]);
//   console.log(zonesName);
// }

app.set("view engine", "ejs");
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;
// const INDEX = 'public/index.html';

const server = app
  .use((req, res) => res.render("index", {zoneDivision: zone, stateSelected: stateSelected}))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const SerialPort = require("serialport");
const Readline = require('@serialport/parser-readline');

const arduinoCOMPort = "COM12";

const arduinoSerialPort = new SerialPort(arduinoCOMPort, {
  baudRate: 9600
});

const parser = arduinoSerialPort.pipe(new Readline({ delimiter: '\n' }));

arduinoSerialPort.on('error', function () {
  console.log('Serial Port ' + arduinoCOMPort + ' is not available');
});

arduinoSerialPort.on('open', function () {
  console.log('Serial Port ' + arduinoCOMPort + ' is opened.');
});

arduinoSerialPort.on('close', function () {
  console.log('Serial Port ' + arduinoCOMPort + ' is closed');
});

const io =  socketIO(server);

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));

  parser.on('data', (count) => {
    // console.log('got word from arduino:', count);
    io.sockets.emit('count', count);
  });


  socket.on('selectedState', function(state) {
    console.log(state);
    stateSelected = state.toString();
    // var zonesCode = Object.keys(zone[stateSelected]);
    // console.log(zonesCode);
    // zonesCode.forEach((e,i) => {
    //   var zoneName = zone[stateSelected][e];
    //   console.log(zoneName);
    // });
  });

  socket.on('selectedZone', function(zoneCode) {
    // console.log(zoneCode);

    const url = "https://www.e-solat.gov.my/index.php?r=esolatApi/TakwimSolat&period=today&zone=" + zoneCode;

    https.get(url, function(response) {
      // console.log(response.statusCode);
      response.on('data', function(data) {
        const waktuSolat = JSON.parse(data);
        io.sockets.emit('prayerTime', waktuSolat);
      });
    });
  });

});

setInterval(() => io.emit('time', new Date().toTimeString().split(" ",1)), 1000);
