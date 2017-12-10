let mainWindow:any = null;

import { app, BrowserWindow } from "electron";

function createWindow ():void {
  mainWindow = new BrowserWindow({width: 1200, height: 640});
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  mainWindow.webContents.openDevTools();
  mainWindow.on("closed", () =>  mainWindow = null);
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});