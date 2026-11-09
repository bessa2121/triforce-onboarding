// ============================================================================
// 1. ESTADO DO JOGO E PERSISTÊNCIA (localStorage)
// ============================================================================
const STORAGE_KEY = 'link_onboarding_save_v1';

const DEFAULT_STATE = {
  started: false,
  hearts: 5,
  maxHearts: 5,
  xp: 0,
  correctAnswers: 0,
  totalAttempts: 0,
  startTime: Date.now(),
  elapsedSeconds: 0,
  player: { x: 180, y: 360, dir: 'down' },
  currentMission: 0,
  completedMissions: [],
  triforce: { wisdom: false, power: false, courage: false },
  m1: { benefits: false, priorities: false, tech: false },
  m5: { mido: false, talon: false, saria: false },
  diaryUnlocked: ['primeiro_contato'],
  collectibles: [],
  achievements: [],
  victory: false
};

let gameState = JSON.parse(JSON.stringify(DEFAULT_STATE));
let isPaused = false;
let isDialogOpen = false;
let currentDialogQueue = [];
let currentDialogCallback = null;

function saveGame() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  } catch (e) {
    console.warn('Não foi possível salvar no localStorage:', e);
  }
}

function loadGame() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      gameState = Object.assign(JSON.parse(JSON.stringify(DEFAULT_STATE)), parsed);
      return true;
    }
  } catch (e) {
    console.warn('Erro ao carregar save:', e);
  }
  return false;
}

