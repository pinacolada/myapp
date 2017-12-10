"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let mainWindow = null;
const electron_1 = require("electron");
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({ width: 1200, height: 640 });
    mainWindow.loadURL(`file://${__dirname}/index.html`);
    mainWindow.webContents.openDevTools();
    mainWindow.on("closed", () => mainWindow = null);
}
electron_1.app.on("ready", createWindow);
electron_1.app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        electron_1.app.quit();
    }
});
electron_1.app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});
