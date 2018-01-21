const hashPM = {
    init: function() {
        this.hash = [];
    },
    getHash: function(x, y) {
        return (x + y) * (x + y + 1) / 2 + y;
    },
    addBoxToCell: function(box, x, y) {
        const s = this.getHash(x, y);
        if (!this.hash.hasOwnProperty(s)) {
            this.hash[s] = {};
        }
        this.hash[s][box.i] = true;
    },
    removeBoxFromCell: function(box, x, y) {
        const s = this.getHash(x, y);
        if (this.hash.hasOwnProperty(s)) {
            if (this.hash[s].hasOwnProperty(box.i)) delete this.hash[s][box.i];
            if (this.isCellEmpty(this.hash[s])) delete this.hash[s];
        }
    },
    isCellEmpty: function (cell) {
        for (let p in cell) {
            if (cell.hasOwnProperty(p)) return false;
        }
        return true;
    },
    printGrid: function() {
        let s = '';
        for (let y = 0; y < gridH; y++) {
            for (let x = 0; x < gridW; x++) {
                let b = false;
                const h = this.getHash(x, y);
                if (this.hash.hasOwnProperty(h)) {
                    for (let i = 0; i < boxes.length; i++) {
                        if (this.hash[h][boxes[i].i]) {
                            if (!b) {
                                b = boxes[i].i
                            } else {
                                b = "X";
                                break;
                            }
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
                    const h = this.getHash(x, y);
                    if (this.hash.hasOwnProperty(h) && this.hash[h][boxes[i].i]) {
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
        for (let h in this.hash) {
            if (!this.hash.hasOwnProperty(h)) continue;
            Object.keys(this.hash[h]).forEach(b1 =>
                Object.keys(this.hash[h]).forEach(b2 => addCollision(b1, b2)));
        }
    }
};