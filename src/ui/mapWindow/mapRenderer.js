const mapSelect = document.getElementById('map-select');
const mapCanvas = document.getElementById('map-canvas');
const mapName = document.getElementById('zone-name');

import { drawMap, processMapData, commonlands } from './mapVis.js';
// const mapImg = document.getElementById('map-image');
let currentZone;

window.fileStream.changeZone((_, data) => {
  const { zoneName } = data;
  // updateMap(zoneName);
  const mapData = processMapData(commonlands);
  drawMap(mapCanvas, mapData);
});

mapSelect.addEventListener('change', (event) => {
  updateMap(event.target.value);
});

window.fileStream.updateLoc((_, data) => {
  const [ lat, long ] = data.loc;
  updateLoc(lat, long)
});

function updateMap(zoneName) {
  const zoneInfo = window.fileStream.getZoneInfo(zoneName);
  mapName.innerHTML = zoneName;
  currentZone = zoneInfo;
  // update map display
  const mapImg = new Image();
  mapImg.onload = function () {
    const context = mapCanvas.getContext('2d');
    mapCanvas.width = zoneInfo.width;
    mapCanvas.height = zoneInfo.height;
    context.drawImage(mapImg, 0, 0);
    window.resizeTo(zoneInfo.width + 20, zoneInfo.height + 80);
  }
  mapImg.src = `../imgs/maps/${zoneInfo.fileName}`;
}

function updateLoc(lat, long) {
  // Your Location is 366.22, 260.38, -55.18
  console.log("INC", lat, long)
  console.log(currentZone);
  const context = mapCanvas.getContext('2d');
  const latRange = Math.abs(currentZone.latMin) + Math.abs(currentZone.latMax);
  console.log(latRange);
  console.log("LEFT", Number(lat));
  console.log("right", (currentZone.height - currentZone.offsetTop * 2));
  const scaledLat = ((currentZone.latMax - parseInt(lat)) / latRange) * (currentZone.height - currentZone.offsetTop * 2);
  
  const longRange = Math.abs(currentZone.longMin) + Math.abs(currentZone.longMax);
  const scaledLong = ((currentZone.longMax - parseInt(long)) / longRange) * (currentZone.width - currentZone.offsetLeft * 2);
  
  context.fillStyle = "#FF0000";
  console.log("DRAWING", scaledLat, scaledLong);
  context.fillRect(scaledLong, scaledLat, 5, 5);
}