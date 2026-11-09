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

## Mapa e música por região
O mundo tem 1800x1520: faixa norte (Kokiri Village, Hyrule Field, Temple of Time) e faixa sul (Lost Woods e Gerudo Valley), ligadas por duas passagens no muro central (x 640-760 e x 1290-1400).
Ao mudar de região, a trilha muda com crossfade de ~1,6 s (`AudioEngine.REGION` em `src/infrastructure/audio.js`):
Kokiri Village → kokiri · Hyrule Field → mido (Epona) · Temple of Time → zelda · Lost Woods → saria · Gerudo Valley → darunia.
Falar com um NPC sobrepõe a trilha da região pela do personagem; ao fechar o diálogo volta a da região.

## Regiões, personagens e missões (v3)
Percurso: Kokiri Village > Hyrule Field > Lost Woods > Gerudo Valley > Temple of Time.
| Região | Personagem | Missão (tema) |
|---|---|---|
| Kokiri Village | Talon (TI) | 1. Acessos, MFA, TI-sombra, cards e compartilhamento seguro |
| Hyrule Field | Mido (Colega) | 2. Regras não ditas da equipe (Baú de Ferramentas também abre) |
| Lost Woods | Saria (RH) | 3. Políticas: férias, presentes, LGPD, conduta, horas extras |
| Gerudo Valley | Darunia (Gestor) | 4. Feedback, prioridades e impacto |
| Temple of Time | Impa (Segurança) e Zelda | 5. Ataques além do phishing; 6. Desafio Final |

As perguntas ficam em `QUIZ` (`src/application/missions.js`) no formato `[cenário, correta, errada1, errada2, errada3, explicação]`; as alternativas são embaralhadas a cada exibição. Save migrado para `link_onboarding_save_v2`. A pasta `link/` é uma cópia antiga e não foi alterada.
