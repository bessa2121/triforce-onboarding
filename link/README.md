# LINK: A Jornada do Primeiro Dia — v2 (refinamento visual)

Site estático, pronto para Vercel (`vercel.json` aponta `outputDirectory` para `public/`). Sem build.
Dev local: `npm run dev` (ou qualquer servidor estático em `public/`).

## Arquitetura
```
public/
  index.html            marcação + ordem de carga dos scripts
  css/main.css          CSS original (layout, modais, tabs)
  css/theme.css         NOVO tema pixel: molduras escalonadas, madeira/ouro, XP segmentada
  js/core/              audio.js, state.js (estado + localStorage, chave inalterada)
  js/data/world.js      obstáculos, NPCs, interativos (dados + colisão)
  js/game/              hud, dialog, missions, diary, session  (lógica ORIGINAL, intacta)
  js/render/            camada visual — só desenha, nunca decide regra
    pixel.js            paleta, grade (1 px de arte = 2 px de mundo), helpers, contorno automático
    sprites.js          gerador de spritesheets (7 personagens x 4 direções x 5 frames) + objetos
    portraits.js        retratos 32x32 dos diálogos
    icons.js            corações, triforce, som (data URLs em pixel art)
    world-art.js        "assa" o mapa inteiro em um canvas (terreno, casas, templo, lago…)
    renderer.js         câmera de escala inteira, y-sort, tochas, água, Navi, partículas
  js/main.js            input (teclado/mobile) + game loop
```
Dependência: scripts clássicos em ordem (as funções globais usadas por `onclick` do HTML original continuam funcionando). Migrar para ES modules/Vite é o próximo passo natural.

## O que mudou / o que NÃO mudou
Preservados: missões, diálogos, XP, corações, diário, bolsa, save (`triforce_onboarding_save_v1`), controles, coordenadas e colisões.
Adicionados em `world.js`: 2 cercas e 4 arbustos com colisão (cosmético, fora de qualquer rota de missão).
