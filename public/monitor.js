socket.on('count', (count) => {
  document.getElementById("counter").innerHTML = count.toString();

  if (count >= 0 && count < 3) {
    document.querySelector(".cont-counter").classList.add("green");
    document.querySelector(".cont-counter").classList.remove("yellow", "red");
  } else if (count >= 3 && count < 5) {
    document.querySelector(".cont-counter").classList.add("yellow");
    document.querySelector(".cont-counter").classList.remove("green", "red");
  } else if (count >= 5) {
    document.querySelector(".cont-counter").classList.add("red");
    document.querySelector(".cont-counter").classList.remove("green", "yellow");
  }

});
