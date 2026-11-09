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
  1: { badge: 'MISSÃO 1/8 • EQUIPE', title: 'Fale com Saria, Darunia e Talon' },
  2: { badge: 'MISSÃO 2/8 • CULTURA', title: 'Converse com Mido ou Saria' },
  3: { badge: 'MISSÃO 3/8 • FERRAMENTAS', title: 'Abra o Baú de Ferramentas ou fale com Talon' },
  4: { badge: 'MISSÃO 4/8 • SEGURANÇA', title: 'Fale com Impa em Hyrule Field' },
  5: { badge: 'MISSÃO 5/8 • COLABORAÇÃO', title: 'Reúna pistas com Mido, Talon e Saria' },
  6: { badge: 'MISSÃO 6/8 • ORGANIZAÇÃO', title: 'Fale com Saria sobre o Diário' },
  7: { badge: 'MISSÃO 7/8 • IMPACTO', title: 'Fale com Darunia em Hyrule Field' },
  8: { badge: 'MISSÃO FINAL • 8/8', title: 'Fale com a Princesa Zelda no Templo' },
  9: { badge: 'CONCLUÍDO', title: 'Jornada de Onboarding Finalizada!' }
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

  const objInfo = MISSION_OBJECTIVES[gameState.currentMission] || MISSION_OBJECTIVES[9];
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

function loseHeart(reason) {
  AudioEngine.playError();
  gameState.hearts--;
  gameState.totalAttempts++;
  updateHUD();
  if (gameState.hearts <= 0) {
    gameState.hearts = gameState.maxHearts;
    gameState.player.x = 180;
    gameState.player.y = 360;
    updateHUD();
    showToast('Você perdeu todos os corações! Navi te trouxe de volta ao início.');
  } else {
    showToast(reason || 'Resposta incorreta! Você perdeu 1 coração.');
  }
  saveGame();
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
  1: { title: 'Missão 1: Conheça a Equipe', reward: '+120 XP • Rede de Apoio', lesson: 'No trabalho, saber a quem recorrer (RH, Gestor, TI) evita bloqueios e agiliza suas entregas.' },
  2: { title: 'Missão 2: Cultura da Empresa', reward: '+80 XP', lesson: 'Pedir ajuda cedo com contexto mostra maturidade e fortalece a colaboração do time.' },
  3: { title: 'Missão 3: Ferramentas de Trabalho', reward: '+105 XP • Mestre das Ferramentas', lesson: 'Manter tarefas registradas, atualizadas e compartilhadas corretamente evita retrabalho.' },
  4: { title: 'Missão 4: Segurança da Informação', reward: '+100 XP', lesson: 'Sempre verifique o remetente, nunca compartilhe senhas e reporte e-mails suspeitos à Segurança/TI.' },
  5: { title: 'Missão 5: Comunicação e Colaboração', reward: '+105 XP • Fragmento da Coragem', lesson: 'Compartilhar informações e alinhar com colegas transforma esforços individuais em resultados.' },
  6: { title: 'Missão 6: Organização', reward: '+90 XP • Fragmento da Sabedoria', lesson: 'Consultar o guia de integração e organizar prioridades reduz a sobrecarga da primeira semana.' },
  7: { title: 'Missão 7: Entenda seu Impacto', reward: '+100 XP • Fragmento do Poder', lesson: 'Toda tarefa contribui para o objetivo coletivo. Alinhar prazos e pedir feedback acelera seu crescimento.' }
};

function completeMission(num) {
  if (!gameState.completedMissions.includes(num)) {
    gameState.completedMissions.push(num);
  }
  if (gameState.currentMission === num) {
    gameState.currentMission = num + 1;
  }

  if (num === 1) unlockAchievement('m1', 'Rede de Apoio');
  if (num === 3) unlockAchievement('m3', 'Mestre das Ferramentas');
  if (num === 5) unlockAchievement('m5', 'Espírito de Equipe');

  if (num === 1 && !gameState.diaryUnlocked.includes('equipe')) gameState.diaryUnlocked.push('equipe');
  if (num === 3 && !gameState.diaryUnlocked.includes('ferramentas')) gameState.diaryUnlocked.push('ferramentas');
  if (num === 4 && !gameState.diaryUnlocked.includes('politicas')) gameState.diaryUnlocked.push('politicas');
  if (num === 6 && !gameState.diaryUnlocked.includes('pratica')) gameState.diaryUnlocked.push('pratica');

  const info = MISSION_LEARNINGS[num];
  if (info) {
    showToast(`✓ ${info.title} (${info.reward}) — ${info.lesson}`);
  }

  if (num === 5 && !gameState.triforce.courage) {
    gameState.triforce.courage = true;
    AudioEngine.playTriforce();
    showTriforceUnlock('CORAGEM (Equipe & Operação)', 'Você dominou ferramentas, execução e colaboração com a equipe!');
  } else if (num === 6 && !gameState.triforce.wisdom) {
    gameState.triforce.wisdom = true;
    AudioEngine.playTriforce();
    showTriforceUnlock('SABEDORIA (RH & Cultura)', 'Você compreendeu a cultura, políticas de segurança e organização!');
  } else if (num === 7 && !gameState.triforce.power) {
    gameState.triforce.power = true;
    AudioEngine.playTriforce();
    showTriforceUnlock('PODER (Gestão & Liderança)', 'Você entendeu prioridades, feedback e o impacto real do seu trabalho!');
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

