class Couleur {
    constructor(couleur, alpha = 1.0) {
        this.obj = { r: 0, g: 0, b: 0, a: 1.0, txt: "#000000", val: 0, id: "" };
        if (typeof couleur === "string") {
            this.txt = couleur;
        }
        else {
            this.val = couleur;
        }
        this.obj.a = alpha;
    }
    get rgb() {
        return `rgb(${this.obj.r}, ${this.obj.g}, ${this.obj.b})`;
    }
    get rgba() {
        return `rgba(${this.obj.r}, ${this.obj.g}, ${this.obj.b}, ${this.obj.a})`;
    }
    get txt() {
        return this.obj.txt;
    }
    set txt(couleur) {
        if (couleur.indexOf("#") === 0) {
            this.val = parseInt(couleur.substr(1), 16);
        }
        else if (couleur.indexOf("rgba(") === 0) {
            let rgb = couleur.split("(")[1];
            [this.obj.r, this.obj.g, this.obj.b, this.obj.a] = rgb.split(",").map(item => parseFloat(item));
        }
        else if (couleur.indexOf("rgb(") === 0) {
            let rgb = couleur.split("(")[1];
            [this.obj.r, this.obj.g, this.obj.b] = rgb.split(",").map(item => parseInt(item, 10));
        }
        else {
            this.obj.txt = couleur; // nom de la couleur
        }
    }
    get val() {
        return this.obj.val;
    }
    set val(couleur) {
        this.obj.val = couleur;
        // tslint:disable-next-line:no-bitwise
        this.obj.r = (couleur >> 16) & 0xFF, this.obj.g = (couleur >> 8) & 0xFF, this.obj.g = couleur & 0xFF;
    }
}
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
class HTMLVisuel {
    constructor(type) {
        this.el = document.createElement(type);
        this.el["visuel"] = this;
    }
    dispatch(eventType) {
        this.el.dispatchEvent(new Event(eventType));
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
        return this;
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
class Visuel extends HTMLVisuel {
    constructor(type = "DIV", id, pos) {
        super(type);
        this.children = [];
        this._pos = new Point();
        this.pos = new Point(pos.x, pos.y);
        this.setCss("box-sizing", "border-box", "position", "absolute");
    }
    get pos() {
        return this._pos;
    }
    set pos(value) {
        if (this._pos.equals(value)) {
            return;
        }
        this._pos.setTo(value.x, value.y);
        this.setCss("left", `${this._pos.x}px`, "top", `${this._pos.y}px`);
    }
    get backgroundColor() {
        return new Couleur(this.el.style.backgroundColor).val;
    }
    set backgroundColor(couleur) {
        this.setCss("background-color", new Couleur(couleur).rgb);
    }
    get borderColor() {
        return new Couleur(this.el.style.borderColor).val;
    }
    set borderColor(couleur) {
        this.setCss("border", "1px solid " + new Couleur(couleur).rgb);
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
    addChild(v) {
        if (v === null) {
            throw new TypeError("Impossible d'ajouter un visuel nul");
        }
        v.parent = this; // tout faire dans le setter parent
        return v;
    }
    addTo(alt) {
        if (alt instanceof Visuel) {
            this.parent = alt;
        }
        else if (alt instanceof HTMLElement) {
            alt.appendChild(this.el);
        }
    }
    removeChild(v) {
        if (this.children.indexOf(v) > -1) {
            v.parent = null;
        }
        return v;
    }
    removeChildren() {
        while (this.numChildren) {
            this.children.pop().parent = null;
        }
    }
    setCss(...propVals) {
        for (let i = 0; i < propVals.length; i += 2) {
            let [prop, val] = [propVals[i], propVals[i + 1]];
            this.el.style[prop] = val;
        }
    }
    get numChildren() {
        return this.children.length;
    }
    get parent() {
        return this.el.parentElement["visuel"];
    }
    set parent(value) {
        if (value === null) {
            // on enlève d'abord ce visuel de son support si c'est un visuel
            if (this.el.parentElement !== null) {
                this.el.parentElement.removeChild(this.el);
                if (this.el.parentElement["visuel"] instanceof Visuel) {
                    let pv = this.el.parentElement["visuel"];
                    pv.children.splice(pv.children.indexOf(this), 1);
                }
            }
            else if (this.el.parentNode != null) {
                this.el.parentNode.removeChild(this.el);
            }
        }
        else if (value instanceof Visuel) {
            value.el.appendChild(this.el);
            if (value.children.indexOf(this) == -1) {
                value.children.push(this);
            }
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
        return this;
    }
}
let r = new Rect(100, 50, 400, 250);
let cadre = new Frame("cadre", r);
cadre.backgroundColor = 0x999999;
cadre.addTo(document.body);
let dia_1 = new Ligne("dia_1", r.topLeft, r.botRight).setStyle("red");
let dia_2 = new Ligne("dia_2", r.botLeft, r.topRight).setStyle("green");
let haut = new Ligne("haut", r.topLeft, r.topRight).setStyle("blue");
let droi = new Ligne("droi", r.topRight, r.botRight);
let bas = new Ligne("bas", r.botRight, r.botLeft);
let gau = new Ligne("gau", r.botLeft, r.topLeft).setStyle("blue");
let hRect = new Rect(150, 150, 200, 200);
let hCent = hRect.topLeft.offset(hRect.width / 2, hRect.height / 2);
console.log("l'horloge est placée en", hRect.toString());
console.log("Son centre est en", hCent.toString());
let horloge = new Frame("horloge", hRect);
horloge.backgroundColor = 0x6666FF;
horloge.addTo(document.body);
