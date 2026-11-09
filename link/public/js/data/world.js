const WORLD_WIDTH = 1800;
const WORLD_HEIGHT = 760;

const obstacles = [
  { x: 0, y: 0, w: WORLD_WIDTH, h: 40, type: 'border' },
  { x: 0, y: WORLD_HEIGHT - 40, w: WORLD_WIDTH, h: 40, type: 'border' },
  { x: 0, y: 0, w: 40, h: WORLD_HEIGHT, type: 'border' },
  { x: WORLD_WIDTH - 40, y: 0, w: 40, h: WORLD_HEIGHT, type: 'border' },

  { x: 100, y: 90, w: 120, h: 90, type: 'house', label: 'Casa de Link' },
  { x: 340, y: 90, w: 130, h: 90, type: 'house', label: 'Casa de Saria (RH)' },
  { x: 120, y: 520, w: 120, h: 80, type: 'house', label: 'Oficina TI' },
  { x: 560, y: 40, w: 40, h: 240, type: 'treewall' },
  { x: 560, y: 440, w: 40, h: 280, type: 'treewall' },

  { x: 760, y: 120, w: 140, h: 90, type: 'rock', label: 'Posto de Gestão' },
  { x: 960, y: 470, w: 90, h: 90, type: 'tree' },
  { x: 1210, y: 40, w: 40, h: 250, type: 'stonewall' },
  { x: 1210, y: 450, w: 40, h: 270, type: 'stonewall' },

  { x: 1440, y: 110, w: 220, h: 70, type: 'temple' },
  { x: 1360, y: 520, w: 90, h: 70, type: 'pillar' },
  { x: 1620, y: 520, w: 90, h: 70, type: 'pillar' },

  // Decoração com colisão (arte: cercas e arbustos)
  { x: 120, y: 262, w: 130, h: 8, type: 'fence' },
  { x: 100, y: 612, w: 130, h: 8, type: 'fence' },
  { x: 250, y: 140, w: 32, h: 26, type: 'bush' },
  { x: 500, y: 100, w: 34, h: 28, type: 'bush' },
  { x: 1100, y: 100, w: 36, h: 30, type: 'bush' },
  { x: 40, y: 400, w: 34, h: 28, type: 'bush' }
];

const npcs = [
  { id: 'saria', name: 'Saria', role: 'RH / People', x: 400, y: 220, color: '#2ecc71', hair: '#27ae60' },
  { id: 'darunia', name: 'Darunia', role: 'Gestor / Liderança', x: 830, y: 250, color: '#d35400', hair: '#e67e22' },
  { id: 'talon', name: 'Talon', role: 'TI / Suporte Técnico', x: 260, y: 560, color: '#2b4c7e', hair: '#5c3a21' },
  { id: 'impa', name: 'Impa', role: 'Segurança e Políticas', x: 1080, y: 220, color: '#5b2c6f', hair: '#ecf0f1' },
  { id: 'mido', name: 'Mido', role: 'Colega de Equipe', x: 460, y: 400, color: '#82e0aa', hair: '#d4ac0d' },
  { id: 'zelda', name: 'Princesa Zelda', role: 'Liderança de Hyrule', x: 1550, y: 240, color: '#f4c430', hair: '#f7dc6f' }
];

const interactables = [
  { id: 'board_kokiri', name: 'Placa de Kokiri', x: 280, y: 310, type: 'sign' },
  { id: 'board_hyrule', name: 'Placa de Hyrule Field', x: 640, y: 310, type: 'sign' },
  { id: 'board_temple', name: 'Placa do Templo', x: 1300, y: 310, type: 'sign' },
  { id: 'chest_tools', name: 'Baú de Ferramentas', x: 700, y: 550, type: 'chest' },
  { id: 'chest_secret_1', name: 'Baú Secreto da Floresta', x: 95, y: 240, type: 'secret_chest', item: 'Bússola de Kokiri', xp: 45 },
  { id: 'chest_secret_2', name: 'Baú do Lago', x: 1120, y: 580, type: 'secret_chest', item: 'Escudo da Segurança', xp: 60 },
  { id: 'pedestal', name: 'Pedestal da Triforce', x: 1550, y: 390, type: 'pedestal' }
];

