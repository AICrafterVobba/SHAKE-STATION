(function(){
"use strict";
window.SS = window.SS || {};
var SS = window.SS;

SS.blackbox = {
  explain: function(S) {
    var k = S.fail, nm = { life: 'Life', food: 'Food', shield: 'Shield' };
    var dust = S.log.filter(function(l){ return l.w === 'storm'; });
    var fl = S.log.filter(function(l){ return l.f; }).pop();
    var need = { life: 2, food: 1, shield: 1 };
    var sk = k === 'dose' ? 'shield' : k;
    var low = S.log.filter(function(l){ return l.a[sk] < need[sk]; }).length;
    var c = [];

    if (k === 'dose') {
      c.push(['☀️', fl ? 'A solar flare (' + fl.f.cls + ') hit on sol ' + fl.d + '.' : 'Radiation built up every day.']);
      c.push(['🛡️', fl ? 'The shield had ' + (fl.a.shield || 'zero') + ' coin' + (fl.a.shield === 1 ? '' : 's') + ' that day.' : 'The shield stayed low.']);
      c.push(['☢️', 'Radiation reached a dangerous level.']);
    } else {
      c.push([dust.length ? '🌪️' : '📉', dust.length ? 'A dust storm cut Sun income to 2 coins.' : 'Everyday spending drained the base.']);
      if (dust.length) c.push(['🔋', 'The battery held ' + dust[0].b + ' coin' + (dust[0].b === 1 ? '' : 's') + ' when it began.']);
      c.push(['🪙', nm[sk] + ' got too little on ' + low + ' sol' + (low === 1 ? '' : 's') + '.']);
      c.push([k === 'life' ? '🫧' : '🌿', (k === 'life' ? 'Air and heat' : 'The crops') + ' ran out.']);
    }

    var tip = {
      life: 'Keep 2 coins on Life every sol, even in a storm.',
      food: 'Plan Food coins before a storm, not during it.',
      dose: 'Raise Shield to 2 or 3 on a flare day. Earth\'s warning can arrive late, so keep a spare coin.'
    }[k];

    return { c: c, tip: tip };
  }
};
})();