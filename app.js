/* Altstadt-Runde — renders the route and runs the tour clock. */
(function () {
  'use strict';

  var KEY = 'altstadt-runde-v1';
  var stops = TOUR.stops;
  var legs  = TOUR.legs;

  /* --- Build the timeline: stop, walk, stop, walk, ... stop -------- */
  var blocks = [];
  stops.forEach(function (s, i) {
    blocks.push({ kind: 'stop', min: s.talkMin, data: s, stopIndex: i });
    if (legs[i]) blocks.push({ kind: 'leg', min: legs[i].min, data: legs[i], legIndex: i });
  });

  var totalMin = blocks.reduce(function (a, b) { return a + b.min; }, 0);

  /* Planned minutes elapsed by the time you leave stop n */
  var leaveBy = stops.map(function (_, n) {
    var m = 0;
    for (var i = 0; i < blocks.length; i++) {
      m += blocks[i].min;
      if (blocks[i].kind === 'stop' && blocks[i].stopIndex === n) break;
    }
    return m;
  });

  /* --- Saved state -------------------------------------------------- */
  var state = { startedAt: null, pausedAt: null, offset: 0, done: [] };
  try {
    var raw = localStorage.getItem(KEY);
    if (raw) state = Object.assign(state, JSON.parse(raw));
  } catch (e) { /* private mode, or storage blocked — run without it */ }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }

  function elapsedMs() {
    if (!state.startedAt) return 0;
    var end = state.pausedAt || Date.now();
    return Math.max(0, end - state.startedAt - state.offset);
  }
  var running = function () { return !!state.startedAt && !state.pausedAt; };

  function mmss(ms) {
    var t = Math.max(0, Math.round(ms / 1000));
    return String(Math.floor(t / 60)).padStart(2, '0') + ':' + String(t % 60).padStart(2, '0');
  }
  function clockAt(min) {
    var d = new Date((state.startedAt || Date.now()) + min * 60000);
    return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  }
  function mapsUrl(from, to) {
    return 'https://www.google.com/maps/dir/?api=1&origin=' + encodeURIComponent(from) +
           '&destination=' + encodeURIComponent(to) + '&travelmode=walking';
  }

  /* --- Render ------------------------------------------------------- */
  var route = document.getElementById('route');
  var band  = document.getElementById('band');

  blocks.forEach(function (b, i) {
    var el = document.createElement('section');
    el.className = 'block block--' + b.kind + ' ' + b.kind;
    if (i === 0) el.classList.add('block--first');
    if (i === blocks.length - 1) el.classList.add('block--last');

    if (b.kind === 'stop') {
      var s = b.data;
      el.id = 'stop-' + s.num;
      el.innerHTML =
        '<div class="stop__num">' + s.num + '</div>' +
        '<div class="stop__head">' +
          '<h2 class="stop__name">' + s.name + '</h2>' +
          '<p class="stop__sub">' + s.sub + '</p>' +
          '<div class="stop__meta"><span>Talk ' + s.talkMin + ' min</span>' +
            '<span class="dot">&middot;</span>' +
            '<span class="due" data-due="' + b.stopIndex + '"></span></div>' +
        '</div>' +
        '<ul class="points">' +
          s.core.map(function (p) { return '<li>' + p + '</li>'; }).join('') +
        '</ul>' +
        (s.flag ? '<div class="flag" data-type="' + s.flag.type + '" data-word="' +
          (s.flag.type === 'warn' ? 'Watch out' : s.flag.type === 'tip' ? 'If you have room' : 'Timing') +
          '">' + s.flag.text + '</div>' : '') +
        (s.extra && s.extra.length
          ? '<details class="more"><summary>If you have time</summary><ul class="points">' +
            s.extra.map(function (p) { return '<li>' + p + '</li>'; }).join('') +
            '</ul></details>'
          : '') +
        '<button class="doneBtn" type="button" data-done="' + b.stopIndex + '">' +
          (legs[b.stopIndex] ? 'Done &mdash; walk on' : 'Finish tour') +
        '</button>';
    } else {
      var l = b.data;
      el.innerHTML =
        '<div class="leg__mark">&#9660;</div>' +
        '<div class="leg__head"><span>Walk ' + l.min + ' min &middot; ' + l.meters + ' m</span>' +
          '<span class="leg__via">via ' + l.via + ' &middot; Google says ' + l.googleMin + ' min</span></div>' +
        '<div class="leg__box">' +
          '<ol class="leg__steps">' +
            l.steps.map(function (s) { return '<li>' + s + '</li>'; }).join('') +
          '</ol>' +
          (l.talk && l.talk.length
            ? '<p class="leg__talkh">Say while walking</p><ul class="leg__talk">' +
              l.talk.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul>'
            : '') +
          '<a class="maplink" href="' + mapsUrl(l.from, l.to) + '" target="_blank" rel="noopener">' +
            'Open this leg in Maps &rarr;</a>' +
        '</div>';
    }
    route.appendChild(el);

    var seg = document.createElement('div');
    seg.className = 'seg seg--' + b.kind;
    seg.style.flex = b.min + ' 0 0';
    seg.innerHTML = '<div class="seg__fill"></div>';
    band.appendChild(seg);
  });

  var segFills = Array.prototype.slice.call(band.querySelectorAll('.seg__fill'));
  var blockEls = Array.prototype.slice.call(route.querySelectorAll('.block'));
  var dueEls   = Array.prototype.slice.call(route.querySelectorAll('[data-due]'));
  var clockTime = document.getElementById('clockTime');
  var clockLabel = document.getElementById('clockLabel');
  var statusEl = document.getElementById('status');
  var barSub = document.getElementById('barSub');

  /* --- Tick --------------------------------------------------------- */
  function paint() {
    var ms = elapsedMs();
    var mins = ms / 60000;

    /* band fills segment by segment against the plan */
    var acc = 0;
    for (var i = 0; i < blocks.length; i++) {
      var pct = state.startedAt ? Math.min(1, Math.max(0, (mins - acc) / blocks[i].min)) : 0;
      segFills[i].style.width = (pct * 100) + '%';
      acc += blocks[i].min;
    }

    /* clock face */
    if (!state.startedAt) {
      clockTime.textContent = 'Start';
      clockLabel.textContent = 'tour';
    } else {
      clockTime.textContent = mmss(ms);
      clockLabel.textContent = state.pausedAt ? 'paused' : 'of ' + totalMin + ':00';
    }

    /* per-stop deadline */
    dueEls.forEach(function (el) {
      var n = +el.getAttribute('data-due');
      el.textContent = state.startedAt
        ? 'leave by ' + clockAt(leaveBy[n])
        : 'at +' + leaveBy[n] + ' min';
    });

    /* status line */
    if (!state.startedAt) { statusEl.hidden = true; return; }
    statusEl.hidden = false;

    var lastDone = state.done.length ? Math.max.apply(null, state.done) : -1;
    var drift = lastDone >= 0 ? (state.doneAt || {})['s' + lastDone] : null;
    var delta = drift != null ? Math.round(drift / 60000 - leaveBy[lastDone]) : 0;

    var next = -1;
    for (var k = 0; k < stops.length; k++) {
      if (state.done.indexOf(k) === -1) { next = k; break; }
    }

    var left = [];
    if (delta > 0) { left.push(delta + ' min behind'); statusEl.dataset.state = 'behind'; }
    else if (delta < 0) { left.push(Math.abs(delta) + ' min ahead'); statusEl.dataset.state = 'ok'; }
    else { left.push('On plan'); statusEl.dataset.state = 'ok'; }

    if (mins > totalMin) { left = ['Over by ' + Math.round(mins - totalMin) + ' min']; statusEl.dataset.state = 'over'; }

    if (next >= 0) left.push('leave ' + stops[next].name + ' by ' + clockAt(leaveBy[next]));
    else left.push('tour complete');

    statusEl.textContent = left.join('  ·  ');
  }

  function paintDone() {
    blockEls.forEach(function (el) {
      var btn = el.querySelector('[data-done]');
      if (!btn) return;
      var n = +btn.getAttribute('data-done');
      var isDone = state.done.indexOf(n) !== -1;
      el.classList.toggle('block--done', isDone);
      btn.innerHTML = isDone ? 'Done' : (legs[n] ? 'Done &mdash; walk on' : 'Finish tour');
    });
  }

  /* --- Wake lock: the screen must not sleep mid-tour ---------------- */
  var lock = null;
  function holdScreen() {
    if (!('wakeLock' in navigator) || lock) return;
    navigator.wakeLock.request('screen').then(function (l) {
      lock = l;
      l.addEventListener('release', function () { lock = null; });
    }).catch(function () { /* denied or unsupported — not worth telling anyone */ });
  }
  function releaseScreen() { if (lock) { lock.release(); lock = null; } }
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible' && running()) holdScreen();
  });

  /* --- Controls ------------------------------------------------------ */
  document.getElementById('clockBtn').addEventListener('click', function () {
    if (!state.startedAt) {
      state.startedAt = Date.now();
      state.pausedAt = null;
      state.offset = 0;
      holdScreen();
      barSub.textContent = 'Started ' + clockAt(0) + ' · back by ' + clockAt(totalMin);
    } else if (state.pausedAt) {
      state.offset += Date.now() - state.pausedAt;
      state.pausedAt = null;
      holdScreen();
    } else {
      state.pausedAt = Date.now();
      releaseScreen();
    }
    save(); paint();
  });

  route.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-done]');
    if (!btn) return;
    var n = +btn.getAttribute('data-done');
    var at = state.done.indexOf(n);
    state.doneAt = state.doneAt || {};
    if (at === -1) {
      state.done.push(n);
      if (state.startedAt) state.doneAt['s' + n] = elapsedMs();
      var nextEl = blockEls[blocks.findIndex(function (b) { return b.kind === 'stop' && b.stopIndex === n; }) + 1];
      if (nextEl) nextEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      state.done.splice(at, 1);
      delete state.doneAt['s' + n];
    }
    save(); paintDone(); paint();
  });

  document.getElementById('resetBtn').addEventListener('click', function () {
    if (!confirm('Reset the clock and clear every stop you have marked done?')) return;
    state = { startedAt: null, pausedAt: null, offset: 0, done: [], doneAt: {} };
    save(); releaseScreen();
    barSub.textContent = '60 min loop · 2.4 km · from Marienplatz';
    paintDone(); paint();
  });

  /* --- Go ------------------------------------------------------------ */
  if (state.startedAt) {
    barSub.textContent = 'Started ' + clockAt(0) + ' · back by ' + clockAt(totalMin);
    if (running()) holdScreen();
    /* Phone locked, reopened, thumb nowhere near the right place.
       Put them back on the stop they are actually standing at. */
    var resume = -1;
    for (var r = 0; r < stops.length; r++) {
      if (state.done.indexOf(r) === -1) { resume = r; break; }
    }
    if (resume > 0) {
      try { history.scrollRestoration = 'manual'; } catch (e) {}
      var jumpTo = resume;
      var jump = function () {
        var el = document.getElementById('stop-' + stops[jumpTo].num);
        if (el) el.scrollIntoView({ block: 'start' });
      };
      window.addEventListener('load', function () { setTimeout(jump, 60); });
      setTimeout(jump, 400);
    }
  }
  paintDone();
  paint();
  setInterval(paint, 1000);
})();
