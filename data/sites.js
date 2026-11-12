(function(){
"use strict";
window.SS = window.SS || {};
window.SS.data = window.SS.data || {};
window.SS.data.sites = [
  { id: 'gale', name: 'GALE CRATER', subtitle: 'Mars · Curiosity', active: true, desc: 'Where Curiosity has measured radiation and weather on Mars. Keep Pip safe for 10 sols.', dataUsed: ['Curiosity RAD', 'DONKI flares'] },
  { id: 'jezero', name: 'JEZERO CRATER', subtitle: 'Coming soon', active: false, desc: 'Perseverance landing site.', dataUsed: ['MEDA weather'] },
  { id: 'shackleton', name: 'SHACKLETON RIM', subtitle: 'Moon · Coming soon', active: false, desc: 'Lunar South Pole exploration site.', dataUsed: ['Artemis data'] }
];
})();