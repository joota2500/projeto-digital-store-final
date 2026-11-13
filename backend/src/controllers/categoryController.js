const categoryService = require('../services/categoryService');

// GET /v1/category/search
async function search(req, res, next) {
  try {
    const resultado = await categoryService.buscar(req.query);
    return res.status(200).json(resultado);
  } catch (err) {
    return next(err);
  }
}

// GET /v1/category/:id
async function getById(req, res, next) {
  try {
    const categoria = await categoryService.buscarPorId(req.params.id);
    return res.status(200).json(categoria);
  } catch (err) {
    return next(err);
  }
}

// POST /v1/category
async function create(req, res, next) {
  try {
    const categoria = await categoryService.criar(req.body);
    return res.status(201).json(categoria);
  } catch (err) {
    return next(err);
  }
}

// PUT /v1/category/:id
async function update(req, res, next) {
  try {
    await categoryService.atualizar(req.params.id, req.body);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

// DELETE /v1/category/:id
async function remove(req, res, next) {
  try {
    await categoryService.remover(req.params.id);
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
