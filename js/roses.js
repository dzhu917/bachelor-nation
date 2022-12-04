// Adapted from the tutorial https://www.youtube.com/watch?v=T9bReBQ801Q

var canvas = document.getElementById("myCanvas");
// set boundaries for roses
canvas.style.opacity = ".6";
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var context = canvas.getContext("2d");
var img = new Image();
img.src = "img/rose.gif";
var img_sparkle = new Image();
img_sparkle.src = "img/sparkles.png";

var numRoses = 20;
var rose = [];

for (var i = 0; i < numRoses; i++) {
  var x = Math.random() * canvas.width;
  var y = Math.random() * canvas.height;
  rose[i] = new Rose(x, y);
}

var numHearts = 15;
var heart = [];

for (var i = 0; i < numHearts; i++) {
  var x = Math.random() * canvas.width;
  var y = Math.random() * canvas.height;
  heart[i] = new Heart(x, y);
}

function Rose(x, y) {
  this.x = x;
  this.y = y;

  this.fall = function () {
    this.y = this.y + 0.75;
    if (this.y > canvas.height) {
      this.y = 0;
    }
  };
  this.show = function () {
    context.drawImage(img, this.x, this.y, 40, 40);
  };
}

function Heart(x, y) {
  this.x = x;
  this.y = y;

  this.fall = function () {
    this.y = this.y + 0.5;
    if (this.y > canvas.height) {
      this.y = 0;
    }
  };
  this.show = function () {
    context.drawImage(img_sparkle, this.x, this.y, 20, 20);
  };
}

function draw() {
  context.fillStyle = "#242635";
  context.fillRect(0, 0, canvas.width, canvas.height);
  for (var i = 0; i < numRoses; i++) {
    rose[i].show();
    rose[i].fall();
  }
  for (var i = 0; i < numHearts; i++) {
    heart[i].show();
    heart[i].fall();
  }
}

function update() {
  draw();
  window.requestAnimationFrame(update);
}
update();
