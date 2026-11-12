/* Fogueira estilo "graça": pedras, lenha, chama animada, halo e feixe dourado que sobe ao céu. */
function drawBonfire(o, tick) {
  const x = snap(o.x), y = snap(o.y), t = tick;
  const lit = true, fl = 0.8 + Math.sin(t * .15) * .1 + Math.sin(t * .37) * .05;
  const R2 = (dx, dy, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x + dx, y + dy, w, h); };
  // halo no chão
  let g = ctx.createRadialGradient(x, y + 6, 2, x, y + 6, 78 * fl); g.addColorStop(0, 'rgba(255,200,90,.5)'); g.addColorStop(1, 'rgba(255,200,90,0)');
  ctx.fillStyle = g; ctx.fillRect(x - 90, y - 60, 180, 140);
  // feixe dourado
  const bh = 190; g = ctx.createLinearGradient(0, y - bh, 0, y - 6);
  g.addColorStop(0, 'rgba(255,226,140,0)'); g.addColorStop(.6, 'rgba(255,226,140,.2)'); g.addColorStop(1, 'rgba(255,240,180,.55)');
  ctx.fillStyle = g; ctx.fillRect(x - 7, y - bh, 14, bh - 4);
  ctx.fillStyle = `rgba(255,248,210,${.25 + .1 * Math.sin(t * .1)})`; ctx.fillRect(x - 2, y - bh + 30, 4, bh - 34);
  // sombra e pedras (fundo)
  R2(-22, 8, 44, 10, 'rgba(0,0,0,.28)');
  const stones = [];
  for (let i = 0; i < 10; i++) { const a = i / 10 * 6.283; stones.push([Math.cos(a) * 18, 10 + Math.sin(a) * 7, Math.sin(a)]); }
  const stone = (s) => { R2(s[0] - 4, s[1] - 3, 8, 6, '#2c2f3a'); R2(s[0] - 3, s[1] - 3, 6, 4, '#6f7482'); R2(s[0] - 3, s[1] - 3, 6, 1, '#9aa0b0'); };
  stones.filter(s => s[2] < 0).forEach(stone);
  // lenha cruzada
  R2(-15, 3, 30, 6, '#3a2110'); R2(-14, 3, 28, 4, '#7a4a24'); R2(-14, 3, 28, 1, '#a8723a');
  R2(-11, 0, 22, 6, '#3a2110'); R2(-10, 0, 20, 4, '#8a5a2c'); R2(-10, 0, 20, 1, '#b57d3c');
  // chama
  for (let i = -2; i <= 2; i++) {
    const h = 14 + 10 * (1 - Math.abs(i) / 3) + Math.sin(t * .32 + i * 1.7) * 4;
    R2(i * 4 - 2, -h + 2, 5, h, '#e8742a'); R2(i * 4 - 1, -h * .68 + 2, 3, h * .68, '#f4c430');
  }
  R2(-1, -14 + Math.sin(t * .4) * 2, 3, 12, '#fff3b8');
  // faíscas subindo
  for (let k = 0; k < 7; k++) {
    const ph = (t * .55 + k * 31) % 90, sx = x + Math.sin(k * 2.3 + ph * .07) * 11, sy = y - 12 - ph * 1.7, al = Math.max(0, 1 - ph / 90);
    ctx.fillStyle = `rgba(255,232,150,${al})`; ctx.fillRect(Math.round(sx), Math.round(sy), 2, 2);
  }
  stones.filter(s => s[2] >= 0).forEach(stone);
}
