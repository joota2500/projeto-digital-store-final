const userService = require('../services/userService');

// GET /v1/user/:id
async function getById(req, res, next) {
  try {
    const user = await userService.buscarPorId(req.params.id);
    return res.status(200).json(user);
  } catch (err) {
    return next(err);
  }
}

// POST /v1/user  (rota pública)
async function create(req, res, next) {
  try {
    const user = await userService.criar(req.body);
    return res.status(201).json(user);
  } catch (err) {
    return next(err);
  }
}

// PUT /v1/user/:id
async function update(req, res, next) {
  try {
    await userService.atualizar(req.params.id, req.body);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

// DELETE /v1/user/:id
async function remove(req, res, next) {
  try {
    await userService.remover(req.params.id);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

// POST /v1/user/token  (rota pública)
async function login(req, res, next) {
  try {
    const resultado = await userService.gerarToken(req.body);
    return res.status(200).json(resultado);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getById,
  create,
  update,
  remove,
  login,
};
