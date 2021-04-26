var express = require('express');
var socketIO = require('socket.io');
var path = require('path');

const app = express();
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;
const INDEX = 'public/index.html';

const server = app
  .use((req, res) => res.sendFile(INDEX, { root: __dirname,}))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

var SerialPort = require("serialport");
const Readline = require('@serialport/parser-readline');

var arduinoCOMPort = "/dev/ttyUSB0";

var arduinoSerialPort = new SerialPort(arduinoCOMPort, {
  baudRate: 9600
});

const parser = arduinoSerialPort.pipe(new Readline());

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
    console.log('got word from arduino:', count);
    socket.emit('data', count);
  });

});

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
