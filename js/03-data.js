(function(){
"use strict";
window.SS = window.SS || {};
var SS = window.SS;

SS.dataModule = {
  fetchLiveDONKI: function() {
    return new Promise(function(res){
      try {
        var c = new AbortController();
        var tm = setTimeout(function(){ c.abort(); }, 3000);
        var e = new Date(), s = new Date(e - 7 * 864e5), f = function(d){ return d.toISOString().slice(0,10); };
        
        fetch('https://api.nasa.gov/DONKI/FLR?startDate=' + f(s) + '&endDate=' + f(e) + '&api_key=DEMO_KEY', { signal: c.signal })
          .then(function(r){
            clearTimeout(tm);
            if (!r.ok) throw 0;
            return r.json();
          })
          .then(function(a){
            var rank = {A:1, B:2, C:3, M:4, X:5}, best = null;
            (a || []).forEach(function(x){
              var k = x.classType || '';
              if (!best || (rank[k[0]] || 0) > (rank[best[0]] || 0) || ((rank[k[0]] || 0) === (rank[best[0]] || 0) && parseFloat(k.slice(1)) > parseFloat(best.slice(1)))) {
                best = k;
              }
            });
            res({ n: (a || []).length, top: best });
          })
          .catch(function(){ res(null); });
      } catch(x) { res(null); }
    });
  }
};
})();