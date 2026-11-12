(function(){
"use strict";
window.SS = window.SS || {};
var SS = window.SS;

function sched(W, f, late) {
  var s = [];
  for (var d = 1; d <= 10; d++) {
    s.push({ d: d, w: W[d-1], f: f[d] || null, late: !!late[d] });
  }
  return s;
}

SS.scheduleModule = {
  mission1: function() {
    var m = { C: 'clear', H: 'hazy', S: 'storm' };
    var fl = SS.data.flares;
    return sched('CCHSSHCCCC'.split('').map(function(c){ return m[c]; }), { 3: fl.a, 6: fl.b, 8: fl.d }, { 6: true });
  },
  randomM: function(seed) {
    var r = SS.rng(seed), W = [], i, k;
    for (i = 0; i < 10; i++) W.push('clear');
    var nb = 1 + (r() < 0.6 ? 1 : 0);
    for (var b = 0; b < nb; b++) {
      var len = 2 + (r() < 0.5 ? 1 : 0), st = 2 + Math.floor(r() * (8 - len));
      for (k = 0; k < len; k++) W[st - 1 + k] = 'storm';
      if (st > 1 && W[st - 2] === 'clear') W[st - 2] = 'hazy';
      if (st - 1 + len < 10 && W[st - 1 + len] === 'clear') W[st - 1 + len] = 'hazy';
    }
    var fl = SS.data.flares, keys = Object.keys(fl), cnt = 2 + (r() < 0.5 ? 1 : 0), days = [], f = {}, late = {};
    while (days.length < cnt) {
      var d = 2 + Math.floor(r() * 9);
      if (days.every(function(x){ return Math.abs(x - d) > 1; })) days.push(d);
    }
    days.forEach(function(d){
      f[d] = fl[keys[Math.floor(r() * keys.length)]];
      if (r() < 0.3) late[d] = true;
    });
    return sched(W, f, late);
  }
};
})();