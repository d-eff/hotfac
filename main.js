// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron');
const { join } = require('path');
const Tail = require('tail-file');
const { effects } = require('./effects.js')

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 200,
    height: 600,
    x: 0,
    y: 100,
    webPreferences: {
      nodeIntegration: false,   
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
      preload: join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile('index.html');

  // open devtools
  mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.on("openFile", (event, args) => {
  const { dialog } = require('electron');
  dialog.showOpenDialog({properties: ['openFile']})
  .then(result => {
    if(result.filePaths.length > 0) {
      const filepath = result.filePaths[0];
      watchFile(filepath);
    }
  });
});

function watchFile(filename) {
// effects[0].callback.call(this, "An gorilla has been mesmerized.", mainWindow);
  const mytail = new Tail(filename, line => {
    parseLine(line);
  });
}

function parseLine(line) {
  const lineTokens = line.replace('[','').replace(']','').replace('\r', '').split(' ');
  const timestamp = lineTokens[3];
  const effectLine = lineTokens.slice(5).join(' ');
  checkForEffect(timestamp, effectLine);
}

function checkForEffect(timestamp, effectLine) {
  effects.forEach(effect => {
    // console.log(effectLine, effect.trigger)
    if (effectLine.includes(effect.trigger)) {
      console.log("FOUND", effect.name);
      effect.callback.call(this, effectLine, mainWindow);
    }
  });
}

