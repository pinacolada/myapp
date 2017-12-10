class Couleur {
    constructor(couleur, alpha = 1.0) {
        this.obj = { r: 0, g: 0, b: 0, a: 1.0, txt: "", val: 0, id: "" };
        if (typeof couleur === "number") {
            this.val = couleur;
        }
        else {
            this.txt = couleur;
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
    set val(value) {
        this.obj.val = value; // tslint:disable-next-line:no-bitwise
        this.obj.r = value >> 16 & 0xFF, this.obj.g = value >> 8 & 0xFF, this.obj.b = value & 0xFF;
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
class Visuel {
    constructor(target, type = "DIV", id, pos) {
        this.children = [];
        this._pos = new Point();
        this.el = document.createElement(type);
        Object.defineProperty(this.el, "visuel", { value: this });
        this.addTo(target);
        this.pos = new Point(pos.x, pos.y);
        this.setCss("box-sizing", "border-box", "position", "absolute");
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
    dispatch(eventType) {
        this.el.dispatchEvent(new Event(eventType));
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
    rotate(radians, centerX = 0, centerY = 0) {
        this.setCss("left", `${this._pos.x - centerX}px`, "top", `${this._pos.y - centerY}px`);
        this.setCss("transform-origin", `${centerX}px ${centerY}px`, "transform", `rotate(${radians}rad)`);
    }
    setCss(...propVals) {
        for (let i = 0; i < propVals.length; i += 2) {
            let [prop, val] = [propVals[i], propVals[i + 1]];
            this.el.style[prop] = val;
        }
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
    get borderRadius() {
        return parseInt(this.el.style.borderRadius, 10);
    }
    set borderRadius(value) {
        this.setCss("border-radius", `${value}px`);
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
    get numChildren() {
        return this.children.length;
    }
    get parent() {
        return Reflect.get(this.el.parentElement, "visuel");
    }
    set parent(value) {
        if (value === null) {
            // on enlève d'abord ce visuel de son support si c'est un visuel
            if (this.el.parentElement !== null) {
                this.el.parentElement.removeChild(this.el);
                if (this.parent !== null && this.parent.children !== null) {
                    let pc = this.parent.children;
                    pc.splice(pc.indexOf(this), 1);
                }
            }
            else if (this.el.parentNode != null) {
                this.el.parentNode.removeChild(this.el);
            }
        }
        else if (value instanceof Visuel) {
            value.el.appendChild(this.el);
            if (value.children.indexOf(this) === -1) {
                value.children.push(this);
            }
        }
    }
}
class Cadre extends Visuel {
    constructor(target, idFrame, rect) {
        super(target, "div", idFrame, rect.topLeft);
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
class Disque extends Visuel {
    constructor(target, idDisque, centre, rayon, couleur) {
        super(target, "div", idDisque, centre);
        this.rayon = rayon;
        this.setCss("left", (this.x - rayon) + "px", "top", (this.y - rayon) + "px");
        this.setCss("width", rayon * 2 + "px", "height", rayon * 2 + "px", "border-radius", rayon + "px");
        this.backgroundColor = couleur;
    }
}
class Ligne extends Visuel {
    constructor(target, idLigne, pStart, pEnd, cou, epai = 1.0, alpha = 1.0) {
        super(target, "div", idLigne, pStart);
        this.pStart = pStart;
        this.pEnd = pEnd;
        this.setCss("width", `${pStart.distTo(pEnd)}px`);
        this.rotate(pStart.angleTo(pEnd), 0, 0);
        this.setStyle(cou, epai, alpha);
    }
    setStyle(cou, epai = 1.0, alpha = 1.0) {
        this.setCss("height", `${epai}px`, "background-color", new Couleur(cou, alpha).rgba);
        this.setCss("top", this.pStart.y + (epai / 2) + "px");
        return this;
    }
}
const body = document.body;
let r = new Rect(100, 50, 400, 250);
let cadre = new Cadre(body, "cadre", r);
cadre.backgroundColor = 0x999999;
cadre.addTo(document.body);
let dia_1 = new Ligne(body, "dia_1", r.topLeft, r.botRight, 0xFF0000);
let dia_2 = new Ligne(body, "dia_2", r.botLeft, r.topRight, 0x00FF00);
let haut = new Ligne(body, "haut", r.topLeft, r.topRight, 0x0000FF);
let droi = new Ligne(body, "droi", r.topRight, r.botRight, 0x000000);
let bas = new Ligne(body, "bas", r.botRight, r.botLeft, 0x000000);
let gau = new Ligne(body, "gau", r.botLeft, r.topLeft, 0x0000FF);
function palette(base) {
    let a = [base];
    // tslint:disable-next-line:no-bitwise
    let rgb = [base >> 16 & 0xFF, base >> 8 & 0xFF, base & 0xFF];
    for (var i = 0; i < 5; i++) {
        let c = [rgb[0], rgb[1], rgb[2]].map((v) => Math.min(v + (i * 32), 255));
        // tslint:disable-next-line:no-bitwise
        a.push((c[0] << 16) | (c[1] << 8) | (c[2]));
    } // de plus en plus clair...
    return a;
}
class Horloge extends Disque {
    constructor(idHorloge, hCent, rayon, coulBase) {
        super(document.body, idHorloge, hCent, rayon, coulBase);
        this.hCent = hCent;
        this.rayon = rayon;
        // tour complet = 2 * Math.PI = tranche * 12 (pie = apple pie...)
        const pi = Math.PI, pi2 = pi * 2;
        const pie = pi / 6, quart = pi / 2;
        // coder les couleurs d'horloges sur 4 teintes
        let coul = palette(coulBase);
        for (let i = 0; i < 12; i++) {
            let d = new Disque(body, "pos_" + i, hCent.polarTo(rayon - 8, pie * i), 3, coul[2]);
        }
        let sec = new Ligne(body, "secondes", hCent, hCent.offset(0, rayon - 15), coul[2], 2);
        let min = new Ligne(body, "minutes", hCent, hCent.offset(0, rayon - 20), coul[3], 2);
        let heu = new Ligne(body, "heures", hCent, hCent.offset(0, rayon - 25), coul[4], 3);
        // c'est parti pour animation !
        function changeTime(d) {
            let h = d.getHours(), m = d.getMinutes();
            let s = d.getSeconds(), mi = d.getMilliseconds();
            sec.rotate((s + mi / 1000) * (pi2 / 60) - quart);
            min.rotate(((m + s / 60) * pi2 / 60) - quart);
            heu.rotate(((h + m / 60) * pi2 / 12) - quart);
        }
        setInterval(() => changeTime(new Date()), 50);
    }
}
let h1 = new Horloge("h1", new Point(250, 420), 50, 0x113399);
let h2 = new Horloge("h2", new Point(120, 120), 100, 0x660000);
let h3 = new Horloge("h3", new Point(400, 300), 90, 0x336633);
let h4 = new Horloge("h4", new Point(540, 200), 70, 0x333366);
