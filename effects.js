exports.effects = [
  { 
    name: 'Mesmerize start',
    trigger: 'has been mesmerized.',
    callback: ((effectLine, window) => {
      const target = effectLine.split(' ').slice(0, -3).join(' ');
      const time = 24;
      window.webContents.send('startTimer', { type: 'mesmerize', target, time });
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
    trigger: 'slows down.',
    callback: ((effectLine, window) => {
      const target = effectLine.split(' ').slice(0, -2).join(' ');
      const time = 30;
      window.webContents.send('startTimer', { type: 'languid-pace', target, time });
    })
  },
  {
    name: 'Quickness start',
    trigger: 'feels much faster.',
    callback: ((effectLine, window) => {
      const target = effectLinesplit(' ').slice(0, -2).join(' ');
      const time = 30;
      window.webContents.send('startTimer', { type: 'quickness', target, time });
    })
  }
];


//The light breeze fades.
//You come into focus.
//Your strength fades.
