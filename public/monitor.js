var counterVal = document.getElementById("counter");
var contCounter = document.querySelector(".cont-counter");

socket.on('count', (count) => {

  counterVal.classList.add("count-val");
  counterVal.innerHTML = count.toString();

  if (count >= 0 && count < 3) {
    contCounter.classList.add("green");
    contCounter.classList.remove("yellow", "red");
  } else if (count >= 3 && count < 5) {
    contCounter.classList.add("yellow");
    contCounter.classList.remove("green", "red");
  } else if (count >= 5) {
    contCounter.classList.add("red");
    contCounter.classList.remove("green", "yellow");
  }

});
