// ============================================================================
// 8. DIÁRIO DE JORNADA
// ============================================================================
const DIARY_SECTIONS = [
  { id: 'autonomia', title: '0. Ajuda e Liderança', text: `<strong>Kaepora Gaebora (Kokiri Village):</strong> a coruja guarda respostas práticas por tema ou palavra-chave e diz quem procurar no mapa.<br><strong>Sábios de setor:</strong> Talon (TI), Mido (equipe), Saria (RH), Darunia (gestão) e Impa (segurança).<br><strong>Pedestal Central (Temple of Time):</strong> abaixo da Princesa Zelda. Só desperta depois que você termina o jogo e permite agendar um 1:1 ou mentoria reais com a liderança.<br><strong>Regra de ouro:</strong> termine a jornada, tente o básico e então acione a liderança com a dúvida em uma frase.` },
  { id: 'primeiro_contato', title: '1. Primeiro Contato', text: `<strong>Controles:</strong> WASD/Setas movem, E/Espaço interagem, 1 a 4 respondem perguntas.<br><strong>Ordem livre:</strong> fale com os sábios na ordem que quiser: Talon (TI, Kokiri Village), Mido (Equipe, Hyrule Field), Saria (RH, Lost Woods), Darunia (Gestão, Gerudo Valley) e Impa (Segurança, Temple of Time). Cada um faz 3 perguntas difíceis. Com os cinco concluídos, a Princesa Zelda abre o Desafio Final.<br><strong>Recompensas:</strong> acertos rendem XP e rupias; acertos seguidos formam combos; acertar de primeira rende bônus e uma missão sem erros dá o selo Mão Firme. Erros não tiram vida, mas zeram o combo e a pergunta volta mais tarde. Marcos de rupias liberam Botas de Pégaso, Bênção de Nayru e um título. Use o minimapa (M para ampliar).` },
  { id: 'ferramentas', title: '2. Acessos e Ferramentas', text: `<strong>Credenciais:</strong> são pessoais e intransferíveis. Precisa de acesso? Abra chamado e avise o gestor do prazo.<br><strong>MFA:</strong> aprovação que você não pediu significa senha comprometida. Negue, troque a senha e reporte.<br><strong>TI-sombra:</strong> app fora da lista oficial leva dados para onde não há contrato nem auditoria. Proponha à TI.<br><strong>Cards:</strong> título claro, responsável, prazo, dependências e status atualizado com comentário.<br><strong>Documentos:</strong> link com menor privilégio (leitura ou edição só para quem precisa) e expiração. Evite anexos e links abertos.` },
  { id: 'equipe', title: '3. Regras Não Ditas', text: `<strong>Pedir ajuda:</strong> mensagem completa (objetivo, o que tentou, erro, prazo). Não espere horas nem pergunte vago no canal geral.<br><strong>Fora do horário:</strong> confirme o recebimento e o prazo; execute no expediente. Silêncio gera ansiedade, heroísmo vira expectativa.<br><strong>Discordar:</strong> com dado e alternativa, na hora certa, e peça que a decisão seja registrada.<br><strong>Crédito:</strong> cite quem contribuiu e avise antes.<br><strong>Atrasos:</strong> avise cedo, com nova data e plano de recuperação.` },
  { id: 'politicas', title: '4. Políticas da Empresa', text: `<strong>Férias:</strong> alinhe com o gestor e formalize no sistema dentro da antecedência. Acordo verbal não vale.<br><strong>Presentes e conflito de interesses:</strong> de quem negocia com a empresa, informe e recuse acima do limite.<br><strong>Dados pessoais (LGPD):</strong> finalidade e mínimo necessário, mesmo para colegas. Use o canal oficial de dados.<br><strong>Conduta:</strong> silêncio do grupo equivale a aprovação. Apoie a pessoa e lembre do canal de ética, que é sigiloso.<br><strong>Horas extras:</strong> aprovação prévia e registro no banco de horas.` },
  { id: 'feedback', title: '5. Feedback e Prioridades', text: `<strong>Receber:</strong> agradeça, peça exemplo concreto, dê contexto em uma frase e transforme em combinado.<br><strong>Pedir:</strong> específico e curto ("o que melhoraria no relatório?"). Silêncio não é aprovação.<br><strong>Dar a um colega:</strong> em privado, logo, com fato e impacto. Escalar vem depois.<br><strong>Prioridades em conflito:</strong> exponha aos dois lados, com prazos e capacidade, e siga a decisão registrada.<br><strong>Impacto:</strong> entenda quem usa sua entrega e qual decisão ela apoia.` },
  { id: 'seguranca', title: '6. Ataques e Defesa', text: `<strong>Vishing:</strong> ligação falsa da TI pedindo código. TI nunca pede MFA.<br><strong>Fadiga de MFA:</strong> bombardeio de aprovações. Negue e troque a senha.<br><strong>Tailgating:</strong> carona na porta. Cada pessoa passa o próprio crachá.<br><strong>Baiting:</strong> pendrive achado. Não conecte, entregue à Segurança.<br><strong>BEC / fraude do executivo:</strong> urgência, sigilo e autoridade. Confirme por canal independente.<br><strong>Evil twin:</strong> Wi-Fi clonado com login falso. Use dados móveis ou VPN oficial.<br><strong>Consent phishing:</strong> app que pede permissões amplas. Consulte a TI.<br><strong>Regra de ouro:</strong> pare, verifique por outro canal, reporte.` }
];

function openDiary() {
  AudioEngine.playMenu();
  const tabs = document.getElementById('diary-tabs');
  const content = document.getElementById('diary-content');
  tabs.innerHTML = '';
  content.innerHTML = '';

  DIARY_SECTIONS.forEach((sec, idx) => {
    const unlocked = sec.id === 'autonomia' || gameState.diaryUnlocked.includes(sec.id);
    const btn = document.createElement('button');
    btn.className = 'tab-btn' + (idx === 1 ? ' active' : '');
    btn.textContent = unlocked ? sec.title : '🔒 Bloqueado';
    btn.onclick = () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      content.innerHTML = unlocked
        ? `<div class="diary-entry"><strong>${sec.title}</strong><br>${sec.text}</div>`
        : `<div class="diary-entry locked">Continue avançando nas missões para desbloquear esta etapa!</div>`;
    };
    tabs.appendChild(btn);
  });
  tabs.children[1].click();
  document.getElementById('diary-modal').classList.add('active');
}

function closeDiary() {
  document.getElementById('diary-modal').classList.remove('active');
}

function openInventory() {
  AudioEngine.playMenu();
  const items = gameState.collectibles || [];
  const achs = gameState.achievements || [];
  document.getElementById('inventory-content').innerHTML = `
    <div class="diary-entry">
      <strong>Itens Colecionáveis (${items.length}/2):</strong><br>
      ${items.length ? items.map(i => `• 🎒 ${i}`).join('<br>') : 'Nenhum item encontrado ainda. Explore os baús secretos!'}
    </div>
    <div class="diary-entry">
      <strong>Rupias:</strong> ${gameState.rupees || 0} • melhor combo x${gameState.bestStreak || 0} • itens: ${(gameState.rewards || []).length ? REWARD_TIERS.filter(t => gameState.rewards.includes(t.id)).map(t => t.name).join(', ') : 'nenhum ainda (próximo marco: 100 rupias)'}<br>
      <strong>Autonomia:</strong> ${autonomyState().consults} consulta(s) à Kaepora Gaebora • ${sectorsMet()} sábio(s) de setor consultado(s)<br>
      <strong>Pedestal Central:</strong> ${agendaUnlocked() ? (schedState().requests.length ? schedState().requests.length + ' audiência(s) registrada(s)' : 'liberado: peça sua audiência') : 'bloqueado até você terminar o jogo'}
    </div>
    <div class="diary-entry">
      <strong>Conquistas Desbloqueadas (${achs.length}):</strong><br>
      ${achs.length ? achs.map(a => `• 🏆 ${a.toUpperCase()}`).join('<br>') : 'Conclua missões e explore Hyrule para desbloquear conquistas!'}
    </div>
  `;
  document.getElementById('inventory-modal').classList.add('active');
}

function closeInventory() {
  document.getElementById('inventory-modal').classList.remove('active');
}

