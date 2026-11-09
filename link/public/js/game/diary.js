// ============================================================================
// 8. DIÁRIO DE JORNADA
// ============================================================================
const DIARY_SECTIONS = [
  { id: 'primeiro_contato', title: '1. Primeiro Contato', text: 'Use WASD/Setas para explorar, E/Espaço para interagir. Navi sempre dá dicas da missão atual.' },
  { id: 'equipe', title: '2. Conhecendo a Equipe', text: 'Saria (RH/Benefícios), Darunia (Gestor/Prioridades), Talon (TI/Suporte), Impa (Segurança), Mido (Equipe).' },
  { id: 'ferramentas', title: '3. Ferramentas', text: 'Registre tarefas com clareza, atualize o status e compartilhe links com permissões corretas.' },
  { id: 'politicas', title: '4. Políticas e Segurança', text: 'Desconfie de e-mails urgentes pedindo senhas. Proteja dados confidenciais do reino.' },
  { id: 'pratica', title: '5. Aplicação Prática', text: 'Seu trabalho gera impacto real na equipe. Comunique bloqueios cedo e peça feedback!' }
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

