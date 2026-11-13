const request = require('supertest');
const app = require('../src/app');

async function loginAdmin() {
  const res = await request(app)
    .post('/v1/user/token')
    .send({ email: 'admin@digitalstore.com', password: '123@123' });

  if (res.status !== 200 || !res.body.token) {
    throw new Error('Não foi possível autenticar o admin de teste');
  }

  return res.body.token;
}

// PNG 1x1 em base64, usado nos testes de imagem
const PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

module.exports = {
  app,
  request,
  loginAdmin,
  PNG_BASE64,
};
