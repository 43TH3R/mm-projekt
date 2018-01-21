const matrixPM = {
    init: function() {
        this.grid = new Array(gridW);
        for (let x = 0; x < gridW; x++) {
            this.grid[x] = new Array(gridH);
            for (let y = 0; y < gridH; y++) {
                this.grid[x][y] = {};
            }
        }
        console.log(gridW, gridH);
    },
    addBoxToCell: function(box, x, y) {
        this.grid[x][y][box.i] = true;
    },
    removeBoxFromCell: function(box, x, y) {
        if (this.grid[x][y].hasOwnProperty(box.i)) delete this.grid[x][y][box.i];
    },
    printGrid: function() {
        let s = '';
        for (let y = 0; y < gridH; y++) {
            for (let x = 0; x < gridW; x++) {
                let b = false;
                for (let i = 0; i < boxes.length; i++) {
                    if (this.grid[x][y][boxes[i].i]) {
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
    },
    drawGrid: function() {
        for (let y = 0; y < gridH; y++) {
            for (let x = 0; x < gridW; x++) {
                for (let i = 0; i < boxes.length; i++) {
                    if (this.grid[x][y][boxes[i].i]) {
                        c.fillStyle = boxes[i].c;
                        c.globalAlpha = 0.5;
                        c.fillRect(x*gridSize, y*gridSize, gridSize, gridSize);
                        c.globalAlpha = 1;
                    }
                }
            }
        }
    },
    checkCollision: function() {
        collisions = {};
        for (let x = 0; x < gridW; x++) {
            for (let y = 0; y < gridH; y++) {
                Object.keys(this.grid[x][y]).forEach(b1 =>
                    Object.keys(this.grid[x][y]).forEach(b2 => addCollision(b1, b2)));
            }
        }
    }
};