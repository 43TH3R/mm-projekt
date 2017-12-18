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
            removeBoxFromCell({i: i}, grid, x, y);
        }
    }
}

let collisions = {};

function addCollision(b1, b2) {
    if (b1 == b2) return;
    b1 += ''; b2 += '';
    if (!collisions.hasOwnProperty(b1)) {
        collisions[b1] = new Set([b2]);
    } else {
        collisions[b1].add(b2);
    }
    if (!collisions.hasOwnProperty(b2)) {
        collisions[b2] = new Set([b1]);
    } else {
        collisions[b2].add(b1);
    }
}

function removeColision(b1, b2) {
    if (b1 == b2) return;
    b1 += ''; b2 += '';
    if (collisions.hasOwnProperty(b1)) {
        collisions[b1].delete(b2);
    }
    if (collisions.hasOwnProperty(b2)) {
        collisions[b2].delete(b1);
    }
}

function addBoxToGrid(box, grid) {
    const cr = getBoxCellRange(box);
    for (let x = cr.a.x; x <= cr.b.x; x++) {
        for (let y = cr.a.y; y <= cr.b.y; y++) {
            addBoxToCell(box, grid, x, y);
        }
    }
}

function addBoxToCell(box, grid, x, y) {
    grid[x][y][box.i] = true;
}

function removeBoxFromCell(box, grid, x, y) {
    if (grid[x][y].hasOwnProperty(box.i)) delete grid[x][y][box.i];
}

function updateBoxOnGrid(box, grid) {
    const prev = getBoxCellRange(box)
    box.x = box.x + box.vx;
    box.y = box.y + box.vy;
    const next = getBoxCellRange(box);
    if (prev.a.x < next.a.x) {
        // lava hrana sa pohla do prava - odstranit stlpec z lava
        for (let y = prev.a.y; y <= prev.b.y; y++)
            for (let x = prev.a.x; x < next.a.x; x++)
                removeBoxFromCell(box, grid, x, y);
    } else if (prev.a.x > next.a.x) {
        // lava hrana sa pohla do lava - pridat stlpec z lava
        for (let y = next.a.y; y <= next.b.y; y++)
            for (let x = next.a.x; x < prev.a.x; x++)
                addBoxToCell(box, grid, x, y);
    }
    if (prev.b.x < next.b.x) {
        // prava hrana sa pohla do prava - pridat stlpec z prava
        for (let y = next.a.y; y <= next.b.y; y++)
            for (let x = prev.b.x+1; x <= next.b.x; x++)
                addBoxToCell(box, grid, x, y);
    } else if (prev.b.x > next.b.x) {
        // prava hrana sa pohla do lava - odstranit stlpec z prava
        for (let y = prev.a.y; y <= prev.b.y; y++)
            for (let x = next.b.x+1; x <= prev.b.x; x++)
                removeBoxFromCell(box, grid, x, y);
    }
    if (prev.a.y > next.a.y) {
        // horna hrana sa pohla hore - pridat riadok z hora
        for (let x = next.a.x; x <= next.b.x; x++)
            for (let y = next.a.y; y < prev.a.y; y++)
                addBoxToCell(box, grid, x, y);
    } else if (prev.a.y < next.a.y) {
        // horna hrana sa pohla dole - odstranit riadok z hora
        for (let x = prev.a.x; x <= prev.b.x; x++)
            for (let y = prev.a.y; y < next.a.y; y++)
                removeBoxFromCell(box, grid, x, y);
    }
    if (prev.b.y > next.b.y) {
        // dolna hrana sa pohla hore - odstranit riadok z dola
        for (let x = prev.a.x; x <= prev.b.x; x++)
            for (let y = next.b.y+1; y <= prev.b.y; y++)
                removeBoxFromCell(box, grid, x, y);
    } else if (prev.b.y < next.b.y) {
        // dolna hrana sa pohla dole - pridat riadok z dola
        for (let x = next.a.x; x <= next.b.x; x++)
            for (let y = prev.b.y+1; y <= next.b.y; y++)
                addBoxToCell(box, grid, x, y);
    }
}

function removeBoxFromGrid(box, grid) {
    const cr = getBoxCellRange(box);
    for (let x = cr.a.x; x <= cr.b.x; x++) {
        for (let y = cr.a.y; y <= cr.b.y; y++) {
            removeBoxFromCell(box, grid, x, y);
        }
    }
}

function printGrid() {
    let s = '';
    for (let y = 0; y < gridH; y++) {
        for (let x = 0; x < gridW; x++) {
            let b = false;
            for (let i = 0; i < boxes.length; i++) {
                // s += grid[x][y][boxes[i].i] ? i : ' ';
                if (grid[x][y][boxes[i].i]) {
                    if (!b) {
                        b = boxes[i].i
                    } else {
                        b = "X";
                        break;
                    }
                }

            }
            if (!b) s += ' ';
            else s += b;
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
		updateBoxOnGrid(box, grid);
	});
}

function checkCollisions() {
    collisions = {};
    for (let x = 0; x < gridW; x++) {
        for (let y = 0; y < gridH; y++) {
            Object.keys(grid[x][y]).forEach(b1 =>
                Object.keys(grid[x][y]).forEach(b2 => addCollision(b1, b2)));
        }
    }
}

let times = [];

function mainLoop() {
    var start = performance.now();
    move();
    checkCollisions();
	draw();
	var end = performance.now();

	// time calc
	times.push(end-start);
	if (times.length > 60) times.splice(0,1);
	document.getElementById('frametime').innerHTML = ("" + (end - start)).substr(0,7);
    const sum = times.reduce((a,v) => a + v);
    document.getElementById('frametime-ma').innerHTML = ("" + (sum / times.length)).substr(0,7);

    // print collisions
    let colText = '';
    boxes.forEach(function (b1) {
       colText += b1.i + ':';
       if (collisions.hasOwnProperty(b1.i)) collisions[b1.i].forEach(b2 => colText += ' '+b2);
       colText += '\n';
    });
    document.getElementById('collisions').innerHTML = colText;
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
        // printGrid();
        // console.log(collisions);
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