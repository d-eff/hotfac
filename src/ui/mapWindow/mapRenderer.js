const mapSelect = document.getElementById('map-select');
const mapCanvas = document.getElementById('map-canvas');
const mapName = document.getElementById('zone-name');

import { drawMap, processMapData, guk } from './mapVis.js';
// const mapImg = document.getElementById('map-image');
let currentZone;

window.fileStream.changeZone((_, data) => {
  const { zoneName } = data;
  updateMap(zoneName);
});

mapSelect.addEventListener('change', (event) => {
  updateMap(event.target.value);
});

window.fileStream.updateLoc((_, data) => {
  const [ lat, long ] = data.loc;
  updateLoc(parseInt(lat), parseInt(long))
});

function updateMap(zoneName) {
  const zoneInfo = window.fileStream.getZoneInfo(zoneName);
  mapName.innerHTML = zoneName;

  const mapData = processMapData(guk);
  currentZone = mapData;
  drawMap(mapCanvas, mapData);
}

function updateLoc(lat, long) {

  const context = mapCanvas.getContext('2d');

  const offsetX = (Math.abs(currentZone.minX) - long);
  const offsetY = (Math.abs(currentZone.minY) - lat);

  context.fillStyle = "#FF0000";
  context.fillRect(offsetX, offsetY, 10, 10);
}

function getCursorPosition(mapCanvas, event) {
  console.log("w", mapCanvas.width, mapCanvas.height);
  const rect = mapCanvas.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  console.log("x: " + x + " y: " + y)
}

mapCanvas.addEventListener('mousedown', function(e) {
  getCursorPosition(mapCanvas, e)
})