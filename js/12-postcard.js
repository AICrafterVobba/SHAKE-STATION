(function(){
"use strict";
window.SS = window.SS || {};
var SS = window.SS;

SS.postcardModule = {
  getFact: function(rec) {
    var facts = SS.data.facts;
    var k;
    if (rec.f) k = rec.f.cls === 'X9.0' ? 'x9' : 'xc';
    else if (rec.w === 'storm') k = rec.d % 2 ? 'opp' : 'cur';
    else k = ['rad', 'sol', 'moxie', 'iss', 'max'][rec.d % 5];
    return facts[k];
  },
  getMessage: function(r, pipName, batt) {
    var a = r.a;
    if (r.f) return r.late ? 'Earth\'s message came late today. Good thing we kept a spare coin.' : a.shield >= 2 ? 'The Sun sneezed! Shield up, everyone safe. Thank you, Commander.' : 'That flare was close! Next time let\'s lift the shield a bit more.';
    if (r.w === 'storm') return batt > 0 ? 'Dust everywhere! The panels are napping, but the battery held. ' + pipName + ' is proud.' : 'Dust everywhere, and the battery is empty. We need a better plan.';
    if (r.w === 'hazy') return 'A little dusty today. The panels are sleepy, but we have a plan.';
    if (a.sci > 0) return 'We studied rocks near Mount Sharp. Discovery points up!';
    return 'Sunny sol! The battery is filling up. ' + pipName + ' feels ready for anything.';
  }
};
})();