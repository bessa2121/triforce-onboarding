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
  if (k === 'm' && gameState.started && typeof toggleMinimap === 'function' && !document.querySelector('.modal-overlay.active')) toggleMinimap();

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

  if (k === ' ' && !isDialogOpen && !document.querySelector('.modal-overlay.active')) {
    e.preventDefault(); const J = R3.jump; if (J.n < 2) { J.v = J.n ? .42 : .5; J.y = Math.max(J.y, .01); J.n++; }
    return;
  }
  if (k === 'e' || (k === ' ' && isDialogOpen)) {
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
  if (!gameState.started || isPaused || isDialogOpen || window.__restBusy || document.querySelector('.modal-overlay.active')) return;
  if (AudioEngine.stepCooldown > 0) AudioEngine.stepCooldown--;

  const speed = 3.6 * (hasReward('boots') ? 1.15 : 1) * (keys['shift'] ? 1.6 : 1);
  let ix = 0, iy = 0;
  if (keys['w'] || keys['arrowup'] || touchDir.up) iy += 1;
  if (keys['s'] || keys['arrowdown'] || touchDir.down) iy -= 1;
  if (keys['a'] || keys['arrowleft'] || touchDir.left) ix -= 1;
  if (keys['d'] || keys['arrowright'] || touchDir.right) ix += 1;
  if (keys['q']) R3.yaw -= .03; if (keys['c']) R3.yaw += .03;
  let dx = 0, dy = 0; R3.moving = false;
  if (ix || iy) {
    const l = Math.hypot(ix, iy), y = R3.yaw, fx = -Math.sin(y), fz = -Math.cos(y);
    dx = (fx * iy / l + Math.cos(y) * ix / l) * speed; dy = (fz * iy / l - Math.sin(y) * ix / l) * speed;
    R3.face = Math.atan2(dx, dy); R3.moving = true; R3.walk += .28;
    gameState.player.dir = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : (dy < 0 ? 'up' : 'down');
  }
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
  for (const b of interactables) {
    if (b.type === 'bonfire' && x + r > b.x - 14 && x - r < b.x + 14 && y + r > b.y - 2 && y - r < b.y + 14) return true;
  }
  return false;
}


function gameLoop() {
  animTick++;
  updatePlayer();
  renderFrame3D(animTick);
  requestAnimationFrame(gameLoop);
}
window.onload = function () { initRenderer(); initRenderer3D(); gameLoop(); };
