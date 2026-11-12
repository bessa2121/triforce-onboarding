
// ============================================================================
// 0. SISTEMA DE ÁUDIO RETRO 16-BIT (WEB AUDIO API)
// ============================================================================
const AudioEngine = {
  ctx: null,
  muted: false,
  volume: (() => { try { const v = parseFloat(localStorage.getItem('triforce_volume')); return isNaN(v) ? 0.12 : Math.max(0, Math.min(1, v)); } catch (e) { return 0.12; } })(),
  bgmInterval: null,
  currentRegion: null,
  stepCooldown: 0,

  init() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) this.ctx = new AC();
    }
    const sl = document.getElementById('vol-slider'); if (sl) sl.value = this.volume;
    if (!this._probed) { this._probed = true; this.probeFiles(); }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  },

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, parseFloat(val)));
    try { localStorage.setItem('triforce_volume', this.volume); } catch (e) {}
    const sl = document.getElementById('vol-slider'); if (sl) sl.value = this.volume;
  },

  toggleMute() {
    this.muted = !this.muted;
    const btn = document.getElementById('audio-btn');
    if (btn) btn.innerHTML = `<img class="pix-icon" alt="" src="${UI.icon(this.muted ? 'mute' : 'sound')}">`;
  },

  playTone(freq, duration, type = 'square', volMul = 0.25) {
    if (this.muted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(this.volume * volMul, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {}
  },

  playStep() {
    if (this.stepCooldown > 0) return;
    this.stepCooldown = 14;
    this.playTone(130 + Math.random() * 25, 0.05, 'triangle', 0.12);
  },

  playDialog() { this.playTone(520, 0.07, 'square', 0.15); },
  playMenu() { this.playTone(620, 0.06, 'triangle', 0.14); },
  playChest() {
    this.playTone(440, 0.08, 'triangle', 0.22);
    setTimeout(() => this.playTone(587.33, 0.14, 'triangle', 0.25), 80);
  },
  playSuccess() {
    this.playTone(523.25, 0.1, 'square', 0.2);
    setTimeout(() => this.playTone(659.25, 0.1, 'square', 0.2), 90);
    setTimeout(() => this.playTone(783.99, 0.18, 'square', 0.22), 180);
  },
  playError() {
    this.playTone(220, 0.14, 'sawtooth', 0.22);
    setTimeout(() => this.playTone(165, 0.22, 'sawtooth', 0.22), 120);
  },
  playBonfire() {   // graça: acorde dourado ascendente + brasa grave
    this.playTone(110, 0.9, 'sine', 0.22);
    [293, 392, 494, 587, 784].forEach((f, i) => setTimeout(() => this.playTone(f, 0.55, 'triangle', 0.2), 120 + i * 140));
  },
  playOcarina() {   // Canção do Tempo (A - D - F, duas vezes), timbre de ocarina
    [440, 294, 349, 440, 294, 349].forEach((f, i) => setTimeout(() => { this.playTone(f, i % 3 === 2 ? 0.7 : 0.38, 'sine', 0.3); this.playTone(f * 2, 0.3, 'sine', 0.05); }, i * 420));
  },
  playOwl() {
    this.playTone(330, 0.14, 'sine', 0.3);
    setTimeout(() => this.playTone(262, 0.24, 'sine', 0.3), 170);
  },
  playAgenda() {   // fanfarra de "item obtido" ao selar o agendamento
    [392, 523, 659, 784, 659, 784, 1046].forEach((f, i) => setTimeout(() => this.playTone(f, i > 5 ? 0.5 : 0.16, 'triangle', 0.32), i * 120));
    setTimeout(() => this.playTone(1318, 0.6, 'sine', 0.2), 900);
  },
  playTriforce() {
    [523, 659, 784, 1046].forEach((f, i) => {
      setTimeout(() => this.playTone(f, 0.22, 'triangle', 0.3), i * 130);
    });
  },

  /* ---- Música: usa audio/<tema>.mp3 se existir (coloque aqui suas faixas licenciadas);
          senão, toca um tema sintetizado ORIGINAL com o clima de cada personagem. ---- */
  THEMES: {
    kokiri:  { root: 392, scale: [0, 2, 4, 7, 9], seq: [0, 2, 4, 2, 3, 2, 1, -1, 0, 2, 4, 5, 4, 2, 1, -1], step: 260, wave: 'triangle', vol: 0.22 },
    saria:   { root: 440, scale: [0, 2, 4, 7, 9], seq: [2, 3, 4, 3, 2, 3, 4, 6, 4, 3, 2, 1, 2, 3, 2, -1], step: 170, wave: 'sine', vol: 0.26 },
    mido:    { root: 330, scale: [0, 2, 4, 7, 9], seq: [0, 0, 2, 0, 0, 4, 3, -1, 0, 0, 2, 0, 4, 3, 2, -1], step: 140, wave: 'square', vol: 0.1 },
    talon:   { root: 294, scale: [0, 2, 3, 5, 7, 8], seq: [4, -1, 3, 2, -1, 3, 1, -1, 2, 1, 0, -1, 1, 0, -1, -1], step: 200, wave: 'sawtooth', vol: 0.07 },
    zelda:   { root: 349, scale: [0, 2, 4, 5, 7, 9], seq: [0, 2, 4, -1, 2, 4, 5, -1, 4, 2, 0, -1, 1, -1, 0, -1], step: 420, wave: 'sine', vol: 0.3 },
    darunia: { root: 165, scale: [0, 3, 5, 7, 10], seq: [0, -1, 0, 2, -1, 0, 3, -1, 0, -1, 4, 3, -1, 2, 1, -1], step: 190, wave: 'square', vol: 0.12 }
  },
  theme: null, base: 'kokiri', override: null, step: 0, el: null, files: {}, themeTimer: null,


  /* ---- YouTube (player oculto): fonte principal das faixas ---- */
  YT_IDS: { kokiri: 'aQ6Fq-LfDZQ', saria: 'V9so9y-8Dgk', mido: 'MBU2IJ1Mnjw', talon: 'UtgHZaq0EGs', zelda: 'EPhfbtjqWM8', darunia: '0hEYvdMoF2g' },
  yt: null, ytReady: false, ytPending: null, ytCur: null, ytBad: {}, resume: {}, _ytLoading: false,
  ytLoad() {
    if (this._ytLoading) return; this._ytLoading = true;
    const h = document.createElement('div'); h.style.cssText = 'position:fixed;left:-9999px;top:0;width:200px;height:200px;opacity:0;pointer-events:none';
    h.innerHTML = '<div id="yt-player"></div>'; document.body.appendChild(h);
    const s = document.createElement('script'); s.src = 'https://www.youtube.com/iframe_api'; s.onerror = () => { this.ytFail(); }; document.head.appendChild(s);
    window.onYouTubeIframeAPIReady = () => {
      this.yt = new YT.Player('yt-player', { height: '200', width: '200', playerVars: { autoplay: 1, controls: 0, playsinline: 1, rel: 0 }, events: {
        onReady: () => { this.ytReady = true; if (this.ytPending && this.theme === this.ytPending) this.ytPlay(this.ytPending); },
        onStateChange: (e) => { if (e.data === 0 && this.ytCur) this.yt.loadVideoById(this.YT_IDS[this.ytCur]); },   // loop
        onError: () => this.ytFail()
      } });
    };
  },
  ytFail() { const n = this.ytCur || this.ytPending; if (!n) return; this.ytBad[n] = true; this.ytCur = null; this.theme = null; this.setTheme(n); },
  ytPlay(name) {
    this.ytPending = name; if (!this.ytReady) { this.ytLoad(); return; }
    this.ytCur = name; this.yt.loadVideoById({ videoId: this.YT_IDS[name], startSeconds: this.resume[name] || 0 }); this.yt.setVolume(this.muted ? 0 : this.volume * 100);
  },

  /* ---- Crossfade de faixas locais: cada tema tem seu <audio>; um laço de 50ms leva o volume ao alvo ---- */
  REGION: { 'Kokiri Village': 'kokiri', 'Hyrule Field': 'mido', 'Temple of Time': 'zelda', 'Lost Woods': 'saria', 'Gerudo Valley': 'darunia' },
  FADE_MS: 1600, pool: {}, goals: {}, fadeLoop: null, filesReady: false, probe: null,
  probeFiles() {
    if (typeof fetch !== 'function') { this.filesReady = true; return; }
    this.probe = Promise.allSettled(Object.keys(this.THEMES).map(n => fetch('assets/audio/' + n + '.mp3', { method: 'HEAD' })
      .then(r => { this.files[n] = r.ok && /audio|octet/.test(r.headers.get('content-type') || 'audio'); }).catch(() => {}))).then(() => { this.filesReady = true; });
  },
  track(n) { let t = this.pool[n]; if (!t) { t = new Audio('assets/audio/' + n + '.mp3'); t.loop = true; t.preload = 'auto'; t.volume = 0; this.pool[n] = t; } return t; },
  fadeTo(name) {
    for (const k in this.pool) this.goals[k] = 0;
    if (name) { this.goals[name] = 1; this.track(name); }
    if (this.fadeLoop) return;
    this.fadeLoop = setInterval(() => {
      const stop = !gameState.started || isPaused, vol = (typeof this.volume === 'number') ? this.volume : 0.5;
      for (const k in this.pool) {
        const t = this.pool[k], g = this.goals[k] || 0;
        if (stop) { if (!t.paused) t.pause(); continue; }
        if (g > 0 && t.paused) t.play().catch(() => {});
        const target = this.muted ? 0 : g * vol, step = vol * 50 / this.FADE_MS;
        t.volume = Math.max(0, Math.min(1, t.volume < target ? Math.min(target, t.volume + step) : Math.max(target, t.volume - step)));
        if (g === 0 && t.volume === 0 && !t.paused) t.pause();
      }
    }, 50);
  },
  setTheme(name) {
    if (this.theme === name) return;
    if (!this.filesReady) { this.theme = null; this.wanted = name; if (this.probe && !this._wait) { this._wait = true; this.probe.then(() => { this._wait = false; this.theme = null; this.setTheme(this.wanted); }); } return; }
    this.theme = name; this.step = 0;
    if (this.el) { this.el.pause(); this.el = null; }
    if (this.themeTimer) clearInterval(this.themeTimer);
    if (this.ytReady && this.ytCur) { if (this.ytCur === 'kokiri') this.resume.kokiri = this.yt.getCurrentTime(); this.yt.pauseVideo(); }
    this.ytCur = null;
    if (this.files[name]) { this.fadeTo(name); return; }
    this.fadeTo(null);
    if (!this.THEMES[name]) return;
    if (this.YT_IDS[name] && !this.ytBad[name] && !this.files[name]) {
      this.ytPlay(name);
      this.themeTimer = setInterval(() => {
        if (!this.ytReady || !this.ytCur) return; this.yt.setVolume(this.muted ? 0 : this.volume * 100);
        const stop = !gameState.started || isPaused, st = this.yt.getPlayerState();
        if (stop && st === 1) this.yt.pauseVideo(); else if (!stop && st === 2 && !this._manual) this.yt.playVideo();
      }, 300);
      return;
    }
    if (this.files[name]) {
      this.el = new Audio('assets/audio/' + name + '.mp3'); this.el.loop = true; this.el.volume = this.volume;
      this.themeTimer = setInterval(() => {
        if (!this.el) return; this.el.volume = this.muted ? 0 : this.volume;
        const stop = !gameState.started || isPaused; if (stop && !this.el.paused) this.el.pause(); else if (!stop && this.el.paused) this.el.play().catch(() => {});
      }, 300);
      this.el.play().catch(() => {}); return;
    }
    const t = this.THEMES[name];
    this.themeTimer = setInterval(() => {
      if (!gameState.started || isPaused || this.muted || !this.ctx) return;
      const d = t.seq[this.step++ % t.seq.length]; if (d < 0) return;
      const oct = Math.floor(d / t.scale.length), semi = t.scale[d % t.scale.length] + 12 * oct;
      this.playTone(t.root * Math.pow(2, semi / 12), t.step / 1000 * 1.6, t.wave, t.vol);
      if (this.step % 4 === 1) this.playTone(t.root / 2, t.step / 1000 * 3, 'triangle', t.vol * 0.7);
    }, t.step);
  },
  /* Tema de fundo: sempre a floresta de Kokiri; personagens trocam durante a conversa */
  startBGM(area) { this.base = this.REGION[area] || 'kokiri'; this.setTheme(this.override || this.base); },
  npcTheme(key) { this.override = this.THEMES[key] && key !== 'link' ? key : null; this.setTheme(this.override || this.base); }
};


// Atalhos de volume: + e - (passos de 5%). O jogo começa baixo (12%) e a escolha fica salva.
window.addEventListener('keydown', (e) => {
  if (e.key !== '+' && e.key !== '=' && e.key !== '-') return;
  AudioEngine.setVolume(AudioEngine.volume + (e.key === '-' ? -0.05 : 0.05));
  if (typeof showToast === 'function') showToast('Volume: ' + Math.round(AudioEngine.volume * 100) + '%');
});
