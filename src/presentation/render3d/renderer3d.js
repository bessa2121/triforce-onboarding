/* Renderizador 3D (Three.js): modelagem low-poly procedural. Lê o mesmo mundo 2D (world.js): (x,y) do mapa -> (x*S, 0, y*S). */
const S = 0.05, R3 = { yaw: 0.0, pitch: 0.58, dist: 12, jump: { y: 0, v: 0, n: 0 }, face: 0, walk: 0, ents: {}, fog: new THREE.Color(0x9ad0f0) };
const MAT = {}; const mat = (c, e) => MAT[c + (e || '')] || (MAT[c + (e || '')] = new THREE.MeshLambertMaterial({ color: c, flatShading: true, emissive: e || 0x000000 }));
function bx(g, w, h, d, c, x, y, z, e) { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(c, e)); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; g.add(m); return m; }
function cone(g, r, h, c, x, y, z, seg) { const m = new THREE.Mesh(new THREE.ConeGeometry(r, h, seg || 6), mat(c)); m.position.set(x, y, z); m.castShadow = true; g.add(m); return m; }
function cyl(g, r1, r2, h, c, x, y, z, seg, e) { const m = new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, h, seg || 8), mat(c, e)); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; g.add(m); return m; }
function ball(g, r, c, x, y, z, e) { const m = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 1), mat(c, e)); m.position.set(x, y, z); m.castShadow = true; g.add(m); return m; }
function W(o) { return { x: (o.x + (o.w || 0) / 2) * S, z: (o.y + (o.h || 0) / 2) * S, w: (o.w || 0) * S, d: (o.h || 0) * S }; }

function textSprite(text, bg, fg, scale) {
  const c = document.createElement('canvas'); c.width = 256; c.height = 64; const g = c.getContext('2d');
  let fs = 34; g.font = fs + 'px VT323, monospace'; while (g.measureText(text).width > 236 && fs > 14) { fs -= 2; g.font = fs + 'px VT323, monospace'; } g.textAlign = 'center'; g.textBaseline = 'middle';
  if (bg) { g.fillStyle = bg; g.fillRect(0, 8, 256, 48); g.strokeStyle = '#2a1608'; g.lineWidth = 4; g.strokeRect(2, 10, 252, 44); }
  g.lineWidth = 6; g.strokeStyle = '#1a1208'; if (!bg) g.strokeText(text, 128, 34); g.fillStyle = fg || '#fff6d8'; g.fillText(text, 128, 34);
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthTest: false }));
  s.scale.set(2.6 * (scale || 1), .65 * (scale || 1), 1); s.renderOrder = 9; return s;
}

const V3 = (x, y, z) => new THREE.Vector3(x, y, z), matD = c => MAT['d' + c] || (MAT['d' + c] = new THREE.MeshLambertMaterial({ color: c, flatShading: true, side: THREE.DoubleSide }));
function seg(g, A, B, rA, rB, c, n) { const d = B.clone().sub(A), m = new THREE.Mesh(new THREE.CylinderGeometry(rB, rA, d.length(), n || 6), mat(c)); m.position.copy(A).add(B).multiplyScalar(.5); m.quaternion.setFromUnitVectors(V3(0, 1, 0), d.normalize()); m.castShadow = true; g.add(m); return m; }
function lathe(g, pts, c, sx) { const m = new THREE.Mesh(new THREE.LatheGeometry(pts.map(p => new THREE.Vector2(p[0], p[1])), 8), matD(c)); m.scale.set(sx || 1, 1, sx || 1); m.castShadow = true; g.add(m); return m; }
function flat(g, geo, c, x, y, z, ry) { const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: c })); m.position.set(x, y, z); m.rotation.y = ry || 0; g.add(m); return m; }
function tri(g, s, c, x, y, z) { const sh = new THREE.Shape(); sh.moveTo(0, s); sh.lineTo(-s * .9, -s * .6); sh.lineTo(s * .9, -s * .6); return flat(g, new THREE.ShapeGeometry(sh), c, x, y, z); }
function eyes(head, ex, ey, ez, k, iris, ang) {
  [-1, 1].forEach(s => { const e = new THREE.Group(); e.position.set(s * ex, ey, ez); e.rotation.y = s * ang;
    [[.078, 0xffffff, 0], [.055, iris, .003], [.03, 0x0a0a14, .006]].forEach(([r, c, z]) => { const m = flat(e, new THREE.CircleGeometry(r * k, 10), c, 0, 0, z); m.scale.y = 1.25; }); head.add(e); });
}
function hairShell(hg, R, t0, t1, p0, p1, c) { const m = new THREE.Mesh(new THREE.SphereGeometry(R, 8, 6, p0, p1, t0, t1), matD(c)); m.castShadow = true; hg.add(m); return m; }

function human(o) {
  const g = new THREE.Group(), k = o.k || 1, sk = o.skin || 0xf2c9a0, B = o.body, fat = o.fat || 1, boot = o.boot || 0x6a4420, hc = o.hair, HY = 2.1;
  const legs = [-.2, .2].map(x => { const l = new THREE.Group(); l.position.set(x * fat, .95, 0); cyl(l, .13, .13, .55, o.pants || 0xf5f0dc, 0, -.275, 0, 6); cyl(l, .17, .17, .5, boot, 0, -.7, 0, 6); bx(l, .3, .14, .42, boot, 0, -.88, .08); g.add(l); return l; });
  const arms = [-1, 1].map(s => { const a = new THREE.Group(); a.position.set(s * (.52 * fat), 1.58, 0); ball(a, .17, B, 0, 0, 0); cyl(a, .13, .11, .6, B, 0, -.3, 0, 6); cyl(a, .135, .135, .1, o.cuff || 0xf0ead6, 0, -.62, 0, 6); ball(a, .13, sk, 0, -.74, 0); g.add(a); return a; });
  lathe(g, [[.001, 1.74], [.18, 1.73], [.32, 1.66], [.36, 1.3], [.34, 1.02]], B, fat);
  lathe(g, [[.385, 1.02], [.385, .9]], o.belt || 0x6b4a22, fat);
  lathe(g, [[.37, .9], o.dress ? [.97, .12] : (o.short ? [.56, .55] : [.52, .58])], o.skirtCol || B, fat);
  bx(g, .14, .14, .05, 0xffd23f, 0, .96, .385 * fat + .02, 0x443300);
  cyl(g, .12, .12, .2, sk, 0, 1.72, 0, 6);
  const head = new THREE.Group(); head.position.y = HY; g.add(head);
  ball(head, .42, sk, 0, 0, 0).scale.set(1, 1.06, .98);
  eyes(head, .16, -.02, .4, 1, o.eye || 0x2a5ad0, .39); cone(head, .05, .11, sk, 0, -.1, .43, 4).rotation.x = Math.PI / 2;
  if (o.frown) [-1, 1].forEach(s => { const b = bx(head, .15, .035, .03, 0x3a2410, s * .16, .12, .41); b.rotation.set(0, s * .39, s * .45); });
  if (!o.goron) [-1, 1].forEach(s => { cone(head, .1, .34, sk, s * .5, .02, -.02, 4).rotation.z = -s * 1.35; });
  const hg = new THREE.Group(); hg.rotation.x = -.28; head.add(hg); const back = 4.7124, bl = o.style === 'long' ? 1.2 : o.style === 'bob' ? 1.2 : 1.05, bt = o.style === 'long' ? 2.5 : o.style === 'bob' ? 2.2 : 1.85;
  if (!o.hat) hairShell(hg, .475, 0, 1.35, 0, 6.2832, hc);
  hairShell(hg, .475, o.hat ? 1.1 : 1.35, bt - (o.hat ? 1.1 : 1.35), back - bl, bl * 2, hc);
  if (o.style === 'long') seg(g, V3(0, 2.05, -.3), V3(0, 1.1, -.42), .32, .2, hc, 8);
  if (o.pony) { const P = [V3(0, 2.3, -.42), V3(0, 2.2, -.8), V3(0, 1.8, -1.0), V3(0, 1.3, -1.0), V3(0, .8, -.9)], R = [.17, .15, .13, .11, .06]; for (let i = 1; i < 5; i++) { seg(g, P[i - 1], P[i], R[i - 1], R[i], hc, 6); ball(g, R[i], hc, P[i].x, P[i].y, P[i].z); } }
  if (o.cap) { const cp = new THREE.Group(); cp.rotation.x = -.5; head.add(cp); hairShell(cp, .52, 0, 1.2, 0, 6.2832, o.cap);
    const P = [V3(0, .4, -.36), V3(0, .46, -.74), V3(0, .22, -1.06), V3(0, -.12, -1.16)], R = [.26, .2, .15, .1]; for (let i = 1; i < 4; i++) { seg(head, P[i - 1], P[i], R[i - 1], R[i], o.cap, 6); ball(head, R[i], o.cap, P[i].x, P[i].y, P[i].z); } ball(head, .12, 0xfff1b0, 0, -.2, -1.18); }
  if (o.hat) { lathe(head, [[.001, .66], [.28, .64], [.42, .52], [.47, .2], [.95, .12], [.97, .06], [.5, .04]], o.hat, 1); lathe(head, [[.47, .22], [.47, .12]], 0x6b3a1a, 1.02); }
  if (o.mus) [-1, 1].forEach(s => ball(head, .07, hc, s * .08, -.14, .39).scale.set(1.7, .6, .8));
  if (o.tiara) { cyl(head, .43, .43, .07, 0xffd23f, 0, .27, 0, 8, 0x553300); ball(head, .06, 0x3a7aff, 0, .27, .43, 0x112266); }
  if (o.triforce) tri(g, .11, 0xffd23f, 0, 1.45, .36 * fat);
  if (o.sheikah) { const e = flat(g, new THREE.CircleGeometry(.1, 10), 0xffffff, 0, 1.45, .36); e.scale.y = .55; flat(g, new THREE.CircleGeometry(.035, 8), 0xd02020, 0, 1.45, .362); }
  if (o.gear) { const sh = cyl(g, .38, .38, .07, 0x9a6a30, 0, 1.25, -.43, 8); sh.rotation.x = Math.PI / 2; bx(g, .5, .1, .04, 0xc0392b, 0, 1.25, -.48); const sw = bx(g, .09, .9, .05, 0xcfd8e8, .12, 1.95, -.55); sw.rotation.z = -.3; bx(g, .3, .07, .07, 0xffd23f, .04, 1.52, -.55).rotation.z = -.3; }
  g.scale.setScalar(k); g.userData = { legL: legs[0], legR: legs[1], armL: arms[0], armR: arms[1] }; return g;
}
function goron() {
  const g = new THREE.Group(), BR = 0x9a5a30, HC = 0x1c1410;
  const legs = [-.5, .5].map(x => { const l = new THREE.Group(); l.position.set(x, .8, 0); cyl(l, .34, .38, .8, BR, 0, -.4, 0, 7); ball(l, .42, 0x7a4624, 0, -.78, .12).scale.set(1, .55, 1.2); g.add(l); return l; });
  const arms = [-1, 1].map(s => { const a = new THREE.Group(); a.position.set(s * 1.3, 2.0, 0); ball(a, .42, BR, 0, 0, 0); cyl(a, .34, .3, .9, BR, 0, -.5, 0, 7); ball(a, .42, 0x8a4e28, 0, -1.1, 0); g.add(a); return a; });
  ball(g, 1, BR, 0, 1.55, 0).scale.set(1.2, 1.05, 1.05); ball(g, .5, 0xb98a60, 0, 1.4, .72).scale.set(1.1, 1, .45);
  const head = new THREE.Group(); head.position.y = 2.72; g.add(head); ball(head, .58, BR, 0, 0, 0).scale.set(1.05, 1, 1);
  eyes(head, .22, .04, .55, 1.5, 0x3a2010, .4); [-1, 1].forEach(s => { const b = bx(head, .24, .06, .04, HC, s * .22, .22, .55); b.rotation.set(0, s * .4, s * .4); });
  ball(head, .1, 0x7a4624, 0, -.05, .6).scale.set(1.2, .9, .9);
  const hg = new THREE.Group(); hg.rotation.x = -.2; head.add(hg); hairShell(hg, .66, 0, 1.3, 0, 6.2832, HC); hairShell(hg, .66, 1.3, .7, 4.7124 - 1.3, 2.6, HC);
  const bd = new THREE.Mesh(new THREE.SphereGeometry(.64, 8, 6, 1.5708 - 1.1, 2.2, 1.95, 1.0), matD(HC)); head.add(bd);
  [-1, 1].forEach(s => ball(g, .17, 0xe8d4a8, s * .45, 2.0, .93)); ball(g, .2, 0xc0392b, 0, 2.05, .98);
  g.scale.setScalar(.95); g.userData = { legL: legs[0], legR: legs[1], armL: arms[0], armR: arms[1] }; return g;
}

function owl() {
  const g = new THREE.Group(), br = 0x8a5a34, lt = 0xe8d4a8;
  ball(g, .95, br, 0, 1.1, 0).scale.set(1, 1.2, .9); ball(g, .6, lt, 0, 1, .55).scale.set(1, 1.3, .5);
  for (let i = 0; i < 3; i++) [-.28, .28].forEach(x => cone(g, .1, .22, 0xb89060, x * (1 + i * .15), .7 + i * .35, .98, 3).rotation.x = Math.PI);
  ball(g, .6, 0x9a6a40, 0, 2.2, 0); [-.38, .38].forEach(x => cone(g, .16, .5, 0x5a3a20, x, 2.8, 0, 4));
  [-.24, .24].forEach(x => { ball(g, .24, lt, x, 2.25, .42); ball(g, .17, 0xffd23f, x, 2.25, .5); ball(g, .08, 0x111111, x, 2.25, .62); });
  cone(g, .1, .28, 0xe8a030, 0, 2.08, .6, 4).rotation.x = Math.PI / 2;
  const wl = new THREE.Group(), wr = new THREE.Group(); wl.position.set(-.95, 1.9, 0); wr.position.set(.95, 1.9, 0);
  [wl, wr].forEach((w, i) => { bx(w, .22, 1.4, .8, 0x6b4426, 0, -.7, 0); bx(w, .2, .5, .6, 0x5a3820, 0, -1.5, 0); w.rotation.z = i ? -.15 : .15; g.add(w); });
  bx(g, .5, .7, .2, 0x6b4426, 0, .45, -.8).rotation.x = .4; [-.3, .3].forEach(x => bx(g, .3, .12, .4, 0xe8a030, x, .06, .2));
  g.userData = { wingL: wl, wingR: wr }; return g;
}
const LOOKS = {
  link: { body: 0x2e9c3a, hair: 0xd9a844, cap: 0x2e9c3a, pants: 0xf5f0dc, belt: 0x7a4a1a, ears: 1, gear: 1, style: 'short', eye: 0x2a5ad0 },
  saria: { body: 0x2f9e5a, hair: 0x1fc070, style: 'bob', short: 1, belt: 0xe8d890, eye: 0x2a8a60, k: .92 },
  mido: { body: 0x3d9a4a, hair: 0xd8541f, style: 'short', frown: 1, belt: 0x7a4a1a, k: .82 },
  talon: { body: 0x3a5fa8, hair: 0x6a4a28, hat: 0xc8a060, mus: 1, fat: 1.22, pants: 0xe8e0c8, belt: 0x5a3a1a, style: 'short', k: 1.1, eye: 0x4a3a20 },
  impa: { body: 0x34467e, hair: 0xe8eaf2, dress: 1, belt: 0xe8e8f0, cuff: 0xcfd6e8, pony: 1, style: 'short', sheikah: 1, eye: 0xd02020, k: 1.08 },
  zelda: { body: 0xfbeaf6, skirtCol: 0xf4a6d0, hair: 0xf5d76e, dress: 1, belt: 0x8a50c8, cuff: 0xffd23f, style: 'long', tiara: 1, triforce: 1, eye: 0x2a5ad0, k: .95 }
};
function ridge(g, w, d, h, c1, c2, seed, cap) {
  const along = w >= d, L = along ? w : d, T = along ? d : w, n = Math.max(1, Math.round(L / 1.8)), seg = L / n; let s = seed + 1; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < n; i++) { const hh = h * (.78 + r() * .4), off = (i - (n - 1) / 2) * seg, W2 = along ? seg * 1.04 : T * (.92 + r() * .16), D2 = along ? T * (.92 + r() * .16) : seg * 1.04, X = along ? off : 0, Z = along ? 0 : off;
    bx(g, W2 + .3, h * .3, D2 + .3, c1, X, h * .15, Z); bx(g, W2, hh, D2, i % 2 ? c1 : c2, X, hh / 2, Z); if (cap) bx(g, W2 + .05, .28, D2 + .05, cap, X, hh + .1, Z); }
}

function buildScenery(scene) {
  let sd = 11; const r = () => (sd = (sd * 16807) % 2147483647) / 2147483647, WX = WORLD_WIDTH * S, WZ = WORLD_HEIGHT * S;
  const far = new THREE.Mesh(new THREE.PlaneGeometry(500, 500), mat(0x3f7a38)); far.rotation.x = -Math.PI / 2; far.position.set(WX / 2, -.08, WZ / 2); far.receiveShadow = true; scene.add(far);
  for (let i = 0; i < 70; i++) {
    const side = i % 4, t = r(), h = 9 + r() * 14, rad = 6 + r() * 7, d = rad + 3 + r() * 10;
    const x = side < 2 ? t * (WX + 40) - 20 : (side === 2 ? -d : WX + d), z = side < 2 ? (side === 0 ? -d : WZ + d) : t * WZ;
    const m = new THREE.Group(); m.position.set(x, 0, z); cone(m, rad, h, h > 17 ? 0x7d8aa0 : 0x4e7a4a, 0, h / 2, 0, 5); if (h > 15) cone(m, rad * .35, h * .28, 0xf4f8ff, 0, h * .86, 0, 5);
    m.children.forEach(c => c.castShadow = false); scene.add(m); (R3.stat = R3.stat || []).push(m);
  }
  const trail = (x, y) => (x > 590 && x < 1210 && y > 320 && y < 390) || (x > 140 && x < 580 && y > 290 && y < 360) || (x > 650 && x < 710 && y < 730);
  const blocked = (x, y) => trail(x, y) || obstacles.some(o => x > o.x - 12 && x < o.x + o.w + 12 && y > o.y - 12 && y < o.y + o.h + 12);
  const dm = new THREE.Object3D(), col = new THREE.Color();
  const mk = (geo, N, ok, cols, y, sc) => { const im = new THREE.InstancedMesh(geo, new THREE.MeshLambertMaterial({ flatShading: true }), N); let n = 0, tries = 0;
    while (n < N && tries++ < N * 40) { const x = 60 + r() * 1680, y2 = 60 + r() * 1400, reg = regionAt(x, y2); if (!ok(reg) || blocked(x, y2)) continue; dm.position.set(x * S, y, y2 * S); dm.rotation.set(0, r() * 6, 0); dm.scale.setScalar(sc * (.7 + r() * .9)); dm.updateMatrix(); im.setMatrixAt(n, dm.matrix); im.setColorAt(n, col.setHex(cols(reg, n))); n++; }
    im.count = n; im.instanceMatrix.needsUpdate = true; scene.add(im); };
  mk(new THREE.ConeGeometry(.12, .55, 3), 900, g => g !== 'Temple of Time' && g !== 'Gerudo Valley', (g, n) => g === 'Lost Woods' ? 0x1f5a2a : [0x4ea03e, 0x66b84e, 0x3d8a35][n % 3], .25, 1);
  mk(new THREE.IcosahedronGeometry(.13, 0), 260, g => g === 'Kokiri Village' || g === 'Hyrule Field', (g, n) => [0xffe066, 0xffffff, 0xff8fb8, 0x9ad8ff][n % 4], .18, 1);
  mk(new THREE.DodecahedronGeometry(.3, 0), 120, g => g === 'Gerudo Valley', () => 0xb89058, .15, 1);
  R3.clouds = []; for (let i = 0; i < 9; i++) { const c = new THREE.Group(); for (let j = 0; j < 4; j++) { const b = ball(c, 2.5 + r() * 2, 0xffffff, j * 3 - 4, r() * 1.2, r() * 2, 0x777777); b.scale.y = .55; b.castShadow = false; } c.position.set(r() * WX, 30 + r() * 8, r() * WZ); scene.add(c); R3.clouds.push(c); }
}

function buildObstacle(o, scene, trees) {
  const p = W(o), g = new THREE.Group(); g.position.set(p.x, 0, p.z);
  switch (o.type) {
    case 'border': if (o.y === 720) ridge(g, p.w, p.d, 6, 0x6b6a5e, 0x7d7a68, o.x + 3, 0x4f9a3c); else ridge(g, p.w, p.d, 4.6, 0x4e5a48, 0x5b6a52, o.x + o.y, 0x3c7a34); break;
    case 'house': bx(g, p.w, 2.6, p.d, 0xe8d6a8, 0, 1.3, 0); { const r = cone(g, Math.max(p.w, p.d) * .78, 2, 0xb5452e, 0, 3.6, 0, 4); r.rotation.y = Math.PI / 4; } bx(g, 1, 1.7, .1, 0x5a3416, 0, .85, p.d / 2 + .02); bx(g, .9, .9, .1, 0x8ecae6, p.w * .3, 1.6, p.d / 2 + .02); break;
    case 'treewall': case 'wtree': case 'tree': { const along = p.d > p.w, n = o.type === 'wtree' || o.type === 'tree' ? 1 : Math.round(Math.max(p.w, p.d) / 1.6);
      for (let i = 0; i < n; i++) { const t = new THREE.Group(), off = n > 1 ? (i - (n - 1) / 2) * 1.6 : 0; t.position.set(along ? 0 : off, 0, along ? off : 0); const tw = o.type === 'treewall', h = (tw ? 4.2 : 2.2) + ((i * 7 + o.x) % 5) * .35; cyl(t, .25, .35, h, 0x6b4426, 0, h / 2, 0, 6); const col = o.type === 'wtree' ? 0x1d5a30 : 0x3c9a3c; const q = tw ? 1.35 : 1; cone(t, 1.3 * q, 2.2 * q, col, 0, h + .7, 0, 7); cone(t, .95 * q, 1.7 * q, col, 0, h + 1.7 * q, 0, 7); g.add(t); } } break;
    case 'rock': bx(g, p.w, 1.1, p.d, 0x8a6a42, 0, .55, 0); bx(g, p.w + .3, .2, p.d + .3, 0xb08850, 0, 1.2, 0); break;
    case 'stonewall': ridge(g, p.w, p.d, 5.2, 0x8a8a9a, 0x9a9aaa, o.y + 5, 0xb8b8c4); break;
    case 'cliff': if (o.h === 420) { ridge(g, p.w, p.d, 6.5, 0xb08a50, 0xc8a064, 9, 0xe0c080); break; } { const m = bx(g, p.w, 1.6 + ((o.x * 3 + o.y) % 4) * .5, p.d, 0xc8a064, 0, .9, 0); m.rotation.y = ((o.x + o.y) % 7) * .1; } break;
    case 'temple': bx(g, p.w, .5, p.d + 1.5, 0xd8d8e8, 0, .25, .6); bx(g, p.w - .6, 3.6, p.d, 0xe4e4f2, 0, 2.3, 0); cone(g, p.w * .58, 2.4, 0x6a7fc0, 0, 5.3, 0, 3).rotation.y = Math.PI / 2; bx(g, 1.6, 2.4, .2, 0x2a3566, 0, 1.4, p.d / 2 + .02, 0x112244);
      for (let i = -2; i <= 2; i++) cyl(g, .22, .22, 3.6, 0xffffff, i * (p.w / 5), 2.3, p.d / 2 + .3, 8); break;
    case 'pillar': cyl(g, p.w * .32, p.w * .38, 4.2, 0xdcdce8, 0, 2.1, 0, 8); bx(g, p.w * .8, .3, p.w * .8, 0xf0f0fa, 0, 4.3, 0); bx(g, p.w * .8, .3, p.w * .8, 0xb8b8c8, 0, .15, 0); break;
    case 'fence': bx(g, p.w, .12, .12, 0x8a5a2e, 0, .7, 0); bx(g, p.w, .12, .12, 0x8a5a2e, 0, .4, 0); for (let i = 0; i <= 4; i++) bx(g, .14, .9, .14, 0x6b4426, -p.w / 2 + i * p.w / 4, .45, 0); break;
    case 'bush': ball(g, Math.max(.6, p.w * .55), 0x2f8a3a, 0, .55, 0).scale.y = .8; break;
    default: bx(g, p.w, 1, p.d, 0x888888, 0, .5, 0);
  }
  scene.add(g); (R3.stat = R3.stat || []).push(g);
  if (o.label) { const s = textSprite(o.label, '#7a4a1e', '#ffd86b', .9); s.position.set(p.x, o.type === 'temple' ? 8 : 5.6, p.z); scene.add(s); }
}

function buildGround(scene) {
  const P = (x0, y0, x1, y1, c, y) => { const m = new THREE.Mesh(new THREE.PlaneGeometry((x1 - x0) * S, (y1 - y0) * S), mat(c)); m.rotation.x = -Math.PI / 2; m.position.set((x0 + x1) / 2 * S, y || 0, (y0 + y1) / 2 * S); m.receiveShadow = true; scene.add(m); return m; };
  P(0, 0, 580, 720, 0x5fae4c); P(580, 0, 1230, 720, 0x78c060); P(1230, 0, 1800, 720, 0xb9b9c8); P(0, 720, 900, 1520, 0x2f6b3a); P(900, 720, 1800, 1520, 0xe0c080);
  P(1300, 100, 1800, 440, 0xd0d0e0, .02); P(1500, 380, 1600, 700, 0x9a9ab0, .03);                                // plaza e escada do templo
  P(600, 330, 1200, 380, 0xc8a46a, .03); P(150, 300, 570, 350, 0xc8a46a, .03); P(660, 40, 700, 720, 0xc8a46a, .03); // trilhas
  const L = LAKE; const lk = P(L.x * 2, L.y * 2, (L.x + L.w) * 2, (L.y + L.h) * 2, 0x3aa0e0, .05); lk.material = new THREE.MeshLambertMaterial({ color: 0x3aa0e0, transparent: true, opacity: .85, emissive: 0x0a3050 }); R3.lake = lk;
}

function buildWorld(scene) {
  buildGround(scene); obstacles.forEach(o => buildObstacle(o, scene));
  npcs.forEach(n => {
    const m = n.id === 'kaepora' ? owl() : n.id === 'darunia' ? goron() : human(LOOKS[n.id] || { body: 0x888888, hair: 0x444444 }); m.position.set(n.x * S, 0, n.y * S); scene.add(m);
    const tag = textSprite(n.name, null, '#fff6d8', .9); tag.position.set(n.x * S, (n.id === 'darunia' ? 4.6 : 3.7), n.y * S); scene.add(tag); R3.ents[n.id] = { m, tag, x: n.x * S, z: n.y * S, h: n.id === 'darunia' ? 4.6 : 3.7, npc: n };
  });
  interactables.forEach(o => {
    const g = new THREE.Group(); g.position.set(o.x * S, 0, o.y * S); let h = 2.4, e = { m: g, x: o.x * S, z: o.y * S, o };
    if (o.type === 'sign') { bx(g, .2, 1.4, .2, 0x6b4426, 0, .7, 0); bx(g, 1.6, .9, .15, 0xc89a60, 0, 1.6, 0); h = 2.8; }
    else if (o.type === 'chest' || o.type === 'secret_chest') { const c = o.type === 'chest' ? 0x9a6a30 : 0x6a3a8a; bx(g, 1.3, .8, .9, c, 0, .4, 0); const lid = bx(g, 1.3, .35, .9, c, 0, .98, 0); bx(g, .2, .3, .1, 0xffd23f, 0, .8, .48, 0x553300); e.lid = lid; e.dx = 1; h = 2; }
    else if (o.type === 'pedestal') { cyl(g, 1.4, 1.7, .5, 0x8a8aa0, 0, .25, 0, 8); cyl(g, 1, 1, .9, 0xb0b0c8, 0, .95, 0, 8); const t = new THREE.Group(); [[0, .62], [-.55, -.3], [.55, -.3]].forEach(([x, y]) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(.5, .5, .2, 3), mat(0xffd23f, 0x332200)); m.rotation.x = Math.PI / 2; m.position.set(x, y, 0); t.add(m); }); t.position.y = 2.6; g.add(t); e.tri = t; e.light = new THREE.PointLight(0xffe08a, 0, 14); e.light.position.y = 2.6; g.add(e.light); h = 4.6; }
    else if (o.type === 'bonfire') {
      for (let i = 0; i < 7; i++) { const a = i / 7 * 6.283; ball(g, .28, 0x6a6a76, Math.sin(a) * 1.0, .2, Math.cos(a) * 1.0).scale.set(1, .7, 1); }
      for (let i = 0; i < 5; i++) { const a = i / 5 * 6.283 + .3; seg(g, V3(Math.sin(a) * .75, .3, Math.cos(a) * .75), V3(Math.sin(a) * .12, 1.1, Math.cos(a) * .12), .12, .09, 0x5a3418); }
      e.flame = cone(g, .5, 1.3, 0xff8a1f, 0, 1.0, 0, 6); e.flame.material = new THREE.MeshBasicMaterial({ color: 0xff8a1f }); e.core = cone(g, .3, .9, 0xffe070, 0, .85, 0, 6); e.core.material = new THREE.MeshBasicMaterial({ color: 0xffe070 });
      e.light = new THREE.PointLight(0xff9a40, 2.2, 18); e.light.position.y = 2; g.add(e.light); const beam = new THREE.Mesh(new THREE.CylinderGeometry(.25, .25, 14, 8, 1, true), new THREE.MeshBasicMaterial({ color: 0xffe08a, transparent: true, opacity: .25 })); beam.position.y = 8; g.add(beam); e.beam = beam; h = 3.4; }
    scene.add(g); const tag = textSprite(o.name, null, '#fff6d8', .8); tag.position.set(o.x * S, h + .3, o.y * S); scene.add(tag); e.tag = tag; e.h = h; R3.ents[o.id] = e;
  });
  TORCHES.forEach(([x, y]) => { const g = new THREE.Group(); g.position.set(x * S, 0, y * S); cyl(g, .12, .16, 1.6, 0x4a3a2a, 0, .8, 0, 6); const f = cone(g, .28, .7, 0xff8a1f, 0, 1.95, 0, 5); f.material = new THREE.MeshBasicMaterial({ color: 0xffa030 }); scene.add(g); (R3.torch = R3.torch || []).push(f); });
  // Link, Navi, setas e balão de interação
  R3.link = human(LOOKS.link); scene.add(R3.link);
  R3.navi = new THREE.Group(); R3.navi.add(new THREE.Mesh(new THREE.IcosahedronGeometry(.22, 1), new THREE.MeshBasicMaterial({ color: 0xbfe9ff }))); const nl = new THREE.PointLight(0x9ad8ff, 1, 8); R3.navi.add(nl); scene.add(R3.navi);
  R3.arrow = cone(scene, .5, 1.1, 0xffd23f, 0, 0, 0, 4); R3.arrow.rotation.x = Math.PI; R3.arrow.material = new THREE.MeshBasicMaterial({ color: 0xffd23f }); R3.arrow.visible = false;
  R3.prompt = textSprite('E', '#fdf3c9', '#5a3a14', .6); R3.prompt.visible = false; scene.add(R3.prompt);
}

function initRenderer3D() {
  const cv = document.getElementById('canvas3d'); R3.cv = cv;
  R3.r = new THREE.WebGLRenderer({ canvas: cv, antialias: true }); R3.r.shadowMap.enabled = true; R3.r.shadowMap.type = THREE.PCFSoftShadowMap; R3.r.setPixelRatio(Math.min(1.5, window.devicePixelRatio || 1));
  R3.scene = new THREE.Scene(); R3.scene.background = R3.fog.clone(); R3.scene.fog = new THREE.Fog(0x9ad0f0, 40, 120);
  R3.cam = new THREE.PerspectiveCamera(55, 1, .1, 400);
  R3.hemi = new THREE.HemisphereLight(0xdfefff, 0x4a6a3a, .85); R3.scene.add(R3.hemi);
  R3.sun = new THREE.DirectionalLight(0xfff0d0, .9); R3.sun.position.set(30, 50, 20); R3.sun.castShadow = true; R3.sun.shadow.mapSize.set(1536, 1536); const sc = R3.sun.shadow.camera; sc.left = sc.bottom = -28; sc.right = sc.top = 28; sc.far = 140; R3.scene.add(R3.sun, R3.sun.target);
  buildWorld(R3.scene); buildScenery(R3.scene); (R3.stat || []).forEach(g => { g.updateMatrixWorld(true); g.traverse(o => { o.matrixAutoUpdate = false; }); }); resize3D(); window.addEventListener('resize', resize3D);
  let drag = null; cv.addEventListener('pointerdown', e => { drag = e.clientX; cv.setPointerCapture(e.pointerId); });
  cv.addEventListener('pointermove', e => { if (drag !== null) { R3.yaw -= (e.clientX - drag) * .006; drag = e.clientX; } });
  cv.addEventListener('pointerup', () => drag = null); cv.addEventListener('wheel', e => { R3.dist = Math.max(5, Math.min(16, R3.dist + e.deltaY * .01)); }, { passive: true });
}
function resize3D() { if (!R3.r) return; R3.r.setSize(window.innerWidth, window.innerHeight); R3.cam.aspect = window.innerWidth / window.innerHeight; R3.cam.updateProjectionMatrix(); }

const SKY = { 'Kokiri Village': [0x9ad8f4, 0x5fae4c, .9], 'Hyrule Field': [0x8ccaf6, 0x78c060, 1], 'Temple of Time': [0xa8b8e8, 0x8a8ab8, .85], 'Lost Woods': [0x2a5a48, 0x1a3a22, .5], 'Gerudo Valley': [0xf2c47c, 0xc8a064, 1.05] };
const _c = new THREE.Color(), _v = new THREE.Vector3();
function updateWorld3D(tick) {
  const p = gameState.player, px = p.x * S, pz = p.y * S, J = R3.jump, t = tick / 60, dt = R3.dt || .0167, f = Math.min(2.5, dt * 60);
  // pulo + pulo duplo (Espaço)
  if (J.y > 0 || J.v !== 0) { J.v -= .028 * f; J.y += J.v * f; if (J.y <= 0) { J.y = 0; J.v = 0; J.n = 0; } }
  const L = R3.link; L.position.set(px, J.y, pz); L.rotation.y += (Math.atan2(Math.sin(R3.face - L.rotation.y), Math.cos(R3.face - L.rotation.y))) * (1 - Math.exp(-14 * dt));
  const u = L.userData, sw = Math.sin(R3.walk) * (R3.moving ? .8 : 0); u.legL.rotation.x = sw; u.legR.rotation.x = -sw; u.armL.rotation.x = -sw * .8; u.armR.rotation.x = sw * .8;
  R3.navi.position.set(px + Math.sin(t * 2.4) * 1.1, J.y + 3.3 + Math.sin(t * 3) * .3, pz + Math.cos(t * 2.4) * 1.1);
  // câmera de terceira pessoa
  const cp = Math.cos(R3.pitch), tx = px, ty = 1.6 + J.y * .5, tz = pz;
  if (!R3.camInit) { R3.cam.position.set(tx, ty + 7, tz + 12); R3.camInit = 1; } R3.cam.position.lerp(_v.set(tx + Math.sin(R3.yaw) * cp * R3.dist, ty + Math.sin(R3.pitch) * R3.dist, tz + Math.cos(R3.yaw) * cp * R3.dist), 1 - Math.exp(-9 * dt)); R3.cam.lookAt(tx, ty, tz);
  R3.sun.position.set(px + 30, 50, pz + 20); R3.sun.target.position.set(px, 0, pz);
  // clima por região
  const reg = regionAt(p.x, p.y), k = SKY[reg]; R3.fog.lerp(_c.set(k[0]), .03); R3.scene.background.copy(R3.fog); R3.scene.fog.color.copy(R3.fog); R3.scene.fog.far = reg === 'Lost Woods' ? 70 : 120; R3.hemi.intensity += (k[2] - R3.hemi.intensity) * .03; R3.sun.intensity = k[2] * .9;
  R3.lake.position.y = .05 + Math.sin(t * 2) * .02; R3.clouds.forEach(c => { c.position.x += dt * .8; if (c.position.x > WORLD_WIDTH * S + 40) c.position.x = -40; });
  (R3.torch || []).forEach((f, i) => { f.scale.y = 1 + Math.sin(t * 9 + i) * .2; });
  // entidades
  let near = null, nd = 1e9; const pe = 62 * S;
  Object.values(R3.ents).forEach(e => {
    const d = Math.hypot(px - e.x, pz - e.z), o = e.npc || e.o;
    if (e.npc) { if (d < 130 * S) e.m.rotation.y += (Math.atan2(Math.sin(Math.atan2(px - e.x, pz - e.z) - e.m.rotation.y), Math.cos(Math.atan2(px - e.x, pz - e.z) - e.m.rotation.y))) * .1; e.m.position.y = Math.sin(t * 2 + e.x) * .04; const u2 = e.m.userData; if (u2.wingL) { u2.wingL.rotation.z = .15 + Math.sin(t * 3) * .1; u2.wingR.rotation.z = -.15 - Math.sin(t * 3) * .1; } else if (u2.armL) { u2.armL.rotation.x = Math.sin(t * 1.6 + e.x) * .05; u2.armR.rotation.x = -u2.armL.rotation.x; } }
    e.tag.visible = d < 22; if (d < pe && d < nd) { nd = d; near = e; }
    if (e.flame) { e.flame.scale.set(1 + Math.sin(t * 11) * .12, 1 + Math.sin(t * 13) * .2, 1); e.light.intensity = 2 + Math.sin(t * 17) * .4; const lit = (gameState.bonfires || []).includes(o.id); e.beam.visible = lit; }
    if (e.tri) { e.tri.rotation.y = t; const n = [gameState.triforce.power, gameState.triforce.wisdom, gameState.triforce.courage].filter(Boolean).length; e.light.intensity = n * .9 + (typeof agendaUnlocked === 'function' && agendaUnlocked() ? 1 : 0); e.tri.children.forEach(c => c.visible = true); }
    if (e.lid) { const op = (gameState.collectibles || []).includes(o.item); e.lid.rotation.x = op ? -1.1 : 0; e.lid.position.set(0, op ? 1.15 : .98, op ? -.35 : 0); }
  });
  R3.prompt.visible = !!near && !isDialogOpen; if (near) R3.prompt.position.set(near.x, near.h + 1.1 + Math.sin(t * 6) * .12, near.z);
  const gt = gameState.guideTarget && R3.ents[gameState.guideTarget]; R3.arrow.visible = !!gt; if (gt) { R3.arrow.position.set(gt.x, gt.h + 2.6 + Math.sin(t * 5) * .4, gt.z); R3.arrow.rotation.y = t * 2; }
}

function renderFrame3D(tick) {
  if (!R3.r) return; updateWorld3D(tick); R3.r.render(R3.scene, R3.cam);
  const p = gameState.player; window.__cam = { x: p.x - 330, y: p.y - 230, w: 660, h: 460 };
  if (typeof drawMinimap === 'function') drawMinimap(tick);
}
