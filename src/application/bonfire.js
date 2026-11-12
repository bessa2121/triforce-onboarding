// ============================================================================
// 13. FOGUEIRA: descansar, salvar e abrir o dashboard de progresso
//   - Animação: brilho na chama, feixe de luz que sobe e painel que desabrocha a partir dele (curvas suaves)
//   - Dados: acertos por área, combo, desempenho, conclusão, trilha de respostas,
//     tesouros, pontos de revisão e autonomia
// ============================================================================
const BF_AREAS = {
  1: { short: 'TI', name: 'Acessos e TI', focus: 'Revise credenciais, MFA, links de compartilhamento e ferramentas fora da lista oficial.' },
  2: { short: 'Equipe', name: 'Regras implícitas', focus: 'Identifique as regras não ditas da equipe e pratique sua aplicação.' },
  3: { short: 'RH', name: 'Políticas e dados', focus: 'Revise férias, horas, LGPD e conflito de interesses.' },
  4: { short: 'Gestão', name: 'Feedback e prioridades', focus: 'Peça exemplos, exponha conflitos de prioridade e avise cedo sobre erros.' },
  5: { short: 'Seg.', name: 'Segurança da informação', focus: 'Revise os conceitos de proteção de dados e as boas práticas.' },
  6: { short: 'Final', name: 'Desafio integrado', focus: 'Retome as questões com dúvida e registre o que aprendeu.' }
};
// Easter eggs: Triforce quase apagada na marca d'água do pergaminho e uma ocarina quase invisível ao lado do botão (clique: Canção do Tempo).
const BF_TRIFORCE = `<svg class="bf-egg bf-tri" viewBox="0 0 100 90" aria-hidden="true"><g fill="#8a5a1c" stroke="#8a5a1c" stroke-width="1.2" stroke-linejoin="round"><path d="M50 3 74 46H26Z"/><path d="M26 46 50 88H2Z"/><path d="M74 46 98 88H50Z"/></g></svg>`;
const BF_OCARINA = `<button type="button" class="bf-egg bf-ocarina" data-act="bf-ocarina" aria-label="Ocarina"><svg viewBox="0 0 130 74" aria-hidden="true"><path d="M92 37 118 18l8 9-22 24Z" fill="#1d3a75"/><path d="M96 37 117 22l4 5-17 18Z" fill="#2f58a6"/><path d="M8 46C4 28 24 10 52 10c28 0 52 12 58 30 4 12-10 24-30 26-22 2-44 4-60 0C14 64 9 56 8 46Z" fill="#1d3a75"/><path d="M13 45C10 30 28 15 52 15c24 0 46 10 52 25 3 9-8 19-26 21-20 2-40 3-55 0-8-2-13-9-14-16Z" fill="#2f58a6"/><path d="M24 30c8-9 22-12 34-11-14 3-24 8-30 17Z" fill="#8fbfff"/><g fill="#0b1a3a"><circle cx="40" cy="42" r="5"/><circle cx="56" cy="38" r="5"/><circle cx="72" cy="38" r="5"/><circle cx="86" cy="44" r="4"/><circle cx="28" cy="48" r="3.5"/></g><path d="M62 52l6 10h-12Z" fill="#e8b53a"/></svg></button>`;
const bfEsc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function statsState() {
  if (!gameState.stats) gameState.stats = { areas: {}, grid: {}, rests: 0 };
  if (!gameState.stats.areas) gameState.stats.areas = {};
  if (!gameState.stats.grid) gameState.stats.grid = {};
  return gameState.stats;
}
function recordAnswer(n, qi, ok, firstTry) {
  const s = statsState(), a = s.areas[n] || (s.areas[n] = { hits: 0, first: 0, misses: 0 });
  if (ok) { a.hits++; if (firstTry) a.first++; s.grid[n + '-' + qi] = firstTry ? 'f' : 'l'; }
  else a.misses++;
  saveGame();
}

// ---------------------------------------------------------------- descansar
function showGraceBanner(title, sub, ms) {
  const b = document.getElementById('grace-banner'); if (!b) return;
  document.getElementById('gb-title').textContent = title; document.getElementById('gb-sub').textContent = sub;
  b.style.setProperty('--gb-ms', ms + 'ms'); b.classList.remove('show'); void b.offsetWidth; b.classList.add('show');
  setTimeout(() => b.classList.remove('show'), ms + 80);
}
function restAtBonfire(id) {
  if (window.__restBusy) return;
  const o = interactables.find(i => i.id === id); if (!o) return;
  clearGuide(id);
  if (!gameState.bonfires) gameState.bonfires = [];
  const first = !gameState.bonfires.includes(id), s = statsState();
  window.__restBusy = true;
  AudioEngine.playBonfire();
  spawnParticles(o.x, o.y - 14, '#ffd25a', first ? 34 : 18);
  if (first) {
    gameState.bonfires.push(id);
    gameState.xp += 15; updateHUD();
    showGraceBanner('FOGUEIRA ACESA', 'Você descansa e seu progresso é salvo', 2100);
  } else showGraceBanner('DESCANSANDO', 'Seu progresso foi salvo', 1300);
  s.rests++; saveGame();
  if (first) { addRupees(10); unlockAchievement('bonfire', 'Chama Acesa'); }
  setTimeout(() => { window.__restBusy = false; openBonfireDash(o); }, first ? 2000 : 1150);
}

// ---------------------------------------------------------------- dashboard (SVG/HTML)
function bfRing(pct, value, label, color) {
  const r = 30, c = 2 * Math.PI * r, p = Math.max(0, Math.min(1, pct));
  return `<div class="bf-ring"><svg viewBox="0 0 80 80" width="84" height="84"><circle cx="40" cy="40" r="${r}" fill="none" stroke="#cdb27a" stroke-width="9"/><circle cx="40" cy="40" r="${r}" fill="none" stroke="${color}" stroke-width="9" stroke-dasharray="${(c * p).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 40 40)"/><text x="40" y="46" text-anchor="middle" class="bf-ring-v">${bfEsc(value)}</text></svg><span>${bfEsc(label)}</span></div>`;
}
function bfDonut(done, avail, locked) {
  const tot = done + avail + locked, r = 36, c = 2 * Math.PI * r; let off = 0;
  const arc = (n, col) => { if (!n) return ''; const len = c * n / tot, e = `<circle cx="50" cy="50" r="${r}" fill="none" stroke="${col}" stroke-width="16" stroke-dasharray="${len.toFixed(1)} ${(c - len).toFixed(1)}" stroke-dashoffset="${(-off).toFixed(1)}" transform="rotate(-90 50 50)"/>`; off += len; return e; };
  return `<svg viewBox="0 0 100 100" width="118" height="118"><circle cx="50" cy="50" r="${r}" fill="none" stroke="#cdb27a" stroke-width="16"/>${arc(done, '#d99a1e')}${arc(avail, '#2f58a6')}${arc(locked, '#8a7a5a')}<text x="50" y="56" text-anchor="middle" class="bf-ring-v" style="font-size:20px">${done}/${tot}</text></svg>`;
}
function bfLineChart(rows) {
  const W = 540, H = 210, pl = 30, pr = 18, pt = 28, pb = 34, max = 3, n = rows.length;
  const X = (i) => pl + i * (W - pl - pr) / (n - 1), Y = (v) => pt + (H - pt - pb) * (1 - v / max);
  let svg = `<svg viewBox="0 0 ${W} ${H}" class="bf-chart" role="img" aria-label="Acertos por área">`;
  for (let v = 0; v <= max; v++) svg += `<line x1="${pl}" x2="${W - pr}" y1="${Y(v)}" y2="${Y(v)}" stroke="#c7a96b" stroke-width="1"/><text x="${pl - 8}" y="${Y(v) + 4}" text-anchor="end" class="bf-axis">${v}</text>`;
  const path = (key) => { let d = '', pen = false; rows.forEach((r, i) => { if (!r.seen) { pen = false; return; } d += (pen ? 'L' : 'M') + X(i) + ' ' + Y(r[key]) + ' '; pen = true; }); return d; };
  svg += `<path d="${path('misses')}" fill="none" stroke="#b8322e" stroke-width="2" stroke-dasharray="5 4"/><path d="${path('first')}" fill="none" stroke="#d99a1e" stroke-width="3"/>`;
  rows.forEach((r, i) => {
    svg += `<text x="${X(i)}" y="${H - 10}" text-anchor="middle" class="bf-axis">${bfEsc(r.label)}</text>`;
    if (!r.seen) { svg += `<circle cx="${X(i)}" cy="${Y(0)}" r="4" fill="none" stroke="#8a7a5a" stroke-width="2"/>`; return; }
    svg += `<circle cx="${X(i)}" cy="${Y(r.first)}" r="4.5" fill="#d99a1e"/><text x="${X(i)}" y="${Y(r.first) - 11}" text-anchor="middle" class="bf-pt">${r.first}</text>`;
    if (r.misses) svg += `<circle cx="${X(i)}" cy="${Y(r.misses)}" r="3.5" fill="#b8322e"/>`;
  });
  return svg + '</svg>';
}

function renderBonfireDash() {
  const s = statsState(), areas = [1, 2, 3, 4, 5, 6];
  const done = areas.filter(missionDone).length, lockedFinal = !finalUnlocked() && !missionDone(6) ? 1 : 0, avail = 6 - done - lockedFinal;
  const rows = areas.map(n => { const a = s.areas[n] || { hits: 0, first: 0, misses: 0 }; return { n, label: BF_AREAS[n].short, first: a.first, misses: a.misses, seen: !!s.areas[n] }; });
  const acc = gameState.totalAttempts > 0 ? gameState.correctAnswers / gameState.totalAttempts : 0;
  const completion = done / 6, au = autonomyState();
  // quests
  const quests = [1, 2, 3, 4, 5].map(n => `<li class="${missionDone(n) ? 'ok' : ''}"><i></i>${missionDone(n) ? 'Concluído' : 'Falar com'} ${bfEsc(missionNpcName(n))} <small>(${BF_AREAS[n].short})</small></li>`).join('')
    + `<li class="${missionDone(6) ? 'ok' : ''}"><i></i>Desafio Final com a Zelda${finalUnlocked() || missionDone(6) ? '' : ' <small>(após os 5 sábios)</small>'}</li>`
    + `<li class="${(schedState().requests || []).length ? 'ok' : ''}"><i></i>Audiência no Pedestal Central${agendaUnlocked() ? '' : ' <small>(após terminar o jogo)</small>'}</li>`;
  // skill bars
  const bars = areas.map((n, i) => { const a = s.areas[n], pct = a ? Math.round(a.first / 3 * 100) : 0; return `<div class="bf-bar"><div class="trk"><b style="height:${Math.max(pct, 6)}%" class="${i % 2 ? 'b2' : ''}"></b></div><span>${BF_AREAS[n].short}</span></div>`; }).join('');
  // trilha de respostas
  let grid = ''; for (let q = 0; q < 3; q++) for (const n of areas) { const v = s.grid[n + '-' + q]; grid += `<i class="${v === 'f' ? 'f' : v === 'l' ? 'l' : ''}"></i>`; }
  // revisão
  const wrong = areas.filter(n => (s.areas[n] || {}).misses > 0).sort((a, b) => s.areas[b].misses - s.areas[a].misses);
  const pend = areas.filter(n => !missionDone(n) && !wrong.includes(n) && n !== 6);
  let review = wrong.slice(0, 3).map(n => `<tr><td>${bfEsc(BF_AREAS[n].name)}</td><td>${bfEsc(BF_AREAS[n].focus)} <small>(${s.areas[n].misses} erro${s.areas[n].misses > 1 ? 's' : ''})</small></td></tr>`);
  pend.slice(0, 3 - review.length).forEach(n => review.push(`<tr><td>${bfEsc(BF_AREAS[n].name)}</td><td>Ainda não concluído: fale com ${bfEsc(missionNpcName(n))}.</td></tr>`));
  if (!review.length) review = ['<tr><td>Nenhum ponto crítico</td><td>Você respondeu sem tropeços. Continue consultando o Diário (J) quando surgir uma dúvida.</td></tr>'];
  // tesouros
  const nextTier = REWARD_TIERS.find(t => !hasReward(t.id)), rup = gameState.rupees || 0;
  const tpct = nextTier ? Math.min(100, Math.round(rup / nextTier.at * 100)) : 100;
  const items = REWARD_TIERS.filter(t => hasReward(t.id)).map(t => t.name).join(', ') || 'nenhum ainda';
  const lvl = getLevelInfo(gameState.xp);
  const ag = schedState().requests.length ? 'audiência registrada' : (agendaUnlocked() ? 'liberado' : 'bloqueado até terminar o jogo');
  document.getElementById('bonfire-body').innerHTML = `
    ${BF_TRIFORCE}
    <div class="bf-head">
      <div><h2 class="bf-title">DIÁRIO DA FOGUEIRA</h2><div class="bf-sub2">Nv. ${lvl.lvl} &bull; ${bfEsc(lvl.title)} &bull; ${gameState.xp} XP</div></div>
      <div class="bf-owl"><canvas id="bf-owl" width="64" height="64"></canvas><span>Consultas à coruja<br><b>${au.consults}</b></span></div>
    </div>
    <p class="bf-motto">Quem persiste, a longo prazo, sempre vence!<br><small>Cada acerto mostra o caminho. Cada revisão é um novo passo.</small></p>
    <div class="bf-grid">
      <section class="bf-card"><h3>Missões</h3><ul class="bf-quests">${quests}</ul></section>
      <section class="bf-card bf-center"><h3>Progresso do jogo</h3>${bfDonut(done, avail, lockedFinal)}
        <div class="bf-legend"><span class="d1">Concluídas ${done}</span><span class="d2">Disponíveis ${avail}</span>${lockedFinal ? '<span class="d3">Bloqueada 1</span>' : ''}</div></section>
      <section class="bf-card"><h3>Desempenho</h3><div class="bf-rings">
        ${bfRing(Math.min(gameState.streak || 0, 6) / 6, gameState.streak || 0, 'Combo atual', '#d99a1e')}
        ${bfRing(acc, Math.round(acc * 100) + '%', 'Acertos', '#2f8a3a')}
        ${bfRing(completion, Math.round(completion * 100) + '%', 'Jornada', '#2f58a6')}
      </div><div class="bf-note">Melhor combo: x${gameState.bestStreak || 0}</div></section>
    </div>
    <div class="bf-grid two">
      <section class="bf-card"><h3>Acertos por área <small>(de primeira)</small></h3>${bfLineChart(rows)}<div class="bf-legend"><span class="d1">Acertos de primeira</span><span class="d4">Erros</span></div></section>
      <section class="bf-card"><h3>Domínio por área</h3><div class="bf-bars">${bars}</div>
        <h3 style="margin-top:12px">Trilha de respostas</h3><div class="bf-trail">${grid}</div>
        <div class="bf-legend"><span class="d1">De primeira</span><span class="d2">Após erro</span><span class="d5">Pendente</span></div></section>
    </div>
    <section class="bf-card"><h3>Onde você pode melhorar</h3>
      <table class="bf-table"><thead><tr><th>Tema de revisão</th><th>Foco da revisão</th></tr></thead><tbody>${review.join('')}</tbody></table></section>
    <section class="bf-card bf-treasure"><h3>Tesouros e conquistas</h3>
      <div class="bf-rup"><img class="rupee-icon" alt="" src="${UI.rupee()}"><b>${rup}</b> rupias <div class="bf-meter"><i style="width:${tpct}%"></i></div><small>${nextTier ? 'Próximo: ' + bfEsc(nextTier.name) + ' (' + nextTier.at + ')' : 'Todos os marcos alcançados'}</small></div>
      <div class="bf-chips"><span>Itens: ${bfEsc(items)}</span><span>Baús: ${(gameState.collectibles || []).length}/2</span><span>Conquistas: ${(gameState.achievements || []).length}</span><span>Sábios ouvidos: ${sectorsMet()}/5</span><span>Descansos: ${s.rests || 0}</span><span>Pedestal: ${bfEsc(ag)}</span></div></section>
    <div class="bf-actions">${BF_OCARINA}<button class="retro-btn gold" data-act="bf-close">Continuar jornada [Esc]</button></div>`;
  drawPortrait('KAEPORA', 'bf-owl');
  [...document.getElementById('bonfire-body').children].filter(el => !el.classList.contains('bf-egg')).forEach((el, i) => el.style.setProperty('--i', i));   // ordem da cascata de entrada
}

// ---------------------------------------------------------------- abrir/fechar com a animação do feixe
let bfClosing = false, bfOpenTimer = 0;
function openBonfireDash(o) {
  const modal = document.getElementById('bonfire-modal'), panel = document.getElementById('bonfire-panel');
  const cam = window.__cam || { x: 0, y: 0 };
  let fx = (o.x - cam.x) * VS, fy = (o.y - 10 - cam.y) * VS;
  fx = Math.max(60, Math.min(window.innerWidth - 60, fx)); fy = Math.max(120, Math.min(window.innerHeight - 20, fy));
  modal.style.setProperty('--fx', fx + 'px'); modal.style.setProperty('--fy', fy + 'px');
  modal.style.setProperty('--bw', Math.min(window.innerWidth * .92, 940) + 'px');
  renderBonfireDash();
  modal.classList.remove('opening', 'closing'); modal.classList.add('active', 'prep');
  document.getElementById('bonfire-paper').scrollTop = 0;
  requestAnimationFrame(() => {
    const r = panel.getBoundingClientRect();
    panel.style.transformOrigin = (fx - r.left) + 'px ' + (fy - r.top) + 'px';   // o painel desabrocha a partir da chama
    modal.classList.remove('prep'); modal.classList.add('opening');
    AudioEngine.playAgenda();
    clearTimeout(bfOpenTimer);
    bfOpenTimer = setTimeout(() => modal.classList.remove('opening'), 1500);   // libera will-change e animações ao terminar
  });
}
function closeBonfireDash() {
  const modal = document.getElementById('bonfire-modal');
  if (!modal || !modal.classList.contains('active') || bfClosing) return false;
  bfClosing = true; clearTimeout(bfOpenTimer); modal.classList.remove('opening'); modal.classList.add('closing');
  setTimeout(() => { modal.classList.remove('active', 'closing'); bfClosing = false; saveGame(); AudioEngine.playMenu(); }, 400);
  return true;
}
(function wireBonfire() {
  const m = document.getElementById('bonfire-modal'); if (!m) return;
  m.addEventListener('click', (ev) => {
    if (ev.target.closest('[data-act=bf-close]')) closeBonfireDash();
    const oc = ev.target.closest('[data-act=bf-ocarina]');
    if (oc) {   // easter egg: toca a Canção do Tempo e a Triforce da marca d'água brilha por um instante
      AudioEngine.playOcarina();
      oc.classList.remove('play'); void oc.offsetWidth; oc.classList.add('play');
      const tri = m.querySelector('.bf-tri'); if (tri) { tri.classList.add('glow'); clearTimeout(tri._t); tri._t = setTimeout(() => tri.classList.remove('glow'), 2600); }
    }
  });
})();
