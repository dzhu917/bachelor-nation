var canvas = document.getElementById("myCanvas");
// set boundaries for roses
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var context = canvas.getContext("2d");
var img = new Image();
img.src = "data/rose.gif"

var numRoses = 20;
var rose = [];

for(var i = 0; i < numRoses; i++){
    var x = Math.random()*canvas.width;
    var y = Math.random()*canvas.height;
    rose[i] = new Rose(x, y);
}

function Rose(x, y){
    this.x = x;
    this.y = y;

    this.fall = function(){
        this.y = this.y+1;
        if(this.y > canvas.height){
            this.y = 0;
        }
    }
    this.show = function(){
        context.drawImage(img, this.x, this.y, 30, 30);
    }
}

function draw() {
    context.fillStyle = 'black'; // black background
    context.fillRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < numRoses; i++) {
        rose[i].show();
        rose[i].fall();
    }
}

function update(){
    draw();
    window.requestAnimationFrame(update);
}
update();