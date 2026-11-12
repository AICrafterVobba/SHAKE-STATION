(function(){
"use strict";
window.SS = window.SS || {};
var SS = window.SS;

SS.rng = function(seed) {
  var s = seed | 0;
  return function() {
    s = s + 0x6D2B79F5 | 0;
    var t = Math.imul(s ^ s >>> 15, 1 | s);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
};
})();