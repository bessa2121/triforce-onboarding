// ============================================================================
// 9. INÍCIO, PAUSA E REINÍCIO
// ============================================================================
function startNewGame() {
  AudioEngine.init();
  gameState = JSON.parse(JSON.stringify(DEFAULT_STATE));
  gameState.started = true;
  gameState.startTime = Date.now();
  saveGame();
  enterGameUI();
  AudioEngine.startBGM('Kokiri Village');
  startDialog([
    { speaker: 'NAVI', role: 'Guia da Jornada', text: 'Olá, Link! Bem-vindo a Hyrule! Você acabou de chegar e ainda não conhece o reino. Use WASD ou Setas para andar e E para interagir com a placa logo à frente!' }
  ]);
}

function continueGame() {
  AudioEngine.init();
  if (loadGame()) {
    gameState.started = true;
    enterGameUI();
    AudioEngine.startBGM(lastAreaName);
    if (gameState.victory) showVictoryScreen();
  }
}

function enterGameUI() {
  document.getElementById('start-modal').classList.remove('active');
  document.getElementById('hud').style.display = 'flex';
  if (window.innerWidth <= 820) document.getElementById('mobile-controls').style.display = 'flex';
  updateHUD();
}

function togglePause() {
  AudioEngine.playMenu();
  isPaused = !isPaused;
  document.getElementById('pause-modal').classList.toggle('active', isPaused);
}

function resetGameConfirm() {
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
}

if (loadGame() && gameState.started) {
  document.getElementById('continue-btn').style.display = 'inline-block';
}

