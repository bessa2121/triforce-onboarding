// ============================================================================
// 6. MISSÕES POR REGIÃO + MOTOR DE PERGUNTAS
// Percurso: Kokiri Village > Hyrule Field > Lost Woods > Gerudo Valley > Temple of Time
// Pergunta = [cenário, CORRETA, errada1, errada2, errada3, explicação]. As alternativas são embaralhadas.
// ============================================================================
const QUIZ = {
  1: { npc: "talon", xp: 20, title: "Acessos, Senhas e Ferramentas",
    intro: "Opa, Link! Aqui na Oficina TI vamos testar como você lida com acessos, MFA, ferramentas e documentos. São 3 cenários reais, e nenhum é tão simples quanto parece. Pronto?",
    hint: "Talon fica na Oficina TI, em Kokiri Village.",
    qs: [
      ["Sexta, 17h: o diretor pede que um consultor externo receba hoje o relatório de clientes. A pasta oficial é restrita à equipe e o consultor ainda não tem conta corporativa. Qual o melhor caminho?", "Pedir à TI uma conta temporária de leitura ao consultor, com data de expiração, e avisar o diretor do horário previsto.", "Exportar o relatório sem as colunas de CPF e enviar por e-mail, registrando no chamado que foi uma exceção pontual de sexta.", "Gerar um link de visualização aberto na pasta, com validade de 24 horas, já que o consultor só precisa ler o conteúdo.", "Compartilhar a pasta com o e-mail pessoal do consultor, em modo leitura, e lembrar de remover o acesso na segunda cedo.", "Acesso nominal, de leitura e com expiração mantém rastreabilidade e o menor privilégio. Link aberto circula sem controle; a planilha filtrada ainda contém dados de clientes fora do ambiente; e e-mail pessoal depende de uma remoção manual que costuma ser esquecida."],
      ["Durante uma reunião, uma notificação de MFA chegou ao seu celular e você aprovou por reflexo, sem lembrar se foi você quem iniciou o login. Nada estranho apareceu até agora. O que fazer?", "Trocar a senha, encerrar as sessões ativas e reportar à Segurança, informando o horário aproximado da aprovação.", "Acompanhar a conta por alguns dias e só reportar se aparecer algum alerta de login vindo de outro local ou dispositivo.", "Avisar apenas o gestor, que decide se o episódio é relevante para a TI, e manter a senha atual até receber retorno dele.", "Trocar a senha por conta própria e dispensar o reporte, já que o acesso foi corrigido antes que qualquer dano ocorresse.", "A aprovação pode ter dado a um invasor uma sessão válida. Trocar a senha e encerrar sessões corta o acesso, e o reporte dá à Segurança o horário para procurar rastros. Esperar ou corrigir em silêncio deixa o incidente sem investigação."],
      ["Seu time quer ligar um app gratuito de automação ao quadro de tarefas oficial. Ele exige um token de API com leitura de todos os cards da empresa e promete economizar duas horas por semana. Como proceder?", "Descrever o ganho e os dados envolvidos em um pedido à TI e manter o processo manual até a avaliação terminar.", "Gerar o token restrito ao seu projeto e testar por duas semanas, para levar à TI números reais de economia de tempo.", "Conectar o app a uma conta de teste sem dados reais e usá-la de forma contínua, pois dados fictícios não oferecem risco.", "Pedir ao colega mais experiente que gere o token no nome dele, para que a automação não fique vinculada à sua conta.", "Ferramenta nova com acesso amplo precisa de avaliação de segurança e contrato antes do uso. Testar 'só no seu projeto' já cria a integração; usar conta de teste como atalho e gerar o token no nome de outra pessoa só escondem a origem do risco."]
    ] },
  2: { npc: "mido", xp: 20, title: "Regras Não Ditas da Equipe",
    intro: "Ei, Link! Aqui no campo existem costumes que não estão escritos em nenhum pergaminho. Vou te dar 3 situações do dia a dia da equipe, e em todas há mais de uma resposta que parece razoável. (Dica: o Baú de Ferramentas ao sul também abre este desafio.)",
    hint: "Mido está em Hyrule Field, perto da Mesa da Equipe (norte do campo).",
    qs: [
      ["Relendo a ata de ontem, você vê que ela omite o risco que levantou na reunião. A decisão já está em execução. Como agir?", "Escrever ao líder com o risco, o dado que o sustenta e o pedido de incluir o ponto na ata, sem expor mais ninguém.", "Acrescentar você mesmo o risco na ata compartilhada, já que o documento é editável por todos os participantes da reunião.", "Levantar o risco novamente na próxima reunião geral, para que o time inteiro avalie a decisão com total transparência.", "Acompanhar a execução em silêncio e guardar registros pessoais, para demonstrar o risco caso ele realmente se concretize.", "O caminho direto e documentado é pedir o ajuste ao responsável pela ata, com dado e sem exposição. Editar a ata de terceiros altera um registro oficial; expor o líder diante do grupo e guardar provas para depois não resolvem o risco agora."],
      ["Mido pediu que você revise a apresentação dele até quinta. Na quarta, Darunia marcou uma entrega sua para o mesmo dia, e você só consegue cumprir uma das duas a tempo. O que faz?", "Informar os dois do conflito hoje, propor a Mido revisar na sexta e confirmar com Darunia a prioridade da entrega.", "Priorizar Mido, que sempre ajuda você, e avisar Darunia do atraso apenas no dia, com um pedido de desculpas sincero.", "Fazer a revisão de Mido à noite e a entrega no dia seguinte, para atender os dois, aceitando dormir menos nesses dias.", "Pedir a outro colega que revise a apresentação no seu lugar, sem avisar Mido, para evitar uma conversa desconfortável.", "Conflito de prazos se resolve cedo e com os envolvidos: renegociar com Mido e validar a prioridade com quem definiu a entrega. Esconder, delegar sem avisar ou se esgotar para cumprir tudo tira a escolha das pessoas e costuma piorar a qualidade."],
      ["Um colega de outra área critica seu trabalho no canal geral, diante de 80 pessoas. O erro apontado é real, mas o tom é desrespeitoso. Qual a melhor resposta inicial?", "Reconhecer o erro em uma frase no canal, informar o prazo da correção e conversar com o colega em privado sobre o tom.", "Responder no canal apontando que o tom foi inadequado e pedindo respeito, antes de tratar do erro em si.", "Ignorar a mensagem no canal e corrigir o erro em silêncio, para não alimentar uma discussão pública.", "Pedir ao gestor que converse com o colega sobre o tom e só corrigir o erro depois dessa conversa.", "Como o erro é verdadeiro, reconhecer e dar prazo encerra o assunto em público; o tom se trata em privado. Reagir ao tom no canal vira briga, o silêncio parece descaso e condicionar a correção a uma conversa atrasa o que é seu."]
    ] },
  3: { npc: "saria", xp: 20, title: "Políticas da Empresa",
    intro: "Link, a Floresta Perdida é onde todo mundo se perde... nas regras! São 3 casos sobre políticas da empresa (fictícias, para treinamento), e os detalhes fazem toda a diferença.",
    hint: "Saria está em Lost Woods: atravesse a passagem ao sul de Hyrule Field (entre x 640 e 760).",
    qs: [
      ["Suas férias, já aprovadas, começam em três semanas. Surge uma reunião com cliente estratégico no seu primeiro dia de folga. Seu gestor diz: 'se puder participar, depois a gente compensa'. O que fazer?", "Pedir o combinado por escrito e formalizar o ajuste no sistema de RH antes de confirmar a sua participação na reunião.", "Participar remotamente por uma hora e não registrar nada, já que o tempo é curto e a compensação foi combinada de boca.", "Recusar de imediato por conta das férias aprovadas, sem discutir alternativas, e deixar a reunião sob responsabilidade do gestor.", "Participar e lançar as horas no banco de horas depois, sem mexer nas férias, para não perder nenhum dia de descanso.", "Combinado verbal não protege você nem a empresa. O ajuste precisa ficar por escrito e no sistema de RH, e só então a participação deve ser aceita. Participar sem registro ou recusar sem alternativa ignora uma das duas partes da regra."],
      ["A área comercial pede o histórico de reclamações de clientes, com nome e telefone, para alimentar uma ferramenta externa de análise de texto. Já existe contrato com a ferramenta. O que você faz?", "Encaminhar ao encarregado de dados para avaliar finalidade e base legal e sugerir anonimizar os registros antes de qualquer envio.", "Remover só os nomes e enviar os telefones, que isolados não identificam o cliente, mantendo o texto das reclamações.", "Enviar o histórico completo, pois o contrato com a ferramenta prevê confidencialidade e isso cobre o uso solicitado.", "Liberar apenas as reclamações dos últimos seis meses, reduzindo o volume de dados para limitar a exposição ao risco.", "Uso novo de dados pessoais exige finalidade e base legal avaliadas pelo encarregado, e anonimizar reduz o risco. Telefone identifica o titular; cláusula de confidencialidade não substitui base legal; reduzir o período não elimina o problema."],
      ["Seu gestor pede que você avalie propostas de fornecedores, e um dos sócios de uma candidata é seu cunhado. Ele afirma que a decisão é técnica e que o parentesco não importa. Qual a postura correta?", "Declarar o parentesco por escrito ao Compliance e se afastar da avaliação, mesmo que o critério seja de fato técnico.", "Participar da avaliação e registrar o parentesco na ata, deixando a transparência garantir a lisura do processo.", "Avaliar só os critérios técnicos, sem opinar sobre preço, e informar o parentesco apenas se esse fornecedor for escolhido.", "Pedir que o gestor assuma a responsabilidade pela escolha, já que a orientação para participar partiu dele.", "Conflito de interesses se resolve com declaração formal e afastamento, não com autorização do gestor nem com transparência parcial. Informar só se vencer chega tarde, e transferir a responsabilidade não elimina o vínculo."]
    ] },
  4: { npc: "darunia", xp: 20, title: "Feedback, Prioridades e Impacto",
    intro: "Hah! No vale o calor é grande e o prazo também. Vou testar como você lida com feedback, prioridades e impacto em 3 situações. Responda com honestidade!",
    hint: "Darunia está em Gerudo Valley: cruze a Lost Woods até o sul e siga o desfiladeiro a leste.",
    qs: [
      ["Na avaliação, Darunia diz que você 'não demonstra proatividade'. Você entregou tudo no prazo e achou o comentário vago, mas a reunião acabou. Qual o próximo passo?", "Marcar 15 minutos para pedir dois exemplos recentes e combinar o que ele gostaria de ver nas próximas semanas.", "Enviar um e-mail com as entregas do trimestre feitas no prazo, para documentar que o feedback não reflete os fatos.", "Aguardar o próximo ciclo de avaliação e ver se o comentário se repete, para só então pedir mais detalhes.", "Perguntar a colegas próximos o que eles acham da sua proatividade, para saber se o feedback procede antes de reagir.", "Feedback vago só vira ação com exemplos e um combinado de expectativa. Rebater com a lista de entregas defende o passado; esperar o ciclo seguinte perde meses; e consultar colegas substitui a visão de quem avalia."],
      ["Na segunda chegam três demandas: o relatório mensal de Darunia (sexta), um ajuste urgente pedido por cliente (terça) e uma melhoria interna sem prazo. Sua capacidade é de duas. Como decidir?", "Mostrar a Darunia o esforço das três, propor adiar a melhoria interna e confirmar a prioridade entre as outras duas.", "Fazer o ajuste do cliente e a melhoria, por serem menores, e entregar o relatório mensal com menos análise que o habitual.", "Decidir sozinho adiar a melhoria interna e avisar apenas se Darunia perguntar sobre o andamento dessas tarefas.", "Pedir ajuda a Mido com a melhoria e tentar as três ao mesmo tempo, aceitando horas extras se for necessário.", "Conflito de capacidade é decisão de prioridade, e quem decide precisa ver o esforço de cada item. Reduzir a qualidade, decidir sem comunicar ou prometer tudo com horas extras esconde o limite real."],
      ["Seu relatório semanal alimenta a reunião de diretoria de amanhã. Você descobre que dois indicadores usam uma fórmula antiga que superestima a receita em cerca de 3%. O que faz?", "Avisar Darunia hoje e enviar a versão corrigida, com uma nota clara sobre o que mudou nos números e o motivo.", "Corrigir a fórmula no relatório de hoje e seguir normalmente, pois a versão certa substitui a anterior sem confusão.", "Enviar o relatório como está, com uma ressalva no rodapé sobre a possível diferença, e corrigir na semana seguinte.", "Esperar a reunião e apresentar a correção ao final, caso alguém questione os números da receita apresentados.", "Um erro que afeta decisão deve ser avisado antes de ser usado, com versão corrigida e nota de mudança. Corrigir sem avisar quebra a rastreabilidade; ressalva no rodapé e correção posterior deixam a diretoria decidir com número errado."]
    ] },
  5: { npc: "impa", xp: 20, title: "Ataques Além do Phishing",
    intro: "Link, phishing é só a porta mais conhecida. Invasores também usam mensagens falsas, visitas, redes e pretextos. Vou apresentar 3 situações, e todas pedem sangue frio.",
    hint: "Impa está em Temple of Time: suba pela passagem ao norte de Gerudo Valley (x 1290 a 1400).",
    qs: [
      ["No app de mensagens da empresa, uma conta com nome e foto do diretor financeiro pede a aprovação urgente de um boleto de R$ 48 mil. A conta foi criada hoje e ele está de férias. O que fazer?", "Não aprovar, ligar para o número cadastrado do diretor, reportar a conta à Segurança e guardar a conversa como evidência.", "Responder pedindo o comprovante da cobrança e aprovar somente se o documento enviado parecer legítimo e coerente.", "Aprovar mantendo o pagamento em análise, para poder estornar caso depois se confirme que era uma fraude.", "Fazer na própria conversa uma pergunta que só o diretor saberia responder e aprovar se a resposta estiver correta.", "Urgência, autoridade e sigilo são o padrão da fraude do executivo; a confirmação deve sair do canal suspeito. Documento, 'estorno depois' e perguntas no mesmo chat continuam sob controle de quem escreve."],
      ["Um técnico uniformizado, com ordem de serviço impressa, diz que veio trocar um equipamento na sala de servidores e que a recepção já liberou. A recepcionista saiu para o almoço. O que fazer?", "Pedir que aguarde na recepção, confirmar a visita com a TI por canal interno e acompanhá-lo se for confirmada.", "Fotografar a ordem de serviço e o crachá e enviar à TI, liberando a entrada enquanto a resposta não chega.", "Liberar a entrada sob a condição de acompanhá-lo o tempo todo, já que ele apresenta documento e uniforme.", "Anotar o número da ordem de serviço, conferir no site da empresa dele e liberar se as informações forem coerentes.", "Documento e uniforme são fáceis de forjar; a confirmação precisa vir de um canal que o visitante não controla, antes da entrada. Liberar enquanto espera ou conferir informações fornecidas por ele não verifica nada."],
      ["Em viagem, você precisa enviar um contrato hoje. O hotel oferece Wi-Fi sem senha, você tem 2 GB de dados móveis e a VPN oficial está instável, caindo a cada poucos minutos. Qual a melhor opção?", "Enviar pelos dados móveis, que bastam para o arquivo, e avisar a TI da instabilidade da VPN depois do envio.", "Usar o Wi-Fi do hotel com a VPN instável, reenviando o arquivo sempre que a conexão cair antes de completar.", "Conferir com a recepção o nome exato da rede do hotel e usar o Wi-Fi, evitando assim redes clonadas por golpistas.", "Enviar o contrato pelo e-mail pessoal, usando dados móveis, para fugir da rede do hotel e da VPN problemática.", "Dados móveis dão um canal que você controla, sem expor o contrato a uma rede aberta. VPN que cai deixa o tráfego exposto no meio do envio; confirmar o nome da rede não a torna segura; e e-mail pessoal tira o documento do ambiente da empresa."]
    ] },
  6: { npc: "zelda", xp: 30, title: "O Desafio de Hyrule",
    intro: "Link, você ouviu os cinco sábios. O Desafio Final reúne tudo o que você viveu em Hyrule em 3 casos que misturam ferramentas, cultura, políticas e segurança. Desta vez, sem dicas.",
    hint: "Zelda está em Temple of Time, acima do Pedestal Central.",
    qs: [
      ["Você percebe que um colega usa há semanas o login de um estagiário já desligado para abrir uma pasta que ele próprio não pode acessar. Ele diz que é só para agilizar o trabalho. O que fazer?", "Reportar à Segurança ou ao canal de ética com os fatos que viu, sem confrontar o colega nem investigar por conta própria.", "Conversar com o colega em privado e dar um prazo para ele regularizar o acesso antes de qualquer reporte formal.", "Pedir à TI apenas o bloqueio do login do estagiário desligado, sem mencionar quem o estaria usando, para evitar atrito.", "Avisar o gestor do colega de maneira informal e deixar que ele decida se o caso merece chegar à Segurança.", "Uso de credencial de terceiros é incidente de segurança e pode envolver acesso indevido a dados. A Segurança precisa investigar o histórico; avisar o colega antes pode apagar rastros, e bloquear sem contexto ou delegar a decisão deixa o risco sem tratamento."],
      ["Sua entrega depende de uma base do RH com dados pessoais. O prazo é curto, o responsável está de licença e o substituto envia por e-mail a base completa, com colunas de que você não precisa. O que faz?", "Usar só as colunas necessárias, não repassar o arquivo, avisar o encarregado de dados do excesso e pedir o canal oficial.", "Usar a base completa para não atrasar e apagar o arquivo ao terminar a entrega, evitando guardar dados além do necessário.", "Devolver o e-mail sem usar nada, explicando a política ao substituto, e comunicar o atraso da entrega ao seu gestor.", "Usar as colunas necessárias e arquivar a base completa na pasta do projeto, caso alguém precise dos outros dados depois.", "Minimizar o uso, conter a circulação e avisar o encarregado trata o envio excessivo na origem, sem parar a entrega. Usar tudo e apagar depois já ampliou a exposição; devolver sem comunicar o encarregado deixa o e-mail circulando; arquivar a base completa amplia o risco."],
      ["Você quer discutir carreira com a liderança, mas parte das suas dúvidas já foi respondida no Diário de Jornada e na Central de Ajuda. O que torna essa conversa mais produtiva?", "Chegar com o que já consultou, dizer o que tentou resolver e levar apenas o que depende da decisão da liderança.", "Chegar com a lista completa de dúvidas, inclusive as respondidas, para a liderança confirmar cada resposta uma a uma.", "Esperar a liderança abrir o assunto de carreira, para não parecer ansioso, e aproveitar para ouvir as expectativas.", "Pedir uma reunião longa, de uma hora, para cobrir todos os temas possíveis, sem montar pauta para manter a conversa natural.", "Autonomia é chegar com o dever de casa feito: o tempo da liderança fica para decisões, contexto e orientação de carreira. Pedir confirmação de tudo, esperar o convite ou ir sem pauta desperdiça a conversa."]
    ] }
};

// Missões em ordem livre: cada sábio tem a sua; a final (Zelda) abre quando as cinco estiverem concluídas.
const NPC_MISSION = { talon: 1, mido: 2, saria: 3, darunia: 4, impa: 5, zelda: 6 };
const missionDone = (n) => (gameState.completedMissions || []).includes(n);
const pendingMissions = () => [1, 2, 3, 4, 5].filter(n => !missionDone(n));
const finalUnlocked = () => pendingMissions().length === 0;
const missionNpcName = (n) => (npcs.find(x => x.id === QUIZ[n].npc) || {}).name || QUIZ[n].npc;

const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

function tryInteract() {
  const px = gameState.player.x;
  const py = gameState.player.y;
  for (const npc of npcs) {
    if (Math.hypot(px - npc.x, py - npc.y) < 62) { handleNPCInteraction(npc.id); return; }
  }
  for (const obj of interactables) {
    if (Math.hypot(px - obj.x, py - obj.y) < 62) { handleObjectInteraction(obj.id); return; }
  }
  showToast('Aproxime-se de um personagem ou objeto para interagir.');
}

function handleObjectInteraction(id) {
  clearGuide(id);
  if (id === 'board_kokiri') {
    if (!missionDone(0)) {
      startDialog([
        { speaker: 'PLACA DE KOKIRI', role: 'Aviso do Reino', text: 'Bem-vindo a Hyrule! Sua jornada passa por 5 regiões: Kokiri Village, Hyrule Field, Lost Woods, Gerudo Valley e Temple of Time. Cada sábio guarda um desafio de 3 perguntas, e você pode falar com eles na ordem que preferir.' },
        { speaker: 'NAVI', role: 'Guia', text: 'Muito bem! Você aprendeu a se mover e interagir. Atenção: as perguntas são difíceis e cada resposta vem com explicação. Acertos rendem XP, rupias e combos. Abra o Diário (J) sempre que precisar, e lembre: a coruja Kaepora Gaebora, em Kokiri Village, é a sua Central de Ajuda.' }
      ], () => { addXP(50, false); completeMission(0); });
    } else {
      startDialog([{ speaker: 'PLACA DE KOKIRI', role: 'Mapa', text: 'Kokiri Village (TI) | Hyrule Field (Equipe) | Lost Woods (RH) | Gerudo Valley (Gestão) | Temple of Time (Segurança e Desafio Final).' }]);
    }
  } else if (id === 'board_hyrule') {
    startDialog([{ speaker: 'PLACA DE HYRULE FIELD', role: 'Orientação', text: 'Norte: Mesa da Equipe (Mido). Sul: Baú de Ferramentas e passagem para Lost Woods (RH). Leste: Temple of Time.' }]);
  } else if (id === 'board_temple') {
    startDialog([{ speaker: 'PLACA DO TEMPLO', role: 'Temple of Time', text: 'Aqui vivem Impa (Segurança) e a Princesa Zelda. Conclua as missões dos cinco sábios para abrir o Desafio Final com a Princesa Zelda.' }]);
  } else if (id === 'chest_tools') {
    if (!missionDone(2)) startQuiz(2);
    else startDialog([{ speaker: 'NAVI', role: 'Guia', text: 'Você já concluiu o desafio de Regras Não Ditas deste baú.' }]);
  } else if (id.startsWith('chest_secret')) {
    const obj = interactables.find(o => o.id === id);
    if (!gameState.collectibles) gameState.collectibles = [];
    if (gameState.collectibles.includes(obj.item)) {
      startDialog([{ speaker: 'BAÚ', role: 'Tesouro', text: `Você já coletou "${obj.item}" deste baú!` }]);
    } else {
      AudioEngine.playChest();
      gameState.collectibles.push(obj.item);
      addXP(obj.xp, false);
      unlockAchievement('explorer', 'Explorador de Baús');
      startDialog([{ speaker: 'TESOURO ENCONTRADO!', role: 'Item Colecionável', text: `Você encontrou "${obj.item}" (+${obj.xp} XP)! Veja seus itens na Bolsa.` }]);
    }
  } else if (id === 'pedestal') {
    pedestalInteract();
  }
}

function handleNPCInteraction(id) {
  const m = NPC_MISSION[id], Q = QUIZ[m], npc = npcs.find(n => n.id === id);
  clearGuide(id);
  if (id === 'kaepora') {
    const first = autonomyState().visits === 0;
    startDialog([{ speaker: 'KAEPORA GAEBORA', role: 'Mentor de Autonomia', text: first
      ? 'Hoo hoo! Escute, Link: quem sabe onde procurar a resposta chega mais longe do que quem sabe tudo. Eu guardo respostas práticas e aponto o sábio certo para cada dúvida.'
      : 'Hoo hoo! De volta aos meus pergaminhos? Sobre o que quer saber desta vez?',
      choices: [
        { label: 'Abrir a Central de Ajuda', action: () => openKaepora() },
        { label: 'Só passando por aqui.', action: () => {} }
      ] }]);
    return;
  }
  markNpcMet(id);
  if (!Q) return;
  const who = npc.name.toUpperCase();
  if (missionDone(m)) {
    const info = MISSION_LEARNINGS[m];
    startDialog([{ speaker: who, role: npc.role, text: m === 6 ? 'Você concluiu o Desafio de Hyrule, Link. Se ainda houver dúvidas, o Pedestal Central logo abaixo leva você à liderança.' : `Você já venceu o meu desafio, Link. Lembre-se: ${info ? info.lesson : 'avise cedo e use os canais certos.'}` }]);
    return;
  }
  if (m === 6 && !finalUnlocked()) {
    startDialog([{ speaker: who, role: npc.role, text: 'O Desafio Final só se abre depois que você ouvir os cinco sábios. Ainda faltam: ' + pendingMissions().map(missionNpcName).join(', ') + '.' }]);
    return;
  }
  startDialog([{ speaker: who, role: npc.role, text: Q.intro, choices: [
    { label: 'Estou pronto. Pode perguntar.', action: () => startQuiz(m) },
    { label: 'Preciso de mais um minuto.', action: () => {} }
  ] }]);
}

// ---------------------------------------------------------------------------
// Motor de perguntas: sem marcadores de certo/errado antes da resposta; erro não custa
// vida, mas zera o combo e a pergunta volta depois. Acertos geram XP, rupias e combo.
// ---------------------------------------------------------------------------
let quiz = null;
function startQuiz(n) {
  quiz = { n, queue: shuffle(QUIZ[n].qs.map((_, i) => i)), total: QUIZ[n].qs.length, done: 0, opts: [], answered: false, missed: new Set(), errors: 0, xp: 0, rupees: 0, summary: false };
  document.getElementById('minigame-modal').classList.add('active');
  renderQuiz();
}
function renderQuiz() {
  const Q = QUIZ[quiz.n], q = Q.qs[quiz.queue[0]];
  quiz.opts = shuffle([0, 1, 2, 3]); quiz.answered = false;
  const combo = gameState.streak >= 2 ? ` • Combo x${gameState.streak}` : '';
  document.getElementById('minigame-body').innerHTML = `
    <h2 class="modal-title">${Q.title.toUpperCase()}</h2>
    <p class="modal-subtitle">Pergunta ${quiz.done + 1} de ${quiz.total}${combo} • Rupias: ${gameState.rupees || 0}</p>
    <div class="diary-entry">${q[0]}</div>
    <div class="dialog-choices">${quiz.opts.map((o, k) => `<button class="choice-btn" onclick="answerQuiz(${k})">${'ABCD'[k]}) ${q[1 + o]}</button>`).join('')}</div>
    <div id="quiz-fb"></div>`;
}
window.answerQuiz = function (k) {
  if (!quiz || quiz.answered || quiz.summary) return;
  quiz.answered = true;
  const Q = QUIZ[quiz.n], qi = quiz.queue.shift(), q = Q.qs[qi], ok = quiz.opts[k] === 0;
  document.querySelectorAll('#minigame-body .choice-btn').forEach(b => { b.disabled = true; });
  let reward = '';
  if (ok) {
    const r = rewardCorrect(Q.xp, !quiz.missed.has(qi));
    quiz.xp += r.xp; quiz.rupees += r.rupees; quiz.done++;
    reward = `<div class="reward-line">+${r.xp} XP &bull; +${r.rupees} rupias${r.first ? ' &bull; de primeira' : ''}${r.combo >= 2 ? ' &bull; Combo x' + r.combo : ''}</div>`;
  } else {
    AudioEngine.playError();
    gameState.totalAttempts++;
    if (gameState.streak >= 2) showToast('Combo perdido! Leia a explicação e recomece a sequência.');
    gameState.streak = 0; quiz.errors++; quiz.missed.add(qi); quiz.queue.push(qi); saveGame();
  }
  document.getElementById('quiz-fb').innerHTML = `
    <div class="diary-entry"><strong>${ok ? 'Resposta correta.' : 'Resposta incorreta.'}</strong><br>${q[5]}${ok ? '' : '<br><em>Esta pergunta volta mais tarde.</em>'}</div>${reward}
    <div style="text-align:right"><button class="retro-btn gold" onclick="nextQuiz()">${quiz.queue.length ? 'Próxima [E]' : 'Ver recompensas [E]'}</button></div>`;
};
window.nextQuiz = function () {
  if (!quiz) return;
  if (quiz.summary) { closeQuizSummary(); return; }
  if (!quiz.answered) return;
  if (quiz.queue.length) renderQuiz(); else finishQuiz();
};
function closeQuiz() { document.getElementById('minigame-modal').classList.remove('active'); quiz = null; }

// Fim da missão: painel de recompensas; efeitos de conclusão acontecem ao continuar.
function finishQuiz() {
  const n = quiz.n, perfect = quiz.errors === 0;
  const bonusXp = 40 + (perfect ? 20 : 0), bonusRup = 50 + (perfect ? 50 : 0);
  quiz.summary = true; quiz.bonusXp = bonusXp; quiz.bonusRup = bonusRup; quiz.perfect = perfect;
  const Q = QUIZ[n], info = MISSION_LEARNINGS[n] || {};
  AudioEngine.playAgenda();
  document.getElementById('minigame-body').innerHTML = `
    <h2 class="modal-title">MISSÃO CONCLUÍDA</h2>
    <p class="modal-subtitle">${Q.title}</p>
    <div class="reward-panel">
      <div class="sim-card"><strong>Acertos:</strong> ${quiz.total} de ${quiz.total} • <strong>Erros no caminho:</strong> ${quiz.errors}</div>
      <div class="sim-card"><strong>Perguntas:</strong> +${quiz.xp} XP • +${quiz.rupees} rupias</div>
      <div class="sim-card"><strong>Conclusão:</strong> +40 XP • +50 rupias</div>
      ${perfect ? '<div class="sim-card gold-card"><strong>Mão Firme:</strong> nenhum erro nesta missão! +20 XP • +50 rupias</div>' : ''}
      <div class="sim-card"><strong>Total:</strong> +${quiz.xp + bonusXp} XP • +${quiz.rupees + bonusRup} rupias</div>
      ${info.lesson ? `<div class="diary-entry"><strong>Para levar:</strong> ${info.lesson}</div>` : ''}
    </div>
    <div style="text-align:right"><button class="retro-btn gold" onclick="closeQuizSummary()">Continuar [E]</button></div>`;
}
window.closeQuizSummary = function () {
  if (!quiz || !quiz.summary) return;
  const n = quiz.n, xp = quiz.bonusXp, rup = quiz.bonusRup, perfect = quiz.perfect;
  closeQuiz();
  addXP(xp, false); addRupees(rup);
  if (perfect) { gameState.perfectMissions = (gameState.perfectMissions || 0) + 1; unlockAchievement('perfect_' + n, 'Mão Firme: ' + QUIZ[n].title); }
  completeMission(n);
  if (n === 6) {
    unlockAchievement('hyrule_hero', 'Herói do Primeiro Dia');
    gameState.victory = true;
    gameState.elapsedSeconds = Math.floor((Date.now() - gameState.startTime) / 1000);
    saveGame();
    notifyAgendaUnlock();
    showVictoryScreen();
  }
};

window.addEventListener('keydown', (e) => {
  if (!quiz || !document.getElementById('minigame-modal').classList.contains('active')) return;
  if (/^[1-4]$/.test(e.key) && !quiz.summary) answerQuiz(+e.key - 1);
  else if (['e', 'E', ' ', 'Enter'].includes(e.key) && (quiz.answered || quiz.summary)) nextQuiz();
});

function showVictoryScreen() {
  const acc = gameState.totalAttempts > 0 ? Math.round((gameState.correctAnswers / gameState.totalAttempts) * 100) : 100;
  const mins = Math.floor(gameState.elapsedSeconds / 60);
  const secs = gameState.elapsedSeconds % 60;
  const lvlInfo = getLevelInfo(gameState.xp);
  document.getElementById('victory-stats').innerHTML = `
    <div class="sim-card"><strong>Missões:</strong> ${gameState.completedMissions.filter(n => n > 0).length}/6</div>
    <div class="sim-card"><strong>Acertos:</strong> ${gameState.correctAnswers} (${acc}% de aproveitamento)</div>
    <div class="sim-card"><strong>XP & Nível:</strong> ${gameState.xp} XP (Nv. ${lvlInfo.lvl} • ${lvlInfo.title})</div>
    <div class="sim-card"><strong>Tempo:</strong> ${mins}m ${secs}s</div>
    <div class="sim-card"><strong>Rupias:</strong> ${gameState.rupees || 0} • melhor combo x${gameState.bestStreak || 0} • missões sem erro: ${gameState.perfectMissions || 0}</div>
    <div class="sim-card"><strong>Recompensas:</strong> ${(gameState.rewards || []).length ? REWARD_TIERS.filter(t => gameState.rewards.includes(t.id)).map(t => t.name).join(', ') : 'nenhuma ainda'}</div>
    <div class="sim-card"><strong>Colecionáveis:</strong> ${(gameState.collectibles || []).length}/2 itens</div>
    <div class="sim-card"><strong>Conquistas:</strong> ${(gameState.achievements || []).length} desbloqueadas</div>` + reportCards();
  document.getElementById('victory-modal').classList.add('active');
}
