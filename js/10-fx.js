(function(){
"use strict";
window.SS = window.SS || {};
var SS = window.SS;

SS.fx = {
  toast: function(t, r) {
    var rm = SS.settings.get('rm') === '1' || (matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
    var dur = rm ? 40 : 4000;
    var e = document.createElement('div');
    e.className = 'toast' + (r ? ' r' : '');
    e.textContent = t;
    var ts = document.getElementById('toasts');
    if (ts) {
      ts.appendChild(e);
      setTimeout(function(){ e.remove(); }, dur + 500);
    }
  },
  fly: function(from, to) {
    var rm = SS.settings.get('rm') === '1';
    if (rm || !from || !to) return;
    var a = from.getBoundingClientRect(), b = to.getBoundingClientRect(), c = document.createElement('div');
    c.className = 'coin';
    c.style.left = a.left + 'px';
    c.style.top = a.top + 'px';
    document.body.appendChild(c);
    var an = c.animate([
      { transform: 'translate(0,0)', opacity: 1 },
      { transform: 'translate(' + (b.left - a.left) + 'px,' + (b.top - a.top) + 'px)', opacity: 0.4 }
    ], { duration: 500, easing: 'ease-out' });
    an.onfinish = function(){ c.remove(); };
  }
};
})();