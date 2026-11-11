// ============================================================================
// 10. LOOP PRINCIPAL E RENDERIZAÇÃO PIXEL ART
// ============================================================================
const keys = {};
const touchDir = { up: false, down: false, left: false, right: false };

window.addEventListener('keydown', (e) => {
  const k = e.key.toLowerCase();
  // digitando em campo de texto (busca da Kaepora, formulário do Pedestal): atalhos do jogo ficam de fora
  if (e.target && e.target.matches && e.target.matches('input, textarea, select')) {
    if (k === 'escape') { e.target.blur(); closeHelperModals(); }
    return;
  }
  keys[k] = true;

  if (!gameState.started) return;
  if (k === 'escape') {
    if (closeHelperModals()) return;
    togglePause();
    return;
  }
  if (isPaused) return;

  if (k === 'j') {
    const diaryModal = document.getElementById('diary-modal');
    if (diaryModal.classList.contains('active')) closeDiary();
    else openDiary();
    return;
  }

  if (k === 'e' || k === ' ') {
    if (isDialogOpen) {
      const nextBtn = document.getElementById('dialog-next-btn');
      if (nextBtn && nextBtn.style.display !== 'none') advanceDialog();
    } else if (!document.querySelector('.modal-overlay.active')) {
      tryInteract();
    }
  }
});

window.addEventListener('keyup', (e) => {
  keys[e.key.toLowerCase()] = false;
});

document.querySelectorAll('.dpad-btn').forEach((btn) => {
  const dir = btn.dataset.dir;
  const setDir = (val) => { touchDir[dir] = val; };
  btn.addEventListener('touchstart', (e) => { e.preventDefault(); setDir(true); }, { passive: false });
  btn.addEventListener('touchend', (e) => { e.preventDefault(); setDir(false); }, { passive: false });
  btn.addEventListener('mousedown', () => setDir(true));
  btn.addEventListener('mouseup', () => setDir(false));
  btn.addEventListener('mouseleave', () => setDir(false));
});

const mobileInteractBtn = document.getElementById('mobile-interact');
if (mobileInteractBtn) {
  mobileInteractBtn.addEventListener('click', () => {
    if (isDialogOpen) {
      const nextBtn = document.getElementById('dialog-next-btn');
      if (nextBtn && nextBtn.style.display !== 'none') advanceDialog();
    } else if (!document.querySelector('.modal-overlay.active')) {
      tryInteract();
    }
  });
}

let animTick = 0;

function updatePlayer() {
  if (!gameState.started || isPaused || isDialogOpen || document.querySelector('.modal-overlay.active')) return;
  if (AudioEngine.stepCooldown > 0) AudioEngine.stepCooldown--;

  const speed = 3.6;
  let dx = 0, dy = 0;
  if (keys['w'] || keys['arrowup'] || touchDir.up) { dy -= speed; gameState.player.dir = 'up'; }
  if (keys['s'] || keys['arrowdown'] || touchDir.down) { dy += speed; gameState.player.dir = 'down'; }
  if (keys['a'] || keys['arrowleft'] || touchDir.left) { dx -= speed; gameState.player.dir = 'left'; }
  if (keys['d'] || keys['arrowright'] || touchDir.right) { dx += speed; gameState.player.dir = 'right'; }

  if (dx !== 0 || dy !== 0) {
    AudioEngine.playStep();
    const nx = gameState.player.x + dx;
    const ny = gameState.player.y + dy;
    if (!checkCollision(nx, gameState.player.y, 14)) gameState.player.x = nx;
    if (!checkCollision(gameState.player.x, ny, 14)) gameState.player.y = ny;
    updateHUD();
    checkPedestalStep();
  }
}

function checkCollision(x, y, r) {
  for (const o of obstacles) {
    if (x + r > o.x && x - r < o.x + o.w && y + r > o.y && y - r < o.y + o.h) return true;
  }
  return false;
}


function gameLoop() {
  animTick++;
  updatePlayer();
  renderFrame(animTick);
  requestAnimationFrame(gameLoop);
}
window.onload = function () { initRenderer(); gameLoop(); };
