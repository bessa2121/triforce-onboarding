# Hyrule Onboarding Quest (LINK: A Jornada do Primeiro Dia)

RPG 3D (Three.js, low-poly procedural) de onboarding corporativo inspirado em Zelda; a lógica 2D original foi mantida. Site estático: **não há build**; a raiz do repositório é o site.

## Rodar / Deploy
- Local: `npm run dev` (precisa de servidor http; não abra o `index.html` direto).
- Vercel: importe o repositório, Framework **Other**, Build Command vazio, Output Directory vazio. O `index.html` da raiz é servido.

## Arquitetura (Clean Architecture MVP)
Dependências apontam para dentro: `presentation → application → domain`; `infrastructure` fornece serviços (áudio) usados pela aplicação.
```
index.html                 composição: ordem de carga dos scripts
assets/
  data/                    knowledge-base.json (FAQ da Kaepora Gaebora)
  audio/                   kokiri, saria, mido, talon, zelda, darunia (.mp3)
  styles/                  main.css (layout) · theme.css (tema pixel)
src/
  domain/                  dados e estado: config.js (agenda), state.js (estado + save), world.js (mapa, NPCs, colisões)
  application/             casos de uso: dialog, missions, diary, hud, session, kaepora (FAQ), agenda (Pedestal), main (input + loop)
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

## Kaepora Gaebora: Mentor de Autonomia e Central de Ajuda
Coruja no jardim da Casa Kokiri, em Kokiri Village (perto do início). Ao conversar, abre a Central de Ajuda:
- **Busca e menu**: categorias (Acessos, Benefícios, Processos, Dicas de Equipe, Segurança), palavra-chave livre (ignora acentos e caixa) e o atalho "Qual é o meu próximo passo?" (usa a missão atual).
- **Triagem**: cada resposta indica o NPC/setor, a região e a direção no mapa a partir de onde o jogador está; "Marcar no mapa" coloca uma seta dourada sobre o destino.
- **Métrica silenciosa**: `gameState.autonomy` guarda visitas, consultas, tópicos, categorias, buscas, destinos marcados e buscas sem resposta (útil para achar lacunas no FAQ). Nada disso aparece para o jogador durante o jogo.
- **Conteúdo**: edite `assets/data/knowledge-base.json` (entradas, palavras-chave, NPC de destino, textos da coruja). O conteúdo atual é de treinamento (empresa fictícia); troque pelos dados reais, em especial a seção Benefícios.

## Pedestal Central: agenda real com a liderança
Em Temple of Time, logo abaixo da Zelda. Pisar nele pela primeira vez ou apertar E abre o pergaminho.
- **Trava**: só libera depois que o jogador **termina o jogo** (as 6 missões, incluindo o Desafio Final da Zelda). Antes disso, o pedestal avisa e a Navi diz quantas missões faltam.
- **Formulário**: nome, e-mail, tema (Dúvida de Projeto, Feedback, Carreira, Outro), dúvida em uma frase (opcional), data e horário (dias úteis, 09:00 a 18:00, configurável).
- **Agenda real**: "Abrir no Google Calendar" (evento preenchido, liderança como convidada), "Baixar .ics" e, se `bookingUrl` estiver configurado, botão para Calendly/Cal.com com nome, e-mail e tema na URL.
- **Confirmação**: "Selar o pergaminho" salva em `gameState.sched.requests` e no banco local `triforce_agenda_v1` (sobrevive ao reinício da jornada), toca a fanfarra, anima a Triforce, dá a conquista "Primeira Conversa de Alinhamento" (+50 XP) e registra no Relatório Final.
- **Para a liderança receber de verdade**: preencha em `src/domain/config.js` o `leaderEmail` (entra no convite) e/ou `webhookUrl` (POST em JSON para Apps Script, Power Automate, Zapier ou Slack). Sem isso, o registro fica só no navegador do colaborador. Um site estático não tem como enviar e-mail por conta própria.

## Relatório Final
A tela de vitória mostra autonomia e agenda. "Copiar relatório (JSON)" exporta `getFinalReport()`. "Continuar explorando" fecha a tela para quem ainda quer agendar no Pedestal.

## Jogabilidade (v2.1)
- **Ordem livre**: os cinco sábios (Talon, Mido, Saria, Darunia e Impa) podem ser visitados em qualquer ordem, e o baú de Hyrule também abre o desafio do Mido. A Zelda abre o Desafio Final quando os cinco estiverem concluídos.
- **Perguntas**: 3 por missão, em cenários mais complexos, com alternativas de tamanho parecido (a correta não é a maior nem a menor por padrão). Os textos ficam em `src/application/missions.js`, objeto `QUIZ`: `[cenário, correta, errada1, errada2, errada3, explicação]`.
- **Sem corações**: errar não custa vida; zera o combo, mostra a explicação e a pergunta volta depois.
- **Recompensas**: cada acerto dá XP e rupias (bônus por acertar de primeira e por combo); fim de missão dá bônus, e missão sem erros dá o selo "Mão Firme". Marcos de rupias liberam Botas de Pégaso (100, +15% de velocidade), Bênção de Nayru (300, +25% de XP) e o título Mestre das Rupias (600). Tudo aparece no relatório final.
- **Minimapa**: canto superior direito; M ou clique alterna entre pequeno e grande. Mostra jogador, campo de visão, sábios pendentes (dourado) e concluídos (verde), Kaepora, Zelda, Pedestal e o destino marcado pela coruja.

## Fogueira (descanso e dashboard)
Uma fogueira com feixe dourado ao estilo "graça", no centro de Hyrule Field. Interagir (E) mostra a faixa "FOGUEIRA ACESA" (1ª vez: +15 XP, +10 rupias, conquista Chama Acesa), salva o progresso e abre o dashboard: um brilho nasce na chama, o feixe sobe e o painel desabrocha a partir dela, com os cards entrando em cascata (animação em transform/opacity, suave, com suporte a `prefers-reduced-motion`).
O painel traz missões, progresso do jogo, combo/acertos/jornada, acertos por área (gráfico de linha), domínio por área, trilha de respostas, "Onde você pode melhorar" (temas de revisão calculados pelos erros), tesouros, conquistas e status do Pedestal. Os dados vêm de `gameState.stats` (registrado a cada resposta). A coruja pode indicar a fogueira (pergunta "Onde vejo meu progresso?").


## Versão 3D
- `src/presentation/render3d/renderer3d.js`: mundo, personagens e câmera em terceira pessoa (Three.js r158 em `assets/vendor/`). O mapa 2D de `world.js` (x,y) vira (x, 0, z) com escala 0,05; colisões e interações continuam 2D.
- Controles (no estilo Breaking Code): WASD relativo à câmera, Shift correr, Espaço pulo/pulo duplo, E interagir, arrastar mouse ou Q/C girar câmera, roda do mouse zoom.
- O minimapa continua usando a arte 2D (`world-art.js`).
