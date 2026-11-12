(function(){
"use strict";
window.SS = window.SS || {};
var SS = window.SS;

var historyStack = [];

function show(id, saveHistory) {
  var currentActive = document.querySelector('.scr.on');
  if (currentActive && saveHistory && currentActive.id !== id) {
    historyStack.push(currentActive.id);
  }
  
  var a = document.querySelectorAll('.scr');
  for (var i = 0; i < a.length; i++) {
    a[i].classList.remove('on');
  }
  var target = document.getElementById(id);
  if (target) {
    target.classList.add('on');
  }
}

SS.screens = {
  show: show,
  home: function() {
    historyStack = [];
    show('home', false);
    var rmChk = document.getElementById('rmChk');
    if (rmChk) rmChk.checked = SS.settings.get('rm') === '1';
  },
  howToPlay: function() {
    show('how', true);
  },
  dataScreen: function(liveR) {
    show('data', true);
    var lt = document.getElementById('liveT'), lm = document.getElementById('liveM');
    if (lt) lt.innerHTML = liveR ? '<span class="live">LIVE</span> Sun right now: ' + liveR.n + ' flare(s) in the last 7 days' + (liveR.top ? ', strongest class ' + liveR.top : '') + ' (NASA DONKI).' : 'Live space weather was not available, so the game uses its snapshot.';
    if (lm) lm.innerHTML = liveR ? '<span class="live">LIVE</span>' : '<span class="snap">SNAPSHOT</span>';
  },
  goBack: function() {
    if (historyStack.length > 0) {
      var prevId = historyStack.pop();
      show(prevId, false);
    } else {
      show('home', false);
    }
  }
};
})();