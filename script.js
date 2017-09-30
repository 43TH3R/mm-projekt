// constants
const gridSize = 100;
const gridW = 8;
const gridH = 6;
const canvasW = gridW * gridSize;
const canvasH = gridH * gridSize;

// initialization
var canvas = document.getElementById("canvas");
canvas.setAttribute("width", canvasW);
canvas.setAttribute("height", canvasH);
var c = canvas.getContext("2d");
c.strokeStyle = "#000000";

boxes = [];
grid = [];
for (var i=0; i<gridW; i++) {
	var row = [];
	for (var j=0; j<gridH; j++) row.push([]); 
	grid.push(row);
}

var addBox = function() {
	newW = Math.random()*80 + 20;
	newH = Math.random()*80 + 20;
	newX = Math.random()*(canvasW - newW);
	newY = Math.random()*(canvasH - newH);
	newVx = Math.random()*10 - 5;
	newVy = Math.random()*10 - 5;
	boxes.push({x: newX, y: newY, w: newW, h: newH, vx: newVx, vy: newVy});
	gridX1 = Math.floor(newX/gridSize);
	gridY1 = Math.floor(newY/gridSize);
	gridX2 = Math.floor((newX + newW)/gridSize);
	gridY2 = Math.floor((newY + newH)/gridSize);
	grid[gridX1][gridY1].push(boxes.length - 1);
	grid[gridX2][gridY2].push(boxes.length - 1);
	for (var i=gridX1; i<gridX2; i++) {
		for (var j=gridY1; j<gridY2; i++) grid[i][j] = boxes.length - 1;
	}
}

var drawGrid = function() {
	for (var i=1; i<gridH; i++) {
		c.moveTo(0, i*gridSize);
		c.lineTo(canvasW, i*gridSize);
		c.stroke();
	}
	for (var i=1; i<gridW; i++) {
		c.moveTo(i*gridSize, 0);
		c.lineTo(i*gridSize, canvasH);
		c.stroke();
	}
}

var draw = function() {
    c.clearRect(0, 0, canvasW, canvasH, 0.5);
	// drawGrid();
	boxes.forEach(function(box, i) {
		c.fillStyle = "#000000";
		c.fillRect(box.x, box.y, box.w, box.h);
		c.fillStyle = "#ff0000";
		c.font="20px Arial";
		c.fillText(i, box.x + box.w/2 - 5, box.y + box.h/2 + 5);
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

addBox();
addBox();
console.log(grid);
	
setInterval(mainLoop, 16);
