/* Renderizador: câmera com escala inteira, entidades ordenadas por profundidade, animações e efeitos. */
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let VS = 2, worldLayer = null;
const motes = [];
const TORCHES = [[1424, 196], [1676, 196], [794, 204], [868, 204]];   // mundo (templo e posto)
const E_GLYPH = ['111', '100', '110', '100', '111'];

function resizeCanvas() {
  canvas.width = window.innerWidth; canvas.height = window.innerHeight;
  VS = Math.max(1, Math.min(3, Math.floor(Math.min(canvas.width / 640, canvas.height / 400))));
}
window.addEventListener('resize', resizeCanvas);

function initRenderer() {
  resizeCanvas(); buildSheets(); buildEntitySprites(); worldLayer = bakeWorld();
  const r = rng(99); for (let i = 0; i < 46; i++) motes.push({ x: r() * WORLD_WIDTH, y: r() * WORLD_HEIGHT, ph: r() * 6.28, s: .2 + r() * .4 });
}
function snap(v) { return Math.round(v / 2) * 2; }

function plaque(text, cx, y) {
  ctx.font = '14px VT323'; const w = Math.ceil(ctx.measureText(text).width) + 10, x = snap(cx - w / 2);
  ctx.fillStyle = PAL.ol; ctx.fillRect(x - 2, y - 14, w + 4, 18); ctx.fillStyle = PAL.wood1; ctx.fillRect(x, y - 12, w, 14); ctx.fillStyle = PAL.wood2; ctx.fillRect(x, y - 12, w, 2);
  ctx.fillStyle = PAL.gold2; ctx.textAlign = 'center'; ctx.fillText(text, cx, y - 1);
}
function nameTag(text, cx, y) {
  ctx.font = '14px VT323'; ctx.textAlign = 'center'; ctx.lineWidth = 3; ctx.strokeStyle = PAL.ol; ctx.strokeText(text, cx, y); ctx.fillStyle = '#fff6d8'; ctx.fillText(text, cx, y);
}
function promptBubble(x, y, tick) {
  const bx = snap(x) - 9, by = snap(y) - 20 + (Math.floor(tick / 16) % 2) * 2;
  ctx.fillStyle = PAL.ol; ctx.fillRect(bx - 2, by - 2, 22, 22); ctx.fillRect(bx + 6, by + 20, 6, 4);
  ctx.fillStyle = '#fdf3c9'; ctx.fillRect(bx, by, 18, 18); ctx.fillRect(bx + 8, by + 20, 2, 2); ctx.fillStyle = PAL.gold1; ctx.fillRect(bx, by + 16, 18, 2);
  ctx.fillStyle = PAL.wood0; E_GLYPH.forEach((row, ry) => [...row].forEach((c, rx) => { if (c === '1') ctx.fillRect(bx + 6 + rx * 2, by + 4 + ry * 2, 2, 2); }));
}
function drawFlame(x, y, tick, seed) {
  const f = Math.floor(tick / 5 + seed) % 3;
  ctx.fillStyle = PAL.ol; ctx.fillRect(x - 6, y + 2, 12, 6); ctx.fillStyle = PAL.st1; ctx.fillRect(x - 4, y + 2, 8, 6);
  ctx.fillStyle = '#e8541f'; ctx.fillRect(x - 4, y - 6 - f * 2, 8, 8 + f * 2); ctx.fillStyle = PAL.gold1; ctx.fillRect(x - 2, y - 4 - f * 2, 4, 6 + f * 2); ctx.fillStyle = PAL.gold2; ctx.fillRect(x - 2, y - 2, 2, 4);
  ctx.fillStyle = 'rgba(255,190,80,0.16)'; ctx.fillRect(x - 14, y - 12, 28, 24);
}
function drawNavi(px, py, tick) {
  const nx = snap(px - 22 + Math.sin(tick * .08) * 5), ny = snap(py - 26 + Math.cos(tick * .1) * 5), w = Math.floor(tick / 4) % 2;
  ctx.fillStyle = 'rgba(150,215,255,0.16)'; ctx.fillRect(nx - 10, ny - 10, 20, 20); ctx.fillStyle = 'rgba(190,235,255,0.22)'; ctx.fillRect(nx - 6, ny - 6, 12, 12);
  ctx.fillStyle = PAL.ol; ctx.fillRect(nx - 12, ny - 6 - w * 2, 8, 8 + w * 2); ctx.fillRect(nx + 4, ny - 6 - w * 2, 8, 8 + w * 2); ctx.fillRect(nx - 4, ny - 4, 8, 8);
  ctx.fillStyle = '#e4f6ff'; ctx.fillRect(nx - 10, ny - 4 - w * 2, 6, 6 + w * 2); ctx.fillRect(nx + 4, ny - 4 - w * 2, 6, 6 + w * 2);
  ctx.fillStyle = '#7fd0ff'; ctx.fillRect(nx - 2, ny - 2, 4, 4); ctx.fillStyle = '#fff'; ctx.fillRect(nx - 2, ny - 2, 2, 2);
  if (tick % 5 === 0) particles.push({ x: nx + 2, y: ny + 2, vx: 0, vy: .15, life: 16, color: '#bfe9ff' });
}

function renderFrame(tick) {
  const vw = canvas.width / VS, vh = canvas.height / VS, p = gameState.player;
  const cam = (pos, view, max) => view >= max ? (max - view) / 2 : Math.max(0, Math.min(max - view, pos - view / 2));
  const camX = snap(cam(p.x, vw, WORLD_WIDTH)), camY = snap(cam(p.y, vh, WORLD_HEIGHT));
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#0b130b'; ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.setTransform(VS, 0, 0, VS, -camX * VS, -camY * VS); ctx.imageSmoothingEnabled = false;
  ctx.drawImage(worldLayer, 0, 0, 900, 380, 0, 0, WORLD_WIDTH, WORLD_HEIGHT);
  // água viva
  const L = LAKE; for (let i = 0; i < 10; i++) { const k = (tick * .4 + i * 37) % 120; if (k < 60) { ctx.fillStyle = k < 30 ? PAL.wat3 : PAL.wat2; ctx.fillRect(snap((L.x + 8 + (i * 29) % (L.w - 16)) * 2), snap((L.y + 8 + (i * 17) % (L.h - 16)) * 2), 6, 2); } }
  // luz do templo e tochas
  ctx.fillStyle = `rgba(110,170,255,${0.18 + Math.sin(tick * .05) * .08})`; ctx.fillRect(1550 - 18, 110 + 18, 36, 48);
  TORCHES.forEach(([x, y], i) => drawFlame(x, y, tick, i));
  // rótulos de prédios
  ctx.textAlign = 'center'; obstacles.forEach(o => { if (o.label) plaque(o.label, o.x + o.w / 2, o.y - 6); });
  // entidades (y-sort)
  const moving = keys['w'] || keys['s'] || keys['a'] || keys['d'] || keys['arrowup'] || keys['arrowdown'] || keys['arrowleft'] || keys['arrowright'] || touchDir.up || touchDir.down || touchDir.left || touchDir.right;
  const near = (o) => Math.hypot(p.x - o.x, p.y - o.y) < 62, ents = [];
  npcs.forEach(n => ents.push({ y: n.y, draw() {
    const d = Math.hypot(p.x - n.x, p.y - n.y), dir = d < 130 ? (Math.abs(p.x - n.x) > Math.abs(p.y - n.y) ? (p.x < n.x ? 'left' : 'right') : (p.y < n.y ? 'up' : 'down')) : 'down';
    const blink = (tick + n.x) % 190 < 8, bob = Math.floor((tick + n.x) / 36) % 2 ? 2 : 0;
    drawActor(ctx, n.id, n.x, n.y, dir, blink ? 4 : 0, bob ? 0 : 0); nameTag(n.name, n.x, n.y - 42 - (bob ? 0 : 0));
    if (near(n)) promptBubble(n.x, n.y - 66, tick);
  } }));
  interactables.forEach(o => ents.push({ y: o.y, draw() {
    const opened = o.type === 'secret_chest' && (gameState.collectibles || []).includes(o.item);
    const spr = o.type === 'sign' ? ENT.sign : o.type === 'chest' ? ENT.chest : o.type === 'secret_chest' ? (opened ? ENT.secretOpen : ENT.secret) : ENT.pedestal;
    ctx.fillStyle = PAL.shadow; ctx.fillRect(snap(o.x) - 16, snap(o.y) + 10, 32, 6);
    ctx.drawImage(spr, snap(o.x) - 18, snap(o.y) - 20, 36, 36);
    if (o.type === 'pedestal') { const n = [gameState.triforce.power, gameState.triforce.wisdom, gameState.triforce.courage].filter(Boolean).length; if (n) { ctx.fillStyle = `rgba(251,226,122,${0.12 * n + Math.sin(tick * .08) * .06})`; ctx.fillRect(snap(o.x) - 20, snap(o.y) - 40, 40, 40); } }
    if (near(o)) promptBubble(o.x, o.y - 34, tick);
  } }));
  const walkSeq = [0, 1, 0, 3];
  ents.push({ y: p.y, draw() { drawActor(ctx, 'link', p.x, p.y, p.dir || 'down', moving ? walkSeq[Math.floor(tick / 6) % 4] : ((tick % 200 < 8) ? 4 : 0), 0); drawNavi(p.x, p.y, tick); } });
  ents.sort((a, b) => a.y - b.y).forEach(e => e.draw());
  // partículas e partículas ambientais
  ctx.textAlign = 'left';
  for (let i = particles.length - 1; i >= 0; i--) { const q = particles[i]; q.x += q.vx; q.y += q.vy; q.life--; ctx.fillStyle = q.color; ctx.fillRect(snap(q.x), snap(q.y), 4, 4); if (q.life <= 0) particles.splice(i, 1); }
  motes.forEach(m => {
    m.x += Math.sin(tick * .02 + m.ph) * .4 + .15; m.y += m.s * .35 + Math.cos(tick * .03 + m.ph) * .2; if (m.y > WORLD_HEIGHT) m.y = 0; if (m.x > WORLD_WIDTH) m.x = 0;
    const zone = m.x < 600 ? 'v' : m.x < 1250 ? 'f' : 'p'; ctx.fillStyle = zone === 'v' ? (m.ph > 3 ? '#7ccb4d' : '#e8a53a') : zone === 'f' ? '#fff6c0' : '#bfe9ff';
    ctx.fillRect(snap(m.x), snap(m.y), 2, 2);
  });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}
