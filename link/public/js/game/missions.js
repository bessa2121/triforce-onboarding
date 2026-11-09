// ============================================================================
// 6. INTERAÇÕES E AS 7 MISSÕES + MISSÃO FINAL
// ============================================================================
function tryInteract() {
  const px = gameState.player.x;
  const py = gameState.player.y;

  for (const npc of npcs) {
    const dist = Math.hypot(px - npc.x, py - npc.y);
    if (dist < 62) {
      handleNPCInteraction(npc.id);
      return;
    }
  }

  for (const obj of interactables) {
    const dist = Math.hypot(px - obj.x, py - obj.y);
    if (dist < 62) {
      handleObjectInteraction(obj.id);
      return;
    }
  }

  showToast('Aproxime-se de um personagem ou objeto para interagir.');
}

function handleObjectInteraction(id) {
  if (id === 'board_kokiri') {
    if (gameState.currentMission === 0) {
      startDialog([
        { speaker: 'PLACA DE KOKIRI', role: 'Aviso do Reino', text: 'Bem-vindo a Hyrule! Leste: Hyrule Field e Temple of Time. Fale com Saria (RH) ao norte para começar sua jornada.' },
        { speaker: 'NAVI', role: 'Guia', text: 'Muito bem! Você aprendeu a se mover e interagir. Agora abra seu Diário (J) ou fale com Saria para iniciar a Missão 1!' }
      ], () => {
        addXP(50);
        completeMission(0);
      });
    } else {
      startDialog([{ speaker: 'PLACA DE KOKIRI', role: 'Mapa', text: 'Oeste: Kokiri Village | Centro: Hyrule Field | Leste: Temple of Time.' }]);
    }
  } else if (id === 'board_hyrule') {
    startDialog([{ speaker: 'PLACA DE HYRULE FIELD', role: 'Orientação', text: 'Norte: Posto de Gestão (Darunia) e Segurança (Impa) | Sul: Baú de Ferramentas e Lago.' }]);
  } else if (id === 'board_temple') {
    startDialog([{ speaker: 'PLACA DO TEMPLO', role: 'Temple of Time', text: 'Aqui reside a Princesa Zelda. Conquiste os 3 Fragmentos da Triforce para enfrentar o Desafio Final.' }]);
  } else if (id === 'chest_tools') {
    if (gameState.currentMission === 3) {
      openMinigameTools();
    } else {
      startDialog([{ speaker: 'NAVI', role: 'Guia', text: 'Este baú contém o simulador de ferramentas da Missão 3!' }]);
    }
  } else if (id.startsWith('chest_secret')) {
    const obj = interactables.find(o => o.id === id);
    if (!gameState.collectibles) gameState.collectibles = [];
    if (gameState.collectibles.includes(obj.item)) {
      startDialog([{ speaker: 'BAÚ', role: 'Tesouro', text: `Você já coletou "${obj.item}" deste baú!` }]);
    } else {
      AudioEngine.playChest();
      gameState.collectibles.push(obj.item);
      addXP(obj.xp);
      unlockAchievement('explorer', 'Explorador de Baús');
      startDialog([{ speaker: 'TESOURO ENCONTRADO!', role: 'Item Colecionável', text: `Você encontrou "${obj.item}" (+${obj.xp} XP)! Veja seus itens na Bolsa.` }]);
    }
  } else if (id === 'pedestal') {
    if (gameState.currentMission >= 8 && gameState.triforce.wisdom && gameState.triforce.power && gameState.triforce.courage) {
      startDialog([{ speaker: 'NAVI', role: 'Guia', text: 'A Triforce brilha! Fale com a Princesa Zelda logo acima para iniciar o Desafio Final!' }]);
    } else {
      startDialog([{ speaker: 'PEDESTAL DA TRIFORCE', role: 'Temple of Time', text: 'Reúna os 3 Fragmentos da Triforce (Sabedoria, Poder e Coragem) para despertar este pedestal.' }]);
    }
  }
}

function handleNPCInteraction(id) {
  const m = gameState.currentMission;

  if (m === 1) {
    if (id === 'saria' && !gameState.m1.benefits) {
      gameState.m1.benefits = true;
      addXP(40);
      startDialog([
        { speaker: 'SARIA', role: 'RH / People', text: 'Olá, Link! Eu cuido de Benefícios, Integração e Cultura. Sempre que tiver dúvidas sobre vale-transporte, férias ou regras de convivência, pode contar comigo!' }
      ], checkM1Complete);
      return;
    }
    if (id === 'darunia' && !gameState.m1.priorities) {
      gameState.m1.priorities = true;
      addXP(40);
      startDialog([
        { speaker: 'DARUNIA', role: 'Gestor / Liderança', text: 'Ei, novato! Eu sou seu Gestor. Se não souber o que priorizar no dia ou precisar de direcionamento nas entregas, fale comigo!' }
      ], checkM1Complete);
      return;
    }
    if (id === 'talon' && !gameState.m1.tech) {
      gameState.m1.tech = true;
      addXP(40);
      startDialog([
        { speaker: 'TALON', role: 'TI / Suporte Técnico', text: 'Opa! Problemas com senha, acesso aos sistemas ou computador travando? Eu sou da equipe de TI e resolvo isso para você!' }
      ], checkM1Complete);
      return;
    }
    startDialog([{ speaker: 'NAVI', role: 'Guia', text: 'Missão 1: Encontre os 3 responsáveis! Falta falar com: ' +
      [!gameState.m1.benefits ? 'Saria (RH)' : '', !gameState.m1.priorities ? 'Darunia (Gestor)' : '', !gameState.m1.tech ? 'Talon (TI)' : ''].filter(Boolean).join(', ') }]);
    return;
  }

  if (m === 2 && (id === 'mido' || id === 'saria')) {
    startDialog([
      {
        speaker: 'MIDO',
        role: 'Colega de Equipe',
        text: 'Ei, Link! Aqui no reino temos costumes que não estão escritos em nenhum pergaminho. Como você deve agir quando travar em uma tarefa há mais de 30 minutos?',
        choices: [
          {
            label: 'A) Tentar esconder o problema até o final do prazo.',
            action: () => {
              loseHeart('Esconder bloqueios atrasa toda a equipe.');
            }
          },
          {
            label: 'B) Pedir ajuda de forma clara explicando o que já tentou.',
            action: () => {
              addXP(80);
              startDialog([
                { speaker: 'SARIA', role: 'RH / People', text: 'Exato! Pedir ajuda cedo com contexto mostra maturidade e agiliza o trabalho de todos. Missão 2 concluída!' }
              ], () => completeMission(2));
            }
          }
        ]
      }
    ]);
    return;
  }

  if (m === 3 && id === 'talon') {
    startDialog([
      { speaker: 'TALON', role: 'TI / Suporte', text: 'Hora de treinar nas ferramentas do reino sem medo de errar! Vá até o Baú de Ferramentas em Hyrule Field (ou clique aqui para abrir o simulador).' ,
        choices: [
          { label: 'Abrir Simulador de Ferramentas agora', action: () => openMinigameTools() },
          { label: 'Vou explorar até o baú primeiro', action: () => {} }
        ]
      }
    ]);
    return;
  }

  if (m === 4 && id === 'impa') {
    startDialog([
      {
        speaker: 'IMPA',
        role: 'Segurança e Políticas',
        text: 'Link, atenção! (Conteúdo demonstrativo de política fictícia): Você recebeu um pergaminho urgente de "Rei_Hyrule_Suporte@gmail.com" pedindo sua senha do portal e uma planilha confidencial. O que fazer?',
        choices: [
          {
            label: 'A) Enviar rápido para não atrasar o suporte.',
            action: () => loseHeart('E-mail suspeito (phishing)! Nunca compartilhe senhas ou dados confidenciais.')
          },
          {
            label: 'B) Não clicar, verificar o remetente oficial e reportar à Segurança/TI.',
            action: () => {
              addXP(100);
              startDialog([
                { speaker: 'IMPA', role: 'Segurança', text: 'Perfeito! Proteger os dados do reino é responsabilidade de todos. Missão 4 concluída!' }
              ], () => completeMission(4));
            }
          }
        ]
      }
    ]);
    return;
  }

  if (m === 5) {
    if (id === 'mido' && !gameState.m5.mido) {
      gameState.m5.mido = true;
      addXP(35);
      startDialog([{ speaker: 'MIDO', role: 'Colega', text: 'Pista 1/3: Eu tenho os dados de campo de Kokiri! Compartilhe com a equipe.' }], checkM5Complete);
      return;
    }
    if (id === 'talon' && !gameState.m5.talon) {
      gameState.m5.talon = true;
      addXP(35);
      startDialog([{ speaker: 'TALON', role: 'TI', text: 'Pista 2/3: Eu liberei o painel compartilhado para vocês unirem os dados!' }], checkM5Complete);
      return;
    }
    if (id === 'saria' && !gameState.m5.saria) {
      gameState.m5.saria = true;
      addXP(35);
      startDialog([{ speaker: 'SARIA', role: 'RH', text: 'Pista 3/3: Eu organizei a reunião de alinhamento. Juntos somos mais fortes!' }], checkM5Complete);
      return;
    }
    startDialog([{ speaker: 'NAVI', role: 'Guia', text: 'Missão 5: Reúna as 3 pistas conversando com Mido, Talon e Saria!' }]);
    return;
  }

  if (m === 6 && id === 'saria') {
    startDialog([
      {
        speaker: 'SARIA',
        role: 'RH / People',
        text: 'Na primeira semana recebemos muita informação! Por isso seu Diário de Jornada organiza tudo em etapas. Qual aba do Diário guarda as regras de proteção de dados?',
        choices: [
          { label: 'A) Políticas e Responsabilidades', action: () => { addXP(90); completeMission(6); showToast('Missão 6 concluída! Sabedoria desbloqueada!'); } },
          { label: 'B) Apenas o mapa de Kokiri', action: () => loseHeart('Consulte seu Diário (J) para confirmar onde ficam as políticas!') }
        ]
      }
    ]);
    return;
  }

  if (m === 7 && id === 'darunia') {
    openImpactChainModal();
    return;
  }

  if (m === 8 && id === 'zelda') {
    openFinalChallengeModal();
    return;
  }

  const npc = npcs.find(n => n.id === id);
  startDialog([{
    speaker: npc.name.toUpperCase(),
    role: npc.role,
    text: `Olá, Link! Continue explorando Hyrule e siga as orientações da Navi para avançar na sua missão atual.`
  }]);
}

function checkM1Complete() {
  if (gameState.m1.benefits && gameState.m1.priorities && gameState.m1.tech) {
    startDialog([{ speaker: 'NAVI', role: 'Guia', text: 'Incrível! Você descobriu quem é quem em Hyrule: RH (Saria), Gestor (Darunia) e TI (Talon). Missão 1 concluída!' }], () => completeMission(1));
  }
}

function checkM5Complete() {
  if (gameState.m5.mido && gameState.m5.talon && gameState.m5.saria) {
    startDialog([{ speaker: 'NAVI', role: 'Guia', text: 'Você colaborou com toda a equipe e uniu as 3 pistas! Missão 5 concluída!' }], () => completeMission(5));
  }
}

// ============================================================================
// 7. MINIGAME (MISSÃO 3), CADEIA DE IMPACTO (MISSÃO 7) E DESAFIO FINAL
// ============================================================================
let toolStep = 0;
function openMinigameTools() {
  toolStep = 0;
  renderToolMinigame();
  document.getElementById('minigame-modal').classList.add('active');
}

function renderToolMinigame() {
  const steps = [
    { title: '1. Registrar Tarefa', desc: 'Selecione a ação correta para iniciar uma demanda no sistema:', ok: 'Criar card com título claro e prazo', bad: 'Anotar apenas em um papel solto' },
    { title: '2. Atualizar Progresso', desc: 'Você concluiu metade da tarefa. O que fazer?', ok: 'Mover card para "Em Andamento" e comentar', bad: 'Deixar parado até terminar tudo' },
    { title: '3. Compartilhar Documento', desc: 'Precisa enviar o relatório para Darunia revisar:', ok: 'Compartilhar link com permissão de leitura/edição', bad: 'Mandar arquivo desatualizado sem aviso' }
  ];
  const s = steps[toolStep];
  document.getElementById('minigame-body').innerHTML = `
    <h2 class="modal-title">TREINAMENTO DE FERRAMENTAS (${toolStep + 1}/3)</h2>
    <p class="modal-subtitle">${s.title}: ${s.desc}</p>
    <div class="dialog-choices">
      <button class="choice-btn" onclick="answerTool(true)">✓ ${s.ok}</button>
      <button class="choice-btn" onclick="answerTool(false)">✗ ${s.bad}</button>
    </div>
    <p style="margin-top:12px; color:#8ecae6; font-size:18px;">Navi: "Este é um ambiente seguro para praticar!"</p>
  `;
}

window.answerTool = function(correct) {
  if (!correct) {
    loseHeart('Na ferramenta, manter registros claros e compartilhados evita retrabalho.');
    return;
  }
  addXP(35);
  toolStep++;
  if (toolStep >= 3) {
    document.getElementById('minigame-modal').classList.remove('active');
    completeMission(3);
    showToast('Missão 3 concluída! Você dominou as ferramentas!');
  } else {
    renderToolMinigame();
  }
};

function openImpactChainModal() {
  document.getElementById('minigame-body').innerHTML = `
    <h2 class="modal-title">CADEIA DE IMPACTO DO SEU TRABALHO</h2>
    <div class="impact-chain">
      <div class="impact-node"><strong>1. Tarefa de Link</strong><br>Organizar o relatório de estoque</div>
      <div class="impact-arrow">➜</div>
      <div class="impact-node"><strong>2. Uso pela Equipe</strong><br>Talon e Mido planejam entregas</div>
      <div class="impact-arrow">➜</div>
      <div class="impact-node"><strong>3. Resultado para Hyrule</strong><br>Vilas abastecidas no prazo!</div>
    </div>
    <div class="diary-entry">
      <strong>Feedback de Darunia (Gestor):</strong><br>
      • <strong>Pontos fortes:</strong> Comunicação clara e organização.<br>
      • <strong>Onde melhorar:</strong> Sempre validar prazos antes de iniciar.<br>
      • <strong>Impacto:</strong> Sua entrega destravou o trabalho de toda a equipe!
    </div>
    <div style="text-align:center; margin-top:12px;">
      <button class="retro-btn gold" onclick="finishM7()">Receber Fragmento do Poder</button>
    </div>
  `;
  document.getElementById('minigame-modal').classList.add('active');
}

window.finishM7 = function() {
  document.getElementById('minigame-modal').classList.remove('active');
  addXP(100);
  completeMission(7);
};

function openFinalChallengeModal() {
  document.getElementById('minigame-body').innerHTML = `
    <h2 class="modal-title">MISSÃO FINAL: O DESAFIO DE HYRULE</h2>
    <p class="modal-subtitle">Princesa Zelda: "Link, você recebeu uma missão urgente, mas está sem acesso à ferramenta e o prazo é curto. Como você resolve?"</p>
    <div class="dialog-choices">
      <button class="choice-btn" onclick="resolveFinal(false)">A) Esperar alguém notar que estou sem acesso e não avisar ninguém.</button>
      <button class="choice-btn" onclick="resolveFinal(true)">B) Pedir acesso ao Talon (TI), alinhar prioridade com Darunia (Gestor), consultar o Diário e colaborar com a equipe.</button>
    </div>
  `;
  document.getElementById('minigame-modal').classList.add('active');
}

window.resolveFinal = function(ok) {
  if (!ok) {
    loseHeart('Em situações reais, comunique bloqueios rápido e acione os responsáveis certos!');
    return;
  }
  document.getElementById('minigame-modal').classList.remove('active');
  addXP(200);
  completeMission(8);
  unlockAchievement('hyrule_hero', 'Herói do Primeiro Dia');
  gameState.victory = true;
  gameState.elapsedSeconds = Math.floor((Date.now() - gameState.startTime) / 1000);
  saveGame();
  showVictoryScreen();
};

function showVictoryScreen() {
  const acc = gameState.totalAttempts > 0 ? Math.round((gameState.correctAnswers / gameState.totalAttempts) * 100) : 100;
  const mins = Math.floor(gameState.elapsedSeconds / 60);
  const secs = gameState.elapsedSeconds % 60;
  const lvlInfo = getLevelInfo(gameState.xp);
  const itemsCount = (gameState.collectibles || []).length;
  const achsCount = (gameState.achievements || []).length;
  document.getElementById('victory-stats').innerHTML = `
    <div class="sim-card"><strong>Missões:</strong> ${gameState.completedMissions.length}/9</div>
    <div class="sim-card"><strong>Acertos:</strong> ${gameState.correctAnswers} (${acc}%)</div>
    <div class="sim-card"><strong>XP & Nível:</strong> ${gameState.xp} XP (Nv. ${lvlInfo.lvl} • ${lvlInfo.title})</div>
    <div class="sim-card"><strong>Tempo:</strong> ${mins}m ${secs}s</div>
    <div class="sim-card"><strong>Colecionáveis:</strong> ${itemsCount}/2 itens</div>
    <div class="sim-card"><strong>Conquistas:</strong> ${achsCount} desbloqueadas</div>
  `;
  document.getElementById('victory-modal').classList.add('active');
}

