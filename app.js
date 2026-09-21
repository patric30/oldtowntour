/* Munich Oldtown Tour — renders the route and runs the tour clock.
   UI follows Material 3: cards, chips, tonal containers, an extended FAB
   carrying the primary action, and Material Symbols throughout. */
(function () {
  'use strict';

  var KEY = 'altstadt-runde-v1';
  var stops = TOUR.stops;
  var legs  = TOUR.legs;

  var FLAG_ICON = { time: 'schedule', warn: 'warning', tip: 'lightbulb' };
  var FLAG_WORD = { time: 'Timing', warn: 'Watch out', tip: 'If you have room' };

  /* --- Build the timeline: stop, walk, stop, walk, ... stop -------- */
  var blocks = [];
  stops.forEach(function (s, i) {
    blocks.push({ kind: 'stop', min: s.talkMin, data: s, stopIndex: i });
    if (legs[i]) blocks.push({ kind: 'leg', min: legs[i].min, data: legs[i], legIndex: i });
  });

  var totalMin = blocks.reduce(function (a, b) { return a + b.min; }, 0);
  var walkMin  = legs.reduce(function (a, l) { return a + l.min; }, 0);
  var km       = (legs.reduce(function (a, l) { return a + l.meters; }, 0) / 1000).toFixed(1);

  function idleSub() {
    return totalMin + ' min loop · ' + km + ' km · from ' + stops[0].name;
  }

  /* Index of the block just after stop n — everything before it is behind you
     once that stop is marked off. Drives the progress band. */
  var blockAfterStop = stops.map(function (_, n) {
    for (var i = 0; i < blocks.length; i++) {
      if (blocks[i].kind === 'stop' && blocks[i].stopIndex === n) return i + 1;
    }
    return 0;
  });

  /* --- Saved state -------------------------------------------------- */
  var state = { startedAt: null, pausedAt: null, offset: 0, done: [], doneAt: {} };
  try {
    var raw = localStorage.getItem(KEY);
    if (raw) state = Object.assign(state, JSON.parse(raw));
  } catch (e) { /* private mode, or storage blocked — run without it */ }
  if (!state.doneAt) state.doneAt = {};

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }

  function elapsedMs() {
    if (!state.startedAt) return 0;
    var end = state.pausedAt || Date.now();
    return Math.max(0, end - state.startedAt - state.offset);
  }
  function running() { return !!state.startedAt && !state.pausedAt; }

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
  /* Opens the Google Maps app and starts walking navigation. No origin, so it
     routes from wherever you are actually standing rather than from the last
     stop — which matters when the group has drifted half a street. */
  function navUrl(dest) {
    return 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(dest) +
           '&travelmode=walking&dir_action=navigate';
  }
  function nextLabel(n) {
    return legs[n] ? 'Next: ' + stops[n + 1].name : 'Finish tour';
  }
  function icon(name, extra) {
    return '<span class="msym' + (extra ? ' ' + extra : '') + '" aria-hidden="true">' + name + '</span>';
  }

  /* ===================================================================
     Narration.

     The browser's own speech synthesis proved unreliable on real phones,
     so every stop is narrated ahead of time by Gemini TTS and shipped as
     an mp3 (see tools/build-audio.js). This is a plain <audio> element:
     it keeps playing with the screen locked, it shows up on the lock
     screen, and there is nothing left to go wrong mid-sentence.
     =================================================================== */

  var audio = null;                 /* one element, reused for every stop */
  var playingStop = -1;
  var durations = {};               /* from audio/manifest.json */

  var canPlay = (function () {
    try { return !!document.createElement('audio').canPlayType('audio/mpeg'); }
    catch (e) { return false; }
  })();

  function audioSrc(n) {
    return 'audio/stop-' + String(stops[n].num).padStart(2, '0') + '.mp3';
  }

  function clock(sec) {
    if (!isFinite(sec) || sec < 0) sec = 0;
    var m = Math.floor(sec / 60), s = Math.round(sec % 60);
    if (s === 60) { m++; s = 0; }
    return m + ':' + String(s).padStart(2, '0');
  }

  function ensureAudio() {
    if (audio) return audio;
    audio = new Audio();
    audio.preload = 'none';
    audio.addEventListener('timeupdate', paintPlayers);
    audio.addEventListener('loadedmetadata', paintPlayers);
    audio.addEventListener('play', paintPlayers);
    audio.addEventListener('pause', paintPlayers);
    audio.addEventListener('ended', function () { stopAudio(); });
    audio.addEventListener('error', function () {
      var btn = playingStop >= 0 && route.querySelector('[data-play="' + playingStop + '"]');
      if (btn) btn.querySelector('.t').textContent = 'Audio unavailable';
      playingStop = -1;
      paintPlayers();
    });
    return audio;
  }

  function paintPlayers() {
    Array.prototype.forEach.call(route.querySelectorAll('[data-play]'), function (btn) {
      var n = +btn.getAttribute('data-play');
      var active = playingStop === n;
      var playing = active && audio && !audio.paused;
      var total = active && audio && isFinite(audio.duration) ? audio.duration : durations[n];

      btn.classList.toggle('is-speaking', playing);
      btn.querySelector('.msym').textContent = playing ? 'pause' : 'play_arrow';
      btn.querySelector('.t').textContent = active
        ? clock(audio ? audio.currentTime : 0) + ' / ' + clock(total)
        : (total ? 'Listen · ' + clock(total) : 'Listen');
      btn.setAttribute('aria-label',
        (playing ? 'Pause narration: ' : 'Play narration: ') + stops[n].name);

      var player = route.querySelector('[data-player="' + n + '"]');
      if (!player) return;
      player.hidden = !active;
      if (active && audio && isFinite(audio.duration) && audio.duration > 0) {
        player.querySelector('.player__fill').style.width =
          (audio.currentTime / audio.duration * 100) + '%';
      }
    });
  }

  function stopAudio() {
    if (audio) { audio.pause(); try { audio.currentTime = 0; } catch (e) {} }
    playingStop = -1;
    paintPlayers();
  }

  function playStop(n) {
    if (!canPlay) return;
    var a = ensureAudio();

    if (playingStop === n) {                  /* same stop: toggle */
      if (a.paused) { a.play().catch(function () {}); } else { a.pause(); }
      paintPlayers();
      return;
    }

    /* Open the extra material — the narration reads it, so it should be
       on screen while it plays. */
    var card = document.getElementById('stop-' + stops[n].num);
    var more = card && card.querySelector('details.more');
    if (more) more.open = true;

    a.pause();
    a.src = audioSrc(n);
    a.load();
    playingStop = n;
    a.play().catch(function () { /* blocked until a gesture — the tap is one */ });

    if ('mediaSession' in navigator && window.MediaMetadata) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: 'Stop ' + stops[n].num + ' · ' + stops[n].name,
        artist: 'Munich Oldtown Tour',
        album: '90 minutes through the Altstadt'
      });
      try {
        navigator.mediaSession.setActionHandler('play',  function () { a.play().catch(function(){}); });
        navigator.mediaSession.setActionHandler('pause', function () { a.pause(); });
      } catch (e) {}
    }
    paintPlayers();
  }

  /* Durations come from the build manifest so the button can say how long
     the narration runs before anything is downloaded. */
  if (canPlay && window.fetch) {
    fetch('audio/manifest.json').then(function (r) { return r.ok ? r.json() : null; })
      .then(function (m) {
        if (!m || !m.stops) return;
        stops.forEach(function (st, i) {
          var e = m.stops['stop-' + String(st.num).padStart(2, '0')];
          if (e) durations[i] = e.seconds;
        });
        paintPlayers();
      })
      .catch(function () { /* button just says "Listen" */ });
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
        '<div class="marker stop__num"><span class="n">' + s.num + '</span>' + icon('check') + '</div>' +
        '<div class="stop__card">' +
          '<div class="stop__head">' +
            '<h2 class="stop__name m3-headline">' + s.name + '</h2>' +
            '<p class="stop__sub">' + s.sub + '</p>' +
          '</div>' +
          '<div class="chips">' +
            (canPlay
              ? '<button class="chip chip--primary chip--talk" type="button" data-play="' +
                  b.stopIndex + '">' + icon('play_arrow') + '<span class="t">Listen</span></button>'
              : '') +
            '<span class="chip">' + icon('schedule') + 'About ' + s.talkMin + ' min here</span>' +
          '</div>' +
          '<div class="player" data-player="' + b.stopIndex + '" hidden>' +
            '<div class="player__bar"><div class="player__fill"></div></div>' +
          '</div>' +
          '<hr class="divider">' +
          '<ul class="points">' +
            s.core.map(function (p) { return '<li>' + p + '</li>'; }).join('') +
          '</ul>' +
          (s.flag
            ? '<div class="flag" data-type="' + s.flag.type + '">' +
                icon(FLAG_ICON[s.flag.type] || 'info') +
                '<div><span class="flag__word">' + (FLAG_WORD[s.flag.type] || 'Note') + '</span>' +
                s.flag.text + '</div></div>'
            : '') +
          (s.extra && s.extra.length
            ? '<details class="more"><summary>' + icon('expand_more') + 'More interesting facts</summary>' +
              '<ul class="points">' +
              s.extra.map(function (p) { return '<li>' + p + '</li>'; }).join('') +
              '</ul></details>'
            : '') +
          '<button class="doneBtn" type="button" data-done="' + b.stopIndex + '">' +
            icon(legs[b.stopIndex] ? 'arrow_forward' : 'flag') +
            '<span class="t">' + nextLabel(b.stopIndex) + '</span>' +
          '</button>' +
        '</div>';
    } else {
      var l = b.data;
      el.innerHTML =
        '<div class="marker leg__mark">' + icon('directions_walk') + '</div>' +
        '<div class="leg__head">' +
          '<span class="leg__dist">Walk ' + l.min + ' min · ' + l.meters + ' m</span>' +
          '<span class="leg__via">via ' + l.via + ' · Google says ' + l.googleMin + ' min</span>' +
        '</div>' +
        '<div class="leg__box">' +
          '<ol class="leg__steps">' +
            l.steps.map(function (s) { return '<li>' + s + '</li>'; }).join('') +
          '</ol>' +
          (l.talk && l.talk.length
            ? '<p class="leg__talkh">' + icon('campaign') + 'Information on the go</p>' +
              '<ul class="leg__talk">' +
              l.talk.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul>'
            : '') +
          '<div class="leg__actions">' +
            '<a class="btn-tonal" href="' + navUrl(l.dest) + '" target="_blank" rel="noopener">' +
              icon('navigation') + 'Walk to ' + stops[b.legIndex + 1].name + '</a>' +
            '<a class="maplink" href="' + mapsUrl(l.from, l.to) + '" target="_blank" rel="noopener">' +
              icon('map') + 'Preview the leg</a>' +
          '</div>' +
        '</div>';
    }
    route.appendChild(el);

    var seg = document.createElement('div');
    seg.className = 'seg seg--' + b.kind;
    seg.style.flex = b.min + ' 0 0';
    seg.innerHTML = '<div class="seg__fill"></div>';
    band.appendChild(seg);
  });

  var segFills  = Array.prototype.slice.call(band.querySelectorAll('.seg__fill'));
  var blockEls  = Array.prototype.slice.call(route.querySelectorAll('.block'));
  var clockTime = document.getElementById('clockTime');
  var clockIcon = document.getElementById('clockIcon');
  var statusEl  = document.getElementById('status');
  var barSub    = document.getElementById('barSub');
  var fab       = document.getElementById('fab');
  var fabIcon   = document.getElementById('fabIcon');
  var fabLabel  = document.getElementById('fabLabel');

  statusEl.innerHTML = '<span class="msym" aria-hidden="true"></span><span class="t"></span>';
  var statusIcon = statusEl.querySelector('.msym');
  var statusText = statusEl.querySelector('.t');

  function nextStop() {
    for (var k = 0; k < stops.length; k++) {
      if (state.done.indexOf(k) === -1) return k;
    }
    return -1;
  }

  /* --- Tick --------------------------------------------------------- */
  function paint() {
    var ms = elapsedMs();
    var lastDone = state.done.length ? Math.max.apply(null, state.done) : -1;
    var filled = lastDone >= 0 ? blockAfterStop[lastDone] : 0;

    /* The band shows how much of the route is behind you, not whether you
       are keeping to a schedule. Nobody on a walk should be told off by a
       progress bar. */
    for (var i = 0; i < blocks.length; i++) {
      segFills[i].style.width = (i < filled ? 100 : 0) + '%';
    }

    var left = 0;
    for (var j = filled; j < blocks.length; j++) left += blocks[j].min;

    /* clock */
    if (!state.startedAt) {
      clockTime.textContent = 'Start';
      clockIcon.textContent = 'play_arrow';
    } else {
      clockTime.textContent = mmss(ms);
      clockIcon.textContent = state.pausedAt ? 'play_arrow' : 'pause';
    }

    /* the FAB names where you are going next */
    var next = nextStop();
    if (!state.startedAt) {
      fabIcon.textContent = 'play_arrow';
      fabLabel.textContent = 'Start tour';
      fab.dataset.variant = 'start';
    } else if (next === -1) {
      fabIcon.textContent = 'celebration';
      fabLabel.textContent = 'Tour complete';
      fab.dataset.variant = 'start';
    } else {
      fabIcon.textContent = legs[next] ? 'arrow_forward' : 'flag';
      fabLabel.textContent = nextLabel(next);
      fab.dataset.variant = 'done';
    }

    /* status banner: where you are, and how much is left */
    if (!state.startedAt) { statusEl.hidden = true; return; }
    statusEl.hidden = false;

    if (next === -1) {
      statusEl.dataset.state = 'done';
      statusIcon.textContent = 'celebration';
      var took = Math.round(ms / 60000);
      statusText.textContent = took >= 1
        ? 'Tour complete  ·  ' + took + ' min door to door'
        : 'Tour complete';
    } else {
      statusEl.dataset.state = 'going';
      statusIcon.textContent = 'directions_walk';
      statusText.textContent = 'Stop ' + stops[next].num + ' of ' + stops.length +
        '  ·  about ' + left + ' min to go';
    }
  }

  function paintDone() {
    blockEls.forEach(function (el) {
      var btn = el.querySelector('[data-done]');
      if (!btn) return;
      var n = +btn.getAttribute('data-done');
      var isDone = state.done.indexOf(n) !== -1;
      el.classList.toggle('block--done', isDone);
      btn.querySelector('.t').textContent = isDone ? 'Done' : nextLabel(n);
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
    /* the narration deliberately keeps playing with the screen off */
  });

  /* --- Actions ------------------------------------------------------- */
  function startTour() {
    state.startedAt = Date.now();
    state.pausedAt = null;
    state.offset = 0;
    holdScreen();
    barSub.textContent = 'Started ' + clockAt(0) + ' · back by ' + clockAt(totalMin);
    save(); paint();
  }

  function toggleClock() {
    if (!state.startedAt) return startTour();
    if (state.pausedAt) {
      state.offset += Date.now() - state.pausedAt;
      state.pausedAt = null;
      holdScreen();
    } else {
      state.pausedAt = Date.now();
      releaseScreen();
    }
    save(); paint();
  }

  function markStop(n, scroll) {
    var at = state.done.indexOf(n);
    if (at === -1) {
      state.done.push(n);
      if (state.startedAt) state.doneAt['s' + n] = elapsedMs();
      if (scroll) {
        var idx = blocks.findIndex(function (b) { return b.kind === 'stop' && b.stopIndex === n; });
        var nextEl = blockEls[idx + 1];
        if (nextEl) nextEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      state.done.splice(at, 1);
      delete state.doneAt['s' + n];
    }
    save(); paintDone(); paint();
  }

  document.getElementById('clockBtn').addEventListener('click', toggleClock);

  route.addEventListener('click', function (e) {
    var play = e.target.closest('[data-play]');
    if (play) { playStop(+play.getAttribute('data-play')); return; }

    var bar = e.target.closest('.player__bar');
    if (bar && audio && isFinite(audio.duration)) {      /* tap the bar to seek */
      var r = bar.getBoundingClientRect();
      audio.currentTime = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)) * audio.duration;
      paintPlayers();
      return;
    }

    var btn = e.target.closest('[data-done]');
    if (btn) markStop(+btn.getAttribute('data-done'), true);
  });

  fab.addEventListener('click', function () {
    if (!state.startedAt) {
      startTour();
      var first = document.getElementById('stop-' + stops[0].num);
      if (first) first.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    var next = nextStop();
    if (next === -1) {
      /* nothing left to mark off — put the summary back in front of them */
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    markStop(next, true);
  });

  function resetTour() {
    if (!confirm('Reset the clock and clear every stop you have marked done?')) return;
    state = { startedAt: null, pausedAt: null, offset: 0, done: [], doneAt: {} };
    save(); releaseScreen(); stopAudio();
    barSub.textContent = idleSub();
    paintDone(); paint();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  document.getElementById('resetBtn').addEventListener('click', resetTour);
  document.getElementById('resetTop').addEventListener('click', resetTour);

  /* --- Go ------------------------------------------------------------ */
  (function fillFacts() {
    var f = { total: totalMin + ' min', walk: walkMin + ' min',
              stops: String(stops.length), km: km + ' km' };
    Object.keys(f).forEach(function (k) {
      var el = document.querySelector('[data-fact="' + k + '"]');
      if (el) el.textContent = f[k];
    });
    barSub.textContent = idleSub();
  })();

  if (state.startedAt) {
    barSub.textContent = 'Started ' + clockAt(0) + ' · back by ' + clockAt(totalMin);
    if (running()) holdScreen();
    /* Phone locked, reopened, thumb nowhere near the right place.
       Put them back on the stop they are actually standing at. */
    var resume = nextStop();
    if (resume > 0) {
      try { history.scrollRestoration = 'manual'; } catch (e) {}
      var jump = function () {
        var el = document.getElementById('stop-' + stops[resume].num);
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
