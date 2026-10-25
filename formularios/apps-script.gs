/**
 * ZELO — Recebe os formulários do site e grava numa planilha Google.
 *
 * Instalação (passo a passo completo em formularios/COMO-ATIVAR.md):
 *  1. Crie uma planilha no Google Drive da ZELO.
 *  2. Na planilha: Extensões → Apps Script. Apague o conteúdo e cole este arquivo.
 *  3. Rode a função "configurar" uma vez (cria as abas e pede autorização).
 *  4. Implantar → Nova implantação → App da Web
 *     (Executar como: Eu | Quem pode acessar: Qualquer pessoa).
 *  5. Copie a URL que termina em /exec e coloque em FORM_ENDPOINT no site.
 */

// E-mail da ZELO que recebe um aviso a cada novo cadastro.
// O dono da planilha (quem implantou o script) também recebe, automaticamente.
const EMAIL_AVISO = 'zeloomotoristaamigo@gmail.com';

const DISPONIBILIDADE = {
  fds: 'Fins de semana',
  fds_semana: 'Fins de semana + meio de semana',
  eventos: 'Apenas eventos',
};

// Uma aba por formulário: colunas, campos obrigatórios e como montar a linha
const FORMULARIOS = {
  parceiro: {
    aba: 'Parceiros',
    titulo: 'Novo parceiro',
    colunas: ['Data', 'Nome', 'Estabelecimento', 'WhatsApp', 'Cidade/Bairro', 'Status'],
    obrigatorios: ['nome', 'estabelecimento', 'whatsapp'],
    linha: (d) => [d.nome, d.estabelecimento, d.whatsapp, d.cidade || ''],
  },
  motorista: {
    aba: 'Motoristas',
    titulo: 'Nova candidatura de motorista',
    colunas: ['Data', 'Nome', 'WhatsApp', 'CNH B', 'Disponibilidade', 'Região', 'Status'],
    obrigatorios: ['nome', 'whatsapp', 'possuiCnh', 'disponibilidade', 'regiao'],
    linha: (d) => [d.nome, d.whatsapp, 'Sim', DISPONIBILIDADE[d.disponibilidade] || d.disponibilidade, d.regiao],
  },
};

/** Recebe o POST do site. Sempre responde JSON: { ok: true } ou { ok: false, erro } */
function doPost(e) {
  try {
    const dados = JSON.parse(e.postData.contents);
    const form = FORMULARIOS[dados.tipo];
    if (!form) return responder({ ok: false, erro: 'Formulário desconhecido' });

    // Limpa os textos e limita o tamanho de cada campo
    Object.keys(dados).forEach((k) => {
      if (typeof dados[k] === 'string') dados[k] = dados[k].trim().slice(0, 200);
    });

    if (form.obrigatorios.some((campo) => !dados[campo])) {
      return responder({ ok: false, erro: 'Preencha todos os campos obrigatórios' });
    }
    // Regra de negócio: motorista sem CNH B não entra (mesma trava do site)
    if (dados.tipo === 'motorista' && dados.possuiCnh !== 'sim') {
      return responder({ ok: false, erro: 'CNH categoria B é obrigatória' });
    }

    // Lock evita que dois envios simultâneos escrevam na mesma linha
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      obterAba(form).appendRow([new Date(), ...form.linha(dados).map(textoSeguro), 'Novo']);
    } finally {
      lock.releaseLock();
    }

    avisarPorEmail(form, dados);
    return responder({ ok: true });
  } catch (erro) {
    console.error(erro);
    return responder({ ok: false, erro: 'Erro interno' });
  }
}

/** Permite testar se a implantação está no ar abrindo a URL /exec no navegador */
function doGet() {
  return responder({ ok: true, servico: 'ZELO formulários' });
}

/** Rode UMA vez pelo editor: cria as abas e dispara a tela de autorização do Google */
function configurar() {
  Object.values(FORMULARIOS).forEach(obterAba);
  MailApp.getRemainingDailyQuota(); // força a permissão de envio de e-mail
}

function obterAba(form) {
  const planilha = SpreadsheetApp.getActiveSpreadsheet();
  let aba = planilha.getSheetByName(form.aba);
  if (!aba) {
    aba = planilha.insertSheet(form.aba);
    aba.appendRow(form.colunas);
    aba.getRange(1, 1, 1, form.colunas.length).setFontWeight('bold');
    aba.setFrozenRows(1);
  }
  return aba;
}

function avisarPorEmail(form, dados) {
  try {
    const linhas = form.colunas.slice(1, -1).map((col, i) => `${col}: ${form.linha(dados)[i] || '-'}`);
    const numero = String(dados.whatsapp || '').replace(/\D/g, '');
    const dono = Session.getEffectiveUser().getEmail();
    const destinatarios = [...new Set([dono, EMAIL_AVISO].filter(Boolean))].join(',');
    MailApp.sendEmail({
      to: destinatarios,
      subject: `ZELO — ${form.titulo}: ${dados.nome}`,
      body: `${linhas.join('\n')}\n\nResponder no WhatsApp: https://wa.me/55${numero}\n\n` +
            `Planilha: ${SpreadsheetApp.getActiveSpreadsheet().getUrl()}`,
    });
  } catch (erro) {
    console.error('Falha ao enviar e-mail de aviso', erro); // o cadastro já foi salvo
  }
}

/** Impede que um texto começando com = + - @ vire fórmula na planilha */
function textoSeguro(valor) {
  const texto = String(valor);
  return /^[=+\-@]/.test(texto) ? `'${texto}` : texto;
}

function responder(objeto) {
  return ContentService.createTextOutput(JSON.stringify(objeto))
    .setMimeType(ContentService.MimeType.JSON);
}
