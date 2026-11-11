/* Arte da Kaepora Gaebora (coruja): sprite 16x24 px de arte (mesma grade 18x26 dos NPCs) e retrato 32x32. */
const OWL = { b: '#8a5a34', b2: '#5a3a20', b3: '#c89a60', cream: '#f2e2b8', gold: '#e8b53a', beak: '#e88a2a', beak2: '#b8601a', scarf: '#3a62b4', scarf2: '#6f9be0', ink: '#1a1a1a' };

function drawOwl(g, dir, blink) {
  g.save(); g.translate(1, 1);
  const c = OWL;
  const eye = (x, y) => { R(g, x, y, 3, 4, c.gold); R(g, x + 1, y + 1, 1, 3, c.ink); P(g, x + 1, y + 1, '#ffffff'); if (blink) { R(g, x, y, 3, 4, c.cream); R(g, x, y + 2, 3, 1, c.ink); } };
  if (dir === 'up') {
    R(g, 4, 21, 3, 2, c.beak2); R(g, 9, 21, 3, 2, c.beak2);
    R(g, 3, 10, 10, 12, c.b); R(g, 1, 11, 3, 9, c.b2); R(g, 12, 11, 3, 9, c.b2);
    for (let y = 12; y < 21; y += 3) { R(g, 5, y, 2, 1, c.b3); R(g, 9, y + 1, 2, 1, c.b3); }
    R(g, 2, 2, 12, 9, c.b); R(g, 2, 0, 2, 3, c.b2); R(g, 12, 0, 2, 3, c.b2); R(g, 4, 3, 3, 1, c.b3);
    R(g, 4, 10, 8, 1, c.scarf); R(g, 7, 11, 2, 3, c.scarf2);
  } else if (dir === 'left') {
    R(g, 5, 21, 3, 2, c.beak2); R(g, 8, 21, 3, 2, c.beak2);
    R(g, 4, 10, 9, 12, c.b); R(g, 3, 13, 3, 8, c.cream); R(g, 7, 11, 5, 9, c.b2); R(g, 7, 18, 5, 2, c.b3); R(g, 12, 17, 3, 5, c.b2);
    R(g, 2, 2, 10, 9, c.b); R(g, 7, 0, 2, 3, c.b2); R(g, 10, 0, 2, 3, c.b2);
    R(g, 3, 4, 7, 5, c.cream); eye(3, 4); R(g, 3, 4, 5, 1, c.b2);
    R(g, 0, 8, 3, 2, c.beak); P(g, 0, 9, c.beak2);
    R(g, 3, 10, 8, 1, c.scarf);
  } else {
    R(g, 4, 21, 3, 2, c.beak); R(g, 9, 21, 3, 2, c.beak); P(g, 4, 22, c.beak2); P(g, 11, 22, c.beak2);
    R(g, 3, 10, 10, 12, c.b); R(g, 1, 11, 3, 9, c.b2); R(g, 12, 11, 3, 9, c.b2); R(g, 1, 19, 3, 2, c.b3); R(g, 12, 19, 3, 2, c.b3);
    R(g, 5, 13, 6, 8, c.cream);
    for (const y of [14, 17, 20]) { P(g, 6, y, c.b3); P(g, 7, y + 1, c.b3); P(g, 8, y + 1, c.b3); P(g, 9, y, c.b3); }
    R(g, 2, 2, 12, 9, c.b); R(g, 2, 0, 2, 3, c.b2); R(g, 12, 0, 2, 3, c.b2);
    R(g, 3, 4, 10, 6, c.cream); eye(4, 4); eye(9, 4);
    R(g, 3, 3, 4, 1, c.b2); R(g, 9, 3, 4, 1, c.b2);          // sobrancelhas sábias
    R(g, 7, 7, 2, 2, c.beak); P(g, 7, 9, c.beak2); P(g, 8, 9, c.beak2);
    R(g, 4, 10, 8, 1, c.scarf); R(g, 7, 11, 2, 2, c.scarf2);
  }
  g.restore();
}

function buildOwlSheet() {
  const [c, g] = mk(18 * 5, 26 * 4);
  ['down', 'left', 'right', 'up'].forEach((d, row) => {
    for (let f = 0; f < 5; f++) {
      const [t] = mk(18, 26);
      drawOwl(t.getContext('2d'), d === 'right' ? 'left' : d, f === 4);
      outline(t, PAL.ol);
      if (d === 'right') { g.save(); g.translate(f * 18 + 18, row * 26); g.scale(-1, 1); g.drawImage(t, 0, 0); g.restore(); }
      else g.drawImage(t, f * 18, row * 26);
    }
  });
  SHEETS.kaepora = c;
}

function drawOwlPortrait(g) {
  const c = OWL, bg = '#241636';
  R(g, 0, 0, 32, 32, bg);
  for (let y = 0; y < 32; y++) for (let x = 0; x < 32; x++) if ((x + y) % 2 === 0 && (y > 18 || x < 3 || x > 28)) P(g, x, y, '#2e1d44');
  R(g, 5, 25, 22, 7, c.b); R(g, 5, 25, 22, 1, c.b3); R(g, 10, 26, 12, 2, c.scarf); R(g, 14, 28, 4, 3, c.scarf2);
  R(g, 4, 4, 24, 22, c.b); R(g, 5, 3, 22, 1, c.b); R(g, 4, 1, 5, 6, c.b2); R(g, 23, 1, 5, 6, c.b2); R(g, 5, 2, 2, 2, c.b3); R(g, 25, 2, 2, 2, c.b3);
  R(g, 7, 8, 18, 14, c.cream); R(g, 9, 7, 14, 1, c.cream); R(g, 9, 22, 14, 1, c.cream);
  R(g, 7, 6, 9, 2, c.b2); R(g, 17, 6, 9, 2, c.b2);
  R(g, 8, 9, 7, 8, c.gold); R(g, 17, 9, 7, 8, c.gold);
  R(g, 9, 10, 5, 6, '#ffffff'); R(g, 18, 10, 5, 6, '#ffffff');
  R(g, 11, 11, 3, 5, c.ink); R(g, 18, 11, 3, 5, c.ink); R(g, 11, 11, 1, 1, '#ffffff'); R(g, 18, 11, 1, 1, '#ffffff');
  R(g, 14, 16, 4, 5, c.beak); R(g, 15, 21, 2, 1, c.beak2); R(g, 14, 16, 4, 1, '#f4b060');
  for (const [x, y] of [[9, 20], [22, 20], [11, 22], [20, 22]]) P(g, x, y, c.b3);
}
