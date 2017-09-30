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
c.moveTo(0,0);
c.lineTo(1000,1000);
c.stroke();

setInterval()