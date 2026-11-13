const orderService = require('../services/orderService');

// POST /v1/order
async function create(req, res, next) {
  try {
    const pedido = await orderService.criar(Number(req.user.id), req.body, req);
    return res.status(201).json(pedido);
  } catch (err) {
    return next(err);
  }
}

// GET /v1/order
async function list(req, res, next) {
  try {
    const resultado = await orderService.listarDoUsuario(Number(req.user.id), req);
    return res.status(200).json(resultado);
  } catch (err) {
    return next(err);
  }
}

// GET /v1/order/:id
async function getById(req, res, next) {
  try {
    const pedido = await orderService.buscarPorId(Number(req.user.id), req.params.id, req);
    return res.status(200).json(pedido);
  } catch (err) {
    return next(err);
  }
}

// PUT /v1/order/:id/cancel
async function cancel(req, res, next) {
  try {
    const pedido = await orderService.cancelar(Number(req.user.id), req.params.id, req);
    return res.status(200).json(pedido);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  create,
  list,
  getById,
  cancel,
};
