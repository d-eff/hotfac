// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, screen } = require('electron')
const { join } = require('path')
const Tail = require('tail-file')
const { maps } = require('./data/maps.js')
const settings = require('electron-settings')

// Windows
let timerWindow
// let mapWindow

let charName
let charClass
let charLevel
let spellList
let currentSpell = ''

// UI Setup
function createWindow (windowConfig, filename) {
  const webPreferences = {
    nodeIntegration: false,
    contextIsolation: true, // protect against prototype pollution
    enableRemoteModule: false, // turn off remote
    preload: join(__dirname, 'ui/preload.js')
  }

  const window = new BrowserWindow({ ...windowConfig, webPreferences })

  window.loadFile(filename)
  return window
}

function makeTimerWindow () {
  return createWindow({
    width: 275,
    height: 600,
    x: 0,
    y: 100
  }, join(__dirname, '/ui/timerWindow/timer.html'))
}

// eslint-disable-next-line no-unused-vars
// function makeMapWindow() {
//   const display = screen.getPrimaryDisplay()
//   const width = display.bounds.width
//   return createWindow({
//     width: 600,
//     height: 600,
//     x: width - 600,
//     y: 100
//   }, join(__dirname, '/ui/mapWindow/map.html'))
// }

// send map file to map renderer
// function loadZoneList() {
//   mapWindow.webContents.send('loadZoneList', maps)
// }

app.disableHardwareAcceleration()

// Main
app.whenReady().then(() => {
  timerWindow = makeTimerWindow()
  // mapWindow = makeMapWindow();
  // mapWindow.webContents.once('dom-ready', loadZoneList);
  timerWindow.webContents.openDevTools();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () { if (process.platform !== 'darwin') app.quit() })

ipcMain.on('chooseCharacter', () => {
  const { dialog } = require('electron')
  dialog.showOpenDialog({ properties: ['openFile'] })
    .then(result => {
      if (result.filePaths.length > 0) {
        const filepath = result.filePaths[0]
        loadCharacterInfo(filepath)
        watchFile(filepath)
      }
    })
})

ipcMain.on('saveCharInfo', async (event, charClass, charLevel) => {
  await settings.set(charName, { class: charClass, level: charLevel })
})

async function loadCharacterInfo (filepath) {
  charName = filepath.match(/eqlog_(.*)_project1999/g)[0].split('_')[1]
  const charData = await settings.get(charName)
  charClass = charData?.class || 'Enchanter'
  charLevel = charData?.level || 1
  spellList = require(`./data/spells/${charClass}`) || {}
  timerWindow.webContents.send('setCharInfo', { charName, charClass, charLevel })
}

function watchFile (filename) {
  const _ = new Tail(filename, line => {
    // eslint-disable-next-line no-unused-vars
    const { timestamp, effect } = parseLine(line)

    if (effect.includes('You begin casting')) {
      const spellName = effect.split(' ').slice(3).join(' ').slice(0, -1)
      currentSpell = spellList[spellName]
    } else if (effect.includes('You have entered')) {
      console.log('hit for map load')
      // will need to remove period
      // clear currentSpell
    } else if (currentSpell && currentSpell !== '') {
      const self = currentSpell.castOnYou
      const other = currentSpell.castOnOther
      if (effect === self || effect.includes(other)) {
        // calc duration, set timer as appropriate
        if (currentSpell.duration) {
          let duration = 0
          if (currentSpell.duration.maxDuration) {
            // todo - we'll need toon level
            if (charLevel >= currentSpell.duration.maxDuration.level) {
              duration = currentSpell.duration.maxDuration.duration
            } else {
              const { duration: minT, level: minL } = currentSpell.duration.minDuration
              const { duration: maxT, level: maxL } = currentSpell.duration.maxDuration
              duration = minT + (charLevel - minL) * ((maxT - minT) / (maxL - minL))
            }
          } else {
            duration = currentSpell.duration.minDuration.duration
          }

          const target = effect === self ? 'Self' : effect.replace(currentSpell.castOnOther, '')
          timerWindow.webContents.send('startTimer', { type: currentSpell.name, target: target.trim(), time: duration, icon: currentSpell.icon })
        }
        currentSpell = ''
      } else if (effect.includes('slain')) {
        console.log('mob death')
      }
    }
  })
}

// Extract timestamp and effect from a line
function parseLine (line) {
  // remove trailing \r
  line = line.replace('\r', '')

  // remove [] from timestamp, split
  const lineTokens = line.replace('[', '').replace(']', '').split(' ')
  const timestamp = lineTokens[3]
  const effect = lineTokens.slice(5).join(' ')

  return { timestamp, effect }
}

ipcMain.on('getZoneInfo', (event, zoneName) => {
  const zoneInfo = maps.find((map) => zoneName === map)
  if (zoneInfo) {
    const mapData = require(`./data/maps/${zoneInfo}.js`)
    event.sender.send('loadZoneData', mapData)
  }
})
