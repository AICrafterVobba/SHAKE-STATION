(function(){
"use strict";
window.SS = window.SS || {};
var SS = window.SS;

var EYES = {
  happy: '<path d="M-24 0 q8 -12 16 0 M8 0 q8 -12 16 0"/><path d="M-7 14 q7 7 14 0" stroke-width="4"/>',
  worried: '<circle cx="-14" cy="2" r="5" fill="#37e3ff" stroke="none"/><circle cx="14" cy="2" r="5" fill="#37e3ff" stroke="none"/><path d="M-22 -9 l16 5 M22 -9 l-16 5 M-7 17 q7 -7 14 0" stroke-width="3.5"/>',
  scared: '<circle cx="-14" cy="2" r="8" stroke-width="3"/><circle cx="14" cy="2" r="8" stroke-width="3"/><path d="M-7 19 q7 -9 14 0" stroke-width="3.5"/>'
};

SS.sceneModule = {
  sky: function(t, cur) {
    var w = cur.w, P = { dawn: ['#f9c9a0', '#d98e7a'], day: ['#f2a65a', '#e8864a'], dusk: ['#4a3170', '#c1582a'] }[t];
    var s1 = document.getElementById('s1'), s2 = document.getElementById('s2');
    if (s1 && s2 && P) { s1.style.stopColor = P[0]; s2.style.stopColor = P[1]; }
    var fog = document.getElementById('fog'); if (fog) fog.setAttribute('opacity', w === 'storm' ? 0.45 : w === 'hazy' ? 0.18 : 0);
    var sun = document.getElementById('sun'); if (sun) sun.setAttribute('opacity', w === 'storm' ? 0.25 : t === 'dusk' ? 0.5 : 1);
    var earth = document.getElementById('earth'); if (earth) earth.setAttribute('opacity', t === 'day' ? 0 : 1);
    var lamp = document.getElementById('lamp'); if (lamp) lamp.setAttribute('fill', t === 'dusk' ? '#fff2a0' : '#7fd6ff');
    var dd = document.getElementById('dust');
    if (dd) {
      dd.innerHTML = '';
      if (w === 'storm') {
        for (var i = 0; i < 28; i++) {
          var l = document.createElementNS('http://www.w3.org/2000/svg', 'line'), y = 20 + Math.random() * 340, x = Math.random() * 800;
          l.setAttribute('x1', x - 40); l.setAttribute('x2', x); l.setAttribute('y1', y); l.setAttribute('y2', y);
          l.style.animationDelay = (-Math.random()).toFixed(2) + 's';
          dd.appendChild(l);
        }
      }
    }
  },
  renderScene: function(moodState, shieldVal) {
    var eyes = document.getElementById('eyes');
    if (eyes) eyes.innerHTML = EYES[moodState] || EYES.happy;
    var shield = document.getElementById('shield');
    if (shield) {
      shield.setAttribute('fill-opacity', shieldVal * 0.06);
      shield.setAttribute('stroke-opacity', shieldVal * 0.3);
    }
  }
};
})();