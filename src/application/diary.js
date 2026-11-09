// ============================================================================
// 8. DIÁRIO DE JORNADA
// ============================================================================
const DIARY_SECTIONS = [
  { id: 'primeiro_contato', title: '1. Primeiro Contato', text: `<strong>Controles:</strong> WASD/Setas movem, E/Espaço interagem, 1 a 4 respondem perguntas.<br><strong>Rota:</strong> Kokiri Village (TI) > Hyrule Field (Equipe) > Lost Woods (RH) > Gerudo Valley (Gestão) > Temple of Time (Segurança e Desafio Final).<br><strong>Regras do jogo:</strong> cada erro custa 1 coração e a pergunta volta mais tarde. Zerar os corações leva você ao posto da região. Cada missão concluída devolve 1 coração.` },
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
    const unlocked = gameState.diaryUnlocked.includes(sec.id);
    const btn = document.createElement('button');
    btn.className = 'tab-btn' + (idx === 0 ? ' active' : '');
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
  tabs.firstChild.click();
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
      <strong>Conquistas Desbloqueadas (${achs.length}):</strong><br>
      ${achs.length ? achs.map(a => `• 🏆 ${a.toUpperCase()}`).join('<br>') : 'Conclua missões e explore Hyrule para desbloquear conquistas!'}
    </div>
  `;
  document.getElementById('inventory-modal').classList.add('active');
}

function closeInventory() {
  document.getElementById('inventory-modal').classList.remove('active');
}

