const { sequelize, Order, OrderItem, Product, ProductImage } = require('../models');
const { criarErro } = require('../middleware/errorHandler');
const { lerId } = require('./helpers');
const { montarUrlImagem } = require('./imageService');

// Frete grátis a partir de R$ 200; abaixo disso cobra R$ 19,90
const FRETE_PADRAO = 19.9;
const FRETE_GRATIS_A_PARTIR = 200;
const FORMAS_PAGAMENTO = ['pix', 'cartao', 'boleto'];
const STATUS_CANCELAVEIS = ['pendente', 'pago'];

function arredondar(valor) {
  return Number(Number(valor).toFixed(2));
}

// O preço vem do banco, nunca do que o front mandou
function precoUnitario(produto) {
  const preco = Number(produto.price);
  const desconto = Number(produto.price_with_discount);
  if (!Number.isNaN(desconto) && desconto < preco) {
    return arredondar(desconto);
  }
  return arredondar(preco);
}

function calcularFrete(subtotal) {
  return subtotal >= FRETE_GRATIS_A_PARTIR ? 0 : FRETE_PADRAO;
}

// Pix e cartão entram como pago (pagamento simulado na hora). Boleto fica pendente.
function statusInicial(forma) {
  if (forma === 'pix' || forma === 'cartao') return 'pago';
  return 'pendente';
}

function caminhoImagem(produto) {
  const imagens = produto.images || [];
  if (!imagens.length) return '';
  return imagens[0].path || '';
}

function formatarItem(item, req) {
  const json = item.toJSON ? item.toJSON() : item;
  return {
    id: json.id,
    product_id: json.product_id,
    product_name: json.product_name,
    product_image: montarUrlImagem(req, json.product_image),
    quantity: json.quantity,
    size: json.size,
    color: json.color,
    unit_price: arredondar(json.unit_price),
    subtotal: arredondar(json.unit_price * json.quantity),
  };
}

function formatarPedido(pedido, req) {
  const json = pedido.toJSON();
  const items = (pedido.items || []).map((item) => formatarItem(item, req));
  const subtotal = arredondar(items.reduce((soma, item) => soma + item.subtotal, 0));

  return {
    id: json.id,
    user_id: json.user_id,
    status: json.status,
    subtotal,
    shipping_cost: arredondar(json.shipping_cost),
    total: arredondar(json.total),
    recipient: json.recipient,
    zipcode: json.zipcode,
    street: json.street,
    number: json.number,
    complement: json.complement,
    neighborhood: json.neighborhood,
    city: json.city,
    state: json.state,
    payment_method: json.payment_method,
    created_at: json.created_at,
    updated_at: json.updated_at,
    items,
  };
}

function incluirItens() {
  return [{ model: OrderItem, as: 'items' }];
}

function validarEndereco(dados) {
  const obrigatorios = ['recipient', 'zipcode', 'street', 'number', 'neighborhood', 'city', 'state'];
  for (const campo of obrigatorios) {
    if (!dados || !String(dados[campo] || '').trim()) {
      throw criarErro(400, `O campo ${campo} é obrigatório`);
    }
  }

  const estado = String(dados.state).trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(estado)) {
    throw criarErro(400, 'O estado deve ter duas letras (UF)');
  }

  return {
    recipient: String(dados.recipient).trim(),
    zipcode: String(dados.zipcode).trim(),
    street: String(dados.street).trim(),
    number: String(dados.number).trim(),
    complement: dados.complement ? String(dados.complement).trim() : null,
    neighborhood: String(dados.neighborhood).trim(),
    city: String(dados.city).trim(),
    state: estado,
  };
}

function validarItens(itens) {
  if (!Array.isArray(itens) || itens.length === 0) {
    throw criarErro(400, 'Envie ao menos um item no pedido');
  }

  return itens.map((item, indice) => {
    const productId = Number(item.product_id);
    const quantity = Number(item.quantity);

    if (!Number.isInteger(productId) || productId <= 0) {
      throw criarErro(400, `Item ${indice + 1}: product_id inválido`);
    }
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw criarErro(400, `Item ${indice + 1}: a quantidade deve ser um número inteiro positivo`);
    }

    return {
      product_id: productId,
      quantity,
      size: item.size ? String(item.size).trim() : null,
      color: item.color ? String(item.color).trim() : null,
    };
  });
}

async function criar(userId, corpo, req) {
  const itens = validarItens(corpo && corpo.items);
  const endereco = validarEndereco(corpo);
  const forma = corpo && corpo.payment_method;

  if (!FORMAS_PAGAMENTO.includes(forma)) {
    throw criarErro(400, 'Forma de pagamento inválida. Use pix, cartao ou boleto');
  }

  const transacao = await sequelize.transaction();

  try {
    const itensProntos = [];
    let subtotal = 0;

    for (const item of itens) {
      const produto = await Product.findByPk(item.product_id, {
        include: [{ model: ProductImage, as: 'images' }],
        transaction: transacao,
      });

      if (!produto || !produto.enabled) {
        throw criarErro(400, `O produto ${item.product_id} não está disponível`);
      }

      const estoque = Number(produto.stock) || 0;
      if (estoque < item.quantity) {
        throw criarErro(
          400,
          `Estoque insuficiente para "${produto.name}". Disponível: ${estoque}`
        );
      }

      const unitPrice = precoUnitario(produto);
      subtotal = arredondar(subtotal + unitPrice * item.quantity);

      itensProntos.push({
        product_id: produto.id,
        product_name: produto.name,
        product_image: caminhoImagem(produto),
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        unit_price: unitPrice,
      });

      produto.stock = estoque - item.quantity;
      await produto.save({ transaction: transacao });
    }

    const shippingCost = calcularFrete(subtotal);
    const total = arredondar(subtotal + shippingCost);

    const pedido = await Order.create(
      {
        user_id: userId,
        status: statusInicial(forma),
        shipping_cost: shippingCost,
        total,
        payment_method: forma,
        ...endereco,
      },
      { transaction: transacao }
    );

    await OrderItem.bulkCreate(
      itensProntos.map((item) => ({ ...item, order_id: pedido.id })),
      { transaction: transacao }
    );

    await transacao.commit();

    const completo = await Order.findByPk(pedido.id, { include: incluirItens() });
    return formatarPedido(completo, req);
  } catch (err) {
    await transacao.rollback();
    throw err;
  }
}

async function listarDoUsuario(userId, req) {
  const pedidos = await Order.findAll({
    where: { user_id: userId },
    include: incluirItens(),
    order: [
      ['created_at', 'DESC'],
      [{ model: OrderItem, as: 'items' }, 'id', 'ASC'],
    ],
  });

  return { data: pedidos.map((pedido) => formatarPedido(pedido, req)) };
}

async function buscarPorId(userId, idParam, req) {
  const id = lerId(idParam);
  const pedido = await Order.findByPk(id, { include: incluirItens() });

  if (!pedido) {
    throw criarErro(404, 'Pedido não encontrado');
  }

  if (pedido.user_id !== userId) {
    throw criarErro(403, 'Você não tem permissão para ver este pedido');
  }

  return formatarPedido(pedido, req);
}

async function cancelar(userId, idParam, req) {
  const id = lerId(idParam);
  const transacao = await sequelize.transaction();

  try {
    const pedido = await Order.findByPk(id, {
      include: incluirItens(),
      transaction: transacao,
    });

    if (!pedido) {
      throw criarErro(404, 'Pedido não encontrado');
    }

    if (pedido.user_id !== userId) {
      throw criarErro(403, 'Você não tem permissão para cancelar este pedido');
    }

    if (!STATUS_CANCELAVEIS.includes(pedido.status)) {
      throw criarErro(400, 'Este pedido não pode mais ser cancelado');
    }

    // Devolve o estoque de cada item (se o produto ainda existir)
    for (const item of pedido.items || []) {
      if (!item.product_id) continue;
      const produto = await Product.findByPk(item.product_id, { transaction: transacao });
      if (produto) {
        produto.stock = (Number(produto.stock) || 0) + item.quantity;
        await produto.save({ transaction: transacao });
      }
    }

    pedido.status = 'cancelado';
    await pedido.save({ transaction: transacao });
    await transacao.commit();

    const atualizado = await Order.findByPk(id, { include: incluirItens() });
    return formatarPedido(atualizado, req);
  } catch (err) {
    await transacao.rollback();
    throw err;
  }
}

module.exports = {
  criar,
  listarDoUsuario,
  buscarPorId,
  cancelar,
  FRETE_PADRAO,
  FRETE_GRATIS_A_PARTIR,
};
