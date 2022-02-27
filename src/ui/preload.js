// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('fileStream', {
  openFile: () => ipcRenderer.send('openFile'),
  getZoneInfo: (zoneName) => ipcRenderer.send('getZoneInfo', zoneName),
  startTimer: (callback) => ipcRenderer.on('startTimer', callback),
  stopTimer: (callback) => ipcRenderer.on('stopTimer', callback),
  changeZone: (callback) => ipcRenderer.on('changeZone', callback),
  updateLoc: (callback) => ipcRenderer.on('updateLoc', callback),
})