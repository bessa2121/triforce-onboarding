// ============================================================================
// CONFIGURAÇÃO DO PEDESTAL CENTRAL (agenda real da liderança)
// Edite aqui, sem mexer no resto do código.
// ============================================================================
const AGENDA_CONFIG = {
  leaderName: 'Princesa Zelda',          // quem recebe o convite
  leaderEmail: '',                       // e-mail do gestor/liderança (entra como convidado no Google Calendar e no .ics)
  bookingUrl: '',                        // opcional: link real do Calendly/Cal.com/etc. (ex.: 'https://calendly.com/gestor/30min')
  webhookUrl: '',                        // opcional: URL que recebe o pedido por POST (Apps Script, Power Automate, Zapier, Slack...)
  durationMin: 30,
  workDays: [1, 2, 3, 4, 5],             // 0=dom ... 6=sáb
  workStart: '09:00',
  workEnd: '18:00',
  minSectorNpcs: 2,                      // trava de autonomia: nº de NPCs de setor conversados...
  minOwlConsults: 1,                     // ...OU nº de respostas consultadas na Kaepora Gaebora
  sectorNpcs: ['talon', 'mido', 'saria', 'darunia', 'impa'],
  topics: ['Dúvida de Projeto', 'Feedback', 'Carreira', 'Outro'],
  storeKey: 'triforce_agenda_v1'         // "banco" local: sobrevive ao reinício da jornada
};
