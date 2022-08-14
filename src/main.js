// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, screen } = require('electron');
const { join } = require('path');
const Tail = require('tail-file');
const { spellEffects, mapEffects } = require('./data/effects.js');
const { maps } = require('./data/maps.js')

let timerWindow;
let mapWindow;

const charClass = "Enchanter";
const spellList = require(`./data/spells/${charClass}`);
let currentSpell = '';

function createWindow (windowConfig, filename) {
  const webPreferences = {
    nodeIntegration: false,   
    contextIsolation: true, // protect against prototype pollution
    enableRemoteModule: false, // turn off remote
    preload: join(__dirname, 'ui/preload.js')
  };

  const window = new BrowserWindow({ ...windowConfig, webPreferences });

  window.loadFile(filename);
  return window;
}

//send map file to map renderer 
function loadZoneList() {
  mapWindow.webContents.send('loadZoneList', maps);
}

app.whenReady().then(() => {
  const display = screen.getPrimaryDisplay();
  const width = display.bounds.width;

  timerWindow = createWindow({
    width: 250,
    height: 600,
    x: 0,
    y: 100,
  }, `${__dirname}/ui/timerWindow/timer.html`);

  // mapWindow = createWindow({
  //   width: 600,
  //   height: 600,
  //   x: width - 600,
  //   y: 100,
  // }, `${__dirname}/ui/mapWindow/map.html`);

  // mapWindow.webContents.once('dom-ready', loadZoneList);

  // timerWindow.webContents.openDevTools();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  });
})

app.on('window-all-closed', function () { if (process.platform !== 'darwin') app.quit() });

ipcMain.on("openFile", () => {
  const { dialog } = require('electron');
  dialog.showOpenDialog({properties: ['openFile']})
  .then(result => {
    if(result.filePaths.length > 0) {
      const filepath = result.filePaths[0];
      watchFile(filepath);
    }
  });
});

function debug() {
  spellEffects[0].callback.call(this, "An gorilla has been mesmerized.", timerWindow);
  spellEffects[0].callback.call(this, "Yr ma has been mesmerized.", timerWindow);
  spellEffects[0].callback.call(this, "GOD, WHO IS CALLED YISUN has been mesmerized.", timerWindow);
  // mapEffects[0].callback.call(this, "You have entered Greater Faydark", mapWindow);
}

function watchFile(filename) {
  const _ = new Tail(filename, line => {
    const { timestamp, effect } = parseLine(line);

    if (effect.includes('You begin casting')) {
      const spellName = effect.split(' ').slice(3).join(' ').slice(0, -1);
      currentSpell = spellList[spellName];
    } else if (effect.includes('You have entered')) {
      console.log("hit for map load");
      // will need to remove period
      // clear currentSpell
    } else if (currentSpell && currentSpell !== '') {
      const self = currentSpell.castOnYou;
      const other = currentSpell.castOnOther;
      if(effect === self || effect.includes(other)) {
        console.log(`hit for ${currentSpell.name} ${effect}`);
        // calc duration, set timer as appropriate  
        currentSpell = '';
      }
    }
  });
}

// Extract timestamp and effect from a line
function parseLine(line) {
  // remove trailing \r
  line = line.replace('\r', '');

  // remove potential trailing period
  // if (line.charAt(line.length - 1) === '.') { 
  //   line = line.slice(0, -1);
  // }

  // remove [] from timestamp, split
  const lineTokens = line.replace('[','').replace(']','').split(' ');
  const timestamp = lineTokens[3];
  const effect = lineTokens.slice(5).join(' ');
  
  return { timestamp, effect };
}

ipcMain.on('getZoneInfo', (event, zoneName) => {
  const zoneInfo = maps.find((map) => zoneName === map)
  if(zoneInfo) {
    const mapData = require(`./data/maps/${zoneInfo}.js`);
    event.sender.send('loadZoneData', mapData);
  }
});