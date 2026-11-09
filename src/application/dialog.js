// ============================================================================
// 5. SISTEMA DE DIÁLOGOS (Com Retrato Pixel Art e Typewriter)
// ============================================================================
let typeTimer = null;


function startDialog(queue, onComplete = null) {
  AudioEngine.playDialog();
  currentDialogQueue = queue;
  currentDialogCallback = onComplete;
  isDialogOpen = true;
  document.getElementById('dialog-box').style.display = 'block';
  renderCurrentDialog();
}

function renderCurrentDialog() {
  if (currentDialogQueue.length === 0) {
    closeDialog();
    return;
  }
  const item = currentDialogQueue[0];
  document.getElementById('dialog-speaker').textContent = item.speaker;
  document.getElementById('dialog-role').textContent = item.role || '';
  drawPortrait(item.speaker);
  AudioEngine.npcTheme(portraitKey(item.speaker));

  const textEl = document.getElementById('dialog-text');
  clearInterval(typeTimer);
  textEl.textContent = '';
  let charIdx = 0;
  const fullText = item.text;
  typeTimer = setInterval(() => {
    textEl.textContent += fullText.charAt(charIdx);
    charIdx++;
    if (charIdx >= fullText.length) clearInterval(typeTimer);
  }, 16);

  const choicesEl = document.getElementById('dialog-choices');
  const nextBtn = document.getElementById('dialog-next-btn');
  choicesEl.innerHTML = '';

  if (item.choices && item.choices.length > 0) {
    nextBtn.style.display = 'none';
    item.choices.forEach(ch => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = ch.label;
      btn.onclick = () => {
        currentDialogQueue.shift();
        if (ch.action) ch.action();
        if (currentDialogQueue.length > 0) renderCurrentDialog();
        else closeDialog();
      };
      choicesEl.appendChild(btn);
    });
  } else {
    nextBtn.style.display = 'inline-block';
  }
}

function advanceDialog() {
  currentDialogQueue.shift();
  if (currentDialogQueue.length > 0) {
    renderCurrentDialog();
  } else {
    closeDialog();
  }
}

function closeDialog() {
  AudioEngine.npcTheme(null);
  isDialogOpen = false;
  document.getElementById('dialog-box').style.display = 'none';
  if (currentDialogCallback) {
    const cb = currentDialogCallback;
    currentDialogCallback = null;
    cb();
  }
}

