# Hyrule Onboarding Quest (LINK: A Jornada do Primeiro Dia)

RPG 2D de onboarding corporativo em pixel art inspirada em Zelda. Site estático: **não há build**; a raiz do repositório é o site.

## Rodar / Deploy
- Local: `npm run dev` (precisa de servidor http; não abra o `index.html` direto).
- Vercel: importe o repositório, Framework **Other**, Build Command vazio, Output Directory vazio. O `index.html` da raiz é servido.

## Arquitetura (Clean Architecture MVP)
Dependências apontam para dentro: `presentation → application → domain`; `infrastructure` fornece serviços (áudio) usados pela aplicação.
```
index.html                 composição: ordem de carga dos scripts
assets/
  audio/                   kokiri, saria, mido, talon, zelda, darunia (.mp3)
  styles/                  main.css (layout) · theme.css (tema pixel)
src/
  domain/                  dados e estado: state.js (estado + save), world.js (mapa, NPCs, colisões)
  application/             casos de uso: dialog, missions, diary, hud, session, main (input + loop)
  infrastructure/          audio.js (arquivos locais -> YouTube -> sintetizado)
  presentation/render/     só desenha: pixel, sprites, portraits, icons, world-art, renderer
```
Usa scripts clássicos (globais) porque o HTML tem `onclick`. Próximo passo: ES modules + Vite.

## Trocar músicas
Substitua os MP3 em `assets/audio/` mantendo os nomes (ver `LEIAME.txt`).
