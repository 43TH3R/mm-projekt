// constants
const gridSize = 10;
const gridW = 80;
const gridH = 60;
const canvasW = gridW * gridSize;
const canvasH = gridH * gridSize;

// initialization
var canvas = document.getElementById("canvas");
canvas.setAttribute("width", canvasW);
canvas.setAttribute("height", canvasH);
var c = canvas.getContext("2d");
c.strokeStyle = "#000000";
c.fillStyle = "#ffffff";

boxes = [];

var addBoxes = function() {
	newW = Math.random()*100;
	newH = Math.random()*100;
	newX = Math.random()*canvasW - newW;
	newY = Math.random()*canvasH - newH;
	newVx = Math.random()*10 - 5;
	newVy = Math.random()*10 - 5;
	boxes.push({x: newX, y: newY, w: newW, h: newH, vx: newVx, vy: newVy});
}

var draw = function() {
	console.log("volam draw");
	console.log(boxes);
    c.fillRect(0,0,canvasW,canvasH);
	boxes.forEach(function(box) {
		c.strokeRect(box.x, box.y, box.w, box.h);
	});
}

var move = function() {
	boxes.forEach(function(box) {
		if (box.x + box.vx < 0 || box.x + box.w + box.vx > canvasW) box.vx = -box.vx;
		if (box.y + box.vy < 0 || box.y + box.h + box.vy > canvasH) box.vy = -box.vy;
		box.x = box.x + box.vx;
		box.y = box.y + box.vy;
	});
}

var mainLoop = function() {
	draw();
	move();
}

addBoxes();
addBoxes();
setInterval(mainLoop, 16);
