var socket = io();

socket.on('time', function(timeString) {
  timeString = tConvert(timeString);
  var el;
  el = document.getElementById('server-time')
  el.innerHTML = 'Server time: ' + timeString;
});

socket.on('prayerTime', function(waktuSolat){
  // console.log(waktuSolat);
  const hijri = waktuSolat.prayerTime[0].hijri;
  const today = waktuSolat.prayerTime[0].day;
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
