const jwt = require('jsonwebtoken');

// Confere se a requisição trouxe um token JWT válido
function auth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Token de autorização não enviado ou inválido',
    });
  }

  const token = header.slice(7).trim();

  if (!token) {
    return res.status(401).json({
      message: 'Token de autorização não enviado ou inválido',
    });
  }

  try {
    const dados = jwt.verify(token, process.env.JWT_SECRET);
    req.user = dados;
    return next();
  } catch (err) {
    return res.status(401).json({
      message: 'Token de autorização não enviado ou inválido',
    });
  }
}

module.exports = auth;
