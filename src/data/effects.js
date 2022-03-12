exports.spellEffects = [
  { 
    name: 'Mesmerize start',
    trigger: 'has been mesmerized',
    callback: ((effectLine, window) => {
      const target = effectLine.split(' ').slice(0, -3).join(' ');
      const time = 24;
      const icon = 'mind';
      window.webContents.send('startTimer', { type: 'mesmerize', target, time, icon });
    })
  },
  {
    name: 'Mesmerize end',
    trigger: 'Your Mesmerize spell has worn off',
    callback: ((_, window) => {
      window.webContents.send('stopTimer', { type: 'mesmerize' });
    })
  },
  {
    name: 'Languid Pace Start',
    trigger: 'slows down',
    callback: ((effectLine, window) => {
      const target = effectLine.split(' ').slice(0, -2).join(' ');
      const time = 30;
      window.webContents.send('startTimer', { type: 'languid-pace', target, time });
    })
  },
  {//~289 @ 19
    name: 'Quickness start',
    trigger: 'feels much faster',
    callback: ((effectLine, window) => {
      const target = effectLine.split(' ').slice(0, -3).join(' ');
      const time = 285;
      const icon = 'boot'
      window.webContents.send('startTimer', { type: 'quickness', target, time, icon });
    })
  },
  {
    name: 'Strength start',
    trigger: 'looks stronger',
    callback: ((effectLine, window) => {
      const target = effectLine.split(' ').slice(0, -2).join(' ');
      const time = 1620; //27 min
      const icon = 'leftArm'
      window.webContents.send('startTimer', { type: 'strength', target, time, icon });
    })
  },
];

exports.mapEffects = [
  {
    name: 'Zone Transition',
    trigger: 'You have entered',
    callback: ((effectLine, window) => {
      const zoneName = effectLine.split(' ').slice(3).join(' ');
      window.webContents.send('changeZone', { zoneName: zoneName });
    })
  },
  {
    name: 'Loc ping',
    trigger: 'Your Location is',
    callback: ((effectLine, window) => {
      const loc = effectLine.split(' ').slice(3).map(coord => parseInt(coord));
      window.webContents.send('updateLoc', { loc: loc });
    })
  }
];


//The light breeze fades.
//You come into focus.
//Your strength fades.

//feels much faster
// Your location is