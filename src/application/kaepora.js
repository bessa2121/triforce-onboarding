// ============================================================================
// 11. KAEPORA GAEBORA: Mentor de Autonomia e Central de Ajuda (FAQ interativo)
//   1) Busca/menu sobre a base assets/data/knowledge-base.json
//   2) Triagem: indica qual NPC/setor procurar e em que direção do mapa ele está
//   3) Métrica silenciosa de autonomia em gameState.autonomy (vai ao relatório final)
// ============================================================================
let KB = null;
const kView = { mode: 'home', q: '', cat: null, entry: null };

function loadKnowledgeBase() {
  return fetch('assets/data/knowledge-base.json')
    .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then(j => { KB = j; return j; })
    .catch(e => { console.warn('Base de conhecimento indisponível:', e); KB = null; });
}
const kbReady = loadKnowledgeBase();

const kEsc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const kNorm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

// ---------------------------------------------------------------- localização
function regionAt(x, y) {
  if (y > 760) return x < 900 ? 'Lost Woods' : 'Gerudo Valley';
  if (x > 1230) return 'Temple of Time';
  if (x > 580) return 'Hyrule Field';
  return 'Kokiri Village';
}
function placePos(id) {
  const o = npcs.find(n => n.id === id) || interactables.find(i => i.id === id);
  return o ? { x: o.x, y: o.y, name: o.name } : null;
}
const COMPASS = ['leste', 'sudeste', 'sul', 'sudoeste', 'oeste', 'noroeste', 'norte', 'nordeste'];
function routeInfo(id) {
  const pos = placePos(id); if (!pos) return null;
  const meta = (KB && KB.places && KB.places[id]) || {};
  const p = gameState.player, dx = pos.x - p.x, dy = pos.y - p.y, dist = Math.hypot(dx, dy);
  const dir = COMPASS[(Math.round(Math.atan2(dy, dx) / (Math.PI / 4)) + 8) % 8];
  const steps = Math.max(1, Math.round(dist / 36));
  const reg = regionAt(pos.x, pos.y), here = regionAt(p.x, p.y);
  let direction;
  if (dist < 90) direction = 'Está bem pertinho de você.';
  else if (reg === here) direction = `Daqui, siga para ${dir}: cerca de ${steps} passos.`;
  else direction = `Fica em ${reg}. Em linha reta no mapa, é para ${dir} (cerca de ${steps} passos), mas siga o caminho indicado abaixo.`;
  return { id, label: meta.label || pos.name, where: meta.where || ('em ' + reg), how: meta.how || '', direction };
}

// ---------------------------------------------------------------- métricas (silenciosas)
function autonomyState() {
  if (!gameState.autonomy) gameState.autonomy = { visits: 0, consults: 0, entries: [], categories: [], searches: 0, misses: [], routes: [], first: null, last: null };
  return gameState.autonomy;
}
function trackVisit() { const a = autonomyState(), t = Date.now(); a.visits++; if (!a.first) a.first = t; a.last = t; saveGame(); }
function trackConsult(entry) {
  const a = autonomyState(), t = Date.now(); a.consults++; a.last = t; if (!a.first) a.first = t;
  if (entry.id && !a.entries.includes(entry.id)) a.entries.push(entry.id);
  if (entry.category && !a.categories.includes(entry.category)) a.categories.push(entry.category);
  saveGame();
  if (a.consults === 1) { unlockAchievement('autonomy', 'Aprendiz Autônomo'); }
  if (typeof notifyAgendaUnlock === 'function') notifyAgendaUnlock();
}
function trackSearch(q, found) {
  const a = autonomyState(); a.searches++;
  if (!found && q.trim()) { a.misses.push(q.trim().slice(0, 60)); if (a.misses.length > 10) a.misses.shift(); }
  saveGame();
}

// ---------------------------------------------------------------- busca
const STOP = new Set(['de', 'da', 'do', 'das', 'dos', 'a', 'o', 'as', 'os', 'e', 'em', 'um', 'uma', 'que', 'para', 'por', 'como', 'com', 'no', 'na', 'eu', 'meu', 'minha', 'se', 'ao', 'qual', 'quais', 'posso', 'preciso']);
function wordHit(text, tok) {
  if (tok.length >= 4) return text.includes(tok);
  return new RegExp('(^|[^a-z0-9])' + tok.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '($|[^a-z0-9])').test(text);
}
function searchKB(q) {
  if (!KB) return [];
  const nq = kNorm(q).trim(); if (!nq) return [];
  const toks = nq.split(/[^a-z0-9:\-]+/).filter(t => t.length >= 2 && !STOP.has(t));
  if (!toks.length) return [];
  const res = [];
  KB.entries.forEach(e => {
    const title = kNorm(e.title), ans = kNorm(e.answer), kws = (e.keywords || []).map(kNorm);
    let sc = 0;
    if (nq.length >= 3 && (kws.some(k => k === nq) || title.includes(nq))) sc += 5;
    toks.forEach(t => {
      if (kws.some(k => k === t)) sc += 6;
      else if (kws.some(k => (t.length >= 3 && k.includes(t)) || (k.length >= 4 && t.includes(k)))) sc += 4;
      if (wordHit(title, t)) sc += 3;
      if (wordHit(ans, t)) sc += 1;
    });
    if (sc >= 2) res.push({ e, sc });
  });
  return res.sort((a, b) => b.sc - a.sc).slice(0, 6).map(r => r.e);
}

function nextStepEntry() {
  const m = gameState.currentMission, Q = QUIZ[m];
  if (m === 0) return { id: 'next_step', title: 'Qual é o meu próximo passo?', category: 'jornada', npc: 'board_kokiri', answer: 'Leia a Placa de Kokiri, logo à frente da sua casa (tecla E). Ela inicia a sua jornada.', tip: 'Depois disso, fale com Talon na Oficina TI.' };
  if (Q) return { id: 'next_step', title: 'Qual é o meu próximo passo?', category: 'jornada', npc: Q.npc, answer: `Sua missão atual é "${Q.title}". ${Q.hint}`, tip: m === 2 ? 'O Baú de Ferramentas, ao sul de Hyrule Field, também abre este desafio.' : 'Se errar, leia a explicação e consulte o Diário (J).' };
  return { id: 'next_step', title: 'Qual é o meu próximo passo?', category: 'jornada', npc: 'pedestal', answer: 'Você concluiu todas as missões! Se ainda houver dúvidas além do jogo, peça uma audiência real com a liderança no Pedestal Central.', tip: 'Chegue com a dúvida em uma frase.' };
}

// ---------------------------------------------------------------- UI
function kaeporaEl(id) { return document.getElementById(id); }
function openKaepora() {
  AudioEngine.playOwl();
  trackVisit();
  kView.mode = 'home'; kView.q = ''; kView.cat = null; kView.entry = null; kView.list = null;
  drawPortrait('KAEPORA', 'kaepora-portrait');
  kaeporaEl('kaepora-q').value = '';
  renderKaeporaChips(); renderKaeporaView();
  kaeporaEl('kaepora-modal').classList.add('active');
  setTimeout(() => { try { kaeporaEl('kaepora-q').focus({ preventScroll: true }); } catch (e) {} }, 60);
}
function closeKaepora() {
  const m = kaeporaEl('kaepora-modal'); if (!m || !m.classList.contains('active')) return false;
  m.classList.remove('active'); AudioEngine.playMenu(); return true;
}
function renderKaeporaChips() {
  const box = kaeporaEl('kaepora-chips'); if (!box) return;
  const cats = KB ? KB.categories : [];
  box.innerHTML = cats.map(c => `<button class="k-chip${kView.cat === c.id ? ' on' : ''}" data-act="cat" data-id="${kEsc(c.id)}" title="${kEsc(c.desc || '')}">${kEsc(c.label)}</button>`).join('') +
    `<button class="k-chip next" data-act="next">Qual é o meu próximo passo?</button>`;
}
function renderKaeporaView() {
  const v = kaeporaEl('kaepora-view'); if (!v) return;
  if (!KB) {
    v.innerHTML = `<div class="k-owl-line">Hoo... não consegui abrir meus pergaminhos (assets/data/knowledge-base.json). Abra o jogo por um servidor http e recarregue. Enquanto isso, o Diário (J) tem o resumo das regras.</div>`;
    return;
  }
  if (kView.mode === 'home') {
    v.innerHTML = `<div class="k-owl-line">${kEsc(KB.owl.greeting)}</div>`;
  } else if (kView.mode === 'results') {
    const list = kView.list || [];
    const title = kView.cat ? (KB.categories.find(c => c.id === kView.cat) || {}).label : `Resultados para "${kView.q}"`;
    v.innerHTML = `<div class="k-owl-line">${list.length ? kEsc(title) + ': escolha uma pergunta.' : kEsc(KB.owl.empty)}</div>` +
      list.map(e => `<button class="k-item" data-act="entry" data-id="${kEsc(e.id)}"><span>${kEsc(e.title)}</span><small>${kEsc((KB.categories.find(c => c.id === e.category) || {}).label || '')}</small></button>`).join('') +
      (list.length ? '' : `<button class="k-item" data-act="entry" data-id="conversa_lideranca"><span>Quero conversar com a liderança (1:1 ou mentoria)</span><small>Processos</small></button>`);
  } else if (kView.mode === 'entry') {
    const e = kView.entry, r = e.npc ? routeInfo(e.npc) : null;
    let status = '';
    if (e.npc === 'pedestal' && typeof agendaUnlocked === 'function') status = `<div class="k-status">${agendaUnlocked() ? 'O Pedestal está liberado para você.' : 'O Pedestal ainda está bloqueado: converse com 2 sábios ou consulte-me mais uma vez.'}</div>`;
    v.innerHTML = `
      <div class="k-answer"><h3>${kEsc(e.title)}</h3><p>${kEsc(e.answer)}</p>${e.tip ? `<p class="k-tip"><b>Dica:</b> ${kEsc(e.tip)}</p>` : ''}</div>
      ${r ? `<div class="k-route"><h4>Onde procurar</h4><p><b>${kEsc(r.label)}</b>, ${kEsc(r.where)}.</p><p>${kEsc(r.direction)}</p>${r.how ? `<p class="k-how">${kEsc(r.how)}</p>` : ''}${status}
        <button class="retro-btn gold" data-act="mark" data-id="${kEsc(r.id)}">Marcar no mapa</button></div>` : ''}
      <button class="retro-btn" data-act="back">Voltar</button>`;
  }
  v.scrollTop = 0;
}
function kaeporaShowEntry(e) {
  AudioEngine.playMenu();
  trackConsult(e);
  kView.mode = 'entry'; kView.entry = e; renderKaeporaView();
}
function kaeporaSearch(q) {
  kView.q = q; kView.cat = null;
  const list = searchKB(q);
  trackSearch(q, list.length > 0);
  kView.mode = 'results'; kView.list = list;
  renderKaeporaChips(); renderKaeporaView();
}
function kaeporaCategory(id) {
  AudioEngine.playMenu();
  const a = autonomyState(); if (!a.categories.includes(id)) { a.categories.push(id); saveGame(); }
  kView.cat = id; kView.q = ''; kaeporaEl('kaepora-q').value = '';
  kView.mode = 'results'; kView.list = KB.entries.filter(e => e.category === id);
  renderKaeporaChips(); renderKaeporaView();
}
function kaeporaMark(placeId) {
  const a = autonomyState(); if (!a.routes.includes(placeId)) a.routes.push(placeId);
  gameState.guideTarget = placeId; saveGame();
  closeKaepora();
  const r = routeInfo(placeId);
  showToast(`Marquei ${r ? r.label : 'o destino'} no mapa: siga a seta dourada.`);
}
function clearGuide(id) { if (gameState.guideTarget === id) { gameState.guideTarget = null; saveGame(); } }

(function wireKaepora() {
  const modal = kaeporaEl('kaepora-modal'); if (!modal) return;
  modal.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-act]'); if (!b) return;
    const act = b.dataset.act, id = b.dataset.id;
    if (act === 'cat') kaeporaCategory(id);
    else if (act === 'next') { kView.list = null; kaeporaShowEntry(nextStepEntry()); }
    else if (act === 'entry') { const e = KB.entries.find(x => x.id === id); if (e) kaeporaShowEntry(e); }
    else if (act === 'mark') kaeporaMark(id);
    else if (act === 'back') { kView.mode = kView.list ? 'results' : 'home'; renderKaeporaView(); }
    else if (act === 'search') { const q = kaeporaEl('kaepora-q').value; if (q.trim()) kaeporaSearch(q); }
    else if (act === 'close') closeKaepora();
  });
  kaeporaEl('kaepora-q').addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') { ev.preventDefault(); const q = ev.target.value; if (q.trim()) kaeporaSearch(q); }
  });
})();
