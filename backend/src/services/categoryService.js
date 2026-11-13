const { Category } = require('../models');
const { criarErro } = require('../middleware/errorHandler');
const { lerId, lerPaginacao, lerBoolean } = require('./helpers');

function formatarCategoria(categoria, campos) {
  const dados = {
    id: categoria.id,
    name: categoria.name,
    slug: categoria.slug,
    use_in_menu: !!categoria.use_in_menu,
  };

  if (!campos) {
    return dados;
  }

  const saida = {};
  campos.forEach((campo) => {
    if (campo in dados) {
      saida[campo] = dados[campo];
    }
  });
  return saida;
}

function lerCampos(fields) {
  if (!fields) return null;
  const permitidos = ['id', 'name', 'slug', 'use_in_menu'];
  const pedidos = String(fields)
    .split(',')
    .map((c) => c.trim())
    .filter(Boolean);

  const validos = pedidos.filter((c) => permitidos.includes(c));
  if (!validos.length) {
    throw criarErro(400, 'Nenhum campo válido foi informado em fields');
  }

  // Sempre devolve o id, mesmo se a pessoa não pediu
  if (!validos.includes('id')) {
    validos.unshift('id');
  }
  return validos;
}

async function buscar(query) {
  const { limit, page } = lerPaginacao(query);
  const campos = lerCampos(query.fields);
  const where = {};

  if (query.use_in_menu !== undefined) {
    where.use_in_menu = lerBoolean(query.use_in_menu);
  }

  const opcoes = { where, order: [['id', 'ASC']] };

  if (limit === -1) {
    const lista = await Category.findAll(opcoes);
    return {
      data: lista.map((c) => formatarCategoria(c, campos)),
      total: lista.length,
      limit: -1,
      page: 1,
    };
  }

  const offset = (page - 1) * limit;
  const { rows, count } = await Category.findAndCountAll({
    ...opcoes,
    limit,
    offset,
  });

  return {
    data: rows.map((c) => formatarCategoria(c, campos)),
    total: count,
    limit,
    page,
  };
}

async function buscarPorId(idParam) {
  const id = lerId(idParam);
  const categoria = await Category.findByPk(id);
  if (!categoria) {
    throw criarErro(404, 'Categoria não encontrada');
  }
  return formatarCategoria(categoria);
}

async function criar(dados) {
  const { name, slug, use_in_menu } = dados || {};

  if (!name || !slug) {
    throw criarErro(400, 'Preencha name e slug');
  }

  const categoria = await Category.create({
    name,
    slug,
    use_in_menu: use_in_menu === undefined ? false : lerBoolean(use_in_menu),
  });

  return formatarCategoria(categoria);
}

async function atualizar(idParam, dados) {
  const id = lerId(idParam);
  const categoria = await Category.findByPk(id);
  if (!categoria) {
    throw criarErro(404, 'Categoria não encontrada');
  }

  const { name, slug, use_in_menu } = dados || {};

  if (name === undefined && slug === undefined && use_in_menu === undefined) {
    throw criarErro(400, 'Envie ao menos um campo para atualizar');
  }

  if (name !== undefined) categoria.name = name;
  if (slug !== undefined) categoria.slug = slug;
  if (use_in_menu !== undefined) categoria.use_in_menu = lerBoolean(use_in_menu);

  await categoria.save();
}

async function remover(idParam) {
  const id = lerId(idParam);
  const categoria = await Category.findByPk(id);
  if (!categoria) {
    throw criarErro(404, 'Categoria não encontrada');
  }
  await categoria.destroy();
}

module.exports = {
  buscar,
  buscarPorId,
  criar,
  atualizar,
  remover,
};
