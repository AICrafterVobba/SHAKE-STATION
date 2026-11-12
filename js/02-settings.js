(function(){
"use strict";
window.SS = window.SS || {};
var SS = window.SS;

function ls(k, v) {
  try {
    if (v === undefined) return localStorage.getItem(k);
    localStorage.setItem(k, v);
  } catch(e) { return null; }
}

SS.settings = {
  get: function(k, def) {
    var val = ls('ss.' + k);
    return val !== null ? val : def;
  },
  set: function(k, v) {
    ls('ss.' + k, v);
  }
};
})();