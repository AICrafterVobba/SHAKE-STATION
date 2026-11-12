(function(){
"use strict";
var $ = function(i){ return document.getElementById(i); };
var SS = window.SS;
var rm = SS.settings.get('rm') === '1' || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);

function T(ms){ return rm ? 40 : ms; }
var pipName = SS.settings.get('pip') || 'Pip';
var liveR = null, S = null, busy = false, tipT = null;

/* ---------- Boot Sequence ---------- */
var armed = false;
function boot() {
  SS.screens.show('boot');
  var L = ['SHAKE STATION OS v2.0', 'Checking life support... OK', 'Powering shield... OK', 'Linking to Earth... signal delayed', 'Loading NASA data...'], i = 0, el = $('bootL');
  if (el) {
    el.style.whiteSpace = 'pre-line';
    el.textContent = '';
  }
  (function nx() {
    if (i < L.length) {
      if (el) el.textContent += L[i++] + '\n';
      setTimeout(nx, T(350));
    } else {
      var logo = $('bootLogo'), tag = $('bootTag'), tap = $('tap');
      if (logo) logo.classList.add('on');
      if (tag) tag.textContent = 'Shake the globe. Survive the sky.';
      if (tap) tap.classList.add('on');
      armed = true;
    }
  })();
}
function leaveBoot() {
  if (!armed) return;
  armed = false;
  loadingScr();
}
document.addEventListener('DOMContentLoaded', function(){
  var bootEl = $('boot');
  if (bootEl) bootEl.addEventListener('click', leaveBoot);
  document.addEventListener('keydown', function(e){
    if ($('boot') && $('boot').classList.contains('on') && (e.key === 'Enter' || e.key === ' ')) leaveBoot();
  });
  
  // Initialize Home screen events
  var rmChk = $('rmChk');
  if (rmChk) {
    rmChk.onchange = function() {
      rm = this.checked;
      SS.settings.set('rm', rm ? '1' : '0');
      document.body.classList.toggle('rm', rm);
    };
  }
  document.body.classList.toggle('rm', rm);

  document.querySelectorAll('[data-back]').forEach(function(b){
    b.onclick = function(){ SS.screens.home(); };
  });

  var hHow = $('hHow'); if (hHow) hHow.onclick = how;
  var hData = $('hData'); if (hData) hData.onclick = function(){ SS.screens.dataScreen(liveR); };
  var hLab = $('hLab'); if (hLab) hLab.onclick = function(){ SS.screens.show('lab'); };
  var hCrew = $('hCrew'); if (hCrew) hCrew.onclick = function(){ var nm = $('nm'); if(nm) nm.value = pipName; SS.screens.show('crew'); };
  
  var nmOk = $('nmOk');
  if (nmOk) {
    nmOk.onclick = function(){
      var nm = $('nm');
      pipName = (nm ? nm.value : 'Pip').slice(0, 12);
      SS.settings.set('pip', pipName);
      HOW[2][1] = 'Shake the globe. Survive the sky. Keep ' + pipName + ' safe for 10 sols.';
      SS.screens.home();
    };
  }

  document.querySelectorAll('.tabs button').forEach(function(b){
    b.onclick = function(){
      var t = b.dataset.t;
      document.querySelectorAll('.tabs button').forEach(function(x){ x.className = x === b ? 'a' : ''; });
      if (t === 'crew') { var hc = $('hCrew'); if(hc) hc.click(); }
      if (t === 'data') SS.screens.dataScreen(liveR);
    };
  });

  var play = $('play'); if (play) play.onclick = function(){ brief(1); };
  var hRand = $('hRand'); if (hRand) hRand.onclick = function(){ brief(0); };
  var go = $('go'); if (go) go.onclick = function(){ SS.screens.show('game'); dawn(); };
  var lgo = $('lgo'); if (lgo) lgo.onclick = function(){ clearInterval(tipT); SS.screens.home(); };

  var endBtn = $('endBtn'); if (endBtn) endBtn.onclick = endDay;
  var nextDayBtn = $('nextDay'); if (nextDayBtn) nextDayBtn.onclick = function(){
    var pov = $('pov'); if(pov) pov.classList.remove('on');
    if (S.over || S.day >= 10) { report(); return; }
    S.day++; dawn();
  };

  var flip = $('flip'); if (flip) flip.onclick = function(){ this.classList.toggle('b'); };
  
  var dock = $('dock');
  if (dock) {
    dock.addEventListener('click', function(e){
      var b = e.target.closest('button');
      if (!b || busy) return;
      var k = b.dataset.k, d = +b.dataset.d, n = S.alloc[k] + d;
      if (n < 0 || n > (k === 'sci' ? 2 : 3)) return;
      if (d > 0 && spent() >= avail()) return;
      if (d > 0) SS.fx.fly($('batt'), b);
      S.alloc[k] = n;
      render();
    });
  }

  boot();
});

/* ---------- Loading Screen ---------- */
function loadingScr() {
  SS.screens.show('loading');
  var sg = $('segs');
  if (sg) {
    sg.innerHTML = '';
    for (var i = 0; i < 12; i++) sg.appendChild(document.createElement('b'));
  }
  var st = [], lg = $('lgo');
  if (lg) lg.disabled = true;

  function fill(n) {
    if (!sg) return;
    var b = sg.children;
    for (var i = 0; i < 12; i++) b[i].className = i < n ? 'f' : '';
  }
  function step(m, n) {
    st.push(m);
    var lst = $('lst'); if(lst) lst.textContent = st.join('\n');
    fill(n);
  }
  step('Loading art... done', 4);
  setTimeout(function(){ step('Loading NASA snapshot... done', 8); }, T(400));

  var ti = 0;
  function tip() {
    var tips = SS.data.tips;
    if (!tips) return;
    var t = tips[ti++ % tips.length];
    var tipEl = $('tip');
    if (tipEl) tipEl.innerHTML = '<span class="tag">' + t[0] + '</span>' + t[1];
  }
  tip();
  clearInterval(tipT);
  tipT = setInterval(tip, 3500);

  SS.dataModule.fetchLiveDONKI().then(function(r){
    liveR = r;
    step('Checking space weather... ' + (r ? 'LIVE' : 'SNAPSHOT (offline)'), 12);
    if (lg) lg.disabled = false;
  });
}

/* ---------- How to Play Modal ---------- */
var HOW = [
  ['READ THE SKY', 'Check today\'s weather and the message from Earth. Earth\'s news is one day old!', 'Sol = one Mars day, about 24 hours 40 minutes.'],
  ['SPEND SUN COINS', 'Fund Life, Food and Shield. Science is a tempting extra. Coins you do not spend stay in the battery.', 'Radiation = invisible energy from the Sun that can harm people.'],
  ['SHAKE AND SURVIVE', 'Shake the globe to end the day. Keep Pip safe for 10 sols.', 'Solar flare = a sudden burst of energy from the Sun. X-class is the strongest.']
], hi = 0;

function how() {
  SS.screens.show('how');
  hi = 0;
  hrender();
}
function hrender() {
  var h = HOW[hi];
  var ht = $('hT'), hp = $('hP'), hg = $('hG'), hNext = $('hN');
  if (ht) ht.textContent = (hi + 1) + '/3  ' + h[0];
  if (hp) hp.textContent = h[1];
  if (hg) hg.textContent = 'Word help: ' + h[2];
  if (hNext) hNext.textContent = hi === 2 ? 'DONE' : 'NEXT';
}

var hNextBtn = $('hNext'); if(hNextBtn) hNextBtn.onclick = function(){
  if (hi < 2) { hi++; hrender(); } else SS.screens.home();
};
var hPrevBtn = $('hPrev'); if(hPrevBtn) hPrevBtn.onclick = function(){
  if (hi > 0) { hi--; hrender(); } else SS.screens.home();
};

/* ---------- Briefing & Game State ---------- */
function brief(kind) {
  var seed = Math.floor(Math.random() * 99999);
  S = {
    kind: kind, seed: seed, day: 1, batt: 6, life: 100, food: 100, dose: 0, sci: 0,
    alloc: { life: 2, food: 1, shield: 1, sci: 0 },
    sch: kind ? SS.scheduleModule.mission1() : SS.scheduleModule.randomM(seed),
    log: [], cards: [], warn: {}, over: false, fail: null
  };
  var bp = $('bP');
  if (bp) bp.textContent = (kind ? 'Mission 1 replays real flares from NASA records in a new order, with a dust storm inspired by the June 2018 Mars storm. ' : 'Random mission (seed ' + seed + '): real flares and storms in a new order. ') + 'Keep ' + pipName + ' safe for 10 sols. Earth will send warnings, but they arrive late.';
  SS.screens.show('brief');
}

var SYS = [
  { k: 'life', n: 'LIFE', i: '🫧' },
  { k: 'food', n: 'FOOD', i: '🌿' },
  { k: 'shield', n: 'SHIELD', i: '🛡️' },
  { k: 'sci', n: 'SCIENCE', i: '🔭' }
];

function cur() { return S.sch[S.day - 1]; }
function income() { return SS.rules.inc[cur().w]; }
function spent() { var a = S.alloc; return a.life + a.food + a.shield + a.sci; }
function avail() { return S.batt + income(); }

function earth() {
  var d = S.day, td = cur(), tm = S.sch[d], m = { text: '', late: false, warn: false };
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
  m.text = d === 10 ? 'Last sol! Almost home.' : 'All clear for tomorrow. A good day to save coins.';
  return m;
}

function dawn() {
  busy = false;
  var o = ['life', 'food', 'shield', 'sci'], t = spent(), a = avail(), i = 0;
  while (t > a && i < 40) {
    var k = o[3 - (i % 4)];
    if (S.alloc[k] > 0) { S.alloc[k]--; t--; }
    i++;
  }
  S.em = earth();
  if (S.em.warn) S.warn[S.day + 1] = true;
  SS.sceneModule.sky('dawn', cur());
  render();
  var endBtn = $('endBtn'); if(endBtn) endBtn.disabled = false;
  SS.fx.toast('📨 New message from Earth!');
  if (S.em.late) SS.fx.toast('⚠️ Message delayed!', 1);
  if (cur().f) SS.fx.toast('☀️ Flare detected!', 1);
  if (cur().w === 'storm') SS.fx.toast('🌪️ Dust storm today', 1);
}

function mood() {
  if (S.fail) return 'scared';
  var w = Math.min(S.life, S.food, 100 - S.dose);
  return cur().f || w <= 30 ? 'scared' : (w <= 60 || cur().w === 'storm') ? 'worried' : 'happy';
}

function render() {
  var d = S.day, tl = '';
  for (var i = 1; i <= 10; i++) {
    var cl = i < d ? 'dn' : i === d ? 'td' : S.warn[i] ? 'wn' : '';
    tl += '<div class="' + cl + '">' + i + (S.warn[i] ? '<br>⚠️' : '') + '</div>';
  }
  var tlEl = $('tl'); if(tlEl) tlEl.innerHTML = tl;
  var w = cur().w;
  var orbEl = $('orb'); if(orbEl) orbEl.innerHTML = '<span>' + (w === 'storm' ? '🌪️' : w === 'hazy' ? '🌫️' : '☀️') + '</span>GALE CRATER<br>SOL ' + d;

  var sp = spent(), left = avail() - sp, save = Math.min(SS.rules.cap, left), h = '';
  var M = { life: S.life, food: S.food, shield: 100 - S.dose, sci: Math.min(100, S.sci / 2) };
  
  SYS.forEach(function(s){
    var a = S.alloc[s.k], v = Math.round(M[s.k] / 10), ms = '';
    for (var j = 0; j < 10; j++) {
      ms += '<i style="' + (j < v ? 'background:var(--' + (s.k === 'life' ? 'teal' : s.k === 'food' ? 'leaf' : s.k === 'shield' ? 'shield' : 'sci') + ')' : '') + '"></i>';
    }
    var hint = s.k === 'life' ? 'Air and heat: ' + sg((a - SS.rules.lifeNeed) * SS.rules.lifeRate) + ' a day' :
               s.k === 'food' ? 'Crops: ' + sg((a - SS.rules.foodNeed) * SS.rules.foodRate - SS.rules.foodDrain) + ' a day' :
               s.k === 'shield' ? 'Radiation: +' + Math.max(0, SS.rules.doseBase - a) + ' a day' :
               'Discovery: +' + (a * SS.rules.sci) + ' points';
    var mx = s.k === 'sci' ? 2 : 3;
    h += '<div class="panel dk"><div class="ic">' + s.i + '</div><b>' + s.n + '</b><div class="mt" aria-hidden="true">' + ms + '</div><div class="ct"><button data-k="' + s.k + '" data-d="-1" aria-label="Less ' + s.n + '"' + (a <= 0 ? ' disabled' : '') + '>−</button><span>' + a + '</span><button data-k="' + s.k + '" data-d="1" aria-label="More ' + s.n + '"' + (left <= 0 || a >= mx ? ' disabled' : '') + '>＋</button></div><small>' + hint + '</small></div>';
  });
  var dockEl = $('dock'); if(dockEl) dockEl.innerHTML = h;

  var batt = '<span style="min-width:170px">Coins to spend: ' + left + '<br>Saved for tomorrow: ' + save + '</span><b>';
  for (i = 0; i < SS.rules.cap; i++) batt += '<i class="' + (i < save ? 'f' : i < save + sp ? 'p' : '') + '"></i>';
  var battEl = $('batt'); if(battEl) battEl.innerHTML = batt + '</b>';

  SS.sceneModule.renderScene(mood(), S.alloc.shield);
  var says = { happy: 'Everything looks good!', worried: 'It\'s so dusty... let\'s hold on!', scared: 'Shield up! I feel the Sun!' };
  var mo = mood();
  var pcard = $('pcard');
  if (pcard) {
    pcard.innerHTML = '<b>' + pipName + ':</b> ' + (cur().w !== 'storm' && mo === 'worried' ? 'I am a little worried...' : says[mo]) + '<br><span style="color:var(--ice)">' + (S.em ? '📨 ' + S.em.text + ' <small>(sent 1 sol ago)</small>' : '') + '</span>';
  }
}

function sg(n) { return (n >= 0 ? '+' : '') + n; }

function endDay() {
  if (busy || S.over) return;
  busy = true;
  var endBtn = $('endBtn'); if(endBtn) endBtn.disabled = true;
  var d = S.day, sc = cur(), a = S.alloc, sp = spent();
  var rec = { d: d, inc: income(), b: S.batt, a: { life: a.life, food: a.food, heat: 0, shield: a.shield, sci: a.sci }, w: sc.w, f: sc.f, late: sc.late };
  
  var stage = $('stage');
  if (stage) {
    stage.classList.remove('shake');
    void stage.offsetWidth;
    stage.classList.add('shake');
  }
  SS.sceneModule.sky('day', sc);

  setTimeout(function(){
    S.batt = Math.min(SS.rules.cap, S.batt + rec.inc - sp);
    S.life = Math.min(100, S.life + (a.life - SS.rules.lifeNeed) * SS.rules.lifeRate);
    S.food = Math.min(100, S.food + (a.food - SS.rules.foodNeed) * SS.rules.foodRate - SS.rules.foodDrain);
    S.dose += Math.max(0, SS.rules.doseBase - a.shield);
    S.sci += a.sci * SS.rules.sci;

    if (sc.f) {
      S.dose += Math.round(sc.f.spike * (1 - SS.rules.cut * a.shield));
      var flash = $('flash');
      if (flash) {
        flash.classList.remove('fl');
        void flash.offsetWidth;
        flash.classList.add('fl');
      }
      var shieldEl = $('shield'); if(shieldEl) shieldEl.setAttribute('stroke-opacity', 1);
    }
    S.life = Math.max(0, S.life);
    S.food = Math.max(0, S.food);
    rec.after = { life: S.life, food: S.food, dose: S.dose, batt: S.batt };

    if (S.dose >= 100) { S.dose = 100; S.fail = 'dose'; }
    else if (S.life <= 0) { S.fail = 'life'; }
    else if (S.food <= 0) { S.fail = 'food'; }

    S.log.push(rec);
    if (S.fail) S.over = true;
    SS.sceneModule.sky('dusk', sc);
    render();
    setTimeout(function(){ showPostcard(rec); }, T(1500));
  }, T(800));
}

function showPostcard(r) {
  var f = SS.postcardModule.getFact(r), m = SS.postcardModule.getMessage(r, pipName, S.batt);
  var sk = r.w === 'storm' ? '#c8703c' : r.w === 'hazy' ? '#e9a56e' : '#f2a65a';
  S.cards.push({ d: r.d, m: m });

  var pf = $('pf');
  if (pf) {
    pf.innerHTML = '<svg viewBox="0 0 400 130"><rect width="400" height="130" fill="' + sk + '"/><path d="M60 100 L130 40 L175 28 L230 48 L300 100Z" fill="#8c4a2a"/><path d="M0 100 Q100 85 200 100 T400 96 V130H0Z" fill="#b9501f"/><path d="M230 112 a34 30 0 0 1 68 0Z" fill="#efe0cc"/><g transform="translate(110,86) scale(.28)"><use href="#pb"/></g></svg><div class="stamp">SOL<br>' + r.d + '</div><div class="pm">GALE CRATER<br>SOL ' + r.d + '</div><div class="hw">' + m + '</div><div class="ss"><span>EARNED ' + r.inc + '</span><span>BATTERY ' + S.batt + '</span><span>RADIATION ' + Math.round(S.dose) + '</span><span>DISCOVERY ' + S.sci + '</span></div>';
  }
  var pb2 = $('pb2');
  if (pb2) {
    pb2.innerHTML = '<h3>EARTH SAID:</h3><p>' + (S.em ? S.em.text : '') + (S.em && S.em.late ? ' <span class="late">LATE</span>' : '') + '</p><h3>REAL NASA SCIENCE:</h3><p>' + (r.f ? 'Real flare: ' + r.f.cls + ', ' + r.f.date + '. ' : '') + f.t + '</p><p class="src">Source: ' + f.s + ' · <b>SNAPSHOT</b></p><p style="margin-top:8px"><b>To:</b> Earth Mission Control · <b>From:</b> ' + pipName + '</p>';
  }
  var flip = $('flip'); if(flip) flip.classList.remove('b');
  var pov = $('pov'); if(pov) pov.classList.add('on');
  var nextDay = $('nextDay'); if(nextDay) nextDay.textContent = S.over || S.day >= 10 ? 'SEE MISSION REPORT' : 'NEXT DAY';
}

function report() {
  var rep = $('rep'), repC = $('repC'), h = '';
  if (rep) rep.classList.add('on');
  if (S.fail) {
    var b = SS.blackbox.explain(S);
    h = '<h2>' + pipName + ' is safe. Mission paused.</h2><p>A shuttle evacuated ' + pipName + '. Let us learn what happened, like every mission team does.</p><h2 style="font-size:16px">BLACK BOX</h2><ul class="chain">' + b.c.map(function(x){ return '<li><span class="i">' + x[0] + '</span>' + x[1] + '</li>'; }).join('') + '</ul><p class="panel">💡 Try next time: ' + b.tip + '</p>';
  } else {
    var av = S.log.reduce(function(s, l){ return s + l.a.shield; }, 0) / S.log.length;
    var p = S.dose < 40 && av >= 1.5 ? 'Careful Guardian' : S.sci >= 120 ? 'Science Star' : S.batt >= 8 ? 'Efficient Planner' : 'Daring Cadet';
    var sc = S.day * 100 + S.sci + S.batt * 5;
    h = '<h2>Mission complete!</h2><p>' + pipName + ' stayed safe for all 10 sols. 🎉</p><p><span class="patch">' + p + '</span></p><p>Score ' + sc + ' · Discovery ' + S.sci + ' · Battery ' + S.batt + ' · Radiation ' + Math.round(S.dose) + '</p><h2 style="font-size:16px">POSTCARD SCRAPBOOK</h2><div class="scrap">' + S.cards.map(function(c){ return '<div><b>SOL ' + c.d + '</b><br>' + c.m + '</div>'; }).join('') + '</div>';
  }
  if (repC) repC.innerHTML = h + '<div class="hb"><button class="btn" id="again">' + (S.fail ? 'TRY AGAIN' : 'PLAY RANDOM MISSION') + '</button><button class="btn sec" id="rhome">HOME</button></div>';
  var again = $('again'), rhome = $('rhome');
  if (again) again.onclick = function(){ if(rep) rep.classList.remove('on'); brief(S.fail ? S.kind : 0); };
  if (rhome) rhome.onclick = function(){ if(rep) rep.classList.remove('on'); SS.screens.home(); };
}
})();