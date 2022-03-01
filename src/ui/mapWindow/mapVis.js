function loadZone (canvas, zoneData) {
  const m
  
}

function drawLayer(canvas, mapData, layerName) {
  const layerData = mapData[layerName];
  const context = canvas.getContext('2d');
  context.fillStyle = "white";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.scale(mapData.scaleFactor, mapData.scaleFactor)

  layerData.forEach(line => {
    if(line.type === 'L') {
      context.beginPath();
      context.strokeStyle = `rgb(${line.color.r}, ${line.color.g}, ${line.color.b})`;
      context.moveTo(line.p1.x + mapData.offsetLeft, line.p1.y + mapData.offsetTop);
      context.lineTo(line.p2.x + mapData.offsetLeft, line.p2.y + mapData.offsetTop);
      context.stroke();
    } else if (line.type === 'P') {
      context.fillStyle = "#FF0000";
      context.fillRect(line.point.x, line.point.y, 3, 3);
    }
  })
}

function test() {
  const innothule = require('../../data/maps/innothule.js');
  console.log(innothule);
}

  export {
    loadZone,
    test
  }