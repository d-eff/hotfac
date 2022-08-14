exports.spellEffects = [
  {
    name: 'Spell Cast',
    trigger: 'You begin casting',
    callback: ((effectLine, window) => {
      const spell = effectLine.split(' ').slice(3).join(' ');
      console.log(spell);
      window.webContents.send('castSpell', { spell });
    })
  },
  { 
    name: 'Mesmerize',
    trigger: 'has been mesmerized',
    callback: ((effectLine, window) => {
      const target = effectLine.split(' ').slice(0, -3).join(' ');
      const time = 24;
      const icon = 'mind';
      window.webContents.send('startTimer', { type: 'mesmerize', target, time, icon });
    })
  },
  { 
    name: 'Enthrall',
    trigger: 'has been enthralled',
    callback: ((effectLine, window) => {
      const target = effectLine.split(' ').slice(0, -3).join(' ');
      const time = 48;
      const icon = 'mind';
      window.webContents.send('startTimer', { type: 'enthrall', target, time, icon });
    })
  },
  { 
    name: 'Entrance',
    trigger: 'has been entranced',
    callback: ((effectLine, window) => {
      const target = effectLine.split(' ').slice(0, -3).join(' ');
      const time = 72;
      const icon = 'mind';
      window.webContents.send('startTimer', { type: 'entrance', target, time, icon });
    })
  },
  {
    name: 'Languid Pace',
    trigger: 'slows down',
    callback: ((effectLine, window) => {
      const target = effectLine.split(' ').slice(0, -2).join(' ');
      const time = 30;
      window.webContents.send('startTimer', { type: 'languid-pace', target, time });
    })
  },
  {
    name: 'Quickness',
    trigger: 'feels much faster',
    callback: ((effectLine, window) => {
      const target = effectLine.split(' ').slice(0, -3).join(' ');
      const time = 960;
      const icon = 'boot'
      window.webContents.send('startTimer', { type: 'alacrity', target, time, icon });
    })
  },
  {
    name: 'Strengthen',
    trigger: 'looks stronger',
    callback: ((effectLine, window) => {
      const target = effectLine.split(' ').slice(0, -2).join(' ');
      const time = 1620; //27 min
      const icon = 'leftArm'
      window.webContents.send('startTimer', { type: 'strengthen', target, time, icon });
    })
  },
  {
    name: 'Spirit Armor',
    trigger: 'coated in translucent armor',
    callback: ((effectLine, window) => {
      const target = effectLine.split(' ').slice(0, -5).join(' ');
      const time = 1620; //27 min
      const icon = '2160'
      window.webContents.send('startTimer', { type: 'spirit armor', target, time, icon });
    })
  },
  {
    name: 'Bravery',
    trigger: 'looks brave',
    callback: ((effectLine, window) => {
      const target = effectLine.split(' ').slice(0, -2).join(' ');
      const time = 2700; 
      const icon = 'leftArm'
      window.webContents.send('startTimer', { type: 'bravery', target, time, icon });
    })
  },
  {
    name: 'Root',
    trigger: 'feet adhere to the ground',
    callback: ((effectLine, window) => {
      const target = effectLine.split(' ').slice(0, -5).join(' ');
      const time = 48; //27 min
      const icon = 'mountain'
      window.webContents.send('startTimer', { type: 'root', target, time, icon });
    })
  },
];

exports.mapEffects = [
  {
    name: 'Zone Transition',
    trigger: 'You have entered',
    callback: ((effectLine, window) => {
      const zoneName = effectLine.split(' ').slice(3).join(' ');

      // window.webContents.send('changeZone', { zoneName: zoneName });
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