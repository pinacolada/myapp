console.log("Je suis dans la page trop bien...");
class Point {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    add(x, y) {
        this.x += x;
        this.y += y;
    }
    equals(p) {
        return this.x === p.x && this.y === p.y;
    }
    setTo(x, y) {
        this.x = x;
        this.y = y;
    }
    offset(x, y) {
        return new Point(this.x + x, this.y + y);
    }
    toString() {
        return `(x:${this.x} - y:${this.y})`;
    }
    angleTo(p2) {
        return Math.atan2(p2.y - this.y, p2.x - this.x);
    }
    distTo(p2) {
        let [x, y] = [p2.x - this.x, p2.y - this.y];
        return Math.sqrt((x * x) + (y * y));
    }
    polarTo(distance, angleRad) {
        return new Point(this.x + Math.cos(angleRad) * distance, this.y + Math.sin(angleRad) * distance);
    }
    static Angle(p1, p2) {
        return Math.atan2(p2.y - p1.y, p2.x - p1.x);
    }
    static Distance(p1, p2) {
        let [x, y] = [p2.x - p1.x, p2.y - p1.y];
        return Math.sqrt((x * x) + (y * y));
    }
    static Polar(p1, distance, angleRad) {
        return new Point(p1.x + Math.cos(angleRad) * distance, p1.y + Math.sin(angleRad) * distance);
    }
}
class Rect extends Point {
    constructor(px = 0, py = 0, width = 0, height = 0) {
        super(px, py);
        this.width = width;
        this.height = height;
    }
    setTo(px = 0, py = 0, width = 0, height = 0) {
        this.x = px;
        this.y = py;
        this.width = width;
        this.height = height;
    }
    toString() {
        return `(x:${this.x} - y:${this.y})-(w:${this.width} - h:${this.height})`;
    }
    get left() {
        return this.x;
    }
    set left(value) {
        this.x = value;
    }
    get top() {
        return this.y;
    }
    set top(value) {
        this.y = value;
    }
    get bottom() {
        return this.y + this.height;
    }
    set bottom(value) {
        this.y = value - this.height;
    }
    get right() {
        return this.x + this.width;
    }
    set right(value) {
        this.x = value - this.width;
    }
    get topLeft() {
        return new Point(this.left, this.top);
    }
    set topLeft(value) {
        this.top = value.y;
        this.left = value.x;
    }
    get topRight() {
        return new Point(this.right, this.top);
    }
    set topRight(value) {
        this.top = value.y;
        this.right = value.x;
    }
    get botLeft() {
        return new Point(this.left, this.bottom);
    }
    set botLeft(value) {
        this.bottom = value.y;
        this.left = value.x;
    }
    get botRight() {
        return new Point(this.right, this.bottom);
    }
    set botRight(value) {
        this.bottom = value.y;
        this.right = value.x;
    }
}
class Visuel {
    constructor(type = "DIV", id, pos) {
        this.children = [];
        this._pos = new Point();
        this.el = document.createElement(type);
        this.el["visuel"] = this;
        this.pos = new Point(pos.x, pos.y);
        this.setCss("box-sizing", "border-box", "position", "absolute");
    }
    dispatch(eventType) {
        this.el.dispatchEvent(new Event(eventType));
    }
    get pos() {
        return this._pos;
    }
    set pos(value) {
        if (this._pos.equals(value))
            return;
        this._pos.setTo(value.x, value.y);
        this.setCss("left", `${this._pos.x}px`, "top", `${this._pos.y}px`);
    }
    get x() {
        return this._pos.x;
    }
    set x(value) {
        if (this._pos.x !== value) {
            this._pos.x = value;
            this.setCss("left", `${this._pos.x}px`);
            this.dispatch("position");
        }
    }
    get y() {
        return this._pos.y;
    }
    set y(value) {
        if (this._pos.y !== value) {
            this._pos.y = value;
            this.setCss("top", `${this.y}px`);
            this.dispatch("position");
        }
    }
    setCss(...propVals) {
        for (let i = 0; i < propVals.length; i += 2) {
            let [prop, val] = [propVals[i], propVals[i + 1]];
            this.el.style[prop] = val;
        }
    }
    addChild(v) {
        if (v === null) {
            throw new TypeError("Impossible d'ajouter un visuel nul");
        }
        v.parent = this; // tout faire dans le setter parent
    }
    removeChild(v) {
        if (this.children.indexOf(v) > -1) {
            v.parent = null;
        }
    }
    removeChildren() {
        while (this.numChildren) {
            this.children.pop().parent = null;
        }
    }
    get numChildren() {
        return this.children.length;
    }
    get parentEl() {
        return this.el.parentElement;
    }
    set parentEl(value) {
        if (value !== null) {
            value.appendChild(this.el);
            let p = value["visuel"];
            if (p !== null && p.children.indexOf(this) === -1) {
                p.children.push(this);
            }
        }
    }
    get parent() {
        return this.parentEl["visuel"];
    }
    set parent(value) {
        if (value === null) {
            // on enlève le visuel de son support
            let pere = this.el.parentElement;
            if (pere !== null) {
                let pv = pere["visuel"];
                pere.removeChild(this.el);
                if (pv != null) {
                    let i = pv.children.indexOf(this);
                    pv.children.splice(i, 1);
                }
            }
        }
        else if (value !== this.parent) {
            this.parentEl = value.el;
        }
    }
}
class Frame extends Visuel {
    constructor(idFrame, rect) {
        super("div", idFrame, rect.topLeft);
        this._rect = new Rect();
        this.rect = rect;
    }
    get rect() {
        return this.rect;
    }
    set rect(value) {
        this._rect.setTo(value.x, value.y, value.width, value.height);
        this.setCss("left", `${this._rect.left}px`, "top", `${this._rect.top}px`, "width", `${this._rect.width}px`, "height", `${this._rect.height}px`);
    }
}
class Ligne extends Visuel {
    constructor(idLigne, pStart, pEnd) {
        super("div", idLigne, pStart);
        this.pStart = pStart;
        this.pEnd = pEnd;
        document.body.appendChild(this.el);
        this.setCss("width", `${pStart.distTo(pEnd)}px`, "transform-origin", "0 0", "transform", `rotate(${pStart.angleTo(pEnd)}rad)`);
        this.setStyle();
    }
    setStyle(couleur = "black", epaisseur = 1.0, alpha = 1) {
        this.setCss("height", `${epaisseur}px`, "background-color", couleur, "opacity", alpha.toString());
    }
}
let r = new Rect(100, 50, 400, 250);
let cadre = new Frame("cadre", r);
cadre.setCss("background-color", "#999999");
document.body.appendChild(cadre.el);
new Ligne("dia1", r.topLeft, r.botRight).setStyle("red");
new Ligne("dia2", r.botLeft, r.topRight).setStyle("green");
new Ligne("haut", r.topLeft, r.topRight).setStyle("blue");
new Ligne("droi", r.topRight, r.botRight);
new Ligne("bas", r.botRight, r.botLeft);
new Ligne("gau", r.botLeft, r.topLeft).setStyle("blue");
console.log(r.toString());
