const { app, request, loginAdmin, PNG_BASE64 } = require('./helpers');

const endereco = {
  recipient: 'João Victor',
  zipcode: '60150-161',
  street: 'Av. Santos Dumont',
  number: '1510',
  complement: '1 andar',
  neighborhood: 'Aldeota',
  city: 'Fortaleza',
  state: 'CE',
};

async function criarUsuarioEToken(prefixo) {
  const email = `${prefixo}.${Date.now()}@mail.com`;
  await request(app).post('/v1/user').send({
    firstname: 'Teste',
    surname: 'Pedidos',
    email,
    password: '123@123',
    confirmPassword: '123@123',
  });

  const login = await request(app).post('/v1/user/token').send({
    email,
    password: '123@123',
  });

  return login.body.token;
}

async function criarProduto(token, extras = {}) {
  const slug = `pedido-prod-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const res = await request(app)
    .post('/v1/product')
    .set('Authorization', `Bearer ${token}`)
    .send({
      enabled: true,
      name: extras.name || 'Tênis de Teste',
      slug,
      stock: extras.stock !== undefined ? extras.stock : 5,
      description: 'Produto usado só nos testes de pedido',
      price: extras.price !== undefined ? extras.price : 150,
      price_with_discount:
        extras.price_with_discount !== undefined ? extras.price_with_discount : 100,
      images: [{ type: 'image/png', content: PNG_BASE64 }],
    });

  if (res.status !== 201) {
    throw new Error(`Não foi possível criar o produto de teste: ${res.status}`);
  }

  return res.body;
}

describe('Pedidos', () => {
  test('GET /api-docs.json documenta as rotas de pedido', async () => {
    const res = await request(app).get('/api-docs.json');
    expect(res.status).toBe(200);
    expect(res.body.paths['/v1/order']).toBeDefined();
    expect(res.body.paths['/v1/order/{id}']).toBeDefined();
    expect(res.body.paths['/v1/order/{id}/cancel']).toBeDefined();
  });

  test('POST /v1/order retorna 401 sem token', async () => {
    const res = await request(app).post('/v1/order').send({
      ...endereco,
      payment_method: 'pix',
      items: [{ product_id: 1, quantity: 1 }],
    });
    expect(res.status).toBe(401);
  });

  test('GET /v1/order retorna 401 sem token', async () => {
    const res = await request(app).get('/v1/order');
    expect(res.status).toBe(401);
  });

  test('POST /v1/order retorna 400 sem itens', async () => {
    const token = await loginAdmin();
    const res = await request(app)
      .post('/v1/order')
      .set('Authorization', `Bearer ${token}`)
      .send({
        ...endereco,
        payment_method: 'pix',
        items: [],
      });
    expect(res.status).toBe(400);
  });

  test('POST /v1/order retorna 400 se faltar endereço', async () => {
    const token = await loginAdmin();
    const produto = await criarProduto(token);
    const res = await request(app)
      .post('/v1/order')
      .set('Authorization', `Bearer ${token}`)
      .send({
        payment_method: 'pix',
        items: [{ product_id: produto.id, quantity: 1 }],
      });
    expect(res.status).toBe(400);
  });

  test('POST /v1/order retorna 400 para produto inexistente', async () => {
    const token = await loginAdmin();
    const res = await request(app)
      .post('/v1/order')
      .set('Authorization', `Bearer ${token}`)
      .send({
        ...endereco,
        payment_method: 'pix',
        items: [{ product_id: 999999, quantity: 1 }],
      });
    expect(res.status).toBe(400);
  });

  test('POST /v1/order retorna 400 quando o estoque não chega', async () => {
    const token = await loginAdmin();
    const produto = await criarProduto(token, { stock: 1 });
    const res = await request(app)
      .post('/v1/order')
      .set('Authorization', `Bearer ${token}`)
      .send({
        ...endereco,
        payment_method: 'pix',
        items: [{ product_id: produto.id, quantity: 3, size: '41', color: '#000' }],
      });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/estoque/i);
  });

  test('POST /v1/order cria o pedido com o preço do banco e reduz o estoque', async () => {
    const token = await loginAdmin();
    const produto = await criarProduto(token, {
      stock: 5,
      price: 150,
      price_with_discount: 100,
    });

    const res = await request(app)
      .post('/v1/order')
      .set('Authorization', `Bearer ${token}`)
      .send({
        ...endereco,
        payment_method: 'pix',
        items: [{ product_id: produto.id, quantity: 2, size: '41', color: '#6FEEFF' }],
      });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe('pago');
    expect(res.body.payment_method).toBe('pix');
    expect(res.body.items).toHaveLength(1);
    expect(res.body.items[0].unit_price).toBe(100);
    expect(res.body.items[0].quantity).toBe(2);
    expect(res.body.items[0].subtotal).toBe(200);
    expect(res.body.items[0].size).toBe('41');
    expect(res.body.subtotal).toBe(200);
    expect(res.body.shipping_cost).toBe(0);
    expect(res.body.total).toBe(200);
    expect(res.body.city).toBe('Fortaleza');

    const consulta = await request(app).get(`/v1/product/${produto.id}`);
    expect(consulta.body.stock).toBe(3);
  });

  test('POST /v1/order com boleto fica pendente e cobra frete abaixo de R$ 200', async () => {
    const token = await loginAdmin();
    const produto = await criarProduto(token, {
      stock: 4,
      price: 80,
      price_with_discount: 80,
    });

    const res = await request(app)
      .post('/v1/order')
      .set('Authorization', `Bearer ${token}`)
      .send({
        ...endereco,
        payment_method: 'boleto',
        items: [{ product_id: produto.id, quantity: 1 }],
      });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe('pendente');
    expect(res.body.subtotal).toBe(80);
    expect(res.body.shipping_cost).toBe(19.9);
    expect(res.body.total).toBe(99.9);
  });

  test('GET /v1/order lista só os pedidos de quem está logado', async () => {
    const tokenA = await criarUsuarioEToken('dona');
    const tokenB = await criarUsuarioEToken('outra');
    const admin = await loginAdmin();
    const produto = await criarProduto(admin, { stock: 6, price: 220, price_with_discount: 220 });

    const criado = await request(app)
      .post('/v1/order')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        ...endereco,
        payment_method: 'cartao',
        items: [{ product_id: produto.id, quantity: 1 }],
      });
    expect(criado.status).toBe(201);

    const listaA = await request(app)
      .get('/v1/order')
      .set('Authorization', `Bearer ${tokenA}`);
    expect(listaA.status).toBe(200);
    expect(listaA.body.data.some((p) => p.id === criado.body.id)).toBe(true);

    const listaB = await request(app)
      .get('/v1/order')
      .set('Authorization', `Bearer ${tokenB}`);
    expect(listaB.status).toBe(200);
    expect(listaB.body.data.some((p) => p.id === criado.body.id)).toBe(false);
  });

  test('GET /v1/order/:id retorna 404 se não existir e 403 se for de outra pessoa', async () => {
    const tokenA = await criarUsuarioEToken('dona2');
    const tokenB = await criarUsuarioEToken('outra2');
    const admin = await loginAdmin();
    const produto = await criarProduto(admin, { stock: 3, price: 220, price_with_discount: 220 });

    const criado = await request(app)
      .post('/v1/order')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        ...endereco,
        payment_method: 'pix',
        items: [{ product_id: produto.id, quantity: 1 }],
      });

    const inexistente = await request(app)
      .get('/v1/order/999999')
      .set('Authorization', `Bearer ${tokenA}`);
    expect(inexistente.status).toBe(404);

    const alheio = await request(app)
      .get(`/v1/order/${criado.body.id}`)
      .set('Authorization', `Bearer ${tokenB}`);
    expect(alheio.status).toBe(403);

    const proprio = await request(app)
      .get(`/v1/order/${criado.body.id}`)
      .set('Authorization', `Bearer ${tokenA}`);
    expect(proprio.status).toBe(200);
    expect(proprio.body.id).toBe(criado.body.id);
    expect(proprio.body.items[0].product_name).toBeDefined();
  });

  test('PUT /v1/order/:id/cancel cancela o pedido e devolve o estoque', async () => {
    const token = await loginAdmin();
    const produto = await criarProduto(token, { stock: 4, price: 50, price_with_discount: 50 });

    const criado = await request(app)
      .post('/v1/order')
      .set('Authorization', `Bearer ${token}`)
      .send({
        ...endereco,
        payment_method: 'pix',
        items: [{ product_id: produto.id, quantity: 2 }],
      });
    expect(criado.status).toBe(201);

    const estoqueDepois = await request(app).get(`/v1/product/${produto.id}`);
    expect(estoqueDepois.body.stock).toBe(2);

    const cancelado = await request(app)
      .put(`/v1/order/${criado.body.id}/cancel`)
      .set('Authorization', `Bearer ${token}`);

    expect(cancelado.status).toBe(200);
    expect(cancelado.body.status).toBe('cancelado');

    const estoqueFinal = await request(app).get(`/v1/product/${produto.id}`);
    expect(estoqueFinal.body.stock).toBe(4);
  });

  test('PUT /v1/order/:id/cancel retorna 400 se o pedido já estiver cancelado', async () => {
    const token = await loginAdmin();
    const produto = await criarProduto(token, { stock: 2, price: 50, price_with_discount: 50 });

    const criado = await request(app)
      .post('/v1/order')
      .set('Authorization', `Bearer ${token}`)
      .send({
        ...endereco,
        payment_method: 'boleto',
        items: [{ product_id: produto.id, quantity: 1 }],
      });

    await request(app)
      .put(`/v1/order/${criado.body.id}/cancel`)
      .set('Authorization', `Bearer ${token}`);

    const deNovo = await request(app)
      .put(`/v1/order/${criado.body.id}/cancel`)
      .set('Authorization', `Bearer ${token}`);

    expect(deNovo.status).toBe(400);
  });
});
