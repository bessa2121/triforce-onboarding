/* Mundo assado uma única vez em canvas 900x380 (px de arte). Camadas: terreno → caminhos → água → decoração → construções → bordas. */
const LAKE = { x: 520, y: 280, w: 70, h: 40 };          // px de arte (mundo 1040,560,140x80)
const PLAZA_X = 625;                                      // mundo x=1250
const zoneOf = (ax) => ax < 300 ? 'village' : ax < PLAZA_X ? 'field' : 'plaza';
const zoneAt = (ax, ay) => ay >= 380 ? (ax < 450 ? 'woods' : 'desert') : zoneOf(ax);
const WOODS_PAL = ['#173d26', '#1f5a33', '#2f7a43', '#5fae6a'];

function grassCell(g, x, y, z, r) {
  const [base, lite, dark, tuft] = { village: [PAL.gr1, PAL.gr2, PAL.gr0, PAL.gr3], field: [PAL.gr2, PAL.gr3, PAL.gr1, PAL.gr4], woods: ['#245a30', '#2f7a43', '#173d26', '#5fae6a'] }[z];
  const t = r(); R(g, x, y, 8, 8, t < .22 ? dark : t > .8 ? lite : base);
  for (let i = 0; i < 3; i++) P(g, x + (r() * 8 | 0), y + (r() * 8 | 0), r() < .5 ? lite : dark);
  if (r() < .55) { const px = x + 1 + (r() * 5 | 0), py = y + 2 + (r() * 5 | 0), c = tuft; P(g, px, py, c); P(g, px - 1, py - 1, c); P(g, px + 1, py - 1, c); }
}
function sandCell(g, x, y, r) {
  const t = r(); R(g, x, y, 8, 8, t < .25 ? '#c79a52' : t > .8 ? '#e6c47e' : '#d9b36a');
  for (let i = 0; i < 3; i++) P(g, x + (r() * 8 | 0), y + (r() * 8 | 0), r() < .5 ? '#efd49a' : '#b8863f');
  if (r() < .3) { const px = x + (r() * 5 | 0), py = y + (r() * 6 | 0); R(g, px, py, 3, 1, '#b8863f'); R(g, px + 1, py + 1, 3, 1, '#efd49a'); }
}
function cliff(g, x, y, w, h, r) {
  const top = Math.min(h, 10); shadowRect(g, x, y + 3, w, h - 3); R(g, x - 1, y - 1, w + 2, h + 2, PAL.ol); R(g, x, y, w, h, '#a8552e'); R(g, x, y, w, top, '#e0a064'); R(g, x, y + top - 1, w, 1, '#7a3a20');
  for (let ry = y + top + 4; ry < y + h - 2; ry += 6) R(g, x + (r() * 4 | 0), ry, w - 4, 1, '#8a4527');
  for (let i = 0; i < w / 4; i++) P(g, x + (r() * w | 0), y + (r() * h | 0), '#c77a45'); R(g, x + w - 3, y + top, 3, h - top, '#7a3a20');
}
function trail(g, x0, x1, y0, y1, r, c1, c2) {
  for (let y = y0; y < y1; y++) { const j = (r() * 3 | 0); R(g, x0 + j, y, x1 - x0 - j, 1, y % 6 ? c1 : c2); P(g, x0 + j, y, PAL.dirt0); P(g, x1 - 1, y, PAL.dirt0); if (r() < .1) P(g, x0 + 4 + (r() * (x1 - x0 - 8) | 0), y, PAL.st1); }
}
function flower(g, x, y, r) {
  const c = ['#ffffff', '#ffd84a', '#ff8fb8', '#8fbfff'][r() * 4 | 0];
  P(g, x, y, '#ffd84a'); P(g, x - 1, y, c); P(g, x + 1, y, c); P(g, x, y - 1, c); P(g, x, y + 1, c);
}
function slab(g, x, y, r) {
  R(g, x, y, 16, 16, '#9aa3bb'); R(g, x, y, 16, 1, '#c4cce0'); R(g, x, y, 1, 16, '#c4cce0'); R(g, x + 15, y, 1, 16, '#6d7590'); R(g, x, y + 15, 16, 1, '#6d7590');
  for (let i = 0; i < 6; i++) P(g, x + 2 + (r() * 12 | 0), y + 2 + (r() * 12 | 0), r() < .5 ? '#b3bbd0' : '#858ea8');
  if (r() < .12) { let cx = x + 4, cy = y + 3; for (let i = 0; i < 6; i++) { P(g, cx, cy, '#6d7590'); cx += r() < .5 ? 1 : 0; cy++; } }
  if (r() < .1) { R(g, x + 11, y + 11, 4, 4, PAL.gr1); P(g, x + 12, y + 11, PAL.gr3); P(g, x + 13, y + 13, PAL.gr3); }
}
function tree(g, cx, cy, rad, r, pl) {
  const c0 = pl ? pl[0] : PAL.gr0, c1 = pl ? pl[1] : PAL.gr1, c2 = pl ? pl[2] : PAL.gr2, c3 = pl ? pl[3] : PAL.gr3;
  R(g, cx - 5, cy + rad - 2, 11, 3, PAL.shadow);
  R(g, cx - 3, cy + rad - 5, 7, 8, PAL.ol); R(g, cx - 2, cy + rad - 5, 5, 7, PAL.wood1); R(g, cx + 1, cy + rad - 5, 2, 7, PAL.wood0); P(g, cx - 2, cy + rad - 4, PAL.wood2);
  disc(g, cx, cy, rad + 1, PAL.ol); disc(g, cx, cy, rad, c0); disc(g, cx - 1, cy - 1, rad - 2, c1); disc(g, cx - 2, cy - 2, Math.max(2, rad - 4), c2);
  for (let i = 0; i < rad; i++) { const a = r() * 6.28, d = r() * (rad - 3); R(g, Math.round(cx - 2 + Math.cos(a) * d), Math.round(cy - 3 + Math.sin(a) * d * .7), 2, 1, c3); }
  for (let i = 0; i < rad; i++) P(g, cx - rad + 2 + (r() * (rad * 2 - 3) | 0), cy + rad - 4 + (r() * 3 | 0), c0);
  P(g, cx - rad + 3, cy - 2, PAL.gr4);
}
function shadowRect(g, x, y, w, h) { R(g, x + 4, y + 4, w, h, PAL.shadow); }

function house(g, x, y, w, h, v) {
  const W0 = v.w0 || PAL.wall0, W1 = v.w1 || PAL.wall1, W2 = v.w2 || PAL.wall2;
  const rf = v.rf || (v.roof === 'B' ? [PAL.roofB0, PAL.roofB1, PAL.roofB2] : [PAL.roofR0, PAL.roofR1, PAL.roofR2]);
  shadowRect(g, x, y + 8, w + 2, h - 6);
  // paredes
  R(g, x, y + 20, w, h - 20, W1); R(g, x, y + 20, w, 3, W0);
  for (let i = 0; i < 18; i++) P(g, x + 3 + (i * 7 % (w - 6)), y + 25 + (i * 5 % 12), W2);
  R(g, x, y + 20, 2, h - 20, PAL.wood1); R(g, x + w - 2, y + 20, 2, h - 20, PAL.wood1); R(g, x + (w >> 1) - 1, y + 23, 2, h - 27, PAL.wood0 + '');
  R(g, x + (w >> 1) - 1, y + 23, 2, 6, W1);
  R(g, x, y + h - 5, w, 5, PAL.st1); R(g, x, y + h - 5, w, 1, PAL.st2); for (let i = 0; i < w; i += 7) R(g, x + i, y + h - 4, 1, 4, PAL.st0);
  // porta
  const dx = x + (w >> 1) - 6, dy = y + h - 5 - 17;
  R(g, dx - 1, dy - 2, 14, 19, PAL.wood0); R(g, dx, dy, 12, 17, PAL.wood1); R(g, dx, dy - 1, 12, 1, PAL.wood1);
  g.clearRect(dx - 1, dy - 2, 1, 1); R(g, dx + 1, dy, 1, 17, PAL.wood2); R(g, dx + 6, dy, 1, 17, PAL.wood0); R(g, dx + 10, dy + 8, 1, 2, PAL.gold1);
  R(g, dx - 2, y + h - 4, 16, 3, PAL.st2); R(g, dx - 2, y + h - 2, 16, 1, PAL.st0);
  // janelas
  [x + 7, x + w - 19].forEach(wx => {
    const wy = y + 26;
    R(g, wx - 3, wy, 3, 11, v.shutter); R(g, wx + 12, wy, 3, 11, v.shutter); R(g, wx - 3, wy, 1, 11, mix(v.shutter, '#fff', .3));
    R(g, wx - 1, wy - 1, 14, 13, PAL.wood0); R(g, wx, wy, 12, 11, PAL.wat2); R(g, wx, wy, 12, 4, PAL.wat3);
    R(g, wx + 5, wy, 2, 11, PAL.wood0); R(g, wx, wy + 5, 12, 1, PAL.wood0); P(g, wx + 1, wy + 1, '#fff'); P(g, wx + 2, wy + 2, '#fff');
    R(g, wx - 2, wy + 12, 16, 3, PAL.wood1); R(g, wx - 2, wy + 12, 16, 1, PAL.wood2);
    for (let i = 0; i < 6; i++) { P(g, wx - 1 + i * 3, wy + 11, PAL.gr1); P(g, wx - 1 + i * 3, wy + 10, ['#ff6a8a', '#ffd84a', '#ffffff'][i % 3]); }
  });
  // telhado
  const rx = x - 4, rw = w + 8;
  for (let i = 0; i < 6; i++) {
    const ry = y + i * 3, inset = Math.max(0, 5 - i) * 0 + (5 - i) * 0;
    R(g, rx + inset, ry, rw - inset * 2, 3, i % 2 ? rf[0] : rf[1]);
    for (let sx = (i % 2) * 4; sx < rw; sx += 8) R(g, rx + sx, ry, 1, 3, rf[0]);
    R(g, rx, ry, rw, 1, rf[2]);
  }
  R(g, rx, y + 18, rw, 2, rf[0]); R(g, rx, y + 20, rw, 2, PAL.shadow); R(g, rx, y, rw, 1, rf[2]);
  R(g, rx - 1, y, 1, 20, PAL.ol); R(g, rx + rw, y, 1, 20, PAL.ol); R(g, rx - 1, y - 1, rw + 2, 1, PAL.ol); R(g, rx - 1, y + 20, rw + 2, 1, PAL.ol);
  if (v.style === 'kokiri') [[6,4],[18,9],[34,5],[48,11],[26,14],[10,13]].forEach(([mx,my]) => { R(g, x + mx, y + my, 3, 2, '#ffffff'); P(g, x + mx + 1, y + my + 2, '#d9402f'); });
  if (v.style === 'ranch') { for (let k = 0; k < 15; k++) { P(g, dx + k * 0.8 | 0, dy + k, '#fff'); P(g, dx + 12 - (k * 0.8 | 0), dy + k, '#fff'); } R(g, dx - 1, dy - 2, 14, 1, '#fff'); }
  // chaminé
  R(g, x + w - 18, y - 7, 9, 10, PAL.ol); R(g, x + w - 17, y - 6, 7, 9, PAL.st1); R(g, x + w - 17, y - 6, 7, 2, PAL.st3); R(g, x + w - 12, y - 4, 2, 7, PAL.st0);
  if (v.emblem === 'gear') { disc(g, x + (w >> 1), y + 11, 4, PAL.gold1); disc(g, x + (w >> 1), y + 11, 2, rf[0]); }
  if (v.emblem === 'flag') { R(g, x + (w >> 1), y - 8, 1, 10, PAL.wood1); R(g, x + (w >> 1) + 1, y - 8, 6, 4, '#3fbf6a'); }
}
function fortPost(g, x, y, w, h) {
  shadowRect(g, x, y + 6, w, h - 6); R(g, x - 1, y - 1, w + 2, h + 1, PAL.ol); R(g, x, y + 6, w, h - 6, PAL.st1);
  for (let ry = y + 8; ry < y + h - 4; ry += 6) { R(g, x, ry, w, 1, PAL.st0); for (let bx = (ry / 6 | 0) % 2 * 5; bx < w; bx += 10) R(g, x + bx, ry, 1, 6, PAL.st0); }
  for (let cx = 0; cx < w; cx += 10) { R(g, x + cx, y, 7, 7, PAL.st2); R(g, x + cx, y, 7, 1, PAL.st3); R(g, x + cx + 6, y, 1, 7, PAL.st0); }
  R(g, x, y + h - 5, w, 5, PAL.st0);
  [x + 8, x + w - 17].forEach(bx => { R(g, bx, y + 10, 9, 20, '#2f58a6'); R(g, bx, y + 10, 9, 2, PAL.gold1); R(g, bx + 3, y + 16, 3, 4, PAL.gold1); R(g, bx + 4, y + 20, 1, 3, PAL.gold2); P(g, bx + 3, y + 29, '#2f58a6'); R(g, bx, y + 29, 3, 2, '#2f58a6'); R(g, bx + 6, y + 29, 3, 2, '#2f58a6'); });
  const dx = x + (w >> 1) - 7; R(g, dx - 1, y + h - 24, 16, 24, PAL.ol); R(g, dx, y + h - 23, 14, 23, PAL.wood1); for (let i = 0; i < 14; i += 3) R(g, dx + i, y + h - 23, 1, 23, PAL.wood0);
  R(g, dx, y + h - 17, 14, 2, PAL.st0); R(g, dx, y + h - 8, 14, 2, PAL.st0); R(g, dx + 10, y + h - 13, 2, 2, PAL.gold1);
  R(g, dx - 1, y + h - 26, 16, 3, PAL.st3);
}
function temple(g, x, y, w, h) {
  const cx = x + (w >> 1);
  shadowRect(g, x, y, w, h);
  R(g, x - 7, y + 27, w + 14, 11, PAL.ol); R(g, x - 6, y + 28, w + 12, 9, PAL.st2); R(g, x - 6, y + 28, w + 12, 1, PAL.st3);   // degraus
  R(g, x - 3, y + 33, w + 6, 4, PAL.st1); R(g, x - 3, y + 36, w + 6, 1, PAL.st0);
  R(g, x - 1, y - 1, w + 2, 30, PAL.ol); R(g, x, y, w, 28, PAL.st1);                                                           // parede
  for (let ry = y + 4; ry < y + 27; ry += 5) R(g, x, ry, w, 1, PAL.st0);
  R(g, cx - 10, y + 8, 20, 20, PAL.ol); R(g, cx - 9, y + 9, 18, 19, '#0c1226'); R(g, cx - 8, y + 9, 16, 2, '#0c1226'); R(g, cx - 10, y + 6, 20, 2, PAL.gold1);   // porta
  [x + 4, x + 20, x + w - 28, x + w - 12].forEach(px => {
    R(g, px - 1, y - 1, 10, 30, PAL.ol); R(g, px, y + 3, 8, 22, PAL.st3); R(g, px + 6, y + 3, 2, 22, PAL.st1); R(g, px + 2, y + 3, 1, 22, PAL.st2);
    R(g, px - 1, y, 10, 4, PAL.st2); R(g, px - 1, y, 10, 1, '#fff'); R(g, px - 1, y + 24, 10, 4, PAL.st2); R(g, px, y + 22, 8, 1, PAL.gold1);
  });
  R(g, x - 3, y - 6, w + 6, 7, PAL.ol); R(g, x - 2, y - 5, w + 4, 5, PAL.st3); R(g, x - 2, y - 2, w + 4, 1, PAL.gold1); R(g, x - 2, y - 1, w + 4, 1, PAL.st1);
  for (let i = 0; i < 22; i++) { const hw = Math.round((i + 1) * (w / 2 + 2) / 22); R(g, cx - hw - 1, y - 6 - 22 + i, hw * 2 + 2, 1, PAL.ol); R(g, cx - hw, y - 6 - 22 + i, hw * 2, 1, i < 2 || i > 19 ? PAL.gold1 : PAL.st2); }
  R(g, cx - 12, y - 6 - 5, 24, 4, PAL.st1);
  for (let i = 0; i < 6; i++) R(g, cx - i, y - 6 - 16 + i, 1 + i * 2, 1, PAL.gold1);                                              // triforce no frontão
  for (let i = 0; i < 4; i++) { R(g, cx - 8 - i, y - 6 - 9 + i, 1 + i * 2, 1, PAL.gold1); R(g, cx + 8 - i, y - 6 - 9 + i, 1 + i * 2, 1, PAL.gold1); }
  R(g, cx - 1, y - 6 - 22, 2, 1, PAL.gold2);
}
function ruinPillar(g, x, y, broken, r) {
  shadowRect(g, x, y + 4, 46, 30);
  R(g, x, y + 22, 46, 13, PAL.ol); R(g, x + 1, y + 23, 44, 11, PAL.st1); R(g, x + 1, y + 23, 44, 2, PAL.st3); R(g, x + 1, y + 33, 44, 1, PAL.st0);
  R(g, x + 14, y + 6 + (broken ? 6 : 0), 18, 17 - (broken ? 6 : 0), PAL.ol); R(g, x + 15, y + 5 + (broken ? 6 : 0), 16, 18 - (broken ? 6 : 0), PAL.st2);
  for (let i = 0; i < 4; i++) R(g, x + 17 + i * 4, y + 6 + (broken ? 6 : 0), 1, 16 - (broken ? 6 : 0), PAL.st1);
  R(g, x + 15, y + 5 + (broken ? 6 : 0), 16, 2, PAL.st3);
  if (!broken) { R(g, x + 12, y, 22, 6, PAL.ol); R(g, x + 13, y + 1, 20, 4, PAL.st3); R(g, x + 13, y + 4, 20, 1, PAL.st1); R(g, x + 14, y + 12, 18, 1, PAL.gold1); }
  else { for (let i = 0; i < 6; i++) P(g, x + 15 + (r() * 16 | 0), y + 11, PAL.st3); R(g, x + 3, y + 26, 9, 6, PAL.st2); R(g, x + 3, y + 26, 9, 1, PAL.st3); }
  for (let i = 0; i < 9; i++) P(g, x + 2 + (r() * 42 | 0), y + 24 + (r() * 9 | 0), PAL.gr2);
  R(g, x + 22, y + 30, 6, 2, PAL.gr1);
}
function brickWall(g, x, y, w, h, r) {
  R(g, x - 1, y - 1, w + 2, h + 2, PAL.ol); R(g, x, y, w, h, PAL.st1);
  for (let ry = y; ry < y + h; ry += 5) { R(g, x, ry, w, 1, PAL.st0); for (let bx = ((ry - y) / 5 | 0) % 2 * 5; bx < w; bx += 10) R(g, x + bx, ry, 1, 5, PAL.st0); R(g, x, ry + 1, w, 1, PAL.st2); }
  R(g, x, y, 2, h, PAL.st2); R(g, x + w - 2, y, 2, h, PAL.st0);
  for (let i = 0; i < h / 8; i++) { const mx = x + (r() * (w - 3) | 0), my = y + (r() * h | 0); R(g, mx, my, 3, 2, PAL.gr1); P(g, mx + 1, my, PAL.gr3); }
}
function fence(g, x, y, w) {
  for (let px = x; px < x + w; px += 8) { R(g, px, y - 3, 3, 10, PAL.ol); R(g, px + 1, y - 2, 1, 8, PAL.wood2); }
  R(g, x, y - 1, w, 3, PAL.ol); R(g, x, y, w, 1, PAL.wood2); R(g, x, y + 1, w, 1, PAL.wood0); R(g, x, y + 3, w, 1, PAL.shadow);
}
function bush(g, x, y, w, h, r) {
  const cx = x + (w >> 1), cy = y + (h >> 1) + 1; shadowRect(g, x, y + 4, w, h - 4);
  for (let i = -1; i <= 1; i++) { disc(g, cx + i * 6, cy + Math.abs(i), 7, PAL.ol); }
  for (let i = -1; i <= 1; i++) { disc(g, cx + i * 6, cy + Math.abs(i), 6, PAL.gr0); disc(g, cx + i * 6 - 1, cy + Math.abs(i) - 1, 4, PAL.gr1); }
  for (let i = 0; i < 7; i++) R(g, cx - 10 + (r() * 18 | 0), cy - 5 + (r() * 6 | 0), 2, 1, PAL.gr3);
  P(g, cx - 4, cy, '#ff6a8a'); P(g, cx + 5, cy - 2, '#ffd84a');
}
function lake(g, r) {
  const L = LAKE;
  rr(g, L.x - 5, L.y - 5, L.w + 10, L.h + 10, PAL.dirt1); rr(g, L.x - 4, L.y - 4, L.w + 8, L.h + 8, PAL.dirt2);
  rr(g, L.x - 2, L.y - 2, L.w + 4, L.h + 4, PAL.wat2); rr(g, L.x, L.y, L.w, L.h, PAL.wat1); rr(g, L.x + 5, L.y + 5, L.w - 10, L.h - 10, PAL.wat0);
  for (let i = 0; i < 14; i++) R(g, L.x + 4 + (r() * (L.w - 12) | 0), L.y + 4 + (r() * (L.h - 10) | 0), 3, 1, PAL.wat2);
  [[L.x + 12, L.y + 28], [L.x + 52, L.y + 12]].forEach(([px, py]) => { disc(g, px, py, 3, PAL.gr1); R(g, px, py, 3, 1, PAL.wat0); P(g, px - 1, py - 1, '#ff9fc0'); });
  for (let i = 0; i < 8; i++) { const rx = L.x - 4 + (i * 11) % (L.w + 6), ry = i % 2 ? L.y - 6 : L.y + L.h + 2; R(g, rx, ry - 4, 1, 6, PAL.gr1); R(g, rx + 1, ry - 3, 1, 5, PAL.gr3); R(g, rx + 2, ry - 5, 1, 7, PAL.gr1); R(g, rx + 1, ry - 6, 2, 3, PAL.wood1); }
  R(g, 548, 281, 24, 16, PAL.ol); R(g, 549, 282, 22, 14, PAL.wood2);                                                       // dock sob o baú
  for (let i = 0; i < 22; i += 4) R(g, 549 + i, 282, 1, 14, PAL.wood0); R(g, 549, 295, 22, 1, PAL.wood0); R(g, 549, 282, 22, 1, mix(PAL.wood2, '#fff', .3));
}
function carpet(g) {
  const x = PLAZA_X, y = 170, w = 160, h = 25;
  R(g, x, y, w, h, '#6e2488'); R(g, x, y, w, 2, PAL.gold1); R(g, x, y + h - 2, w, 2, PAL.gold1); R(g, x, y + 2, w, 1, PAL.gold0); R(g, x, y + h - 3, w, 1, PAL.gold0);
  for (let i = 6; i < w - 4; i += 12) { P(g, x + i, y + 12, PAL.gold2); P(g, x + i - 1, y + 12, PAL.gold1); P(g, x + i + 1, y + 12, PAL.gold1); P(g, x + i, y + 11, PAL.gold1); P(g, x + i, y + 13, PAL.gold1); }
  for (let i = 0; i < w; i += 2) { P(g, x + i, y + 5, '#8b3aa8'); P(g, x + i, y + h - 6, '#8b3aa8'); }
}

/* Jardim da Casa Kokiri: canteiro com borda de pedras, flores e arbustinhos, ao lado do caminho da porta. RNG próprio para não alterar o resto do mapa. */
function garden(g) {
  const q = rng(4242), X = 208, Y = 108, W = 34, H = 26;
  R(g, X + 2, Y + H, W - 2, 3, PAL.shadow);                                  // sombra
  rr(g, X, Y, W, H, PAL.dirt0); rr(g, X + 1, Y + 1, W - 2, H - 2, PAL.dirt1);  // terra
  for (let i = 0; i < 26; i++) P(g, X + 3 + (q() * (W - 6) | 0), Y + 3 + (q() * (H - 6) | 0), q() < .5 ? PAL.dirt2 : PAL.dirt0);
  for (let x = X + 2; x < X + W - 2; x += 4) {                                // pedras na borda (cima e baixo)
    [Y, Y + H - 2].forEach(yy => { R(g, x, yy, 3, 2, PAL.st1); R(g, x, yy, 3, 1, PAL.st3); });
  }
  for (let y = Y + 3; y < Y + H - 3; y += 4) [X, X + W - 2].forEach(xx => { R(g, xx, y, 2, 3, PAL.st1); R(g, xx, y, 2, 1, PAL.st3); });
  // fileiras de flores nos cantos e tufos de grama
  for (let i = 0; i < 5; i++) { flower(g, X + 5 + i * 6, Y + 5, q); flower(g, X + 5 + i * 6, Y + H - 6, q); }
  [[X + 5, Y + 11], [X + W - 6, Y + 11], [X + 5, Y + 15], [X + W - 6, Y + 15]].forEach(([fx, fy]) => { R(g, fx - 1, fy, 3, 2, PAL.gr1); flower(g, fx, fy - 1, q); });
  // ponto de pouso: pedra chata sob a coruja
  R(g, X + (W >> 1) - 5, Y + (H >> 1) + 2, 10, 4, PAL.ol); R(g, X + (W >> 1) - 4, Y + (H >> 1) + 2, 8, 3, PAL.st2); R(g, X + (W >> 1) - 4, Y + (H >> 1) + 2, 8, 1, PAL.st3);
}
function bakeWorld() {
  const [c, g] = mk(900, 760), r = rng(1337);
  for (let ty = 0; ty < 95; ty++) for (let tx = 0; tx < 113; tx++) { const z = zoneAt(tx * 8, ty * 8); if (z === 'desert') sandCell(g, tx * 8, ty * 8, r); else if (z !== 'plaza') grassCell(g, tx * 8, ty * 8, z, r); }
  for (let ty = 0; ty < 24; ty++) for (let tx = PLAZA_X / 16 | 0; tx < 57; tx++) slab(g, tx * 16, ty * 16, r);
  // caminho de terra com bordas orgânicas
  let t = 0, b = 0;
  for (let x = 40; x < PLAZA_X; x++) {
    t = Math.max(0, Math.min(3, t + (r() < .2 ? (r() < .5 ? -1 : 1) : 0))); b = Math.max(0, Math.min(3, b + (r() < .2 ? (r() < .5 ? -1 : 1) : 0)));
    const y0 = 165 + t, y1 = 200 - b; R(g, x, y0 - 1, 1, y1 - y0 + 2, PAL.dirt0); R(g, x, y0, 1, y1 - y0, PAL.dirt1);
    R(g, x, y0 + 1, 1, 2, PAL.dirt2 + ''); R(g, x, y1 - 2, 1, 1, PAL.dirt0);
    if (r() < .06) P(g, x, y0 + 3 + (r() * (y1 - y0 - 6) | 0), PAL.st1); if (r() < .05) P(g, x, y0 + 4 + (r() * 20 | 0), PAL.dirt3);
    if (r() < .12) P(g, x, y0 - 1 - (r() * 2 | 0), PAL.gr3);
  }
  [[78, 90], [202, 90]].forEach(([dx, dy]) => { for (let y = dy; y < 168; y++) { const j = (r() * 2 | 0); R(g, dx - 4 + j, y, 9 - j, 1, y % 5 ? PAL.dirt1 : PAL.dirt2); R(g, dx - 4 + j, y, 1, 1, PAL.dirt0); R(g, dx + 4, y, 1, 1, PAL.dirt0); } });
  rr(g, 76, 296, 30, 10, PAL.dirt1);
  trail(g, 336, 364, 200, 470, r, PAL.dirt1, PAL.dirt2); trail(g, 656, 686, 380, 470, r, PAL.dirt1, PAL.dirt2);
  carpet(g); lake(g, r);
  garden(g);   // jardim da Casa Kokiri (onde a Kaepora fica)
  // decoração plana (sem colisão): flores, tufos altos, cogumelos, pedrinhas
  const blocked = (wx, wy) => obstacles.some(o => wx > o.x - 14 && wx < o.x + o.w + 14 && wy > o.y - 14 && wy < o.y + o.h + 14) ||
    (wy > 310 && wy < 420) || (wy > 400 && wy < 960 && (Math.abs(wx - 700) < 50 || Math.abs(wx - 1340) < 50)) || (wx > 1020 && wx < 1200 && wy > 540 && wy < 660) || [...npcs, ...interactables].some(o => Math.hypot(o.x - wx, o.y - wy) < 40);
  for (let i = 0; i < 900; i++) {
    const wx = 60 + r() * 1680, wy = 60 + r() * (WORLD_HEIGHT - 120); if (blocked(wx, wy)) continue;
    const ax = wx / 2 | 0, ay = wy / 2 | 0, z = zoneAt(ax, ay), k = r();
    if (z === 'desert') { if (k < .5) { R(g, ax, ay + 1, 5, 3, PAL.ol); R(g, ax + 1, ay, 4, 3, '#c0713f'); R(g, ax + 1, ay, 4, 1, '#e8a36a'); } else { for (let n = -1; n <= 1; n++) { R(g, ax + n * 2, ay - 3 + Math.abs(n), 1, 4, '#a08a3a'); R(g, ax + n * 2 + 1, ay - 4, 1, 5, '#d8c25a'); } } continue; }
    if (z === 'woods') { if (k < .4) { R(g, ax, ay, 3, 2, '#e8e0d0'); R(g, ax - 1, ay - 2, 5, 2, '#7a4ad0'); P(g, ax, ay - 2, '#fff'); } else if (k < .75) { for (let n = -1; n <= 1; n++) R(g, ax + n * 2, ay - 3 + Math.abs(n), 1, 4, '#3f9a50'); } else { R(g, ax, ay, 6, 4, PAL.wood1); R(g, ax, ay, 6, 2, PAL.wood2); R(g, ax + 1, ay + 1, 4, 1, PAL.wood0); } continue; }
    if (z === 'plaza') { if (k < .5) { R(g, ax, ay, 3, 2, PAL.gr1); P(g, ax + 1, ay, PAL.gr3); } else { R(g, ax, ay, 4, 3, PAL.st1); R(g, ax, ay, 4, 1, PAL.st2); } continue; }
    if (k < .4) { for (let n = 0; n < 4; n++) flower(g, ax + (r() * 8 | 0), ay + (r() * 6 | 0), r); }
    else if (k < .7) { for (let n = -1; n <= 1; n++) { R(g, ax + n * 2, ay - 3 + Math.abs(n), 1, 4, PAL.gr0); R(g, ax + n * 2 + 1, ay - 4, 1, 5, PAL.gr3); } }
    else if (k < .82 && z === 'village') { R(g, ax, ay, 3, 2, '#e8e0d0'); R(g, ax - 1, ay - 2, 5, 2, '#d9402f'); P(g, ax, ay - 2, '#fff'); P(g, ax + 2, ay - 1, '#fff'); }
    else { R(g, ax, ay + 1, 5, 3, PAL.ol); R(g, ax + 1, ay, 4, 3, PAL.st1); R(g, ax + 1, ay, 4, 1, PAL.st3); R(g, ax + 5, ay + 3, 2, 1, PAL.shadow); }
  }
  // objetos, ordenados por y (profundidade)
  const list = obstacles.filter(o => o.type !== 'border' && o.type !== 'treewall').sort((a, b) => a.y - b.y);
  for (const o of list) {
    const x = o.x / 2, y = o.y / 2, w = o.w / 2, h = o.h / 2;
    if (o.type === 'house') house(g, x, y, w, h, o.label.includes('TI') ? { style: 'ranch', roof: 'R', rf: ['#7a1f1a', '#a8302a', '#d9553f'], w0: '#7a1f1a', w1: '#b83a2c', w2: '#d9553f', shutter: '#f4f0e0', emblem: 'gear' } : { style: 'kokiri', rf: ['#2c6b2a', '#3d8a30', '#7ccb4d'], w0: '#7a4a24', w1: '#a8723a', w2: '#c98f50', shutter: '#7ccb4d', emblem: o.label.includes('Saria') ? 'flag' : '' });
    else if (o.type === 'rock') fortPost(g, x, y, w, h);
    else if (o.type === 'temple') temple(g, x, y, w, h);
    else if (o.type === 'pillar') ruinPillar(g, x, y, o.x > 1500, r);
    else if (o.type === 'stonewall') brickWall(g, x, y, w, h, r);
    else if (o.type === 'wtree') tree(g, x + (w >> 1), y + (h >> 1) - 2, 19, r, WOODS_PAL);
    else if (o.type === 'cliff') cliff(g, x, y, w, h, r);
    else if (o.type === 'tree') tree(g, x + (w >> 1), y + (h >> 1) - 2, 20, r);
    else if (o.type === 'fence') fence(g, x, y + 2, w);
    else if (o.type === 'bush') bush(g, x, y, w, h, r);
  }
  // pedestal base
  R(g, 764, 190, 24, 12, PAL.st1); R(g, 764, 190, 24, 2, PAL.st3);
  // paredes de árvores
  obstacles.filter(o => o.type === 'treewall').forEach(o => { for (let ty = o.y / 2; ty < (o.y + o.h) / 2 - 4; ty += 11) tree(g, o.x / 2 + 10 + ((ty / 11 | 0) % 2 ? 2 : -2), ty + 9, 10, r); });
  // bordas: floresta densa em duas fileiras
  for (let i = 0; i < 2; i++) {
    for (let x = i * 7; x < 900; x += 14) { tree(g, x + 4, 8 + i * 8, 9, r); tree(g, x + 4, 752 - i * 7, 9, r, WOODS_PAL); const gap = (x > 312 && x < 388) || (x > 637 && x < 708); if (!gap) tree(g, x + 4, 372 - i * 7, 9, r); }
    for (let y = 10 + i * 6; y < 750; y += 13) { tree(g, 6 + i * 6, y, 9, r); tree(g, 894 - i * 6, y, 9, r); }
  }
  return c;
}
