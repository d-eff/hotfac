const mapSelect = document.getElementById('map-select');
const mapCanvas = document.getElementById('map-canvas');
const mapName = document.getElementById('zone-name');
const legendCanvas = document.getElementById('legend-canvas');
const gridCanvas = document.getElementById('grid-canvas');
const locCanvas = document.getElementById('loc-canvas');
let currentZone;

window.fileStream.loadZoneList((_, maps) => {
  maps.forEach(map => {
    const option = document.createElement('option');
    option.value = map;
    option.innerHTML = map;
    mapSelect.appendChild(option);
  });
})

// "You have entered <Zone>" listener
window.fileStream.changeZone((_, data) => {
  window.fileStream.getZoneInfo(data.zoneName);
});

// Change dropdown listener
mapSelect.addEventListener('change', (event) => {
  window.fileStream.getZoneInfo(event.target.value);
});

window.fileStream.updateLoc(updateLoc);

window.fileStream.loadZoneData((_, zoneData) => {
  const zone = zoneData.zone;
  currentZone = zone;
  mapName.innerHTML = zone.name;
  
  // draw MAP layer
  drawLayer(mapCanvas, zone, 'map');
  //drawLayer(legendCanvas, zone, 'legend');
  resizeCanvas(locCanvas, zone);
});

function updateLoc(_, data) {
  const [ lat, long ] = data.loc;
  const context = locCanvas.getContext('2d');
  const offsetX = (Math.abs(currentZone.offsetLeft) - parseInt(long));
  const offsetY = (Math.abs(currentZone.offsetTop) - parseInt(lat));
  clearLocMap();
  context.fillStyle = "#FF0000";
  context.fillRect(offsetX, offsetY, 20, 20);
}

function clearLocMap() {
  const context = locCanvas.getContext('2d');
  context.save();
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(0, 0, locCanvas.width, locCanvas.height);
  context.restore();
}

function resizeCanvas(canvas, mapData) {
  canvas.width = mapData.width* mapData.scaleFactor;
  canvas.height = mapData.height * mapData.scaleFactor;
  const context = canvas.getContext('2d');
  context.scale(mapData.scaleFactor, mapData.scaleFactor)
}

function drawLayer(canvas, mapData, layerName) {
  const layerData = mapData[layerName];
  const context = canvas.getContext('2d');
  canvas.width = mapData.width * mapData.scaleFactor;
  canvas.height = mapData.height * mapData.scaleFactor;

  // context.fillStyle = "white";
  // context.fillRect(0, 0, canvas.width, canvas.height);
  context.scale(mapData.scaleFactor, mapData.scaleFactor)
  layerData.forEach(line => {
    if(line.type === 'L') {
      context.beginPath();
      context.strokeStyle = `rgb(${line.color.r}, ${line.color.g}, ${line.color.b})`;
      context.moveTo(line.p1.x + mapData.offsetLeft, line.p1.y + mapData.offsetTop);
      context.lineTo(line.p2.x + mapData.offsetLeft, line.p2.y + mapData.offsetTop);
      context.stroke();
    } else if (line.type === 'P') {
      context.font = "30px Arial";
      context.fillText(line.caption, line.point.x, line.point.y);
    }
  })
}