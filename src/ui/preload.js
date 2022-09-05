// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('fileStream', {
  chooseCharacter: () => ipcRenderer.send('chooseCharacter'),
  getZoneInfo: (zoneName) => ipcRenderer.send('getZoneInfo', zoneName),
  saveCharInfo: (charClass, charLevel) => ipcRenderer.send('saveCharInfo', charClass, charLevel),
  setCharInfo: (callback) => ipcRenderer.on('setCharInfo', callback),
  startTimer: (callback) => ipcRenderer.on('startTimer', callback),
  changeZone: (callback) => ipcRenderer.on('changeZone', callback),
  loadZoneData: (callback) => ipcRenderer.on('loadZoneData', callback),
  updateLoc: (callback) => ipcRenderer.on('updateLoc', callback),
  loadZoneList: (callback) => ipcRenderer.on('loadZoneList', callback)
})
