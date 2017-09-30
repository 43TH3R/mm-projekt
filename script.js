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

var boxes = [];
// var grid = [];
// for (var i=0; i<gridW; i++) {
// 	var row = [];
// 	for (var j=0; j<gridH; j++) row.push([]);
// 	grid.push(row);
// }

function addBox() {
	newW = Math.random()*70 + 30;
	newH = Math.random()*70 + 30;
	newX = Math.random()*(canvasW - newW);
	newY = Math.random()*(canvasH - newH);
	newVx = Math.random()*10 - 5;
	newVy = Math.random()*10 - 5;
	boxes.push({x: newX, y: newY, w: newW, h: newH, vx: newVx, vy: newVy});
	// gridX1 = Math.floor(newX/gridSize);
	// gridY1 = Math.floor(newY/gridSize);
	// gridX2 = Math.floor((newX + newW)/gridSize);
	// gridY2 = Math.floor((newY + newH)/gridSize);
	// for (var i=gridX1; i<=gridX2; i++) {
	// 	for (var j=gridY1; j<=gridY2; i++) grid[i][j] = boxes.length - 1;
	// }
}

// function printGrid() {
//     for (var i = 0; i < gridW; i++) {
//         var riadok = "";
//         for (var j = 0; j < gridH; j++) {
//             for (var k = 0; k < grid[i][j].length; k++) {
//                 riadok += grid[i][j][k] + " ";
//             }
//             riadok += "|";
//         }
//         console.log(riadok);
//     }
// }

function drawGrid() {
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

function draw() {
    c.clearRect(0, 0, canvasW, canvasH, 0.5);
	// drawGrid();
    drawBoxes();
}

function drawBoxes() {
    boxes.forEach(function(box, i) {
        c.fillStyle = "#000000";
        c.fillRect(box.x, box.y, box.w, box.h);
        c.fillStyle = "#ff0000";
        c.font="20px Arial";
        var label = "" + (i+1);
        c.fillText(label, box.x + box.w/2 - c.measureText(label).width/2, box.y + box.h/2 + 7);
    });
}

function move() {
	boxes.forEach(function(box) {
		if (box.x + box.vx < 0 || box.x + box.w + box.vx > canvasW) box.vx = -box.vx;
		if (box.y + box.vy < 0 || box.y + box.h + box.vy > canvasH) box.vy = -box.vy;
		box.x = box.x + box.vx;
		box.y = box.y + box.vy;
	});
}

function mainLoop() {
    move();
	draw();
}

addBox();
addBox();
addBox();
addBox();

var interval;
var playing = false;

function start() {
    if (!playing) {
        interval = setInterval(mainLoop, 16);
        playing = true;
    }
}

function stop() {
    if (playing) {
        clearInterval(interval);
        drawGrid();
        drawBoxes();
        playing = false;
    }
}

start();