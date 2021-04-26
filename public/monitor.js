socket.on('count',(count) => {
  document.getElementById("counter").innerHTML = count.toString();


if(count>0){
  document.querySelector(".cont-counter").classList.add("green");

}

else if(count>3){
  document.querySelector(".cont-counter").classList.add("yellow");
  document.querySelector(".cont-counter").classList.remove("green");
}

else if(count>5){
  document.querySelector(".cont-counter").classList.add("red");
  document.querySelector(".cont-counter").classList.remove("yellow");
}

});
