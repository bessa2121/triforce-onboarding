/* Spritesheets procedurais: 5 frames (idle, passo A, idle, passo B, piscar) x 4 direções, 18x26 px de arte. */
const CHARS = {
  link:   { skin:'#f5c79c', hair:'#e9c24a', eye:'#243b9a', hat:'link', hatc:'#3b9d4a', sleeve:'#f2ead0', body:'#3b9d4a', trim:'#e8b53a', pants:'#efe3b8', boot:'#7a4a24', belt:'#7a4a24', gear:1 },
  saria:  { skin:'#f5c79c', hair:'#4fcf6a', eye:'#1f8f5a', hs:'bob', dot:1, body:'#3fae4f', trim:'#9be07a', pants:'#f5c79c', belt:'#7a4a24', boot:'#7a5a34' },
  darunia:{ skin:'#a9623c', hair:'#3a2a24', eye:'#201010', hs:'spike', body:'#8a4a2c', trim:'#d98a3a', pants:'#5a3a22', boot:'#3a2a1a', bulk:2, brow:1, dot:1, skin2:1 },
  talon:  { skin:'#f1c19a', hair:'#6a4426', eye:'#2a2a2a', hat:'cap', hatc:'#3a62b4', body:'#e8e0c8', trim:'#3a62b4', pants:'#3a62b4', boot:'#5a3a22', bulk:1, stache:'#6a4426', dot:1, overalls:1 },
  impa:   { skin:'#e3b28c', hair:'#f2f2f6', eye:'#a02828', hs:'long', hat:'band', band:'#c83a3a', emblem:'eye', body:'#5a4aa0', trim:'#e8b53a', dress:1, boot:'#4a2a5a' },
  mido:   { skin:'#f8d2b0', hair:'#d9402f', eye:'#1a1a1a', hs:'spike', dot:1, body:'#4aa04a', trim:'#e8d27a', pants:'#f8d2b0', belt:'#7a4a24', boot:'#7a5a34', brow:1 },
  zelda:  { skin:'#f8d2b0', hair:'#f0cf55', eye:'#3a6ad0', hs:'long', hat:'crown', body:'#f2c2d8', trim:'#fbe27a', emblem:'tri', dress:1, boot:'#b08a3a' }
};
const SHEETS = {};
const ROW = { down: 0, left: 1, right: 2, up: 3 };

function drawChar(g, s, dir, f, blink) {
  g.save(); g.translate(1, 1);
  const b = s.bulk || 0, st = f === 1 ? 1 : f === 3 ? -1 : 0, up = dir === 'up', sd = dir === 'left';
  const sk = s.skin, sk2 = mix(sk, '#7a2a1a', .22), bo = s.body, bo2 = mix(bo, '#0a1030', .3), bo3 = mix(bo, '#ffffff', .28);
  const pants = s.pants || bo2, boot = s.boot, tx = sd ? 5 - b : 4 - b, tw = sd ? 6 + 2 * b : 8 + 2 * b;
  const H = s.hair, H2 = mix(H, '#000000', .25), H3 = mix(H, '#ffffff', .3), hc = s.hatc, hc2 = hc ? mix(hc, '#ffffff', .3) : null;
  // --- pernas / saia
  if (s.dress) {
    for (let i = 0; i < 7; i++) { const hw = 4 + b + (i >> 1); R(g, 8 - hw, 15 + i, hw * 2, 1, i === 6 ? s.trim : (i % 2 ? bo2 : bo)); }
    R(g, 6 + st, 22, 2, 1, boot); R(g, 9 - st, 22, 2, 1, boot);
  } else if (sd) {
    R(g, 6 + st * 2, 18, 3, 3, pants); R(g, 5 + st * 2, 21, 4, 2, boot);
    R(g, 7 - st * 2, 18, 3, 3, mix(pants, '#000000', .25)); R(g, 6 - st * 2, 21, 4, 2, mix(boot, '#000000', .25));
  } else {
    const lh = st > 0 ? 2 : 3, rh = st < 0 ? 2 : 3;
    R(g, 5, 18, 3, lh, pants); R(g, 5, 18 + lh, 3, 2, boot); R(g, 8, 18, 3, rh, pants); R(g, 8, 18 + rh, 3, 2, boot);
  }
  // --- gear nas costas
  if (s.gear && (up || sd)) {
    const sx = up ? 5 : 10; R(g, sx, 11, up ? 6 : 3, 6, '#2e5fb3'); R(g, sx, 13, up ? 6 : 3, 1, PAL.gold1); R(g, sx + 1, 11, 1, 2, '#6f9be0');
    R(g, up ? 11 : 11, 8, 2, 3, PAL.gold1); P(g, up ? 11 : 11, 7, '#cfd8e8');
  }
  // --- tronco
  R(g, tx, 11, tw, s.dress ? 5 : 7, bo); R(g, tx + 1, 11, 2, 1, bo3);
  if (!s.dress) R(g, tx, 17, tw, 1, bo2);
  if (s.overalls) { R(g, tx + 1, 13, tw - 2, 5, pants); if (!sd && !up) { R(g, 5, 11, 1, 2, pants); R(g, 10, 11, 1, 2, pants); P(g, 6, 14, PAL.gold1); P(g, 9, 14, PAL.gold1); } }
  if (s.belt && !s.dress) { R(g, tx, 15, tw, 1, s.belt); if (!sd && !up) R(g, 7, 15, 2, 1, PAL.gold1); }
  if (s.gear && dir === 'down') for (let i = 0; i < 5; i++) P(g, 5 + i, 11 + i, s.belt);
  if (!up && !sd) { R(g, 6, 11, 4, 1, s.trim); R(g, 7, 11, 2, 1, sk2); }
  if (s.emblem === 'tri' && !up && !sd) { P(g, 8, 12, PAL.gold2); P(g, 7, 13, PAL.gold1); P(g, 9, 13, PAL.gold1); R(g, tx, 14, tw, 1, '#8a4ad0'); }
  if (s.emblem === 'eye' && !up && !sd) { R(g, 6, 12, 4, 1, '#c83a3a'); R(g, 7, 13, 2, 1, '#e8e0f0'); P(g, 8, 14, '#c83a3a'); }
  if (s.dress && !up) R(g, tx, 14, tw, 1, s.trim);
  // --- braços
  if (!sd) {
    R(g, tx - 2, 12 + st, 2, 4, s.sleeve || bo); R(g, tx - 2, 16 + st, 2, 2, sk);
    R(g, tx + tw, 12 - st, 2, 4, s.sleeve || bo); R(g, tx + tw, 16 - st, 2, 2, sk);
  } else { R(g, 6 - st, 12, 3, 4, bo3 === bo ? bo : mix(bo, '#ffffff', .12)); R(g, 6 - st, 16, 3, 2, sk); }
  // --- cabeça
  R(g, 3, 2, 10, 9, sk); R(g, 4, 10, 8, 1, sk2);
  g.clearRect(3, 10, 1, 1); g.clearRect(12, 10, 1, 1);
  if (up) {
    R(g, 3, 1, 10, 9, H); R(g, 3, 9, 10, 1, H2); R(g, 5, 2, 3, 1, H3);
    if (s.hs === 'long') { R(g, 3, 10, 10, 5, H); R(g, 3, 14, 10, 1, H2); }
    if (s.hat === 'link') { R(g, 3, 1, 10, 8, hc); R(g, 4, 2, 3, 1, hc2); R(g, 7, 9, 3, 4, hc); R(g, 8, 13, 2, 1, hc); }
    if (s.hat === 'cap') { R(g, 3, 1, 10, 6, hc); R(g, 4, 2, 3, 1, hc2); }
    if (s.hat === 'crown') { R(g, 4, 1, 8, 1, PAL.gold1); P(g, 4, 0, PAL.gold1); P(g, 7, 0, PAL.gold1); P(g, 11, 0, PAL.gold1); }
  } else {
    // cabelo base
    R(g, 3, 1, 10, 3, H); R(g, 5, 1, 3, 1, H3);
    if (sd) { R(g, 7, 3, 6, 6, H); R(g, 12, 8, 1, 1, H2); }
    else {
      R(g, 3, 4, 3, 2, H); R(g, 10, 4, 3, 2, H);
      if (s.hs === 'bob') { R(g, 3, 4, 2, 6, H); R(g, 11, 4, 2, 6, H); R(g, 3, 9, 2, 1, H2); R(g, 11, 9, 2, 1, H2); }
      if (s.hs === 'long') { R(g, 2, 4, 2, 11, H); R(g, 12, 4, 2, 11, H); R(g, 2, 14, 2, 1, H2); R(g, 12, 14, 2, 1, H2); }
      if (s.hs === 'spike') { P(g, 4, 0, H); P(g, 7, 0, H); P(g, 10, 0, H); P(g, 8, 0, H); }
    }
    if (sd && s.hs === 'long') R(g, 8, 4, 5, 11, H);
    if (sd && s.hs === 'bob') R(g, 9, 4, 4, 6, H);
    if (sd && s.hs === 'spike') { P(g, 4, 0, H); P(g, 7, 0, H); P(g, 10, 0, H); }
    // chapéus
    if (s.hat === 'link') {
      R(g, 3, 1, 10, 4, hc); R(g, 5, 0, 6, 1, hc); R(g, 4, 1, 3, 1, hc2); R(g, 3, 4, 10, 1, PAL.gold1);
      if (sd) { R(g, 11, 3, 3, 3, hc); R(g, 12, 6, 2, 4, hc); P(g, 12, 10, hc); } else { R(g, 12, 2, 3, 3, hc); R(g, 13, 5, 2, 3, hc); P(g, 14, 8, hc); }
      if (!sd) { R(g, 4, 5, 2, 1, H); R(g, 9, 5, 3, 1, H); }
    }
    if (s.hat === 'cap') { R(g, 3, 1, 10, 3, hc); R(g, 4, 1, 3, 1, hc2); if (sd) R(g, 0, 4, 8, 1, mix(hc, '#000000', .3)); else R(g, 2, 4, 12, 1, mix(hc, '#000000', .3)); }
    if (s.hat === 'crown') { R(g, 4, 1, 8, 1, PAL.gold1); P(g, 4, 0, PAL.gold1); P(g, 7, 0, PAL.gold1); P(g, 8, 0, PAL.gold1); P(g, 11, 0, PAL.gold1); if (!sd) P(g, 8, 2, '#4aa0e8'); }
    if (s.hat === 'band') { R(g, 3, 3, 10, 1, s.band); if (!sd) P(g, 8, 3, PAL.gold1); }
    // rosto
    if (!sd) {
      if (blink) { R(g, 5, 8, 2, 1, '#3a2418'); R(g, 9, 8, 2, 1, '#3a2418'); }
      else if (s.dot) { R(g, 5, 7, 1, 2, '#1a1a1a'); R(g, 10, 7, 1, 2, '#1a1a1a'); }
      else { R(g, 5, 6, 2, 3, s.eye); R(g, 9, 6, 2, 3, s.eye); P(g, 5, 6, '#ffffff'); P(g, 9, 6, '#ffffff'); }
      if (s.brow) { R(g, 5, 5, 3, 1, '#3a1a10'); R(g, 8, 5, 3, 1, '#3a1a10'); }
      P(g, 4, 8, '#f3a08e'); P(g, 11, 8, '#f3a08e');
      if (s.stache) R(g, 6, 8, 4, 1, s.stache);
      if (s.beard) R(g, 4, 9, 8, 2, s.beard);
    } else {
      if (blink) R(g, 4, 8, 2, 1, '#3a2418'); else if (s.dot) R(g, 4, 7, 1, 2, '#1a1a1a'); else { R(g, 4, 6, 2, 3, s.eye); P(g, 4, 6, '#ffffff'); }
      if (s.brow) R(g, 4, 5, 3, 1, '#3a1a10'); P(g, 2, 7, sk); P(g, 3, 8, '#f3a08e');
      if (s.stache) R(g, 2, 8, 3, 1, s.stache); if (s.beard) R(g, 3, 9, 5, 2, s.beard);
    }
  }
  g.restore();
}
function buildSheets() {
  for (const id in CHARS) {
    const [c, g] = mk(18 * 5, 26 * 4);
    ['down', 'left', 'right', 'up'].forEach((d, row) => {
      for (let f = 0; f < 5; f++) {
        const [t] = mk(18, 26);
        drawChar(t.getContext('2d'), CHARS[id], d === 'right' ? 'left' : d, f === 4 ? 0 : f, f === 4);
        outline(t, PAL.ol);
        if (d === 'right') { g.save(); g.translate(f * 18 + 18, row * 26); g.scale(-1, 1); g.drawImage(t, 0, 0); g.restore(); }
        else g.drawImage(t, f * 18, row * 26);
      }
    });
    SHEETS[id] = c;
  }
  if (typeof buildOwlSheet === 'function') buildOwlSheet();
}
function drawActor(ctx, id, x, y, dir, f, dy) {
  x = Math.round(x / 2) * 2; y = Math.round(y / 2) * 2; dy = dy || 0;
  ctx.fillStyle = PAL.shadow; ctx.fillRect(x - 12, y + 14, 24, 4); ctx.fillRect(x - 10, y + 12, 20, 2); ctx.fillRect(x - 10, y + 18, 20, 2);
  ctx.drawImage(SHEETS[id], f * 18, ROW[dir] * 26, 18, 26, x - 18, y - 36 + dy, 36, 52);
}

/* Sprites dos objetos interativos (16x16 px de arte) */
const ENT = {};
function buildEntitySprites() {
  const make = (fn) => { const [c, g] = mk(18, 18); g.translate(1, 1); fn(g); outline(c, PAL.ol); return c; };
  ENT.sign = make(g => { R(g, 1, 1, 14, 9, PAL.wood2); R(g, 1, 1, 14, 1, mix(PAL.wood2, '#fff', .3)); R(g, 1, 9, 14, 1, PAL.wood1);
    for (let i = 0; i < 3; i++) R(g, 3, 3 + i * 2, 10 - (i === 2 ? 4 : 0), 1, PAL.wood0); R(g, 7, 10, 2, 6, PAL.wood1); R(g, 6, 15, 4, 1, PAL.gr1); });
  const chest = (body, trim, open) => make(g => {
    R(g, 1, 7, 14, 8, body); R(g, 1, 14, 14, 1, mix(body, '#000', .35)); R(g, 1, 7, 14, 1, mix(body, '#fff', .25));
    R(g, 3, 7, 1, 8, trim); R(g, 12, 7, 1, 8, trim);
    if (open) { R(g, 2, 8, 12, 3, '#1a0f08'); R(g, 7, 7, 2, 2, PAL.gold2); R(g, 1, 0, 14, 5, mix(body, '#fff', .12)); R(g, 1, 4, 14, 1, trim); }
    else { R(g, 2, 2, 12, 5, mix(body, '#fff', .12)); R(g, 3, 1, 10, 1, mix(body, '#fff', .12)); R(g, 3, 2, 1, 5, trim); R(g, 12, 2, 1, 5, trim); R(g, 1, 6, 14, 1, trim); R(g, 7, 6, 2, 4, PAL.gold1); P(g, 7, 6, PAL.gold2); }
  });
  ENT.chest = chest(PAL.wood1, PAL.gold1, false); ENT.chestOpen = chest(PAL.wood1, PAL.gold1, true);
  ENT.secret = chest('#5a4aa6', PAL.gold1, false); ENT.secretOpen = chest('#5a4aa6', PAL.gold1, true);
  ENT.pedestal = make(g => { R(g, 0, 8, 16, 3, PAL.st2); R(g, 0, 8, 16, 1, PAL.st3); R(g, 2, 11, 12, 5, PAL.st1); R(g, 2, 15, 12, 1, PAL.st0); R(g, 2, 11, 1, 5, PAL.st2);
    for (let i = 0; i < 3; i++) R(g, 8 - i, 12 + i, 1 + i * 2, 1, PAL.gold1); P(g, 8, 12, PAL.gold2); });
}
