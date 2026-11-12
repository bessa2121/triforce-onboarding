/* Retratos de diálogo 32x32 px de arte (exibidos a 64x64). Mesma ficha dos sprites do mundo. */
function portraitKey(sp) {
  const s = (sp || '').toUpperCase();
  for (const k of ['KAEPORA', 'SARIA', 'DARUNIA', 'TALON', 'IMPA', 'MIDO', 'ZELDA']) if (s.includes(k)) return k.toLowerCase();
  return s.includes('NAVI') ? 'navi' : 'link';
}
function portraitArt(g, s) {
  const bg = mix(s.body, '#0a1020', .74); R(g, 0, 0, 32, 32, bg);
  for (let y = 0; y < 32; y++) for (let x = 0; x < 32; x++) if ((x + y) % 2 === 0 && (y > 18 || x < 3 || x > 28)) P(g, x, y, mix(bg, s.body, .14));
  const sk = s.skin, sk2 = mix(sk, '#7a2a1a', .22), H = s.hair, H2 = mix(H, '#000000', .25), H3 = mix(H, '#ffffff', .3), hc = s.hatc;
  if (s.hs === 'long') R(g, 5, 8, 22, 24, H2);
  if (s.hs === 'bob') R(g, 6, 8, 20, 15, H2);
  R(g, 3, 27, 26, 5, s.body); R(g, 3, 27, 26, 1, mix(s.body, '#ffffff', .3)); R(g, 13, 24, 6, 4, sk2); R(g, 12, 27, 8, 1, s.trim); R(g, 14, 27, 4, 1, sk2);
  R(g, 8, 7, 16, 17, sk); g.clearRect(8, 7, 1, 1); g.clearRect(23, 7, 1, 1); g.clearRect(8, 23, 1, 1); g.clearRect(23, 23, 1, 1);
  R(g, 10, 23, 12, 1, sk2); R(g, 7, 14, 1, 4, sk); R(g, 24, 14, 1, 4, sk);
  R(g, 7, 5, 18, 5, H); R(g, 9, 5, 5, 1, H3); R(g, 7, 10, 3, 5, H); R(g, 22, 10, 3, 5, H); R(g, 12, 10, 8, 1, H);
  if (s.hs === 'bob') { R(g, 7, 10, 3, 12, H); R(g, 22, 10, 3, 12, H); }
  if (s.hs === 'long') { R(g, 6, 10, 3, 18, H); R(g, 23, 10, 3, 18, H); }
  if (s.hs === 'spike') for (let x = 8; x < 24; x += 4) R(g, x, 2, 2, 3, H);
  if (s.hs === 'short') R(g, 7, 10, 2, 4, H);
  if (s.bangs) { R(g, 10, 10, 12, 1, H); R(g, 11, 11, 3, 1, H); R(g, 18, 11, 3, 1, H); R(g, 15, 11, 2, 1, H); R(g, 12, 12, 1, 1, H); R(g, 19, 12, 1, 1, H); }
  if (s.hat === 'link') { R(g, 7, 4, 18, 7, hc); R(g, 10, 3, 12, 1, hc); R(g, 9, 5, 5, 1, mix(hc, '#fff', .3)); R(g, 7, 10, 18, 1, PAL.gold1); R(g, 23, 6, 5, 6, hc); R(g, 25, 12, 4, 5, hc); R(g, 12, 11, 3, 2, H); R(g, 18, 11, 4, 2, H); }
  if (s.hat === 'cap') { R(g, 7, 4, 18, 6, hc); R(g, 9, 5, 5, 1, mix(hc, '#fff', .3)); if (s.button) { R(g, 10, 3, 12, 1, hc); R(g, 15, 2, 2, 1, mix(hc, '#fff', .45)); R(g, 6, 10, 20, 2, mix(hc, '#000000', .3)); R(g, 5, 11, 22, 1, mix(hc, '#000000', .45)); R(g, 6, 12, 2, 4, H); R(g, 24, 12, 2, 4, H); } else R(g, 5, 10, 22, 2, mix(hc, '#000000', .3)); }
  if (s.hat === 'crown') { R(g, 9, 5, 14, 2, PAL.gold1); for (const x of [9, 14, 19, 22]) R(g, x, 3, 2, 3, PAL.gold1); R(g, 15, 6, 2, 2, '#4aa0e8'); }
  if (s.hat === 'band') { R(g, 7, 9, 18, 2, s.band); R(g, 15, 9, 2, 2, PAL.gold1); }
  const e2 = mix(s.eye, '#000000', .55);
  if (s.dot) { R(g, 12, 16, 2, 4, '#1a1a1a'); R(g, 19, 16, 2, 4, '#1a1a1a'); }
  else { R(g, 11, 15, 4, 5, s.eye); R(g, 18, 15, 4, 5, s.eye); R(g, 12, 16, 2, 3, e2); R(g, 19, 16, 2, 3, e2); R(g, 11, 15, 2, 2, '#ffffff'); R(g, 18, 15, 2, 2, '#ffffff'); }
  if (s.brow) { R(g, 10, 13, 6, 1, '#3a1a10'); R(g, 17, 13, 6, 1, '#3a1a10'); }
  R(g, 9, 19, 2, 1, '#f3a08e'); R(g, 22, 19, 2, 1, '#f3a08e');
  if (s.emblem === 'tri') { R(g, 15, 29, 2, 1, PAL.gold2); R(g, 14, 30, 4, 1, PAL.gold1); }
  if (s.nose) { R(g, 14, 17, 4, 4, s.nose); R(g, 14, 17, 2, 1, mix(s.nose, '#ffffff', .5)); R(g, 17, 20, 1, 1, mix(s.nose, '#000000', .25)); }
  if (s.bigStache) { R(g, 10, 21, 13, 2, s.stache); R(g, 12, 20, 3, 1, s.stache); R(g, 18, 20, 3, 1, s.stache); R(g, 9, 22, 2, 2, s.stache); R(g, 22, 22, 2, 2, s.stache); R(g, 15, 23, 3, 1, mix(sk, '#7a2a1a', .35)); }
  else if (s.stache) R(g, 13, 21, 7, 1, s.stache);
  if (s.beard) R(g, 10, 21, 13, 3, s.beard);
}
function drawNaviPortrait(g) {
  R(g, 0, 0, 32, 32, '#0b1830');
  for (let y = 0; y < 32; y += 2) for (let x = (y / 2) % 2 * 2; x < 32; x += 4) P(g, x, y, '#12264a');
  disc(g, 16, 16, 11, '#1d4a7a'); disc(g, 16, 16, 9, '#3d86c0'); disc(g, 16, 16, 6, '#8ecae6'); disc(g, 16, 16, 3, '#ffffff');
  R(g, 3, 9, 7, 13, '#d8f0ff'); R(g, 22, 9, 7, 13, '#d8f0ff'); R(g, 4, 10, 5, 3, '#ffffff'); R(g, 23, 10, 5, 3, '#ffffff');
}
function drawPortrait(speaker, canvasId = 'dialog-portrait') {
  const pc = document.getElementById(canvasId); if (!pc) return;
  const [t, g] = mk(34, 34); g.translate(1, 1);
  const k = portraitKey(speaker); if (k === 'navi') drawNaviPortrait(g); else if (k === 'kaepora') drawOwlPortrait(g); else portraitArt(g, CHARS[k]);
  outline(t, PAL.ol);
  const p = pc.getContext('2d'); p.imageSmoothingEnabled = false; p.clearRect(0, 0, 64, 64); p.drawImage(t, 1, 1, 32, 32, 0, 0, 64, 64);
}
