// ============================================================================
// 12. PEDESTAL CENTRAL: agenda real com a liderança (1:1 / Mentoria)
//   - Trava de autonomia (2 NPCs de setor OU 1 consulta à Kaepora Gaebora)
//   - Formulário em pergaminho, Google Calendar / agenda externa / .ics
//   - Registro no estado + "banco" local + webhook opcional + Relatório Final
// ============================================================================
const LOCK_MESSAGE = 'Conclua a jornada e consulte os sábios e a Kaepora Gaebora antes de solicitar uma audiência real.';
let pedestalStepArmed = true;
let pedestalExternalOpened = false;

function schedState() {
  if (!gameState.sched) gameState.sched = { requests: [], autoLocked: false, autoUnlocked: false, draft: { name: '', email: '' } };
  return gameState.sched;
}
function sectorsMet() { return (gameState.met || []).filter(id => AGENDA_CONFIG.sectorNpcs.includes(id)).length; }
function agendaUnlocked() {   // regra: só depois de terminar o jogo (Desafio Final concluído)
  return !!gameState.victory || (gameState.completedMissions || []).includes(6);
}
function markNpcMet(id) {
  if (!AGENDA_CONFIG.sectorNpcs.includes(id)) return;
  if (!gameState.met) gameState.met = [];
  if (!gameState.met.includes(id)) { gameState.met.push(id); saveGame(); notifyAgendaUnlock(); }
}
function notifyAgendaUnlock() {
  const s = schedState();
  if (agendaUnlocked() && !s.noticeShown) {
    s.noticeShown = true; saveGame();
    showToast('Jornada concluída! O Pedestal Central despertou: peça uma audiência real com a liderança (Temple of Time).');
  }
}

// ---------------------------------------------------------------- interação
function pedestalInteract() {
  clearGuide('pedestal');
  if (!agendaUnlocked()) {
    const faltam = [1, 2, 3, 4, 5, 6].filter(n => !missionDone(n)).length;
    startDialog([
      { speaker: 'PEDESTAL CENTRAL', role: 'Temple of Time', text: LOCK_MESSAGE },
      { speaker: 'NAVI', role: 'Guia', text: `O pedestal desperta quando você termina o jogo: ${faltam === 1 ? 'falta 1 missão' : 'faltam ' + faltam + ' missões'}, contando o Desafio Final da Zelda. Em dúvida, a Kaepora Gaebora (Kokiri Village) ajuda no caminho.` }
    ]);
    return;
  }
  openPedestal();
}
function checkPedestalStep() {
  const o = interactables.find(i => i.id === 'pedestal'); if (!o) return;
  const d = Math.hypot(gameState.player.x - o.x, gameState.player.y - o.y);
  if (d > 70) { pedestalStepArmed = true; return; }
  if (d < 22 && pedestalStepArmed) {
    pedestalStepArmed = false;
    const s = schedState(), un = agendaUnlocked();
    if (s.requests.length || (un ? s.autoUnlocked : s.autoLocked)) return;   // pisar abre sozinho só na 1ª vez de cada estado
    if (un) s.autoUnlocked = true; else s.autoLocked = true;
    saveGame(); pedestalInteract();
  }
}

// ---------------------------------------------------------------- datas / links
const pad2 = (n) => String(n).padStart(2, '0');
function parseSlot(dateStr, timeStr) {
  if (!dateStr || !timeStr) return null;
  const [y, m, d] = dateStr.split('-').map(Number), [hh, mm] = timeStr.split(':').map(Number);
  const dt = new Date(y, m - 1, d, hh, mm, 0, 0);
  return isNaN(dt) ? null : dt;
}
const toLocalStamp = (d) => `${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}T${pad2(d.getHours())}${pad2(d.getMinutes())}00`;
const toUtcStamp = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const hm = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
function validateSlot(dt) {
  if (!dt) return 'Escolha a data e o horário desejados.';
  if (dt.getTime() < Date.now() + 15 * 60000) return 'Escolha um horário no futuro.';
  if (!AGENDA_CONFIG.workDays.includes(dt.getDay())) return 'A liderança atende em dias úteis. Escolha outra data.';
  const mins = dt.getHours() * 60 + dt.getMinutes();
  if (mins < hm(AGENDA_CONFIG.workStart) || mins + AGENDA_CONFIG.durationMin > hm(AGENDA_CONFIG.workEnd)) return `Horários disponíveis: ${AGENDA_CONFIG.workStart} às ${AGENDA_CONFIG.workEnd}.`;
  return null;
}
function reqTitle(r) { return `${r.topic}: conversa com ${AGENDA_CONFIG.leaderName}`; }
function reqDetails(r) {
  return [`Solicitante: ${r.name} <${r.email}>`, `Tema: ${r.topic}`, r.note ? `Dúvida: ${r.note}` : '', 'Agendado pelo Hyrule Onboarding Quest (Pedestal Central).'].filter(Boolean).join('\n');
}
function googleCalendarUrl(r) {
  const start = new Date(r.startISO), end = new Date(start.getTime() + AGENDA_CONFIG.durationMin * 60000);
  const p = new URLSearchParams({ action: 'TEMPLATE', text: reqTitle(r), details: reqDetails(r), dates: `${toLocalStamp(start)}/${toLocalStamp(end)}` });
  try { p.set('ctz', Intl.DateTimeFormat().resolvedOptions().timeZone); } catch (e) {}
  const guests = [AGENDA_CONFIG.leaderEmail, r.email].filter(Boolean).join(',');
  if (guests) p.set('add', guests);
  return 'https://calendar.google.com/calendar/render?' + p.toString();
}
function bookingUrl(f) {
  const u = new URL(AGENDA_CONFIG.bookingUrl);
  u.searchParams.set('name', f.name); u.searchParams.set('email', f.email);
  u.searchParams.set('a1', `${f.topic}${f.note ? ': ' + f.note : ''}`);
  if (f.date) { u.searchParams.set('month', f.date.slice(0, 7)); u.searchParams.set('date', f.date); }
  return u.toString();
}
function buildIcs(r) {
  const start = new Date(r.startISO), end = new Date(start.getTime() + AGENDA_CONFIG.durationMin * 60000);
  const esc = (s) => String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Hyrule Onboarding Quest//PT-BR', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'BEGIN:VEVENT',
    `UID:${r.id}@hyrule-onboarding`, `DTSTAMP:${toUtcStamp(new Date())}`, `DTSTART:${toUtcStamp(start)}`, `DTEND:${toUtcStamp(end)}`,
    `SUMMARY:${esc(reqTitle(r))}`, `DESCRIPTION:${esc(reqDetails(r))}`,
    `ATTENDEE;CN=${esc(r.name)};ROLE=REQ-PARTICIPANT:mailto:${r.email}`];
  if (AGENDA_CONFIG.leaderEmail) lines.push(`ATTENDEE;CN=${esc(AGENDA_CONFIG.leaderName)};ROLE=CHAIR:mailto:${AGENDA_CONFIG.leaderEmail}`);
  lines.push('STATUS:TENTATIVE', 'BEGIN:VALARM', 'TRIGGER:-PT15M', 'ACTION:DISPLAY', 'DESCRIPTION:Conversa de alinhamento', 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR');
  return lines.join('\r\n');
}
function downloadIcs(id) {
  const r = schedState().requests.find(x => x.id === id); if (!r || !r.startISO) return;
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([buildIcs(r)], { type: 'text/calendar;charset=utf-8' }));
  a.download = 'conversa-de-alinhamento.ics'; document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}
const fmtSlot = (iso) => { const d = new Date(iso); return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()} às ${pad2(d.getHours())}:${pad2(d.getMinutes())}`; };

// ---------------------------------------------------------------- persistência
function persistRequest(r) {
  try {
    const all = JSON.parse(localStorage.getItem(AGENDA_CONFIG.storeKey) || '[]'); all.push(r);
    localStorage.setItem(AGENDA_CONFIG.storeKey, JSON.stringify(all));
  } catch (e) { console.warn('Banco local de agenda indisponível:', e); }
}
function sendWebhook(r) {
  if (!AGENDA_CONFIG.webhookUrl) return Promise.resolve('skipped');
  return fetch(AGENDA_CONFIG.webhookUrl, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ type: 'agenda_request', leader: AGENDA_CONFIG.leaderName, ...r }) })
    .then(() => 'sent').catch(() => 'failed');
}

// ---------------------------------------------------------------- modal
const pedEl = (id) => document.getElementById(id);
function openPedestal() {
  AudioEngine.playMenu();
  pedestalExternalOpened = false;
  const s = schedState();
  renderPedestal(s.requests.length ? 'status' : 'form');
  pedEl('pedestal-modal').classList.add('active');
}
function closePedestal() {
  const m = pedEl('pedestal-modal'); if (!m || !m.classList.contains('active')) return false;
  m.classList.remove('active'); AudioEngine.playMenu(); return true;
}
function closeHelperModals() { return closePedestal() || closeKaepora() || closeBonfireDash(); }

function renderPedestal(mode, req) {
  const body = pedEl('pedestal-body'), s = schedState(), d = s.draft || {};
  if (mode === 'form') {
    const today = new Date(); const min = `${today.getFullYear()}-${pad2(today.getMonth() + 1)}-${pad2(today.getDate())}`;
    body.innerHTML = `
      <h2 class="sc-title">PEDIDO DE AUDIÊNCIA</h2>
      <p class="sc-sub">Reserve uma conversa 1:1 / mentoria com ${kEsc(AGENDA_CONFIG.leaderName)} para as dúvidas que vão além do jogo.</p>
      <div class="sc-row">
        <label>Seu nome<input id="sc-name" type="text" maxlength="80" autocomplete="name" value="${kEsc(d.name)}"></label>
        <label>Seu e-mail<input id="sc-email" type="email" maxlength="120" autocomplete="email" value="${kEsc(d.email)}"></label>
      </div>
      <label>Tema da dúvida<select id="sc-topic">${AGENDA_CONFIG.topics.map(t => `<option>${kEsc(t)}</option>`).join('')}</select></label>
      <label>Em uma frase, qual é a dúvida? <em>(opcional)</em><textarea id="sc-note" maxlength="200" rows="1"></textarea></label>
      <div class="sc-row">
        <label>Data desejada<input id="sc-date" type="date" min="${min}"></label>
        <label>Horário<input id="sc-time" type="time" step="900" min="${AGENDA_CONFIG.workStart}" max="${AGENDA_CONFIG.workEnd}"></label>
      </div>
      <p class="sc-hint">Atendimento em dias úteis, das ${kEsc(AGENDA_CONFIG.workStart)} às ${kEsc(AGENDA_CONFIG.workEnd)} (${AGENDA_CONFIG.durationMin} min).</p>
      <div id="sc-err" class="sc-err" role="alert"></div>
      <div class="sc-actions">
        <button class="retro-btn gold" data-act="seal">Selar o pergaminho</button>
        <button class="retro-btn primary" data-act="gcal">Abrir no Google Calendar</button>
        ${AGENDA_CONFIG.bookingUrl ? '<button class="retro-btn primary" data-act="external">Abrir agenda do gestor</button>' : ''}
        ${AGENDA_CONFIG.bookingUrl ? '<button class="retro-btn" data-act="sealExternal" id="sc-sealext" style="display:none">Já marquei na agenda externa</button>' : ''}
        <button class="retro-btn" data-act="close">Fechar</button>
      </div>`;
  } else if (mode === 'status') {
    const rows = s.requests.map(r => `<div class="sc-card"><b>${kEsc(r.topic)}</b><br>${r.startISO ? kEsc(fmtSlot(r.startISO)) : 'Horário combinado na agenda externa'}<br><small>${kEsc(r.name)} · ${kEsc(r.email)}</small></div>`).join('');
    const last = s.requests[s.requests.length - 1];
    body.innerHTML = `
      <h2 class="sc-title">AUDIÊNCIAS REGISTRADAS</h2>
      <p class="sc-sub">Você já pediu ${s.requests.length === 1 ? 'uma conversa' : s.requests.length + ' conversas'} com ${kEsc(AGENDA_CONFIG.leaderName)}.</p>
      ${rows}
      <div class="sc-actions">
        ${last.startISO ? `<button class="retro-btn primary" data-act="gcalLast">Google Calendar</button><button class="retro-btn primary" data-act="icsLast">Baixar .ics</button>` : ''}
        <button class="retro-btn gold" data-act="newReq">Nova solicitação</button>
        <button class="retro-btn" data-act="close">Fechar</button>
      </div>`;
  } else if (mode === 'done') {
    body.innerHTML = `
      <div class="sc-done">
        <img class="pix-big sc-tri" alt="Triforce" src="${UI.triforce({}, true)}">
        <h2 class="sc-title">AUDIÊNCIA SELADA!</h2>
        <p class="sc-sub">Você registrou sua primeira conversa de alinhamento. Buscar ajuda no momento certo também é sinal de autonomia.</p>
        <div class="sc-card"><b>${kEsc(req.topic)}</b><br>${req.startISO ? kEsc(fmtSlot(req.startISO)) : 'Horário combinado na agenda externa'}<br><small>com ${kEsc(AGENDA_CONFIG.leaderName)}${req.sent === 'sent' ? ' · pedido enviado à liderança' : ''}</small></div>
        <div class="sc-actions">
          ${req.startISO ? `<button class="retro-btn primary" data-act="gcalLast">Adicionar ao Google Calendar</button><button class="retro-btn primary" data-act="icsLast">Baixar .ics</button>` : ''}
          <button class="retro-btn gold" data-act="close">Continuar jornada</button>
        </div>
      </div>`;
  }
  body.parentElement.scrollTop = 0;
}
function readForm() {
  const v = (id) => (pedEl(id) ? pedEl(id).value.trim() : '');
  return { name: v('sc-name'), email: v('sc-email'), topic: v('sc-topic'), note: v('sc-note'), date: v('sc-date'), time: v('sc-time') };
}
function formError(msg) { const e = pedEl('sc-err'); if (e) e.textContent = msg || ''; if (msg) AudioEngine.playError(); return !msg; }
function validateIdentity(f) {
  if (f.name.length < 2) return 'Informe seu nome.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email)) return 'Informe um e-mail válido.';
  if (!f.topic) return 'Escolha o tema da dúvida.';
  return null;
}
function saveDraft(f) { const s = schedState(); s.draft = { name: f.name, email: f.email }; saveGame(); }

function sealRequest(via) {
  const f = readForm();
  let err = validateIdentity(f), dt = null;
  if (!err && (via === 'jogo' || f.date || f.time)) { dt = parseSlot(f.date, f.time); err = validateSlot(dt); }
  if (!formError(err)) return;
  saveDraft(f);
  const s = schedState(), first = s.requests.length === 0;
  const r = { id: 'ag_' + Date.now().toString(36), createdAt: new Date().toISOString(), name: f.name, email: f.email, topic: f.topic, note: f.note,
    startISO: dt ? dt.toISOString() : null, durationMin: AGENDA_CONFIG.durationMin, leader: AGENDA_CONFIG.leaderName, via, sent: 'skipped', firstAlignment: first };
  s.requests.push(r); persistRequest(r); saveGame();
  sendWebhook(r).then(st => { r.sent = st; saveGame(); });
  // conquista
  AudioEngine.playAgenda();
  spawnParticles(gameState.player.x, gameState.player.y - 10, '#fbe27a', 36);
  if (first) { gameState.xp += 50; updateHUD(); }
  unlockAchievement('alinhamento', 'Primeira Conversa de Alinhamento');
  showToast('Audiência registrada! Ela aparecerá no Relatório Final da Princesa Zelda.');
  saveGame();
  const card = pedEl('pedestal-modal').querySelector('.scroll-card'); card.classList.remove('burst'); void card.offsetWidth; card.classList.add('burst');
  renderPedestal('done', r);
}

(function wirePedestal() {
  const modal = pedEl('pedestal-modal'); if (!modal) return;
  modal.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-act]'); if (!b) return;
    const act = b.dataset.act, s = schedState(), last = s.requests[s.requests.length - 1];
    if (act === 'close') closePedestal();
    else if (act === 'seal') sealRequest('jogo');
    else if (act === 'sealExternal') sealRequest('agenda_externa');
    else if (act === 'newReq') { AudioEngine.playMenu(); renderPedestal('form'); }
    else if (act === 'gcalLast' && last) window.open(googleCalendarUrl(last), '_blank', 'noopener');
    else if (act === 'icsLast' && last) downloadIcs(last.id);
    else if (act === 'gcal') {
      const f = readForm(), dt = parseSlot(f.date, f.time);
      let err = validateIdentity(f) || validateSlot(dt);
      if (!formError(err)) return;
      saveDraft(f);
      window.open(googleCalendarUrl({ id: 'draft', name: f.name, email: f.email, topic: f.topic, note: f.note, startISO: dt.toISOString() }), '_blank', 'noopener');
      showToast('Evento aberto no Google Calendar. Para registrar no jogo, sele o pergaminho.');
    } else if (act === 'external') {
      const f = readForm(), err = validateIdentity(f);
      if (!formError(err)) return;
      saveDraft(f); window.open(bookingUrl(f), '_blank', 'noopener');
      pedestalExternalOpened = true; const x = pedEl('sc-sealext'); if (x) x.style.display = '';
    }
  });
})();

// ---------------------------------------------------------------- relatório final
function getFinalReport() {
  const a = autonomyState(), s = schedState(), first = s.requests[0];
  return {
    gerado_em: new Date().toISOString(),
    autonomia: {
      consultas_kaepora: a.consults, visitas_kaepora: a.visits, buscas_digitadas: a.searches,
      topicos_consultados: a.entries.slice(), categorias_exploradas: a.categories.slice(),
      destinos_marcados_no_mapa: a.routes.slice(), buscas_sem_resposta: a.misses.slice(),
      sabios_consultados: (gameState.met || []).filter(id => AGENDA_CONFIG.sectorNpcs.includes(id))
    },
    agenda_lideranca: {
      agendou_primeira_conversa: !!first,
      primeira_conversa: first ? { tema: first.topic, horario: first.startISO, via: first.via } : null,
      total_pedidos: s.requests.length
    },
    progresso: { missoes: (gameState.completedMissions || []).length, xp: gameState.xp, acertos: gameState.correctAnswers }
  };
}
function reportCards() {
  const r = getFinalReport(), au = r.autonomia, ag = r.agenda_lideranca;
  const autLevel = au.consultas_kaepora + au.sabios_consultados.length >= 4 ? 'Alta' : (au.consultas_kaepora + au.sabios_consultados.length >= 2 ? 'Boa' : 'Em desenvolvimento');
  const talk = ag.agendou_primeira_conversa
    ? `agendou sua primeira conversa de alinhamento (${kEsc(ag.primeira_conversa.tema)}${ag.primeira_conversa.horario ? ', ' + fmtSlot(ag.primeira_conversa.horario) : ''}).`
    : 'ainda não agendou. O Pedestal Central, abaixo da Zelda, segue disponível.';
  return `
    <div class="vic-wide"><span class="vic-k">Autonomia (Kaepora Gaebora)</span><p>${au.consultas_kaepora} consulta(s) em ${au.topicos_consultados.length} tópico(s) • ${au.sabios_consultados.length} sábio(s) consultado(s) • nível: <b>${autLevel}</b></p></div>
    <div class="vic-wide"><span class="vic-k">Conversa com a liderança</span><p>${talk}</p></div>`;
}
function copyReport() {
  const txt = JSON.stringify(getFinalReport(), null, 2);
  const done = () => showToast('Relatório copiado para a área de transferência.');
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done).catch(() => window.prompt('Copie o relatório:', txt));
  else window.prompt('Copie o relatório:', txt);
}
function closeVictory() { document.getElementById('victory-modal').classList.remove('active'); }
window.getFinalReport = getFinalReport;
