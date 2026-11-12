/* Minimapa: terreno do mundo reduzido + marcadores. M (ou clique) alterna entre pequeno e grande. */
let mmBase = null, mmBig = false;
const MM_REGIONS = [['Kokiri', 290, 400], ['Hyrule', 900, 400], ['Templo', 1500, 400], ['Lost Woods', 450, 1140], ['Gerudo', 1350, 1140]];

function initMinimap() {
  const c = document.getElementById('minimap'); if (!c || !worldLayer) return;
  mmBase = document.createElement('canvas'); mmBase.width = 360; mmBase.height = Math.round(360 * WORLD_HEIGHT / WORLD_WIDTH);
  const g = mmBase.getContext('2d'); g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';
  g.drawImage(worldLayer, 0, 0, worldLayer.width, worldLayer.height, 0, 0, mmBase.width, mmBase.height);
  g.fillStyle = 'rgba(8,12,24,.28)'; g.fillRect(0, 0, mmBase.width, mmBase.height);
  g.font = 'bold 15px monospace'; g.textAlign = 'center';
  MM_REGIONS.forEach(([t, x, y]) => { const px = x / WORLD_WIDTH * mmBase.width, py = y / WORLD_HEIGHT * mmBase.height; g.fillStyle = '#000'; g.fillText(t, px + 1, py + 1); g.fillStyle = '#fbe27a'; g.fillText(t, px, py); });
  c.parentElement.addEventListener('click', toggleMinimap);
}
function toggleMinimap() {
  mmBig = !mmBig;
  const c = document.getElementById('minimap'), w = mmBig ? 420 : 200;
  c.width = w; c.height = Math.round(w * WORLD_HEIGHT / WORLD_WIDTH);
  c.parentElement.classList.toggle('big', mmBig);
}

function drawMinimap(tick) {
  const wrap = document.getElementById('minimap-wrap'), c = document.getElementById('minimap');
  if (!wrap || !c || !mmBase) return;
  const show = !!gameState.started; if ((wrap.style.display !== 'none') !== show) wrap.style.display = show ? 'block' : 'none';
  if (!show) return;
  const g = c.getContext('2d'), sx = c.width / WORLD_WIDTH, sy = c.height / WORLD_HEIGHT;
  g.imageSmoothingEnabled = true; g.drawImage(mmBase, 0, 0, c.width, c.height);
  const dot = (x, y, r, fill, line) => { g.beginPath(); g.arc(x * sx, y * sy, r, 0, 6.283); g.fillStyle = fill; g.fill(); g.lineWidth = 1.5; g.strokeStyle = line || '#10131c'; g.stroke(); };
  const k = mmBig ? 1.5 : 1, pulse = 0.5 + 0.5 * Math.sin(tick * 0.12);
  // campo de visão
  const cam = window.__cam; if (cam) { g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 1; g.strokeRect(cam.x * sx, cam.y * sy, cam.w * sx, cam.h * sy); }
  // pedestal
  const ped = interactables.find(i => i.id === 'pedestal');
  if (ped) { const un = typeof agendaUnlocked === 'function' && agendaUnlocked(); g.save(); g.translate(ped.x * sx, ped.y * sy); g.rotate(Math.PI / 4); const r = (4 + (un ? pulse * 1.5 : 0)) * k; g.fillStyle = un ? '#7fd8ff' : '#6a7686'; g.fillRect(-r / 1.4, -r / 1.4, r * 1.4, r * 1.4); g.strokeStyle = '#10131c'; g.lineWidth = 1.5; g.strokeRect(-r / 1.4, -r / 1.4, r * 1.4, r * 1.4); g.restore(); }
  interactables.filter(i => i.type === 'bonfire').forEach(b => { const lit = (gameState.bonfires || []).includes(b.id); dot(b.x, b.y, (lit ? 3.6 : 3) * k, lit ? (Math.floor(tick / 7) % 2 ? '#ff9a2e' : '#ffd25a') : '#a8693a', '#3a1c08'); });
  // NPCs: pendentes em dourado, concluídos em verde, Kaepora em marrom, Zelda em rosa (cinza até a missão final abrir)
  npcs.forEach(n => {
    const m = NPC_MISSION[n.id];
    if (n.id === 'kaepora') dot(n.x, n.y, 4.2 * k, '#c89a60', '#5a3a20');
    else if (n.id === 'zelda') dot(n.x, n.y, 4.2 * k, finalUnlocked() || missionDone(6) ? '#ff8fd0' : '#8a7f90');
    else dot(n.x, n.y, 3.8 * k, missionDone(m) ? '#52d27a' : '#f4c430');
  });
  // destino marcado pela Kaepora
  const gt = gameState.guideTarget && placePos(gameState.guideTarget);
  if (gt) { g.beginPath(); g.arc(gt.x * sx, gt.y * sy, (6 + pulse * 5) * k, 0, 6.283); g.lineWidth = 2; g.strokeStyle = `rgba(255,90,70,${0.9 - pulse * 0.4})`; g.stroke(); }
  // jogador
  const p = gameState.player; dot(p.x, p.y, 4.6 * k, (Math.floor(tick / 18) % 2) ? '#ffffff' : '#9fe0ff', '#0b4a8f');
}
