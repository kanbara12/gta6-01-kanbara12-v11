// SUNCOAST: HEATLINE — all sound is synthesised live with WebAudio.
// No audio files, no network: engine hum, gunfire, pickups and three
// original radio stations built from oscillators and scheduled notes.

import { RADIO } from './config.js';

// Simple original melodies (note, beats) — written for this game.
const TUNES = [
  // SHORELINE 96.7 — Sunset Run: warm major-key cruise.
  [[62, 1], [65, 1], [69, 1.5], [67, 0.5], [65, 1], [62, 1], [60, 2], [0, 1]],
  // PIER 102.5 — Boardwalk Lights: bouncy minor.
  [[57, 0.5], [60, 0.5], [62, 1], [64, 1], [62, 0.5], [60, 0.5], [59, 2], [0, 1]],
  // DUNE 89.9 — Night Mirage: slow and sparse.
  [[64, 2], [62, 1], [59, 2], [57, 2], [60, 2], [0, 2]],
];

export class GameAudio {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.station = 0;
    this.engineOsc = null;
    this.engineGain = null;
    this.radioTimer = null;
    this.noteIdx = 0;
  }
  ensure() {
    if (this.ctx) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AC();
      const master = this.ctx.createGain();
      master.gain.value = 0.5;
      master.connect(this.ctx.destination);
      this.master = master;
      // Engine: two detuned saws through a low-pass, gain follows speed.
      this.engineOsc = this.ctx.createOscillator();
      this.engineOsc.type = 'sawtooth';
      this.engineOsc.frequency.value = 55;
      const o2 = this.ctx.createOscillator();
      o2.type = 'sawtooth';
      o2.frequency.value = 55 * 1.01;
      const lp = this.ctx.createBiquadFilter();
      lp.type = 'lowpass'; lp.frequency.value = 480;
      this.engineGain = this.ctx.createGain();
      this.engineGain.gain.value = 0.0;
      this.engineOsc.connect(lp); o2.connect(lp);
      lp.connect(this.engineGain); this.engineGain.connect(master);
      this.engineOsc.start(); o2.start();
      this.startRadio();
    } catch (e) { this.ctx = null; }
  }
  setEngine(speedKmh, driving) {
    if (!this.ctx || !this.engineOsc) return;
    const f = 50 + Math.min(1, speedKmh / 180) * 130;
    this.engineOsc.frequency.setTargetAtTime(f, this.ctx.currentTime, 0.08);
    this.engineGain.gain.setTargetAtTime(driving && !this.muted ? 0.05 + Math.min(1, speedKmh / 180) * 0.05 : 0.0, this.ctx.currentTime, 0.1);
  }
  blip(freq, dur, type = 'sine', vol = 0.2) {
    if (!this.ctx || this.muted) return;
    try {
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = type; o.frequency.value = freq;
      g.gain.setValueAtTime(vol, this.ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);
      o.connect(g); g.connect(this.master);
      o.start(); o.stop(this.ctx.currentTime + dur);
    } catch (e) { /* audio is best-effort */ }
  }
  gunshot() {
    if (!this.ctx || this.muted) return;
    try {
      const len = this.ctx.sampleRate * 0.14;
      const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len) * 0.8;
      const src = this.ctx.createBufferSource();
      src.buffer = buf;
      const g = this.ctx.createGain();
      g.gain.value = 0.5;
      src.connect(g); g.connect(this.master);
      src.start();
    } catch (e) { /* best-effort */ }
  }
  pickup() { this.blip(880, 0.12); setTimeout(() => this.blip(1320, 0.18), 90); }
  startRadio() {
    if (!this.ctx || this.radioTimer) return;
    this.radioTimer = setInterval(() => {
      if (this.muted) return;
      const tune = TUNES[this.station % TUNES.length];
      const [note, beats] = tune[this.noteIdx % tune.length];
      this.noteIdx++;
      if (note > 0) {
        const freq = 440 * Math.pow(2, (note - 69) / 12);
        this.blip(freq, beats * 0.32, 'triangle', 0.08);
        this.blip(freq / 2, beats * 0.32, 'sine', 0.05);
      }
    }, 340);
  }
  nextStation() {
    this.station = (this.station + 1) % RADIO.length;
    this.noteIdx = 0;
    return RADIO[this.station];
  }
  toggleMute() {
    this.muted = !this.muted;
    if (this.master) this.master.gain.value = this.muted ? 0 : 0.5;
    return this.muted;
  }
}
