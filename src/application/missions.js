// ============================================================================
// 6. MISSÕES POR REGIÃO + MOTOR DE PERGUNTAS
// Percurso: Kokiri Village > Hyrule Field > Lost Woods > Gerudo Valley > Temple of Time
// Pergunta = [cenário, CORRETA, errada1, errada2, errada3, explicação]. As alternativas são embaralhadas.
// ============================================================================
const QUIZ = {
  1: { npc: 'talon', xp: 20, title: 'Acessos, Senhas e Ferramentas',
    intro: 'Opa, Link! Aqui na Oficina TI vamos testar como você lida com acessos, MFA, ferramentas e documentos. São cenários reais, e nenhum é tão simples quanto parece. Pronto?',
    hint: 'Talon fica na Oficina TI, em Kokiri Village.',
    qs: [
      ["Você precisa de uma pasta do financeiro ainda hoje. Um colega com acesso se oferece: 'use meu login só dessa vez, ninguém vai saber'. O que você faz?",
        "Recusa e abre um chamado de acesso pelo canal oficial, avisando o gestor do prazo para pedir prioridade.",
        "Aceita, mas pede que ele troque a senha logo depois para anular o risco.",
        "Aceita, desde que ele acompanhe tudo ao seu lado durante o uso.",
        "Pede que ele baixe os arquivos e envie para o seu e-mail pessoal.",
        "Credenciais são pessoais e intransferíveis: tudo feito com o login dele é atribuído a ele. Trocar a senha depois ou supervisionar não desfaz a violação, e e-mail pessoal ainda tira o dado do controle da empresa."],
      ["Seu celular recebe uma aprovação de MFA que você não pediu. Dois minutos depois, outra. Depois mais uma.",
        "Nega todas, troca a senha na hora e avisa TI/Segurança: alguém provavelmente já tem sua senha.",
        "Aprova uma só para as notificações pararem e investiga depois.",
        "Ignora o celular até o bombardeio parar sozinho.",
        "Desativa o MFA temporariamente para não ser mais incomodado.",
        "É o ataque de fadiga de MFA: o invasor já sabe a senha e conta com seu cansaço para aprovar. Qualquer pedido de MFA que você não iniciou significa senha comprometida."],
      ["Seu time usa uma ferramenta de tarefas lenta. Você achou um app gratuito ótimo e quer subir a planilha de clientes nele para ganhar tempo.",
        "Propõe o app à TI para avaliação de segurança e contrato, e segue na ferramenta oficial até a aprovação.",
        "Usa só com as colunas 'não sensíveis' da planilha, sem avisar ninguém.",
        "Usa em conta pessoal e apaga tudo ao terminar o projeto.",
        "Usa mesmo assim: se a produtividade do time sobe, a empresa ganha.",
        "É TI-sombra: os dados saem de onde há contrato, backup e auditoria. Decidir sozinho o que é 'não sensível' não é papel seu, e apagar depois não garante que a ferramenta não guardou cópias."],
      ["Você terminou metade de uma tarefa que depende de outra pessoa entregar o insumo. Como registrar no sistema?",
        "Card com título claro, responsável, prazo, link da dependência, status 'Em andamento' e comentário do que falta.",
        "Card com o título 'Relatório' e os detalhes combinados em conversa privada com a pessoa.",
        "Deixa em 'A fazer' até concluir tudo, para não gerar ruído na equipe.",
        "Registra a tarefa só depois de pronta, com o resultado final anexado.",
        "O card é a fonte da verdade: quem o abrir sem contexto precisa entender estado e bloqueio. Conversa privada some, status parado faz o gestor decidir com dado errado e registro tardio esconde o trabalho em curso."],
      ["Você vai enviar o relatório a Darunia, para revisar, e a um fornecedor externo, que só precisa ler. Qual a forma mais segura?",
        "Compartilha o documento oficial por link: Darunia com comentar/editar, o fornecedor só leitura, apenas para o e-mail dele e com data de expiração.",
        "Link aberto a 'qualquer pessoa com o link pode editar', para ninguém pedir acesso depois.",
        "Anexa uma cópia por e-mail aos dois, para que cada um tenha seu arquivo garantido.",
        "Pede o e-mail pessoal do fornecedor e dá edição, para ele ajustar o que quiser.",
        "Menor privilégio e expiração: link aberto vaza se encaminhado, e anexos criam versões paralelas desatualizadas. Cada pessoa recebe só o nível de acesso de que precisa."]
    ] },
  2: { npc: 'mido', xp: 20, title: 'Regras Não Ditas da Equipe',
    intro: 'Ei, Link! Aqui no campo existem costumes que não estão escritos em nenhum pergaminho. Vamos ver como você se sai nas situações do dia a dia da equipe. (Dica: o Baú de Ferramentas ao sul também abre este desafio.)',
    hint: 'Mido está em Hyrule Field, perto da Mesa da Equipe (norte do campo).',
    qs: [
      ["Você está travado há 40 minutos. Seu gestor está em reunião e o colega sênior parece ocupado. O que fazer?",
        "Manda uma mensagem completa: o que tenta fazer, o que já testou, o erro e até quando consegue esperar.",
        "Espera o gestor sair da reunião para perguntar tudo de uma vez.",
        "Chama o sênior por vídeo agora: se está travado, a urgência é sua.",
        "Pergunta no canal geral 'alguém pode ajudar?' para alcançar mais gente.",
        "Mensagem autocontida respeita o tempo do outro e permite resposta assíncrona. Esperar demais atrasa a equipe, ligar sem contexto interrompe e pergunta vaga no canal geral raramente recebe resposta útil."],
      ["Às 18h40, um colega de outra área marca você pedindo algo que só você faz, para amanhã às 15h. Qual a atitude esperada?",
        "Responde confirmando o recebimento e o horário em que entrega, e executa no expediente seguinte.",
        "Só responde quando terminar, para entregar resultado e não promessa.",
        "Ignora fora do expediente e retoma no dia seguinte sem confirmar nada.",
        "Faz na hora, mesmo à noite, para mostrar comprometimento.",
        "Confirmar sem executar fora do horário dá previsibilidade e respeita limites. Silêncio gera ansiedade em quem depende de você, e o 'herói da noite' cria expectativa de disponibilidade permanente."],
      ["Em reunião, o líder propõe um plano que você acredita colocar o prazo em risco.",
        "Expõe o risco com um dado e uma alternativa, em tom de proposta, e pede que a decisão final seja registrada.",
        "Concorda na reunião e conversa com os colegas depois, em um chat paralelo.",
        "Cala e executa; se der errado, lembra na retrospectiva que avisou.",
        "Diz com firmeza, diante de todos, que o plano não vai funcionar.",
        "Discordância com dado e alternativa é bem-vinda. O chat paralelo corrói a confiança, o 'eu avisei' tardio é passivo-agressivo e o confronto sem proposta ignora o tom e não resolve."],
      ["Você vai usar na apresentação ao diretor uma planilha que Mido montou. Como proceder?",
        "Avisa o Mido antes e cita a contribuição dele na apresentação.",
        "Apresenta sem citar: o que importa é o resultado da equipe, não o autor.",
        "Cita apenas se o diretor perguntar de quem é a planilha.",
        "Refaz a planilha do zero, para ela ser considerada trabalho seu.",
        "Dar crédito é regra não escrita que constrói reputação e acelera a colaboração. Omitir corrói a confiança do time, e refazer do zero é retrabalho que ainda esconde a origem."],
      ["Sexta, 17h45: você percebe que a entrega de segunda vai atrasar um dia. O que fazer?",
        "Avisa agora quem depende da entrega, com nova data, causa e o que pode ser feito para recuperar.",
        "Espera segunda, porque ninguém lê mensagens na sexta à noite.",
        "Trabalha escondido no fim de semana para recuperar sem alarmar ninguém.",
        "Muda o card para 'Em risco' sem comentário e deixa o time interpretar.",
        "Avisar cedo e com plano dá tempo de replanejar. Esconder o risco, mesmo com esforço heroico, tira a escolha de quem depende de você, e um status sem contexto vira ruído."]
    ] },
  3: { npc: 'saria', xp: 20, title: 'Políticas da Empresa',
    intro: 'Link, a Floresta Perdida é onde todo mundo se perde... nas regras! Vou testar você nas políticas da empresa (fictícias, para treinamento). Atenção aos detalhes.',
    hint: 'Saria está em Lost Woods: atravesse a passagem ao sul de Hyrule Field (entre x 640 e 760).',
    qs: [
      ["Você quer emendar suas férias com um feriado e viajar em breve. Qual é a sequência correta pela política?",
        "Alinha as datas com o gestor, considerando as entregas, e então formaliza o pedido no sistema de RH dentro da antecedência exigida.",
        "Registra no sistema e avisa o gestor depois, pois férias são um direito.",
        "Combina de boca com o time e formaliza na volta.",
        "Espera o gestor sugerir datas para não parecer que está pedindo demais.",
        "O direito existe, mas as datas se organizam com a empresa e exigem registro formal e antecedência. Acordo verbal não vale para a folha nem protege você; esperar passivamente pode custar a data."],
      ["Um fornecedor com contrato em renovação oferece a você um ingresso de evento de R$ 600 'como agradecimento'.",
        "Recusa com educação e informa o gestor/Compliance, pois há negociação em curso e o valor passa do limite.",
        "Aceita e declara depois, já que foi um gesto espontâneo.",
        "Aceita e sorteia entre o time para não ficar com benefício individual.",
        "Aceita só depois que a renovação for assinada.",
        "É risco de conflito de interesses: presentes de quem negocia com a empresa passam por limite e registro. Dividir ou esperar a assinatura não elimina a aparência de influência, e a próxima renovação continua em jogo."],
      ["Pelo chat, um colega pede a lista de clientes com CPF e telefone para 'mandar uma pesquisa', sem passar pelo time responsável.",
        "Pergunta a finalidade, o direciona ao canal oficial de dados e compartilha só o mínimo necessário se houver autorização.",
        "Envia: é colega da mesma empresa, então é uso interno.",
        "Envia só os telefones, que são menos sensíveis que o CPF.",
        "Recusa sem explicar e sem avisar ninguém.",
        "Mesmo internamente, acesso a dados pessoais exige finalidade e necessidade (minimização). Telefone também é dado pessoal. Recusar em silêncio deixa o risco aberto e o colega sem caminho."],
      ["Em reunião, um colega faz uma 'brincadeira' com a aparência de outra pessoa. Ela dá um sorriso sem graça e ninguém reage.",
        "Intervém de forma breve na hora ou fala com ela depois, oferecendo apoio e lembrando do canal de ética, que é sigiloso.",
        "Ignora: se ela se incomodasse, teria dito algo.",
        "Conversa só com o colega em particular e dá o assunto por encerrado.",
        "Denuncia ao RH em nome dela sem falar com ela antes.",
        "O sorriso sem graça não é consentimento, e o silêncio do grupo é lido como aprovação. Falar só com o autor não protege quem foi exposta, e denunciar em nome dela sem ouvi-la tira a autonomia dela."],
      ["Por iniciativa própria, você ficou duas horas além do horário para fechar uma entrega. A política exige aprovação prévia de horas extras.",
        "Avisa o gestor, registra no banco de horas conforme a política e alinha como proceder da próxima vez.",
        "Não registra: foi escolha sua e evita burocracia.",
        "Registra no sistema sem avisar; a aprovação sai sozinha.",
        "Compensa saindo cedo amanhã, sem comunicar.",
        "Trabalho não registrado não protege você nem a empresa, e compensação por conta própria foge da política. O alinhamento evita que isso vire uma expectativa tácita de trabalhar além do horário."]
    ] },
  4: { npc: 'darunia', xp: 20, title: 'Feedback, Prioridades e Impacto',
    intro: 'Hah! No vale o calor é grande e o prazo também. Vou testar como você lida com feedback, prioridades e impacto. Responda com honestidade!',
    hint: 'Darunia está em Gerudo Valley: cruze a Lost Woods até o sul e siga o desfiladeiro a leste.',
    qs: [
      ["Em um 1:1, Darunia diz: 'sua entrega é boa, mas chega sem aviso de atraso'. Você acha injusto, pois houve imprevistos.",
        "Agradece, pede um exemplo concreto, explica o contexto em uma frase e combina como vai avisar antes do prazo.",
        "Detalha cada imprevisto para mostrar que o feedback não procede.",
        "Concorda logo para encerrar a conversa e segue como antes.",
        "Pede que ele registre o feedback por escrito para avaliar depois.",
        "Feedback útil vira combinado. Defender-se em excesso fecha a conversa, concordar sem entender não muda nada e pedir por escrito sinaliza resistência."],
      ["Você entregou o primeiro relatório e, duas semanas depois, não recebeu nenhum retorno.",
        "Pede de forma específica, em 15 minutos: 'o que no relatório ajudaria mais a equipe?'",
        "Interpreta o silêncio como sinal de que está tudo certo.",
        "Pergunta no canal do time se alguém tem algum feedback sobre você.",
        "Espera o ciclo formal de avaliação para saber.",
        "Silêncio não é aprovação. Pedidos específicos geram respostas úteis; perguntas amplas e públicas constrangem, e esperar meses desperdiça a chance de ajustar cedo."],
      ["Darunia pediu a tarefa A para sexta. Uma diretora de outra área pede a tarefa B para hoje, 'urgente'. Você só consegue fazer uma.",
        "Expõe o conflito aos dois, com prazos e capacidade, pede que decidam a prioridade e segue o que ficar registrado.",
        "Prioriza a diretora, pelo nível hierárquico.",
        "Faz a A e avisa a diretora só se ela cobrar.",
        "Entrega as duas pela metade para não desagradar ninguém.",
        "Conflito de prioridade se resolve com transparência, não com palpite. Hierarquia sozinha não define prioridade, o silêncio só adia o problema e entregas pela metade costumam não servir a ninguém."],
      ["Mido atrasa o insumo da sua etapa pela terceira vez. Qual o melhor primeiro passo?",
        "Conversa em privado e logo, descrevendo fatos e impacto, e pergunta o que ajudaria.",
        "Escala ao gestor com o histórico dos três atrasos.",
        "Comenta com outros colegas para ver se mais alguém sente o mesmo.",
        "Absorve o atraso e compensa sozinho para manter o clima.",
        "O primeiro passo é direto, privado e com fatos. Escalar de início quebra a confiança, comentar com terceiros vira fofoca e absorver em silêncio mantém o problema."],
      ["Você percebe que o relatório semanal que produz há um mês parece não ser lido por ninguém.",
        "Pergunta a quem deveria usá-lo qual decisão ele apoia e propõe, com o gestor, ajustar ou encerrar o relatório.",
        "Continua: alguém pediu, então não cabe questionar.",
        "Para de produzir e usa o tempo em outra tarefa.",
        "Acrescenta mais dados para o relatório chamar atenção.",
        "Entender o uso conecta a tarefa ao resultado e libera tempo para o que importa. Questionar com método e alinhar é diferente de abandonar sozinho ou inflar o trabalho."]
    ] },
  5: { npc: 'impa', xp: 20, title: 'Ataques Além do Phishing',
    intro: 'Link, phishing é só a porta mais conhecida. Invasores também usam telefone, portas, pendrives e redes falsas. Vamos ver se você reconhece cada ataque.',
    hint: 'Impa está em Temple of Time: suba pela passagem ao norte de Gerudo Valley (x 1290 a 1400).',
    qs: [
      ["Alguém liga dizendo ser 'do suporte de TI', cita seu nome e cargo e pede o código de 6 dígitos que chegou por SMS 'para cancelar um bloqueio'.",
        "Desliga sem informar o código, liga de volta por um canal oficial e reporta a tentativa.",
        "Informa: ele sabia seu nome e cargo, então é mesmo da empresa.",
        "Pede o ramal e informa o código se parecer legítimo.",
        "Informa só os três primeiros dígitos, por precaução.",
        "É vishing com pretexto. Nome e cargo são fáceis de obter, a TI nunca pede códigos de MFA, e fornecer parte do código ainda ajuda o atacante."],
      ["No portão do Templo, uma pessoa com caixas pesadas e crachá no bolso pede que você segure a porta.",
        "É cordial, mas pede que ela passe o crachá no leitor ou a encaminha à recepção.",
        "Segura a porta: negar ajuda seria rude.",
        "Pergunta o nome e deixa entrar se parecer funcionária.",
        "Deixa entrar e avisa a Segurança logo depois.",
        "É tailgating (carona na entrada). Quem tem acesso legítimo passa o próprio crachá. Avisar depois ou confiar na aparência já deixa a pessoa dentro."],
      ["No estacionamento você acha um pendrive com a etiqueta 'Salários 2026 - Confidencial'.",
        "Não conecta em nenhum equipamento e o entrega à Segurança/TI.",
        "Conecta em um computador pessoal, não no da empresa, para descobrir o dono.",
        "Conecta no computador da empresa para identificar o dono e devolver.",
        "Joga no lixo para que ninguém mais o encontre.",
        "É baiting: a curiosidade é a isca e o dispositivo pode instalar malware ao ser conectado. Descartar tira a chance de investigar e de outra pessoa o encontrar."],
      ["Um e-mail do 'diretor financeiro', com domínio quase igual ao da empresa, pede um pagamento urgente a um fornecedor novo e diz 'não comente com ninguém'.",
        "Não paga, confirma por um canal independente (telefone cadastrado), segue o fluxo de aprovação e reporta.",
        "Paga: o pedido veio de um diretor e pediu sigilo.",
        "Responde ao e-mail pedindo confirmação.",
        "Paga metade e pede comprovantes depois.",
        "É fraude do executivo (BEC): urgência, sigilo e autoridade juntos. Responder ao mesmo e-mail fala com o atacante, e pagar parte ainda é perder dinheiro."],
      ["Em um café, a rede 'Hyrule_Corp_Free' abre uma página pedindo seu login corporativo para liberar a internet.",
        "Não digita credenciais, usa dados móveis ou a VPN oficial e avisa a Segurança sobre a rede suspeita.",
        "Loga: o nome tem 'Corp', logo a rede é da empresa.",
        "Loga com uma senha antiga para limitar o estrago.",
        "Loga agora e troca a senha ao sair do café.",
        "É um portal falso em uma rede clonada (evil twin). Qualquer senha digitada ali foi capturada; a antiga pode estar reaproveitada em outros sistemas, e trocar depois não desfaz a exposição do período."]
    ] },
  6: { npc: 'zelda', xp: 30, title: 'O Desafio de Hyrule',
    intro: 'Link, o Desafio Final reúne tudo o que você viveu em Hyrule: ferramentas, cultura, políticas, feedback e segurança. Desta vez, sem dicas.',
    hint: 'Zelda está em Temple of Time, acima do Pedestal da Triforce.',
    qs: [
      ["Você recebeu uma missão urgente, mas está sem acesso à ferramenta e o prazo é curto. O que faz?",
        "Abre um chamado de acesso com o prazo, avisa Darunia do risco e propõe um plano B documentado para adiantar o que der.",
        "Espera o acesso chegar e só então avisa o gestor, para não criar alarme.",
        "Pede o login a um colega só até o acesso sair e depois conta a Talon.",
        "Reduz o escopo por conta própria para caber no prazo e entrega assim.",
        "Bloqueio comunicado cedo, no canal certo e com plano B é o comportamento esperado. Emprestar login viola a política de acesso, e reduzir escopo sem alinhar muda a entrega sem o gestor decidir."],
      ["Para bater a meta do mês, Darunia sugere 'ajustar um pouco' os números do relatório antes de enviá-lo à diretoria.",
        "Entende o objetivo, recusa ajustar dados, propõe apresentar os números reais com um plano de recuperação e, se ele insistir, usa o canal de ética.",
        "Ajusta: ordem do gestor se cumpre, e a responsabilidade é dele.",
        "Ajusta só um pouco, o suficiente para não chamar atenção.",
        "Envia os números reais sem avisar o gestor, para evitar discussão.",
        "Alterar dados é fraude, e 'cumprir ordem' não isenta quem executa. Enviar escondido quebra a confiança; o caminho é recusar com alternativa e escalar ao canal de ética se a pressão persistir."],
      ["Um app 'de produtividade' pede permissão total de leitura e envio no seu e-mail e no Drive corporativos para sincronizar tarefas.",
        "Nega a permissão e consulta a TI sobre apps homologados antes de autorizar.",
        "Autoriza: o login é feito pela conta oficial, então é seguro.",
        "Autoriza e revisa as permissões depois, quando sobrar tempo.",
        "Autoriza só no celular, não no computador.",
        "É consent phishing: o app ganha acesso sem precisar da sua senha nem do MFA. Revogar depois pode ser tarde, e o aparelho usado não muda a permissão concedida."],
      ["Você entra de licença na semana que vem e Mido vai assumir suas tarefas e arquivos. Como preparar a passagem?",
        "Pede delegação formal de acesso à TI, deixa cards e documentos atualizados e agenda uma conversa de passagem.",
        "Passa sua senha ao Mido e a troca quando voltar.",
        "Deixa um resumo no chat e pede que ele se vire com o resto.",
        "Move seus arquivos para uma pasta pessoal dele para facilitar.",
        "Delegação formal mantém rastreabilidade e acesso mínimo; cards atualizados e conversa evitam perda de contexto. Senha compartilhada e pastas pessoais fogem da política, e um resumo solto não cobre o trabalho em curso."]
    ] }
};

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
  if (id === 'board_kokiri') {
    if (gameState.currentMission === 0) {
      startDialog([
        { speaker: 'PLACA DE KOKIRI', role: 'Aviso do Reino', text: 'Bem-vindo a Hyrule! Sua jornada passa por 5 regiões: Kokiri Village, Hyrule Field, Lost Woods, Gerudo Valley e Temple of Time. Comece falando com Talon (TI), na Oficina daqui.' },
        { speaker: 'NAVI', role: 'Guia', text: 'Muito bem! Você aprendeu a se mover e interagir. Atenção: as perguntas são difíceis, erros custam corações e cada resposta vem com explicação. Abra o Diário (J) sempre que precisar.' }
      ], () => { addXP(50, false); completeMission(0); });
    } else {
      startDialog([{ speaker: 'PLACA DE KOKIRI', role: 'Mapa', text: 'Kokiri Village (TI) | Hyrule Field (Equipe) | Lost Woods (RH) | Gerudo Valley (Gestão) | Temple of Time (Segurança e Desafio Final).' }]);
    }
  } else if (id === 'board_hyrule') {
    startDialog([{ speaker: 'PLACA DE HYRULE FIELD', role: 'Orientação', text: 'Norte: Mesa da Equipe (Mido). Sul: Baú de Ferramentas e passagem para Lost Woods (RH). Leste: Temple of Time.' }]);
  } else if (id === 'board_temple') {
    startDialog([{ speaker: 'PLACA DO TEMPLO', role: 'Temple of Time', text: 'Aqui vivem Impa (Segurança) e a Princesa Zelda. Conquiste os 3 Fragmentos da Triforce e a aprovação de Impa para o Desafio Final.' }]);
  } else if (id === 'chest_tools') {
    if (gameState.currentMission === 2) startQuiz(2);
    else startDialog([{ speaker: 'NAVI', role: 'Guia', text: 'Este baú abre o desafio de Regras Não Ditas da Missão 2 (Hyrule Field).' }]);
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
    if (gameState.currentMission >= 6 && gameState.triforce.wisdom && gameState.triforce.power && gameState.triforce.courage) {
      startDialog([{ speaker: 'NAVI', role: 'Guia', text: 'A Triforce brilha! Fale com a Princesa Zelda logo acima para iniciar o Desafio Final!' }]);
    } else {
      startDialog([{ speaker: 'PEDESTAL DA TRIFORCE', role: 'Temple of Time', text: 'Reúna os 3 Fragmentos (Coragem, Sabedoria e Poder) e passe pelo teste de Impa para despertar este pedestal.' }]);
    }
  }
}

function handleNPCInteraction(id) {
  const m = gameState.currentMission, Q = QUIZ[m], npc = npcs.find(n => n.id === id);
  if (Q && Q.npc === id) {
    startDialog([{ speaker: npc.name.toUpperCase(), role: npc.role, text: Q.intro, choices: [
      { label: 'Estou pronto. Pode perguntar.', action: () => startQuiz(m) },
      { label: 'Preciso de mais um minuto.', action: () => {} }
    ] }]);
    return;
  }
  const text = m === 0 ? 'Leia a Placa de Kokiri primeiro, Link.' : Q ? 'Ainda não é comigo, Link. ' + Q.hint : 'Você já concluiu a jornada, Link. Foi um prazer!';
  startDialog([{ speaker: npc.name.toUpperCase(), role: npc.role, text }]);
}

// ---------------------------------------------------------------------------
// Motor de perguntas: sem marcadores de certo/errado antes da resposta;
// erro = -1 coração e a pergunta volta depois; explicação sempre exibida.
// ---------------------------------------------------------------------------
let quiz = null;
function startQuiz(n) {
  quiz = { n, queue: shuffle(QUIZ[n].qs.map((_, i) => i)), total: QUIZ[n].qs.length, done: 0, opts: [], answered: false };
  document.getElementById('minigame-modal').classList.add('active');
  renderQuiz();
}
function renderQuiz() {
  const Q = QUIZ[quiz.n], q = Q.qs[quiz.queue[0]];
  quiz.opts = shuffle([0, 1, 2, 3]); quiz.answered = false;
  document.getElementById('minigame-body').innerHTML = `
    <h2 class="modal-title">${Q.title.toUpperCase()}</h2>
    <p class="modal-subtitle">Pergunta ${quiz.done + 1} de ${quiz.total} • Corações: ${gameState.hearts}</p>
    <div class="diary-entry">${q[0]}</div>
    <div class="dialog-choices">${quiz.opts.map((o, k) => `<button class="choice-btn" onclick="answerQuiz(${k})">${'ABCD'[k]}) ${q[1 + o]}</button>`).join('')}</div>
    <div id="quiz-fb"></div>`;
}
window.answerQuiz = function (k) {
  if (!quiz || quiz.answered) return;
  quiz.answered = true;
  const Q = QUIZ[quiz.n], qi = quiz.queue.shift(), q = Q.qs[qi], ok = quiz.opts[k] === 0;
  document.querySelectorAll('#minigame-body .choice-btn').forEach(b => { b.disabled = true; });
  if (ok) { addXP(Q.xp); quiz.done++; }
  else {
    quiz.queue.push(qi);
    if (loseHeart('Resposta incorreta. Leia a explicação e tente de novo mais tarde.')) { closeQuiz(); return; }
  }
  document.getElementById('quiz-fb').innerHTML = `
    <div class="diary-entry"><strong>${ok ? 'Resposta correta.' : 'Resposta incorreta.'}</strong><br>${q[5]}${ok ? '' : '<br><em>Esta pergunta volta mais tarde.</em>'}</div>
    <div style="text-align:right"><button class="retro-btn gold" onclick="nextQuiz()">${quiz.queue.length ? 'Próxima [E]' : 'Concluir missão [E]'}</button></div>`;
};
window.nextQuiz = function () {
  if (!quiz || !quiz.answered) return;
  if (quiz.queue.length) renderQuiz(); else finishQuiz();
};
function closeQuiz() { document.getElementById('minigame-modal').classList.remove('active'); quiz = null; }

function finishQuiz() {
  const n = quiz.n;
  closeQuiz();
  addXP(40, false);
  gameState.hearts = Math.min(gameState.maxHearts, gameState.hearts + 1);
  completeMission(n);
  if (n === 6) {
    unlockAchievement('hyrule_hero', 'Herói do Primeiro Dia');
    gameState.victory = true;
    gameState.elapsedSeconds = Math.floor((Date.now() - gameState.startTime) / 1000);
    saveGame();
    showVictoryScreen();
  }
}

window.addEventListener('keydown', (e) => {
  if (!quiz || !document.getElementById('minigame-modal').classList.contains('active')) return;
  if (/^[1-4]$/.test(e.key)) answerQuiz(+e.key - 1);
  else if (['e', 'E', ' ', 'Enter'].includes(e.key) && quiz.answered) nextQuiz();
});

function showVictoryScreen() {
  const acc = gameState.totalAttempts > 0 ? Math.round((gameState.correctAnswers / gameState.totalAttempts) * 100) : 100;
  const mins = Math.floor(gameState.elapsedSeconds / 60);
  const secs = gameState.elapsedSeconds % 60;
  const lvlInfo = getLevelInfo(gameState.xp);
  document.getElementById('victory-stats').innerHTML = `
    <div class="sim-card"><strong>Missões:</strong> ${gameState.completedMissions.length}/7</div>
    <div class="sim-card"><strong>Acertos:</strong> ${gameState.correctAnswers} (${acc}% de aproveitamento)</div>
    <div class="sim-card"><strong>XP & Nível:</strong> ${gameState.xp} XP (Nv. ${lvlInfo.lvl} • ${lvlInfo.title})</div>
    <div class="sim-card"><strong>Tempo:</strong> ${mins}m ${secs}s</div>
    <div class="sim-card"><strong>Colecionáveis:</strong> ${(gameState.collectibles || []).length}/2 itens</div>
    <div class="sim-card"><strong>Conquistas:</strong> ${(gameState.achievements || []).length} desbloqueadas</div>`;
  document.getElementById('victory-modal').classList.add('active');
}
