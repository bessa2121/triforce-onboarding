const particles = [];
function spawnParticles(x, y, color = '#f4c430', count = 12) {
  for (let i = 0; i < count; i++) {
    particles.push({
      x, y,
      vx: (Math.random() - 0.5) * 3.5,
      vy: (Math.random() - 0.8) * 3.5,
      life: 28 + Math.random() * 14,
      color
    });
  }
}
let lastAreaName = 'Kokiri Village';

let toastTimeout = null;
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.style.display = 'block';
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.style.display = 'none';
  }, 3500);
}

function currentObjective() {
  if (gameState.victory || missionDone(6)) return { badge: 'JORNADA CONCLUÍDA', title: 'Pedestal Central liberado: peça sua audiência' };
  if (finalUnlocked()) return { badge: 'MISSÃO FINAL', title: 'Fale com a Princesa Zelda no Templo' };
  const pend = pendingMissions().map(missionNpcName);
  const done = 5 - pend.length;
  return { badge: `MISSÕES ${done}/5 • ORDEM LIVRE`, title: 'Faltam: ' + (pend.length > 3 ? pend.slice(0, 3).join(', ') + '...' : pend.join(', ')) };
}

// ---- Recompensas por acertos: rupias, combo e itens por marcos de rupias
const REWARD_TIERS = [
  { id: 'boots', at: 100, name: 'Botas de Pégaso', desc: '+15% de velocidade ao caminhar' },
  { id: 'nayru', at: 300, name: 'Bênção de Nayru', desc: '+25% de XP em cada acerto' },
  { id: 'crown', at: 600, name: 'Título: Mestre das Rupias', desc: 'Honraria no relatório final' }
];
function hasReward(id) { return (gameState.rewards || []).includes(id); }
function addRupees(n) {
  gameState.rupees = (gameState.rupees || 0) + n;
  if (!gameState.rewards) gameState.rewards = [];
  REWARD_TIERS.forEach(t => {
    if (gameState.rupees >= t.at && !gameState.rewards.includes(t.id)) {
      gameState.rewards.push(t.id);
      AudioEngine.playChest();
      spawnParticles(gameState.player.x, gameState.player.y - 10, '#7ef0a0', 26);
      showToast(`Recompensa desbloqueada: ${t.name} (${t.desc})`);
      if (t.id === 'crown') unlockAchievement('rupee_master', 'Mestre das Rupias');
    }
  });
  updateHUD(); saveGame();
}
function rewardCorrect(baseXp, firstTry) {
  gameState.streak = (gameState.streak || 0) + 1;
  gameState.bestStreak = Math.max(gameState.bestStreak || 0, gameState.streak);
  let xp = baseXp + (firstTry ? 10 : 0);
  if (hasReward('nayru')) xp = Math.round(xp * 1.25);
  const rupees = 10 + (firstTry ? 5 : 0) + Math.min(gameState.streak - 1, 5) * 5;
  addXP(xp); addRupees(rupees);
  if (gameState.streak === 5) unlockAchievement('combo5', 'Combo x5');
  return { xp, rupees, first: firstTry, combo: gameState.streak };
}

function getLevelInfo(xp) {
  if (xp >= 650) return { lvl: 5, title: 'Herói de Hyrule', min: 650, max: 900 };
  if (xp >= 450) return { lvl: 4, title: 'Guardião da Triforce', min: 450, max: 650 };
  if (xp >= 280) return { lvl: 3, title: 'Aventureiro Ágil', min: 280, max: 450 };
  if (xp >= 120) return { lvl: 2, title: 'Explorador de Hyrule', min: 120, max: 280 };
  return { lvl: 1, title: 'Recém-chegado', min: 0, max: 120 };
}

function unlockAchievement(id, title) {
  if (!gameState.achievements) gameState.achievements = [];
  if (!gameState.achievements.includes(id)) {
    gameState.achievements.push(id);
    showToast(`🏆 Conquista: ${title}`);
    saveGame();
  }
}

function updateHUD() {
  const rr = document.getElementById('rupee-row');
  if (rr) rr.innerHTML = `<img class="rupee-icon" alt="" src="${UI.rupee()}"><strong class="rupee-count">${gameState.rupees || 0}</strong>` + (gameState.streak >= 2 ? `<span class="combo-badge">Combo x${gameState.streak}</span>` : '');

  document.getElementById('hud-xp').textContent = gameState.xp;
  const lvlInfo = getLevelInfo(gameState.xp);
  const pct = Math.min(100, Math.round(((gameState.xp - lvlInfo.min) / (lvlInfo.max - lvlInfo.min)) * 100));
  const xpFill = document.getElementById('xp-bar-fill');
  if (xpFill) xpFill.style.width = pct + '%';
  const lvlEl = document.getElementById('hud-level');
  if (lvlEl) lvlEl.textContent = `Nv. ${lvlInfo.lvl} • ${lvlInfo.title}`;

  const objInfo = currentObjective();
  const badgeEl = document.getElementById('hud-mission-badge');
  const titleEl = document.getElementById('hud-mission-title');
  if (badgeEl) badgeEl.textContent = objInfo.badge;
  if (titleEl) titleEl.textContent = objInfo.title;

  const triImg = document.getElementById('hud-triforce');
  if (triImg) triImg.src = UI.triforce(gameState.triforce);

  let area = 'Kokiri Village';
  if (gameState.player.y > 760) area = gameState.player.x < 900 ? 'Lost Woods' : 'Gerudo Valley';
  else if (gameState.player.x > 1230) area = 'Temple of Time';
  else if (gameState.player.x > 580) area = 'Hyrule Field';
  document.getElementById('hud-area').textContent = area;

  if (area !== lastAreaName) {
    lastAreaName = area;
    const fade = document.getElementById('region-fade');
    if (fade) {
      fade.style.opacity = '0.45';
      setTimeout(() => { fade.style.opacity = '0'; }, 240);
    }
    AudioEngine.startBGM(area);
  }
}

function addXP(amount, isCorrect = true) {
  AudioEngine.playSuccess();
  spawnParticles(gameState.player.x, gameState.player.y - 10, '#f4c430', 14);
  gameState.xp += amount;
  if (isCorrect) {
    gameState.correctAnswers++;
    gameState.totalAttempts++;
  }
  updateHUD();
  saveGame();
}

const MISSION_LEARNINGS = {
  1: { title: 'Missão 1: Acessos e Ferramentas', lesson: 'Credencial é pessoal, MFA não solicitado é alerta e ferramenta fora da lista oficial é risco.' },
  2: { title: 'Missão 2: Regras Não Ditas', lesson: 'Avise cedo, pergunte com contexto, discorde com proposta e dê crédito.' },
  3: { title: 'Missão 3: Políticas da Empresa', lesson: 'Direito e política andam juntos: alinhe, registre e use os canais oficiais.' },
  4: { title: 'Missão 4: Feedback e Prioridades', lesson: 'Peça feedback específico, transforme-o em combinado e exponha conflitos de prioridade.' },
  5: { title: 'Missão 5: Defesa contra Ataques', lesson: 'Pare, verifique por outro canal e reporte: vale para ligação, porta, pendrive, e-mail e Wi-Fi.' }
};

function completeMission(num) {
  if (!gameState.completedMissions.includes(num)) gameState.completedMissions.push(num);
  const ach = { 1: ['m1', 'Mestre dos Acessos'], 2: ['m2', 'Espírito de Equipe'], 3: ['m3', 'Guardião das Políticas'], 4: ['m4', 'Mente Aberta ao Feedback'], 5: ['m5', 'Sentinela de Hyrule'] }[num];
  if (ach) unlockAchievement(ach[0], ach[1]);
  const sec = { 1: 'ferramentas', 2: 'equipe', 3: 'politicas', 4: 'feedback', 5: 'seguranca' }[num];
  if (sec && !gameState.diaryUnlocked.includes(sec)) gameState.diaryUnlocked.push(sec);
  const info = MISSION_LEARNINGS[num];
  if (info) showToast(`Missão concluída: ${info.title}`);
  const tri = {
    2: ['courage', 'CORAGEM (Equipe & Operação)', 'Você dominou acessos, ferramentas e as regras não ditas da equipe!'],
    3: ['wisdom', 'SABEDORIA (RH & Cultura)', 'Você atravessou o labirinto das políticas da empresa!'],
    4: ['power', 'PODER (Gestão & Liderança)', 'Você entendeu feedback, prioridades e o impacto do seu trabalho!']
  }[num];
  if (tri && !gameState.triforce[tri[0]]) {
    gameState.triforce[tri[0]] = true;
    AudioEngine.playTriforce();
    showTriforceUnlock(tri[1], tri[2]);
  }
  updateHUD();
  saveGame();
}

function showTriforceUnlock(title, desc) {
  document.getElementById('triforce-unlock-title').textContent = `FRAGMENTO DA ${title}`;
  document.getElementById('triforce-unlock-desc').textContent = desc;
  document.getElementById('triforce-unlock-svg').innerHTML = `<img class="pix-big" alt="" src="${UI.triforce(gameState.triforce)}">`;
  document.getElementById('triforce-modal').classList.add('active');
}

function closeTriforceModal() {
  document.getElementById('triforce-modal').classList.remove('active');
}

