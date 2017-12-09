"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Point {
    constructor(px, py) {
        this.px = px;
        this.py = py;
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
let mainWindow = null;
const electron_1 = require("electron");
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({ width: 800, height: 600 });
    mainWindow.loadURL(`file://${__dirname}/index.html`);
    mainWindow.webContents.openDevTools();
    mainWindow.on('closed', () => mainWindow = null);
}
electron_1.app.on('ready', createWindow);
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
