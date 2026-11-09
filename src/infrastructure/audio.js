
// ============================================================================
// 0. SISTEMA DE ÁUDIO RETRO 16-BIT (WEB AUDIO API)
// ============================================================================
const AudioEngine = {
  ctx: null,
  muted: false,
  volume: 0.35,
  bgmInterval: null,
  currentRegion: null,
  stepCooldown: 0,

  init() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) this.ctx = new AC();
    }
    if (!this._probed) { this._probed = true; this.probeFiles(); }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  },

  setVolume(val) {
    this.volume = parseFloat(val);
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

  probeFiles() {
    if (typeof fetch !== 'function') return;
    Object.keys(this.THEMES).forEach(n => fetch('assets/audio/' + n + '.mp3', { method: 'HEAD' }).then(r => { this.files[n] = r.ok && /audio|octet/.test(r.headers.get('content-type') || 'audio'); }).catch(() => {}));
  },
  setTheme(name) {
    if (this.theme === name) return;
    this.theme = name; this.step = 0;
    if (this.el) { this.el.pause(); this.el = null; }
    if (this.themeTimer) clearInterval(this.themeTimer);
    if (this.ytReady && this.ytCur) { if (this.ytCur === 'kokiri') this.resume.kokiri = this.yt.getCurrentTime(); this.yt.pauseVideo(); }
    this.ytCur = null;
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
  startBGM() { this.base = 'kokiri'; this.setTheme(this.override || this.base); },
  npcTheme(key) { this.override = this.THEMES[key] && key !== 'link' ? key : null; this.setTheme(this.override || this.base); }
};

