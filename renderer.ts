class Couleur {
    obj =  {  r:0,  g:0,  b:0,  a:1.0,   txt:"#000000", val:0, id:""};
    constructor(couleur:string|number, alpha:number = 1.0) {
        if(typeof couleur === "string") {
            this.txt = couleur;
        } else {
            this.val = couleur;
        }
        this.obj.a = alpha;
    }
    get rgb():string {
        return `rgb(${this.obj.r}, ${this.obj.g}, ${this.obj.b})`;
    }
    get rgba():string {
        return `rgba(${this.obj.r}, ${this.obj.g}, ${this.obj.b}, ${this.obj.a})`;
    }
    get txt():string {
        return this.obj.txt;
    }
    set txt(couleur:string) {
        if(couleur.indexOf("#")===0) {
            this.val = parseInt(couleur.substr(1), 16);
        } else if(couleur.indexOf("rgba(")===0) {
            let rgb:string = couleur.split("(")[1];
            [this.obj.r, this.obj.g, this.obj.b, this.obj.a] = rgb.split(",").map(item => parseFloat(item));
        } else if(couleur.indexOf("rgb(")===0) {
            let rgb:string = couleur.split("(")[1];
            [this.obj.r, this.obj.g, this.obj.b] = rgb.split(",").map(item => parseInt(item,10));
        } else {
            this.obj.txt = couleur; // nom de la couleur
        }
    }
    get val():number {
        return this.obj.val;
    }

    set val(couleur:number) {
        this.obj.val = couleur;
        // tslint:disable-next-line:no-bitwise
        this.obj.r = (couleur >> 16) & 0xFF, this.obj.g = (couleur >> 8) & 0xFF, this.obj.g = couleur & 0xFF;
    }
}
class Point {
    constructor(public x:number=0, public y:number=0) {
    }
    add(x:number, y:number):void {
        this.x += x;
        this.y += y;
    }
    equals(p:Point):boolean {
        return this.x === p.x && this.y === p.y;
    }
    setTo(x:number, y:number):void {
        this.x = x;
        this.y = y;
    }
    offset(x:number, y:number):Point {
        return new Point(this.x + x, this.y + y);
    }

    toString():string {
        return `(x:${this.x} - y:${this.y})`;
    }
    angleTo(p2:Point):number {
        return Math.atan2(p2.y-this.y, p2.x-this.x);
    }
    distTo(p2:Point):number {
        let [x, y] = [p2.x - this.x, p2.y- this.y];
        return Math.sqrt((x*x)+(y*y));
    }
    polarTo(distance:number, angleRad:number):Point {
        return new Point(this.x + Math.cos(angleRad)*distance, this.y + Math.sin(angleRad)* distance);
    }
    static Angle(p1:Point, p2:Point):number {
        return Math.atan2(p2.y-p1.y, p2.x-p1.x);
    }
    static Distance(p1:Point, p2:Point):number {
        let [x, y] = [p2.x-p1.x,p2.y-p1.y];
        return Math.sqrt((x*x)+(y*y));
    }
    static Polar(p1:Point, distance:number, angleRad:number):Point {
        return new Point(p1.x + Math.cos(angleRad)*distance, p1.y + Math.sin(angleRad)* distance);
    }
}
class Rect extends Point {
    constructor(px:number=0, py:number=0, public width:number=0, public height:number=0) {
        super(px, py);
    }
    setTo(px:number=0, py:number=0, width:number=0, height:number=0):Rect {
        this.x = px;
        this.y = py;
        this.width = width;
        this.height = height;
        return this;
    }
    toString():string {
        return `(x:${this.x} - y:${this.y})-(w:${this.width} - h:${this.height})`;
    }
    get left():number {
        return this.x;
    }
    set left(value:number) {
        this.x = value;
    }
    get top():number {
        return this.y;
    }
    set top(value:number) {
        this.y = value;
    }
    get bottom():number {
        return this.y + this.height;
    }
    set bottom(value:number) {
        this.y = value - this.height;
    }
    get right():number {
        return this.x + this.width;
    }
    set right(value:number) {
        this.x = value - this.width;
    }
    get topLeft():Point {
        return new Point(this.left, this.top);
    }
    set topLeft(value:Point) {
        this.top = value.y;
        this.left = value.x;
    }
    get topRight():Point {
        return new Point(this.right, this.top);
    }
    set topRight(value:Point) {
        this.top = value.y;
        this.right = value.x;
    }
    get botLeft():Point {
        return new Point(this.left, this.bottom);
    }
    set botLeft(value:Point) {
        this.bottom = value.y;
        this.left = value.x;
    }
    get botRight():Point {
        return new Point(this.right, this.bottom);
    }
    set botRight(value:Point) {
        this.bottom = value.y;
        this.right = value.x;
    }
}
class Visuel {
    children:Visuel[] = [];
    el:HTMLElement;
    _pos:Point = new Point();
    constructor(type:string="DIV", id:string, pos:Point) {
        this.el = document.createElement(type);
        this.el["visuel"] = this;
        this.pos = new Point(pos.x, pos.y);
        this.setCss("box-sizing", "border-box", "position","absolute");
    }
    addChild (v:Visuel):Visuel {
        if(v === null) {
            throw new TypeError("Impossible d'ajouter un visuel nul");
        }
        v.parent = this;// tout faire dans le setter parent
        return v;
    }
    addTo(alt:any):void {
        if(alt instanceof Visuel) {
            this.parent = alt;
        } else if (alt instanceof HTMLElement) {
            alt.appendChild(this.el);
        }
    }
    dispatch(eventType:string):void {
        this.el.dispatchEvent(new Event(eventType));
    }
    removeChild(v:Visuel):Visuel {
        if(this.children.indexOf(v)> -1) {
            v.parent = null;
        }
        return v;
    }
    removeChildren():void {
        while(this.numChildren) {
            this.children.pop().parent = null;
        }
    }
    setCss (...propVals:string[]):void {
        for(let i:number = 0; i < propVals.length; i+=2) {
            let [prop, val] = [propVals[i],propVals[i+1]];
            this.el.style[prop] = val;
        }
    }
    get backgroundColor():number {
        return new Couleur(this.el.style.backgroundColor).val;
    }
    set backgroundColor(couleur:number) {
        this.setCss("background-color", new Couleur(couleur).rgb);
    }
    get borderColor():number {
        return new Couleur(this.el.style.borderColor).val;
    }
    set borderColor(couleur:number) {
        this.setCss("border", "1px solid "+new Couleur(couleur).rgb);
    }
    get borderRadius():number {
        return parseInt(this.el.style.borderRadius, 10);
    }
    set borderRadius(value:number) {
        this.setCss("border-radius", `${value}px`);
    }
    get pos():Point {
        return this._pos;
    }
    set pos(value:Point) {
        if (this._pos.equals(value) ) {
            return;
        }
        this._pos.setTo(value.x, value.y);
        this.setCss("left", `${this._pos.x}px`,"top", `${this._pos.y}px`);
    }
    get x():number {
        return this._pos.x;
    }
    set x(value:number) {
        if(this._pos.x !== value) {
            this._pos.x = value;
            this.setCss("left", `${this._pos.x}px`);
            this.dispatch("position");
        }
    }
    get y():number {
        return this._pos.y;
    }
    set y(value:number) {
        if(this._pos.y !== value) {
            this._pos.y = value;
            this.setCss("top", `${this.y}px`);
            this.dispatch("position");
        }
    }
    get numChildren():number {
        return this.children.length;
    }

    get parent():Visuel {
        return this.el.parentElement["visuel"];
    }
    set parent(value:Visuel) {
        if(value === null) {
            // on enlève d'abord ce visuel de son support si c'est un visuel
            if(this.el.parentElement !== null) {
                this.el.parentElement.removeChild(this.el);
                if(this.el.parentElement["visuel"] instanceof Visuel) {
                   let pv:Visuel = this.el.parentElement["visuel"];
                   pv.children.splice(pv.children.indexOf(this), 1);
                }
            } else if(this.el.parentNode !=null) {
                this.el.parentNode.removeChild(this.el);
            }
        } else if (value instanceof Visuel) {
            value.el.appendChild(this.el);
            if (value.children.indexOf ( this ) === -1) {
                value.children.push(this);
            }
        }
    }
}
class Frame extends Visuel {
    _rect:Rect = new Rect();
    constructor(idFrame:string, rect:Rect) {
        super("div", idFrame, rect.topLeft);
        this.rect = rect;
    }
    get rect():Rect {
        return this.rect;
    }
    set rect(value:Rect) {
        this._rect.setTo(value.x, value.y, value.width, value.height);
        this.setCss("left", `${this._rect.left}px`,
                    "top", `${this._rect.top}px`, 
                    "width", `${this._rect.width}px`,
                    "height", `${this._rect.height}px`);
    }
}
class Ligne extends Visuel {
    constructor(idLigne:string, public pStart:Point, public pEnd:Point) {
        super("div", idLigne, pStart);
        document.body.appendChild(this.el);
        this.setCss("width",`${pStart.distTo(pEnd)}px`,
                    "transform-origin", "0 0",
                    "transform", `rotate(${pStart.angleTo(pEnd)}rad)`);
        this.setStyle();
    }
    setStyle(couleur:string="black", epaisseur:number=1.0, alpha:number=1):Ligne {
        this.setCss("height", `${epaisseur}px`,
                    "background-color", couleur,
                    "opacity",alpha.toString());
        return this;
    }
}
let r:Rect = new Rect(100, 50, 400, 250);

let cadre:Frame = new Frame("cadre", r);
cadre.backgroundColor = 0x999999;
cadre.addTo(document.body);

let dia_1:Ligne = new Ligne("dia_1", r.topLeft,  r.botRight).setStyle("red");
let dia_2:Ligne = new Ligne("dia_2", r.botLeft,  r.topRight).setStyle("green");
let haut:Ligne = new Ligne("haut", r.topLeft,  r.topRight).setStyle("blue");
let droi:Ligne = new Ligne("droi", r.topRight, r.botRight);
let bas:Ligne = new Ligne("bas",  r.botRight, r.botLeft);
let gau:Ligne = new Ligne("gau",  r.botLeft,  r.topLeft).setStyle("blue");

let hRect:Rect = new Rect(150,150, 200,200);
let hCent:Point = hRect.topLeft.offset(hRect.width/2, hRect.height/2);
console.log("l'horloge est placée en", hRect.toString());
console.log("Son centre est en", hCent.toString());

let horloge:Frame = new Frame("horloge", hRect);
horloge.backgroundColor = 0x66FF66;
horloge.borderRadius = 20;
horloge.addTo(document.body);