(function(){
"use strict";
window.SS = window.SS || {};
var SS = window.SS;

SS.rules = {
  cap: 12,
  inc: { clear: 6, hazy: 4, storm: 2 },
  lifeNeed: 2,
  lifeRate: 20,
  foodNeed: 1,
  foodRate: 12,
  foodDrain: 4,
  doseBase: 4,
  cut: 0.3,
  sci: 10,
  
  cl: function(v, a, b) {
    return Math.max(a, Math.min(b, v));
  }
};
})();