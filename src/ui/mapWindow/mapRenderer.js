window.fileStream.changeZone((_, data) => {
  const { zoneName } = data;
  console.log(zoneName);
  const zoneInfo = window.fileStream.getZoneInfo(zoneName);
  console.log(zoneInfo);
});

window.fileStream.updateLoc((_, data) => {
  const { lat, long, elev } = data;
  console.log(lat, long, elev);
});