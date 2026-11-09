/* ============================================================================
 * DIREÇÃO DE ARTE — fundamentos
 * 1 "pixel de arte" = 2px de mundo (PX). Tile = 16x16 px de arte (32px de mundo).
 * Sprites 18x26 px de arte, retratos 32x32, mundo assado em 900x380 px de arte.
 * Paleta inspirada em Minish Cap: verdes saturados, contornos escuros quentes.
 * ========================================================================== */
const PX = 2;
const PAL = {
  ol:'#1b1722',
  gr0:'#2c6b2a', gr1:'#3d8a30', gr2:'#58a83c', gr3:'#86cf52', gr4:'#b6e87a',
  dirt0:'#a77945', dirt1:'#c49a5f', dirt2:'#dcbb82', dirt3:'#efd9a6',
  st0:'#5f6678', st1:'#8790a4', st2:'#aab3c6', st3:'#d0d7e4',
  roofR0:'#8e2a22', roofR1:'#b83a2c', roofR2:'#dd5d43',
  roofB0:'#233f7a', roofB1:'#2f58a6', roofB2:'#4f82d6',
  wall0:'#c9b17c', wall1:'#e8d5a2', wall2:'#f7ecc8',
  wood0:'#4a2c17', wood1:'#7a4a24', wood2:'#a8723a',
  wat0:'#2a5fae', wat1:'#3f86d8', wat2:'#7cc0f4', wat3:'#d4f0ff',
  gold0:'#b57d1c', gold1:'#e8b53a', gold2:'#fbe27a',
  shadow:'rgba(10,25,15,0.28)'
};
function mk(w, h) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d'); g.imageSmoothingEnabled = false; return [c, g];
}
function R(g, x, y, w, h, c) { g.fillStyle = c; g.fillRect(x, y, w, h); }
function P(g, x, y, c) { g.fillStyle = c; g.fillRect(x, y, 1, 1); }
function rng(seed) {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function hex(c) { return [1, 3, 5].map(i => parseInt(c.substr(i, 2), 16)); }
function mix(a, b, t) {
  const A = hex(a), B = hex(b);
  return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join('');
}
function disc(g, cx, cy, r, c) {
  for (let y = -r; y <= r; y++) { const w = Math.round(Math.sqrt(r * r - y * y + r * 0.4)); R(g, cx - w, cy + y, w * 2 + 1, 1, c); }
}
function rr(g, x, y, w, h, c) { R(g, x + 2, y, w - 4, h, c); R(g, x, y + 2, w, h - 4, c); R(g, x + 1, y + 1, w - 2, h - 2, c); }
/* contorno de 1px ao redor de todos os pixels opacos (padrão dos sprites de GBA) */
function outline(c, col) {
  const g = c.getContext('2d'), w = c.width, h = c.height, d = g.getImageData(0, 0, w, h);
  const out = g.createImageData(w, h); out.data.set(d.data);
  const A = (x, y) => x >= 0 && y >= 0 && x < w && y < h && d.data[(y * w + x) * 4 + 3] > 0;
  const [r, gr, b] = hex(col);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (!A(x, y) && (A(x - 1, y) || A(x + 1, y) || A(x, y - 1) || A(x, y + 1))) {
      const i = (y * w + x) * 4; out.data[i] = r; out.data[i + 1] = gr; out.data[i + 2] = b; out.data[i + 3] = 255;
    }
  }
  g.putImageData(out, 0, 0); return c;
}
