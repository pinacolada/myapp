console.log("Normalement, on devrait me voir dans la page trop bien...");
class Point {
    constructor(px, py) {
        this.px = px;
        this.py = py;
        if (!(this instanceof Rect))
            console.log("Point :", this.toString());
    }
    toString() {
        return `(x:${this.px} - y:${this.py})`;
    }
}
class Rect extends Point {
    constructor(px, py, width, height) {
        super(px, py);
        this.width = width;
        this.height = height;
        console.log("Rect :", this.toString());
    }
    toString() {
        return `(x:${this.px} - y:${this.py})-(w:${this.width} - h:${this.height})`;
    }
}
let p1 = new Point(20, 50);
let p2 = new Point(100, 250);
let r1 = new Rect(100, 100, 400, 300);
