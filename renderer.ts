class Couleur {
    obj = [0, 0, 0, 0, 0]; //  r:0,  g:0,  b:0,  a:1.0, val:0;
    id:string;
    constructor(couleur:string|number, alpha:number = 1.0) {
        if(typeof couleur === "number") {
            this.val = couleur;
        } else if(typeof couleur === "string") {
            if(couleur.indexOf("#")===0) {
                this.val = parseInt(couleur.substr(1), 16);
            } else if(couleur.indexOf("rgba(")===0) {
                let rgb:string = couleur.split("(")[1];
                [this.r, this.g, this.b, this.alpha] = rgb.split(",").map(item => parseFloat(item));
            } else if(couleur.indexOf("rgb(")===0) {
                let rgb:string = couleur.split("(")[1];
                [this.r, this.g, this.b] = rgb.split(",").map(item => parseInt(item,10));
            } else {
                this.id = couleur; // nom de la couleur
            }
        }
        this.alpha = alpha;
    }
    get rgb():string {
        return `rgb(${this.r}, ${this.g}, ${this.b})`;
    }
    get rgba():string {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.alpha})`;
    }
    get val():number {
        return this.obj[4];
    }
    set val(value:number) { // tslint:disable-next-line:no-bitwise
        this.obj = [value >> 16 & 0xFF, value >> 8 & 0xFF, value & 0xFF, value, 1];
    }
    get r():number {
        return this.obj[0];
    }
    set r(value:number) {
        this.obj[0] = value;  // tslint:disable-next-line:no-bitwise
        this.obj[4] = this.obj[0] << 16 | this.obj[1] << 8 | this.obj[2];
    }
    get g():number {
        return this.obj[1];
    }
    set g(value:number) {
        this.obj[1] = value; // tslint:disable-next-line:no-bitwise
        this.obj[4] = this.obj[0] << 16 | this.obj[1] << 8 | this.obj[2];
    }
    get b():number {
        return this.obj[2];
    }
    set b(value:number) {
        this.obj[2] = value; // tslint:disable-next-line:no-bitwise
        this.obj[4] = this.obj[0] << 16 | this.obj[1] << 8 | this.obj[2];
    }
    get alpha():number {
        return this.obj[3];
    }
    set alpha(value:number) {
        this.obj[3] = value;
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
    constructor(target:HTMLElement|Visuel, type:string="DIV", id:string, pos:Point) {
        this.el = document.createElement(type);
        Object.defineProperty(this.el, "visuel", {value:this});
        this.addTo(target);
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
    rotate(radians:number, centerX:number=0, centerY:number=0):void {
        this.setCss("left", `${this._pos.x - centerX}px`,"top", `${this._pos.y - centerY}px`);
        this.setCss("transform-origin", `${centerX}px ${centerY}px`,
                    "transform",        `rotate(${radians}rad)`);
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
        return Reflect.get(this.el.parentElement, "visuel");
    }
    set parent(value:Visuel) {
        if(value === null) {
            // on enlève d'abord ce visuel de son support si c'est un visuel
            if(this.el.parentElement !== null) {
                this.el.parentElement.removeChild(this.el);
                if (this.parent !== null && this.parent.children !==null) {
                    let pc:Visuel[] = this.parent.children;
                    pc.splice(pc.indexOf(this), 1);
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
class Cadre extends Visuel {
    _rect:Rect = new Rect();
    constructor(target:any, idFrame:string, rect:Rect, couleurFond:number) {
        super(target, "div", idFrame, rect.topLeft);
        this.rect = rect;
        this.backgroundColor = couleurFond;
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
class Disque extends Visuel {
    constructor(target:any, idDisque:string, centre:Point,public rayon:number, couleur:number) {
        super(target, "div", idDisque, centre);
        this.setCss("left", (this.x - rayon)+"px", "top", (this.y - rayon)+"px");
        this.setCss("width", rayon * 2 + "px", "height", rayon * 2 + "px","border-radius",rayon+"px");
        this.setCss("border","1px solid rgba(66,66,66,0.7)");
        this.backgroundColor = couleur;
    }
}
class Ligne extends Visuel {
    constructor(target:any, idLigne:string, public pStart:Point, public pEnd:Point, cou:number, epai:number=1.0, alpha:number=1.0) {
        super(target, "div", idLigne, pStart);
        this.setCss("width",`${pStart.distTo(pEnd)}px`);
        this.setCss("border","1px solid rgba(66,66,66,0.7)");
        this.rotate(pStart.angleTo(pEnd), 0, 0);
        this.setStyle(cou, epai, alpha);
    }
    setStyle(cou:number, epai:number=1.0, alpha:number=1.0):Ligne {
        this.setCss("height", `${epai}px`, "background-color",new Couleur(cou, alpha).rgba);
        this.setCss("top", this.pStart.y + (epai/2) + "px");
        return this;
    }
}

const body:HTMLElement = document.body;
let r:Rect = new Rect(100, 50, 400, 250);
let cadre:Cadre = new Cadre(body, "cadre", r, 0x999999);

let dia_1:Ligne = new Ligne(body, "dia_1", r.topLeft,  r.botRight, 0xFF0000);
let dia_2:Ligne = new Ligne(body, "dia_2", r.botLeft,  r.topRight, 0x00FF00);
let haut:Ligne = new Ligne(body, "haut", r.topLeft,  r.topRight, 0x0000FF);
let droi:Ligne = new Ligne(body, "droi", r.topRight, r.botRight, 0x000000);
let bas:Ligne = new Ligne(body, "bas",  r.botRight, r.botLeft, 0x000000);
let gau:Ligne = new Ligne(body, "gau",  r.botLeft,  r.topLeft, 0x0000FF);

class Horloge extends Disque {
    constructor(idHorloge:string, public hCent:Point, public rayon:number, coulBase:number) {
        super(body, idHorloge, hCent,rayon, coulBase);
        // tour complet = 2 * Math.PI = tranche * 12 (pie = apple pie...)
        const pi:number = Math.PI, pi2:number = pi * 2,quart:number = pi/2;

        // définit les couleurs sur 5 teintes en partant de la coulBase
        const coul:number[] = palette(coulBase), pie:number = pi /6;
        for(let i:number = 0; i < 12; i ++) {
            let d:Disque = new Disque(body, "pos_"+i, hCent.polarTo(rayon-8, pie * i), 3, coul[2]);
        }
        let sec:Ligne = new Ligne(body, "secondes", hCent, hCent.offset(0, rayon-16), coul[4], 3);
        let min:Ligne = new Ligne(body, "minutes", hCent, hCent.offset(0, rayon-20), coul[3], 3);
        let heu:Ligne = new Ligne(body, "heures", hCent, hCent.offset(0, rayon-25), coul[2], 3);
        let milieu:Disque = new Disque(body, "milieu", hCent, 6, coul[1]);

        // c'est parti pour l'animation !
        function changeTime(d:Date):void {
            let h:number= d.getHours(), m:number = d.getMinutes();
            let s:number = d.getSeconds(), mi:number = d.getMilliseconds();
            sec.rotate((s + mi/1000) * (pi2/60) - quart);
            min.rotate(((m + s/60) * pi2/60) - quart);
            heu.rotate(((h + m/60) * pi2/12) - quart);
        }
        setInterval(() => changeTime(new Date()), 50);

        function palette(base:number):number[] {
            let a:number[] = [base];
            // tslint:disable-next-line:no-bitwise
            let rgb:number[] = [base >> 16 & 0xFF, base >> 8 & 0xFF, base & 0xFF];
            for(var i:number =0; i < 5; i++) {
                let c:number[] = [rgb[0], rgb[1], rgb[2]].map((v)=> Math.min(v + (i*32), 255));
                // tslint:disable-next-line:no-bitwise
                a.push((c[0] << 16) | (c[1] << 8) | (c[2]));
            }// de plus en plus clair...
            return a;
        }
    }
}

let h1:Horloge = new Horloge("h1", new Point(250, 420), 50, 0x113399);
let h2:Horloge = new Horloge("h2", new Point(120, 120), 100, 0x660000);
let h3:Horloge = new Horloge("h3", new Point(400, 300), 90, 0x336633);
let h4:Horloge = new Horloge("h4", new Point(540, 200), 70, 0x333366);