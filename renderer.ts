console.log("Je suis dans la page trop bien...");

class Point {
    constructor(public x:number=0, public y:number=0) {
    }
    add(x:number, y:number):void{
        this.x += x;
        this.y += y;
    }    
    equals(p:Point):boolean {
        return this.x === p.x && this.y === p.y;
    }
    setTo(x:number, y:number):void{
        this.x = x;
        this.y = y;
    }
    offset(x:number, y:number):Point {
        return new Point(this.x + x, this.y + y);
    }

    toString() {
        return `(x:${this.x} - y:${this.y})`;
    }
    angleTo(p2:Point):number {
        return Math.atan2(p2.y-this.y, p2.x-this.x);
    }
    distTo(p2):number {
        let [x, y] = [p2.x - this.x, p2.y- this.y];
        return Math.sqrt((x*x)+(y*y));
    }
    polarTo(distance:number, angleRad:number):Point {
        return new Point(this.x + Math.cos(angleRad)*distance, this.y + Math.sin(angleRad)* distance);
    }
    static Angle(p1:Point, p2:Point) {
        return Math.atan2(p2.y-p1.y, p2.x-p1.x);
    }    
    static Distance(p1:Point, p2:Point):number {
        let [x, y] = [p2.x-p1.x,p2.y-p1.y];
        return Math.sqrt((x*x)+(y*y));
    }
    static Polar(p1:Point, distance:number, angleRad:number) {
        return new Point(p1.x + Math.cos(angleRad)*distance, p1.y + Math.sin(angleRad)* distance);
    }
}
class Rect extends Point {
    constructor(px:number=0, py:number=0, public width:number=0, public height:number=0) {
        super(px, py);
    }
    setTo(px:number=0, py:number=0, width:number=0, height:number=0){
        this.x = px;
        this.y = py;
        this.width = width;
        this.height = height;
    }
    toString() {
        return `(x:${this.x} - y:${this.y})-(w:${this.width} - h:${this.height})`;
    }
    get left():number {
        return this.x;
    }
    set left(value:number){
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
    set bottom(value:number){
        this.y = value - this.height;
    }
    get right():number {
        return this.x + this.width;
    }
    set right(value:number){
        this.x = value - this.width;
    }
    get topLeft():Point {
        return new Point(this.left, this.top);
    }
    set topLeft(value:Point){
        this.top = value.y;
        this.left = value.x;
    }
    get topRight():Point {
        return new Point(this.right, this.top);
    }
    set topRight(value:Point){
        this.top = value.y;
        this.right = value.x;
    }
    get botLeft():Point {
        return new Point(this.left, this.bottom);
    }
    set botLeft(value:Point){
        this.bottom = value.y;
        this.left = value.x;
    }
    get botRight():Point {
        return new Point(this.right, this.bottom);
    }
    set botRight(value:Point){
        this.bottom = value.y;
        this.right = value.x;
    }
}
class Visuel {
    el:HTMLElement;
    children:Visuel[] = [];
    _pos:Point = new Point();
    constructor(type:string="DIV", id:string, pos:Point) {
        this.el = document.createElement(type);
        this.el["visuel"] = this;
        this.pos = new Point(pos.x, pos.y);
        this.setCss("box-sizing", "border-box", "position","absolute");
    }
    dispatch(eventType:string) {
        this.el.dispatchEvent(new Event(eventType))
    }
    get pos():Point {
        return this._pos;
    }
    set pos(value:Point){
        if(this._pos.equals(value)) return;
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
    setCss(...propVals:string[]) {
        for(let i=0; i < propVals.length; i+=2) {
            let [prop, val] = [propVals[i],propVals[i+1]];
            this.el.style[prop] = val;
        }
    }
    addChild(v:Visuel) {
        if(v === null) {
            throw new TypeError("Impossible d'ajouter un visuel nul");
        }
        v.parent = this;// tout faire dans le setter parent
    }
    removeChild(v:Visuel) {
        if(this.children.indexOf(v)> -1){
            v.parent = null;
        }
    }
    removeChildren(){
        while(this.numChildren){
            this.children.pop().parent = null;
        }
    }
    get numChildren():number {
        return this.children.length;
    }
    get parentEl():HTMLElement {
        return this.el.parentElement;
    }
    set parentEl(value:HTMLElement) {
        if(value !== null) {
            value.appendChild(this.el);
            let p:Visuel = value["visuel"];
            if(p !== null && p.children.indexOf(this) === -1) {
                p.children.push(this);
            }
        }   
    }
    get parent():Visuel {
        return this.parentEl["visuel"];
    }
    set parent(value:Visuel) {
        if(value === null) {
            // on enlève le visuel de son support
            let pere:HTMLElement = this.el.parentElement;
            if(pere !== null) {
                let pv:Visuel = pere["visuel"];
                pere.removeChild(this.el);
                if(pv != null) {
                    let i = pv.children.indexOf(this);
                    pv.children.splice(i, 1);   
                }  
            }
        } else if (value !== this.parent) {// on n'ajoute pas un enfant déjà mis
            this.parentEl = value.el;            
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
    setStyle(couleur:string="black", epaisseur:number=1.0, alpha:number=1) {
        this.setCss("height", `${epaisseur}px`,
                    "background-color", couleur, 
                    "opacity",alpha.toString());
    }
}
let r = new Rect(100, 50, 400, 250);

let cadre = new Frame("cadre", r);
cadre.setCss("background-color", "#999999");
document.body.appendChild(cadre.el);

new Ligne("dia1", r.topLeft,  r.botRight).setStyle("red");
new Ligne("dia2", r.botLeft,  r.topRight).setStyle("green");
new Ligne("haut", r.topLeft,  r.topRight).setStyle("blue");
new Ligne("droi", r.topRight, r.botRight);
new Ligne("bas",  r.botRight, r.botLeft);
new Ligne("gau",  r.botLeft,  r.topLeft).setStyle("blue");

console.log(r.toString());