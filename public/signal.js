var socket = io();
var el;

socket.on('time', function(timeString) {
  el = document.getElementById('server-time')
  el.innerHTML = 'Server time: ' + timeString;
});
