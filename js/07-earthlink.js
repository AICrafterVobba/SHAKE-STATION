(function(){
"use strict";
window.SS = window.SS || {};
var SS = window.SS;

SS.earthlink = {
  buildMessage: function(S, day) {
    var td = S.sch[day - 1], tm = S.sch[day], m = { text: '', late: false, warn: false };
    if (td.f && td.late) {
      m.late = true;
      m.text = 'Message delayed! Earth\'s warning about today\'s ' + td.f.cls + ' flare arrived late.';
      return m;
    }
    if (tm) {
      if (tm.f && !tm.late) {
        m.warn = true;
        m.text = 'FLARE WARNING: an X-class flare is expected tomorrow. Raise the shield!';
        return m;
      }
      if (tm.w === 'storm' && td.w !== 'storm') {
        m.warn = true;
        m.text = 'DUST WARNING: a dust storm arrives tomorrow. Save coins in the battery!';
        return m;
      }
      if (tm.w === 'hazy' && td.w === 'clear') {
        m.text = 'Hazy skies tomorrow. Solar income will dip a little.';
        return m;
      }
    }
    m.text = day === 10 ? 'Last sol! Almost home.' : 'All clear for tomorrow. A good day to save coins.';
    return m;
  }
};
})();