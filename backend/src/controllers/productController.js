const productService = require('../services/productService');

// GET /v1/product/search
async function search(req, res, next) {
  try {
    const resultado = await productService.buscar(req.query, req);
    return res.status(200).json(resultado);
  } catch (err) {
    return next(err);
  }
}

// GET /v1/product/:id
async function getById(req, res, next) {
  try {
    const produto = await productService.buscarPorId(req.params.id, req);
    return res.status(200).json(produto);
  } catch (err) {
    return next(err);
  }
}

// POST /v1/product
async function create(req, res, next) {
  try {
    const produto = await productService.criar(req.body, req);
    return res.status(201).json(produto);
  } catch (err) {
    return next(err);
  }
}

// PUT /v1/product/:id
async function update(req, res, next) {
  try {
    await productService.atualizar(req.params.id, req.body);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

// DELETE /v1/product/:id
async function remove(req, res, next) {
  try {
    await productService.remover(req.params.id);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  search,
  getById,
  create,
  update,
  remove,
};
