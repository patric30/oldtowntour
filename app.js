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
     Reading a stop aloud.

     Three things make this reliable, and it was broken without all of them:

     1. Chrome cuts a single utterance off at roughly 15 seconds. Some of
        these bullets run 25 seconds, so each one is split into pieces of at
        most ~170 characters before it is spoken.
     2. An utterance with no live reference can be garbage-collected while it
        is still being spoken, which stops the speech dead. Every utterance
        stays reachable from `queue` until the run ends.
     3. Handing the whole stop to the engine's own queue at once is fragile.
        Pieces are spoken one at a time, each starting when the last ends, so
        a dropped item cannot silently swallow the remainder.
     =================================================================== */

  var synth = window.speechSynthesis;
  var canSpeak = !!synth && typeof window.SpeechSynthesisUtterance === 'function';
  var speakingStop = -1;
  var voice = null;

  var runToken = 0;      /* bumped on every stop, so stale callbacks go quiet */
  var queue = [];        /* holds utterances alive past their creation scope */
  var cursor = 0;
  var guardTimer = null;

  /* longest first, so "Dienerstraße" wins over the generic "straße" */
  var SAY = (TOUR.say || []).slice().sort(function (a, b) { return b[0].length - a[0].length; })
    .map(function (pair) {
      return [new RegExp(pair[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), pair[1]];
    });

  function pickVoice() {
    var vs = (canSpeak && synth.getVoices()) || [];
    if (!vs.length) return null;
    var en = vs.filter(function (v) { return /^en[-_]?/i.test(v.lang || ''); });
    return en.filter(function (v) { return /^en[-_]GB/i.test(v.lang); })[0]
        || en.filter(function (v) { return /^en[-_]US/i.test(v.lang); })[0]
        || en[0] || null;
  }
  if (canSpeak) {
    voice = pickVoice();
    synth.onvoiceschanged = function () { voice = pickVoice(); };
  }

  function speakable(text) {
    var t = text;
    for (var i = 0; i < SAY.length; i++) t = t.replace(SAY[i][0], SAY[i][1]);
    return t
      .replace(/ß/g, 'ss')
      .replace(/[äÄ]/g, 'a').replace(/[öÖ]/g, 'o').replace(/[üÜ]/g, 'u')
      .replace(/\s*[—–]\s*/g, ', ')   /* dashes read better as a pause */
      .replace(/\s+/g, ' ')
      .trim();
  }

  /* Break at a sentence end once the piece is long enough to be worth
     breaking; fall back to a hard cap so nothing reaches Chrome's limit. */
  function pieces(text) {
    var words = text.split(' ');
    var out = [], buf = '';
    for (var i = 0; i < words.length; i++) {
      buf = buf ? buf + ' ' + words[i] : words[i];
      var breaks = /[.!?]["')\]]?$/.test(words[i]);
      var pauses = /[,;:]$/.test(words[i]);
      if ((breaks && buf.length >= 90) || (pauses && buf.length >= 140) || buf.length >= 170) {
        out.push(buf); buf = '';
      }
    }
    if (buf) out.push(buf);
    return out.length ? out : [text];
  }

  function highlight(el) {
    Array.prototype.forEach.call(route.querySelectorAll('.is-reading'), function (e) {
      e.classList.remove('is-reading');
    });
    if (el) {
      el.classList.add('is-reading');
      el.scrollIntoView({ block: 'nearest' });
    }
  }

  function paintTalkChips() {
    Array.prototype.forEach.call(route.querySelectorAll('[data-speak]'), function (btn) {
      var n = +btn.getAttribute('data-speak');
      var on = speakingStop === n;
      btn.classList.toggle('is-speaking', on);
      btn.querySelector('.msym').textContent = on ? 'stop_circle' : 'volume_up';
      btn.setAttribute('aria-label',
        (on ? 'Stop reading ' : 'Read aloud: ') + stops[n].name);
    });
  }

  function stopSpeaking() {
    runToken++;
    if (guardTimer) { clearTimeout(guardTimer); guardTimer = null; }
    queue = [];
    cursor = 0;
    if (canSpeak && (synth.speaking || synth.pending)) synth.cancel();
    speakingStop = -1;
    highlight(null);
    paintTalkChips();
  }

  /* Everything on the card, the extra material included. */
  function segmentsFor(n) {
    var card = document.getElementById('stop-' + stops[n].num);
    if (!card) return [];
    var segs = [];
    function add(el, text) {
      pieces(speakable(text)).forEach(function (p) { segs.push({ el: el, text: p }); });
    }
    add(null, stops[n].name);
    Array.prototype.forEach.call(card.querySelectorAll('.stop__card > .points > li'), function (li) {
      add(li, li.textContent);
    });
    var more = card.querySelector('details.more');
    if (more) {
      more.open = true;   /* it all gets read, so let it all be visible */
      Array.prototype.forEach.call(more.querySelectorAll('.points > li'), function (li) {
        add(li, li.textContent);
      });
    }
    return segs;
  }

  function speakNext(token) {
    if (token !== runToken) return;
    if (cursor >= queue.length) { stopSpeaking(); return; }

    var seg = queue[cursor];
    var u = new SpeechSynthesisUtterance(seg.text);
    seg.utterance = u;                       /* keep it reachable */
    if (voice) { u.voice = voice; u.lang = voice.lang; } else { u.lang = 'en-GB'; }
    u.rate = 1;

    var moved = false;
    function advance() {
      if (moved || token !== runToken) return;
      moved = true;
      if (guardTimer) { clearTimeout(guardTimer); guardTimer = null; }
      cursor++;
      speakNext(token);
    }

    /* Only fires if the engine goes quiet without ever ending the utterance.
       It re-arms while speech is genuinely running, so it can never cut a
       piece short. */
    function arm(ms) {
      if (guardTimer) clearTimeout(guardTimer);
      guardTimer = setTimeout(function () {
        if (moved || token !== runToken) return;
        if (synth.speaking || synth.pending) { arm(3000); return; }
        advance();
      }, ms);
    }

    u.onstart = function () { if (token === runToken) highlight(seg.el); };
    u.onend   = advance;
    u.onerror = advance;

    arm(Math.max(6000, seg.text.length * 130));
    try { synth.resume(); } catch (e) {}   /* Chrome can leave it paused */
    synth.speak(u);
  }

  function speakStop(n) {
    if (!canSpeak) return;
    if (speakingStop === n) { stopSpeaking(); return; }

    var wasSpeaking = synth.speaking || synth.pending;
    stopSpeaking();

    var segs = segmentsFor(n);
    if (!segs.length) return;
    queue = segs;
    cursor = 0;
    speakingStop = n;
    paintTalkChips();

    var token = runToken;
    /* A speak() right after a cancel() gets dropped in Chrome. When nothing
       was playing we start synchronously, which is what iOS needs to treat
       this as inside the tap. */
    if (wasSpeaking) setTimeout(function () { speakNext(token); }, 120);
    else speakNext(token);
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
            (canSpeak
              ? '<button class="chip chip--primary chip--talk" type="button" data-speak="' +
                  b.stopIndex + '">' + icon('volume_up') + 'Listen</button>'
              : '') +
            '<span class="chip">' + icon('schedule') + 'About ' + s.talkMin + ' min here</span>' +
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
    if (document.visibilityState === 'hidden') stopSpeaking();
  });
  window.addEventListener('pagehide', function () { stopSpeaking(); });

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
    var say = e.target.closest('[data-speak]');
    if (say) { speakStop(+say.getAttribute('data-speak')); return; }
    var btn = e.target.closest('[data-done]');
    if (btn) { stopSpeaking(); markStop(+btn.getAttribute('data-done'), true); }
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
    save(); releaseScreen(); stopSpeaking();
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
