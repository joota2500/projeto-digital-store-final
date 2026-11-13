const { Op } = require('sequelize');
const {
  sequelize,
  Product,
  ProductImage,
  ProductOption,
  ProductCategory,
  Category,
} = require('../models');
const { criarErro } = require('../middleware/errorHandler');
const { lerId, lerPaginacao, lerRadius, lerValoresOpcao, lerBoolean } = require('./helpers');
const { salvarBase64, montarUrlImagem, apagarArquivo, ehUrl, ehCaminhoLocal } = require('./imageService');

const CAMPOS_PRODUTO = [
  'id',
  'enabled',
  'name',
  'slug',
  'use_in_menu',
  'stock',
  'description',
  'price',
  'price_with_discount',
  'category_ids',
  'images',
  'options',
];

function arredondarPreco(valor) {
  return Number(Number(valor).toFixed(2));
}

function formatarOpcao(opcao) {
  return {
    id: opcao.id,
    title: opcao.title,
    shape: opcao.shape,
    radius: opcao.radius,
    type: opcao.type,
    values: opcao.values ? opcao.values.split(',').map((v) => v.trim()) : [],
  };
}

function formatarProduto(produto, req, campos) {
  const json = produto.toJSON();
  const dados = {
    id: json.id,
    enabled: !!json.enabled,
    name: json.name,
    slug: json.slug,
    use_in_menu: !!json.use_in_menu,
    stock: json.stock,
    description: json.description,
    price: arredondarPreco(json.price),
    price_with_discount: arredondarPreco(json.price_with_discount),
    category_ids: (json.categories || []).map((c) => c.id),
    images: (json.images || []).map((img) => ({
      id: img.id,
      content: montarUrlImagem(req, img.path),
    })),
    options: (json.options || []).map(formatarOpcao),
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
  const pedidos = String(fields)
    .split(',')
    .map((c) => c.trim())
    .filter(Boolean);
  const validos = pedidos.filter((c) => CAMPOS_PRODUTO.includes(c));
  if (!validos.length) {
    throw criarErro(400, 'Nenhum campo válido foi informado em fields');
  }
  if (!validos.includes('id')) {
    validos.unshift('id');
  }
  return validos;
}

function includesPadrao() {
  return [
    { model: ProductImage, as: 'images' },
    { model: ProductOption, as: 'options' },
    { model: Category, as: 'categories', attributes: ['id'], through: { attributes: [] } },
  ];
}

// Guarda uma imagem nova (base64) ou reaproveita um caminho/URL já pronto
function resolverCaminhoImagem(item) {
  if (!item || !item.content) {
    throw criarErro(400, 'Cada imagem precisa de um conteúdo');
  }
  if (ehUrl(item.content) || ehCaminhoLocal(item.content)) {
    return item.content;
  }
  return salvarBase64(item.type, item.content);
}

function montarDadosOpcao(opcao) {
  const values = lerValoresOpcao(opcao);
  if (!values) {
    throw criarErro(400, 'A opção precisa de valores (value ou values)');
  }

  const dados = { values };

  if (opcao.title !== undefined) dados.title = opcao.title;
  if (opcao.shape !== undefined) {
    if (!['square', 'circle'].includes(opcao.shape)) {
      throw criarErro(400, 'shape deve ser square ou circle');
    }
    dados.shape = opcao.shape;
  }
  if (opcao.type !== undefined) {
    if (!['text', 'color'].includes(opcao.type)) {
      throw criarErro(400, 'type deve ser text ou color');
    }
    dados.type = opcao.type;
  }
  if (opcao.radius !== undefined) {
    dados.radius = lerRadius(opcao.radius);
  }

  return dados;
}

async function filtrarIdsPorCategoria(categoryIds) {
  const ids = String(categoryIds)
    .split(',')
    .map((v) => Number(v.trim()))
    .filter((n) => Number.isInteger(n) && n > 0);

  if (!ids.length) {
    throw criarErro(400, 'category_ids inválido');
  }

  const relacoes = await ProductCategory.findAll({
    where: { category_id: { [Op.in]: ids } },
    attributes: ['product_id'],
  });

  return [...new Set(relacoes.map((r) => r.product_id))];
}

function normalizarFiltroOpcao(optionQuery) {
  // O Express interpreta option[1] como array (índice 1) e option[45] como objeto.
  // Aqui unificamos os dois formatos.
  if (!optionQuery) return [];
  if (Array.isArray(optionQuery)) {
    return optionQuery
      .map((valor, indice) => [String(indice), valor])
      .filter(([, valor]) => valor !== undefined && valor !== null);
  }
  return Object.entries(optionQuery);
}

async function filtrarIdsPorOpcao(optionQuery) {
  // option[45]=GG,PP  ->  { '45': 'GG,PP' }
  const entradas = normalizarFiltroOpcao(optionQuery);
  let ids = null;

  for (const [optionIdRaw, valoresRaw] of entradas) {
    const optionId = Number(optionIdRaw);
    if (!Number.isInteger(optionId) || optionId <= 0) {
      throw criarErro(400, 'ID de opção inválido no filtro option');
    }

    const valores = String(valoresRaw)
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);

    if (!valores.length) {
      throw criarErro(400, 'Valores do filtro option inválidos');
    }

    const opcao = await ProductOption.findByPk(optionId);
    if (!opcao) {
      return [];
    }

    const lista = opcao.values.split(',').map((v) => v.trim());
    const bate = valores.some((v) => lista.includes(v));
    const produtoId = bate ? opcao.product_id : null;

    const atual = produtoId ? [produtoId] : [];
    ids = ids === null ? atual : ids.filter((id) => atual.includes(id));
  }

  return ids || [];
}

async function buscar(query, req) {
  const { limit, page } = lerPaginacao(query);
  const campos = lerCampos(query.fields);
  const where = {};
  let idsPermitidos = null;

  if (query.match) {
    const termo = `%${query.match}%`;
    where[Op.or] = [
      { name: { [Op.like]: termo } },
      { description: { [Op.like]: termo } },
    ];
  }

  if (query['price-range']) {
    const partes = String(query['price-range']).split('-');
    const min = Number(partes[0]);
    const max = Number(partes[1]);
    if (Number.isNaN(min) || Number.isNaN(max) || partes.length !== 2) {
      throw criarErro(400, 'price-range deve estar no formato min-max, ex: 100-200');
    }
    where.price = { [Op.between]: [min, max] };
  }

  if (query.category_ids) {
    idsPermitidos = await filtrarIdsPorCategoria(query.category_ids);
  }

  if (query.option) {
    const idsOpcao = await filtrarIdsPorOpcao(query.option);
    idsPermitidos = idsPermitidos === null
      ? idsOpcao
      : idsPermitidos.filter((id) => idsOpcao.includes(id));
  }

  if (idsPermitidos !== null) {
    where.id = { [Op.in]: idsPermitidos.length ? idsPermitidos : [0] };
  }

  const opcoes = {
    where,
    include: includesPadrao(),
    distinct: true,
    order: [['id', 'ASC']],
  };

  let rows;
  let total;

  if (limit === -1) {
    rows = await Product.findAll(opcoes);
    total = rows.length;
    return {
      data: rows.map((p) => formatarProduto(p, req, campos)),
      total,
      limit: -1,
      page: 1,
    };
  }

  const resultado = await Product.findAndCountAll({
    ...opcoes,
    limit,
    offset: (page - 1) * limit,
  });

  rows = resultado.rows;
  total = resultado.count;

  return {
    data: rows.map((p) => formatarProduto(p, req, campos)),
    total,
    limit,
    page,
  };
}

async function buscarPorId(idParam, req) {
  const id = lerId(idParam);
  const produto = await Product.findByPk(id, { include: includesPadrao() });
  if (!produto) {
    throw criarErro(404, 'Produto não encontrado');
  }
  return formatarProduto(produto, req);
}

async function vincularCategorias(produto, categoryIds, transaction) {
  if (categoryIds === undefined) return;

  if (!Array.isArray(categoryIds)) {
    throw criarErro(400, 'category_ids deve ser um array de IDs');
  }

  if (categoryIds.length) {
    const existentes = await Category.findAll({
      where: { id: { [Op.in]: categoryIds } },
      transaction,
    });
    if (existentes.length !== categoryIds.length) {
      throw criarErro(400, 'Uma ou mais categorias informadas não existem');
    }
  }

  await produto.setCategories(categoryIds, { transaction });
}

async function criar(dados, req) {
  const corpo = dados || {};

  if (!corpo.name || !corpo.slug || corpo.price === undefined || corpo.price_with_discount === undefined) {
    throw criarErro(400, 'Preencha name, slug, price e price_with_discount');
  }

  if (Number.isNaN(Number(corpo.price)) || Number.isNaN(Number(corpo.price_with_discount))) {
    throw criarErro(400, 'price e price_with_discount devem ser números');
  }

  return sequelize.transaction(async (transaction) => {
    const produto = await Product.create(
      {
        enabled: corpo.enabled === undefined ? false : lerBoolean(corpo.enabled),
        name: corpo.name,
        slug: corpo.slug,
        use_in_menu: corpo.use_in_menu === undefined ? false : lerBoolean(corpo.use_in_menu),
        stock: corpo.stock === undefined ? 0 : Number(corpo.stock),
        description: corpo.description || null,
        price: Number(corpo.price),
        price_with_discount: Number(corpo.price_with_discount),
      },
      { transaction }
    );

    if (Array.isArray(corpo.images)) {
      for (const item of corpo.images) {
        const caminho = resolverCaminhoImagem(item);
        await ProductImage.create(
          {
            product_id: produto.id,
            enabled: item.enabled === undefined ? true : lerBoolean(item.enabled),
            path: caminho,
          },
          { transaction }
        );
      }
    }

    if (Array.isArray(corpo.options)) {
      for (const opcao of corpo.options) {
        if (!opcao.title) {
          throw criarErro(400, 'Cada opção precisa de um título');
        }
        const dadosOpcao = montarDadosOpcao(opcao);
        await ProductOption.create(
          {
            product_id: produto.id,
            title: opcao.title,
            shape: dadosOpcao.shape || 'square',
            radius: dadosOpcao.radius === undefined ? 0 : dadosOpcao.radius,
            type: dadosOpcao.type || 'text',
            values: dadosOpcao.values,
          },
          { transaction }
        );
      }
    }

    await vincularCategorias(produto, corpo.category_ids, transaction);

    const completo = await Product.findByPk(produto.id, {
      include: includesPadrao(),
      transaction,
    });
    return formatarProduto(completo, req);
  });
}

async function atualizar(idParam, dados) {
  const id = lerId(idParam);
  const corpo = dados || {};

  const produto = await Product.findByPk(id, { include: includesPadrao() });
  if (!produto) {
    throw criarErro(404, 'Produto não encontrado');
  }

  await sequelize.transaction(async (transaction) => {
    const camposSimples = [
      'name',
      'slug',
      'stock',
      'description',
      'price',
      'price_with_discount',
    ];
    camposSimples.forEach((campo) => {
      if (corpo[campo] !== undefined) {
        produto[campo] = corpo[campo];
      }
    });
    if (corpo.enabled !== undefined) produto.enabled = lerBoolean(corpo.enabled);
    if (corpo.use_in_menu !== undefined) produto.use_in_menu = lerBoolean(corpo.use_in_menu);

    await produto.save({ transaction });

    if (Array.isArray(corpo.images)) {
      for (const item of corpo.images) {
        if (item.deleted && item.id) {
          const imagem = await ProductImage.findOne({
            where: { id: item.id, product_id: id },
            transaction,
          });
          if (imagem) {
            apagarArquivo(imagem.path);
            await imagem.destroy({ transaction });
          }
          continue;
        }

        if (item.id) {
          const imagem = await ProductImage.findOne({
            where: { id: item.id, product_id: id },
            transaction,
          });
          if (!imagem) {
            throw criarErro(400, `Imagem ${item.id} não encontrada neste produto`);
          }
          if (item.content) {
            const caminhoAntigo = imagem.path;
            imagem.path = resolverCaminhoImagem(item);
            if (caminhoAntigo !== imagem.path) {
              apagarArquivo(caminhoAntigo);
            }
          }
          if (item.enabled !== undefined) {
            imagem.enabled = lerBoolean(item.enabled);
          }
          await imagem.save({ transaction });
        } else if (item.content) {
          const caminho = resolverCaminhoImagem(item);
          await ProductImage.create(
            {
              product_id: id,
              enabled: item.enabled === undefined ? true : lerBoolean(item.enabled),
              path: caminho,
            },
            { transaction }
          );
        }
      }
    }

    if (Array.isArray(corpo.options)) {
      for (const opcao of corpo.options) {
        if (opcao.deleted && opcao.id) {
          await ProductOption.destroy({
            where: { id: opcao.id, product_id: id },
            transaction,
          });
          continue;
        }

        if (opcao.id) {
          const existente = await ProductOption.findOne({
            where: { id: opcao.id, product_id: id },
            transaction,
          });
          if (!existente) {
            throw criarErro(400, `Opção ${opcao.id} não encontrada neste produto`);
          }
          const dadosOpcao = {};
          if (opcao.title !== undefined) dadosOpcao.title = opcao.title;
          if (opcao.shape !== undefined || opcao.type !== undefined || opcao.radius !== undefined || opcao.value !== undefined || opcao.values !== undefined) {
            Object.assign(dadosOpcao, montarDadosOpcao({ ...existente.toJSON(), ...opcao }));
          }
          await existente.update(dadosOpcao, { transaction });
        } else {
          if (!opcao.title) {
            throw criarErro(400, 'Cada opção nova precisa de um título');
          }
          const dadosOpcao = montarDadosOpcao(opcao);
          await ProductOption.create(
            {
              product_id: id,
              title: opcao.title,
              shape: dadosOpcao.shape || 'square',
              radius: dadosOpcao.radius === undefined ? 0 : dadosOpcao.radius,
              type: dadosOpcao.type || 'text',
              values: dadosOpcao.values,
            },
            { transaction }
          );
        }
      }
    }

    await vincularCategorias(produto, corpo.category_ids, transaction);
  });
}

async function remover(idParam) {
  const id = lerId(idParam);
  const produto = await Product.findByPk(id, { include: [{ model: ProductImage, as: 'images' }] });
  if (!produto) {
    throw criarErro(404, 'Produto não encontrado');
  }

  // Apaga os arquivos enviados antes de remover o registro (o banco já faz cascade)
  (produto.images || []).forEach((img) => apagarArquivo(img.path));
  await produto.destroy();
}

module.exports = {
  buscar,
  buscarPorId,
  criar,
  atualizar,
  remover,
};
