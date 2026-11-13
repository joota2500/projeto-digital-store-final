const { criarErro } = require('../middleware/errorHandler');

// Confere se o ID da URL é um número inteiro válido
function lerId(valor) {
  const id = Number(valor);
  if (!Number.isInteger(id) || id <= 0) {
    throw criarErro(400, 'ID inválido');
  }
  return id;
}

// Lê limit e page da query string (padrões do enunciado: 12 e 1)
function lerPaginacao(query) {
  const limitRaw = query.limit === undefined ? 12 : query.limit;
  const pageRaw = query.page === undefined ? 1 : query.page;

  const limit = Number(limitRaw);
  const page = Number(pageRaw);

  if (!Number.isInteger(limit) || limit === 0 || limit < -1) {
    throw criarErro(400, 'O parâmetro limit deve ser -1 ou um número positivo');
  }

  if (!Number.isInteger(page) || page < 1) {
    throw criarErro(400, 'O parâmetro page deve ser um número positivo');
  }

  return { limit, page };
}

// Converte "4px" (ou número) para o inteiro que vai no banco
function lerRadius(valor) {
  if (valor === undefined || valor === null || valor === '') {
    return 0;
  }
  if (typeof valor === 'number') {
    return Math.round(valor);
  }
  const numero = parseInt(String(valor).replace(/px/i, ''), 10);
  if (Number.isNaN(numero)) {
    throw criarErro(400, 'O campo radius é inválido');
  }
  return numero;
}

// O enunciado mistura "value" e "values"; aceitamos os dois
function lerValoresOpcao(opcao) {
  const bruto = opcao.values !== undefined ? opcao.values : opcao.value;
  if (Array.isArray(bruto)) {
    return bruto.map((v) => String(v).trim()).filter(Boolean).join(',');
  }
  if (typeof bruto === 'string') {
    return bruto.trim();
  }
  return '';
}

function lerBoolean(valor, padrao = false) {
  if (valor === undefined || valor === null || valor === '') {
    return padrao;
  }
  if (valor === true || valor === 1 || valor === '1' || valor === 'true') {
    return true;
  }
  if (valor === false || valor === 0 || valor === '0' || valor === 'false') {
    return false;
  }
  throw criarErro(400, 'Valor booleano inválido');
}

function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email));
}

module.exports = {
  lerId,
  lerPaginacao,
  lerRadius,
  lerValoresOpcao,
  lerBoolean,
  emailValido,
};
