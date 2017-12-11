// constants
const gridSize = 30;
const density = 0.00001;

// initialization
const playButton = document.getElementById("playButton");
const stopButton = document.getElementById("stopButton");
const stepButton = document.getElementById("stepButton");
const canvas = document.getElementById("canvas");

const dimensions = canvas.getBoundingClientRect();
const gridW = Math.floor(dimensions.width / gridSize);
const gridH = Math.floor(dimensions.height / gridSize);
const canvasW = gridW * gridSize;
const canvasH = gridH * gridSize;

canvas.setAttribute("width", canvasW);
canvas.setAttribute("height", canvasH);
const c = canvas.getContext("2d");
c.strokeStyle = "#000000";
initGridPath();

// data structures
let boxes = [];
const grid = new Array(gridW);
for (let x = 0; x < gridW; x++) {
    grid[x] = new Array(gridH);
    for (let y = 0; y < gridH; y++) {
        grid[x][y] = {};
    }
}

let lastBox = 0;

function addBox() {
	newW = Math.random()*70 + 30;
	newH = Math.random()*70 + 30;
	newX = Math.random()*(canvasW - newW);
	newY = Math.random()*(canvasH - newH);
	newVx = Math.random()*10 - 5;
	newVy = Math.random()*10 - 5;
	lastBox++;
	const box = {
	    x: newX,
        y: newY,
        w: newW,
        h: newH,
        vx: newVx,
        vy: newVy,
        i: lastBox,
        c: getRandomColor()
	};
	boxes.push(box);
	addBoxToGrid(box, grid);
}

function removeBox() {
    removeBoxById(parseInt(document.getElementById('removeId').value));
}

function removeBoxById(i) {
    boxes = boxes.filter(box => box.i !== i);
    for (let x = 0; x < gridW; x++) {
        for (let y = 0; y < gridH; y++) {
            if (grid[x][y].hasOwnProperty(i)) delete grid[x][y][i];
        }
    }
}

function addBoxToGrid(box, grid) {
    const cr = getBoxCellRange(box);
    for (let x = cr.a.x; x <= cr.b.x; x++) {
        for (let y = cr.a.y; y <= cr.b.y; y++) {
            grid[x][y][box.i] = true;
        }
    }
}

function removeBoxFromGrid(box, grid) {
    const cr = getBoxCellRange(box);
    for (let x = cr.a.x; x <= cr.b.x; x++) {
        for (let y = cr.a.y; y <= cr.b.y; y++) {
            grid[x][y][box.i] = false;
        }
    }
}

function printGrid() {
    let s = '';
    for (let y = 0; y < gridH; y++) {
        for (let x = 0; x < gridW; x++) {
            for (let i = 0; i < boxes.length; i++) {
                s += grid[x][y][boxes[i].i] ? i : ' ';
            }
            s += ' ';
        }
        s += '\n';
    }
    console.log(s);
}

function getBoxCellRange(box) {
    const a = getPointCell(box.x, box.y);
    const b = getPointCell(box.x + box.w, box.y + box.h);
    return {a: a, b: b};
}

function getPointCell(x, y) {
    return {
        x: Math.floor(x / gridSize),
        y: Math.floor(y / gridSize)
    };
}

function initGridPath() {
	c.beginPath();
	for (let i=1; i<gridH; i++) {
		c.moveTo(0, i*gridSize);
		c.lineTo(canvasW, i*gridSize);
	}
	for (let i=1; i<gridW; i++) {
		c.moveTo(i*gridSize, 0);
		c.lineTo(i*gridSize, canvasH);
	}
}

function draw() {
    c.clearRect(0, 0, canvasW, canvasH);
	drawGrid();
    c.stroke();
    drawBoxes();
}

function drawGrid() {
    for (let y = 0; y < gridH; y++) {
        for (let x = 0; x < gridW; x++) {
            for (let i = 0; i < boxes.length; i++) {
                if (grid[x][y][boxes[i].i]) {
                    c.fillStyle = boxes[i].c;
                    c.globalAlpha = 0.5;
                    c.fillRect(x*gridSize, y*gridSize, gridSize, gridSize);
                    c.globalAlpha = 1;
                }
            }
        }
    }
}

function drawBoxes() {
    boxes.forEach(function(box) {
        c.fillStyle = box.c;
        c.fillRect(box.x, box.y, box.w, box.h);
        c.fillStyle = "#000000";
        c.font="20px Arial";
        const label = "" + (box.i);
        c.fillText(label, box.x + box.w/2 - c.measureText(label).width/2, box.y + box.h/2 + 7);
    });
}

function move() {
	boxes.forEach(function(box) {
		if (box.x + box.vx < 0 || box.x + box.w + box.vx > canvasW) box.vx = -box.vx;
		if (box.y + box.vy < 0 || box.y + box.h + box.vy > canvasH) box.vy = -box.vy;
		else box.vy = box.vy + box.w*box.h*density; 
		removeBoxFromGrid(box, grid);
		box.x = box.x + box.vx;
		box.y = box.y + box.vy;
        addBoxToGrid(box, grid);
	});
}

function mainLoop() {
    move();
	draw();
}

// playback control
let interval;
let playing = false;

function start() {
    if (!playing) {
        interval = setInterval(mainLoop, 16);
        playing = true;
    }
}

function stop() {
    if (playing) {
        clearInterval(interval);
        playing = false;
    }
}

function step() {
	if (!playing) {
        mainLoop();
        printGrid();
    }
}

function getRandomColor() {
    var letters = '3456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
}

// start
addBox();
addBox();
addBox();
addBox();

start();