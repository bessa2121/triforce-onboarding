const WORLD_WIDTH = 1800;
const WORLD_HEIGHT = 1520;   // faixa norte (Kokiri/Hyrule/Templo) + faixa sul (Lost Woods / Gerudo Valley)

const obstacles = [
  { x: 0, y: 0, w: WORLD_WIDTH, h: 40, type: 'border' },
  { x: 0, y: WORLD_HEIGHT - 40, w: WORLD_WIDTH, h: 40, type: 'border' },
  // muro entre norte e sul, com duas passagens: x 640-760 (Hyrule -> Lost Woods) e x 1290-1400 (Templo -> Gerudo)
  { x: 0, y: 720, w: 640, h: 40, type: 'border' },
  { x: 760, y: 720, w: 530, h: 40, type: 'border' },
  { x: 1400, y: 720, w: 400, h: 40, type: 'border' },
  { x: 0, y: 0, w: 40, h: WORLD_HEIGHT, type: 'border' },
  { x: WORLD_WIDTH - 40, y: 0, w: 40, h: WORLD_HEIGHT, type: 'border' },

  { x: 100, y: 90, w: 120, h: 90, type: 'house', label: 'Casa de Link' },
  { x: 340, y: 90, w: 130, h: 90, type: 'house', label: 'Casa Kokiri' },
  { x: 120, y: 520, w: 120, h: 80, type: 'house', label: 'Oficina TI' },
  { x: 560, y: 40, w: 40, h: 240, type: 'treewall' },
  { x: 560, y: 440, w: 40, h: 280, type: 'treewall' },

  { x: 760, y: 120, w: 140, h: 90, type: 'rock', label: 'Mesa da Equipe' },
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

(function expandSouth() {
  const seg = (px, py, a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], t = Math.max(0, Math.min(1, ((px - a[0]) * dx + (py - a[1]) * dy) / (dx * dx + dy * dy))); return Math.hypot(px - a[0] - t * dx, py - a[1] - t * dy); };
  const near = (px, py, path) => path.some((p, i) => i && seg(px, py, path[i - 1], p) < 95);
  let sd = 7; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
  const woodsPath = [[700, 740], [700, 900], [320, 1010], [320, 1170], [620, 1260], [780, 1360], [780, 1450]];
  const desertPath = [[1340, 740], [1340, 900], [1100, 1010], [1500, 1150], [1300, 1290], [1100, 1400]];
  obstacles.push({ x: 880, y: 760, w: 40, h: 420, type: 'cliff' });
  for (let gy = 770; gy < 1440; gy += 88) for (let gx = 50; gx < 1690; gx += 88) {
    const cx = gx + 40, cy = gy + 40; if (cx > 850 && cx < 950 && cy < 1200) continue;
    const woods = cx < 900;
    if (near(cx, cy, woods ? woodsPath : desertPath) || rnd() > (woods ? 0.72 : 0.5)) continue;
    obstacles.push(woods ? { x: gx, y: gy, w: 80, h: 80, type: 'wtree' } : { x: gx, y: gy, w: 80, h: 64, type: 'cliff' });
  }
})();

const npcs = [
  { id: 'saria', name: 'Saria', role: 'RH / People', x: 320, y: 1090, color: '#2ecc71', hair: '#27ae60' },
  { id: 'darunia', name: 'Darunia', role: 'Gestor / Liderança', x: 1220, y: 955, color: '#d35400', hair: '#e67e22' },
  { id: 'talon', name: 'Talon', role: 'TI / Suporte Técnico', x: 260, y: 560, color: '#2b4c7e', hair: '#5c3a21' },
  { id: 'impa', name: 'Impa', role: 'Segurança e Políticas', x: 1400, y: 270, color: '#5b2c6f', hair: '#ecf0f1' },
  { id: 'mido', name: 'Mido', role: 'Colega de Equipe', x: 830, y: 250, color: '#82e0aa', hair: '#d4ac0d' },
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

