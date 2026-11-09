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

const MISSION_OBJECTIVES = {
  0: { badge: 'COMEÇO • TUTORIAL', title: 'Leia a Placa de Kokiri (E)' },
  1: { badge: 'MISSÃO 1/6 • KOKIRI VILLAGE', title: 'Fale com Talon (TI) na Oficina' },
  2: { badge: 'MISSÃO 2/6 • HYRULE FIELD', title: 'Fale com Mido ou abra o Baú de Ferramentas' },
  3: { badge: 'MISSÃO 3/6 • LOST WOODS', title: 'Passagem ao sul do campo: fale com Saria' },
  4: { badge: 'MISSÃO 4/6 • GERUDO VALLEY', title: 'Atravesse a floresta e fale com Darunia' },
  5: { badge: 'MISSÃO 5/6 • TEMPLE OF TIME', title: 'Suba a passagem ao norte: fale com Impa' },
  6: { badge: 'MISSÃO FINAL • 6/6', title: 'Fale com a Princesa Zelda no Templo' },
  7: { badge: 'CONCLUÍDO', title: 'Jornada de Onboarding Finalizada!' }
};

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
  const hc = document.getElementById('hearts-container');
  hc.innerHTML = '';
  for (let i = 0; i < gameState.maxHearts; i++) {
    const full = i < gameState.hearts;
    hc.innerHTML += `<img class="heart-icon" alt="" src="${UI.heart(full)}">`;
  }

  document.getElementById('hud-xp').textContent = gameState.xp;
  const lvlInfo = getLevelInfo(gameState.xp);
  const pct = Math.min(100, Math.round(((gameState.xp - lvlInfo.min) / (lvlInfo.max - lvlInfo.min)) * 100));
  const xpFill = document.getElementById('xp-bar-fill');
  if (xpFill) xpFill.style.width = pct + '%';
  const lvlEl = document.getElementById('hud-level');
  if (lvlEl) lvlEl.textContent = `Nv. ${lvlInfo.lvl} • ${lvlInfo.title}`;

  const objInfo = MISSION_OBJECTIVES[gameState.currentMission] || MISSION_OBJECTIVES[7];
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

const CHECKPOINT = { 'Kokiri Village': [180, 360], 'Hyrule Field': [700, 400], 'Lost Woods': [700, 800], 'Gerudo Valley': [1340, 800], 'Temple of Time': [1400, 400] };
function loseHeart(reason) {
  AudioEngine.playError();
  gameState.hearts--;
  gameState.totalAttempts++;
  if (gameState.hearts <= 0) {
    gameState.hearts = gameState.maxHearts;
    const c = CHECKPOINT[lastAreaName] || CHECKPOINT['Kokiri Village'];
    gameState.player.x = c[0]; gameState.player.y = c[1];
    updateHUD(); saveGame();
    showToast('Você perdeu todos os corações! Navi te levou ao posto da região. Revise o Diário (J) e tente de novo.');
    return true;
  }
  updateHUD();
  showToast(reason || 'Resposta incorreta! Você perdeu 1 coração.');
  saveGame();
  return false;
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
  1: { title: 'Missão 1: Acessos e Ferramentas', reward: '+140 XP • Mestre dos Acessos', lesson: 'Credencial é pessoal, MFA não solicitado é alerta e ferramenta fora da lista oficial é risco.' },
  2: { title: 'Missão 2: Regras Não Ditas', reward: '+140 XP • Fragmento da Coragem', lesson: 'Avise cedo, pergunte com contexto, discorde com proposta e dê crédito.' },
  3: { title: 'Missão 3: Políticas da Empresa', reward: '+140 XP • Fragmento da Sabedoria', lesson: 'Direito e política andam juntos: alinhe, registre e use os canais oficiais.' },
  4: { title: 'Missão 4: Feedback e Prioridades', reward: '+140 XP • Fragmento do Poder', lesson: 'Peça feedback específico, transforme-o em combinado e exponha conflitos de prioridade.' },
  5: { title: 'Missão 5: Defesa contra Ataques', reward: '+140 XP', lesson: 'Pare, verifique por outro canal e reporte: vale para ligação, porta, pendrive, e-mail e Wi-Fi.' }
};

function completeMission(num) {
  if (!gameState.completedMissions.includes(num)) gameState.completedMissions.push(num);
  if (gameState.currentMission === num) gameState.currentMission = num + 1;
  const ach = { 1: ['m1', 'Mestre dos Acessos'], 2: ['m2', 'Espírito de Equipe'], 3: ['m3', 'Guardião das Políticas'], 4: ['m4', 'Mente Aberta ao Feedback'], 5: ['m5', 'Sentinela de Hyrule'] }[num];
  if (ach) unlockAchievement(ach[0], ach[1]);
  const sec = { 1: 'ferramentas', 2: 'equipe', 3: 'politicas', 4: 'feedback', 5: 'seguranca' }[num];
  if (sec && !gameState.diaryUnlocked.includes(sec)) gameState.diaryUnlocked.push(sec);
  const info = MISSION_LEARNINGS[num];
  if (info) showToast(`Missão concluída: ${info.title} (${info.reward}) — ${info.lesson}`);
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

