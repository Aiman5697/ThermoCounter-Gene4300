var socket = io();
var el = document.getElementById('server-time');
var selector1 = document.getElementById('selector1');
var selector2 = document.getElementById('selector2');


selector1.addEventListener("change", function() {
  var stateSelected = selector1.value;
  // console.log(selector1.value);
  socket.emit("selectedState", stateSelected);
  document.location.href='/';
});

selector2.addEventListener("change", function() {
  var zoneSelected = selector2.value;
  // console.log(selector1.value);
  socket.emit("selectedZone", zoneSelected);
});

function shortString(selector) {
  const elements = document.querySelectorAll(selector);
  const tail = '...';
  if (elements && elements.length) {
    for (const element of elements) {
      let text = element.innerText;
      if (element.hasAttribute('data-limit')) {
        // console.log(element.dataset.limit);
        if (text.length > element.dataset.limit) {
          element.innerText = `${text.substring(0, element.dataset.limit - tail.length).trim()}${tail}`;
        }
      } else {
        throw Error('Cannot find attribute \'data-limit\'');
      }
    }
  }
}

window.onload = function() {
  shortString('.short');
};

socket.on('time', function(timeString) {
  timeString = tConvert(timeString);

  el.innerHTML = 'Server time: ' + timeString;
});

socket.on('prayerTime', function(waktuSolat){
  // console.log(waktuSolat);
  const imsak = tConvert(waktuSolat.prayerTime[0].imsak);
  const fajr = tConvert(waktuSolat.prayerTime[0].fajr);
  const syuruk = tConvert(waktuSolat.prayerTime[0].syuruk);
  const dhuhr = tConvert(waktuSolat.prayerTime[0].dhuhr);
  const asr = tConvert(waktuSolat.prayerTime[0].asr);
  const maghrib = tConvert(waktuSolat.prayerTime[0].maghrib);
  const isha = tConvert(waktuSolat.prayerTime[0].isha);
  // console.log(isha);
  var array = ["imsak","fajr","syuruk","dhuhr","asr","maghrib","isha"];
  var array1 = [imsak,fajr,syuruk,dhuhr,asr,maghrib,isha];

  array.forEach((time,i) => {
    // console.log(array1[i]);
    var timeTable = document.querySelector("." + time);
    timeTable.innerHTML = array1[i];
  });
});

function tConvert (time) {
  // Check correct time format and split into components
  time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

  if (time.length > 1) { // If time format correct
    time = time.slice (1);  // Remove full string match value
    time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
    time[0] = +time[0] % 12 || 12; // Adjust hours
  }
  return time.join (''); // return adjusted time or original string
}
