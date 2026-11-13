// Tratamento centralizado de erros da API
function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Erro interno do servidor';

  if (status >= 500) {
    console.error(err);
  }

  // 204 não pode ter corpo; nos outros casos devolvemos uma mensagem
  if (status === 204) {
    return res.status(204).send();
  }

  return res.status(status).json({ message });
}

// Atalho para criar um erro com status HTTP
function criarErro(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

module.exports = {
  errorHandler,
  criarErro,
};
