/* Ícones da interface em pixel art (data URLs gerados em runtime — nada de emoji, SVG ou imagens externas). */
const UI = (() => {
  const cache = {};
  const fromMap = (rows, pal) => { const [c, g] = mk(rows[0].length, rows.length); rows.forEach((row, y) => [...row].forEach((ch, x) => { if (pal[ch]) P(g, x, y, pal[ch]); })); return c.toDataURL(); };
  const HEART = ['..OOO.OOO..', '.OhhrOrrrO.', 'OhhrrrrrrrO', 'OhrrrrrrrdO', 'OrrrrrrrrdO', '.OrrrrrrdO.', '..OrrrrdO..', '...OrrdO...', '....OdO....', '.....O.....'];
  const SPK = ['....O.......', '...OO...O...', '..OOO....O..', 'OOOOO..O.O..', 'OOOOO..O.O..', 'OOOOO..O.O..', '..OOO....O..', '...OO...O...', '....O.......'];
  const MUTE = ['....O.......', '...OO.......', '..OOO.O...O.', 'OOOOO..O.O..', 'OOOOO...O...', 'OOOOO..O.O..', '..OOO.O...O.', '...OO.......', '....O.......'];
  return {
    heart(full) { const k = 'h' + full; return cache[k] || (cache[k] = fromMap(HEART, full ? { O: '#2a0f14', r: '#e0383a', h: '#ff9aa0', d: '#a01f2e' } : { O: '#1a0c10', r: '#4a3a40', h: '#5c4a52', d: '#3a2c32' })); },
    icon(name) { return fromMap(name === 'mute' ? MUTE : SPK, { O: '#fbe27a' }); },
    triforce(f, lit) {
      const k = 't' + (lit ? 'all' : [f.power, f.wisdom, f.courage].join()); if (cache[k]) return cache[k];
      const [c, g] = mk(22, 17); g.translate(1, 1);
      const tri = (ax, ay, on) => { for (let i = 0; i < 7; i++) { R(g, ax - i, ay + i, 1 + i * 2, 1, on ? (i < 2 ? PAL.gold2 : PAL.gold1) : '#3a3f4a'); } R(g, ax - 6, ay + 6, 13, 1, on ? PAL.gold0 : '#252a33'); };
      tri(10, 0, lit || f.power); tri(5, 8, lit || f.wisdom); tri(15, 8, lit || f.courage);
      outline(c, PAL.ol); return cache[k] = c.toDataURL();
    }
  };
})();
