#!/usr/bin/env node
/* Generates one narration file per stop with the Gemini TTS API.
 *
 *   node tools/build-audio.js           only stops whose text changed
 *   node tools/build-audio.js --force   everything
 *
 * Needs GEMINI_API_KEY in .env (never committed) and ffmpeg on PATH.
 * Output lands in audio/ and IS committed — the site is static, so the
 * files have to ship with it.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const ROOT  = path.join(__dirname, '..');
const OUT   = path.join(ROOT, 'audio');
const MODEL = 'gemini-3.1-flash-tts-preview';
const VOICE = 'Sulafat';
const KBPS  = '48k';

const DIRECTION =
  'You are narrating a walking tour of Munich for English-speaking visitors. ' +
  'Read the following warmly and clearly, at an unhurried pace, as if you were ' +
  'standing next to the listener pointing things out. Let the full stops breathe. ' +
  'Pronounce German names, streets and places in German.';

function env() {
  const p = path.join(ROOT, '.env');
  if (!fs.existsSync(p)) throw new Error('.env not found — needs GEMINI_API_KEY');
  return Object.fromEntries(
    fs.readFileSync(p, 'utf8').split('\n').filter(Boolean).filter(l => !l.startsWith('#'))
      .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; })
  );
}

const strip = h => h.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

/* What gets spoken for one stop: its name, the main bullets, then the
   extra material. Matches what the card shows, in the same order. */
function textFor(stop) {
  return [strip(stop.name) + '.']
    .concat((stop.core || []).map(strip))
    .concat((stop.extra || []).map(strip))
    .join('\n\n');
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function synthesise(text, key) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${key}`;
  const body = {
    contents: [{ parts: [{ text: DIRECTION + '\n\n' + text }] }],
    generationConfig: {
      responseModalities: ['AUDIO'],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: VOICE } } }
    }
  };
  for (let attempt = 1; attempt <= 4; attempt++) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body)
    });
    const json = await res.json();
    const part = json.candidates && json.candidates[0] && json.candidates[0].content
      && json.candidates[0].content.parts && json.candidates[0].content.parts[0];
    if (part && part.inlineData) return Buffer.from(part.inlineData.data, 'base64');

    const msg = json.error ? `${json.error.status}: ${json.error.message}` : 'no audio in response';
    const retryable = !json.error || [429, 500, 503].includes(json.error.code);
    if (!retryable || attempt === 4) throw new Error(msg);
    const wait = attempt * 4000;
    console.log(`      ${msg.slice(0, 80)} — retrying in ${wait / 1000}s`);
    await sleep(wait);
  }
}

/* Gemini returns raw 24 kHz mono signed 16-bit PCM. */
function toMp3(pcm, file) {
  execFileSync('ffmpeg', [
    '-y', '-f', 's16le', '-ar', '24000', '-ac', '1', '-i', 'pipe:0',
    '-codec:a', 'libmp3lame', '-b:a', KBPS, '-ar', '24000', '-ac', '1', file
  ], { input: pcm, stdio: ['pipe', 'ignore', 'ignore'] });
}

const duration = file =>
  +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration',
    '-of', 'csv=p=0', file]).toString().trim();

(async () => {
  const force = process.argv.includes('--force');
  const key = env().GEMINI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY missing from .env');

  const TOUR = (0, eval)(fs.readFileSync(path.join(ROOT, 'tour-data.js'), 'utf8') + ';TOUR');
  fs.mkdirSync(OUT, { recursive: true });

  const manifestPath = path.join(OUT, 'manifest.json');
  const old = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')) : {};
  const manifest = {};
  let built = 0, skipped = 0;

  for (const stop of TOUR.stops) {
    const id   = 'stop-' + String(stop.num).padStart(2, '0');
    const file = path.join(OUT, id + '.mp3');
    const text = textFor(stop);
    const hash = crypto.createHash('sha256')
      .update(MODEL + '|' + VOICE + '|' + KBPS + '|' + DIRECTION + '|' + text).digest('hex').slice(0, 16);

    const prev = old[id];
    if (!force && prev && prev.hash === hash && fs.existsSync(file)) {
      manifest[id] = prev;
      skipped++;
      console.log(`  ${id}  ${stop.name} — unchanged`);
      continue;
    }

    process.stdout.write(`  ${id}  ${stop.name} — ${text.split(/\s+/).length} words … `);
    const pcm = await synthesise(text, key);
    toMp3(pcm, file);
    const secs = duration(file);
    manifest[id] = {
      hash,
      stop: stop.num,
      name: stop.name,
      seconds: +secs.toFixed(1),
      bytes: fs.statSync(file).size
    };
    built++;
    console.log(`${secs.toFixed(0)}s, ${(fs.statSync(file).size / 1024).toFixed(0)} KB`);
    await sleep(1200);                      /* stay well under the rate limit */
  }

  fs.writeFileSync(manifestPath, JSON.stringify({
    model: MODEL, voice: VOICE, bitrate: KBPS,
    generated: new Date().toISOString().slice(0, 10),
    stops: manifest
  }, null, 2) + '\n');

  const total = Object.values(manifest).reduce((a, m) => a + m.seconds, 0);
  const size  = Object.values(manifest).reduce((a, m) => a + m.bytes, 0);
  console.log(`\n  ${built} built, ${skipped} unchanged`);
  console.log(`  ${(total / 60).toFixed(1)} min of audio, ${(size / 1048576).toFixed(1)} MB total`);
})().catch(e => { console.error('\nFAILED:', e.message); process.exit(1); });
