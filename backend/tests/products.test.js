const { app, request, loginAdmin, PNG_BASE64 } = require('./helpers');

describe('Produtos', () => {
  test('GET /v1/product/search lista os produtos do seed com paginação', async () => {
    const res = await request(app).get('/v1/product/search').query({ limit: 5, page: 1 });
    expect(res.status).toBe(200);
    expect(res.body.total).toBeGreaterThanOrEqual(15);
    expect(res.body.limit).toBe(5);
    expect(res.body.page).toBe(1);
    expect(res.body.data).toHaveLength(5);
    expect(res.body.data[0].images.length).toBeGreaterThan(0);
    expect(res.body.data[0].options.length).toBeGreaterThan(0);
    expect(res.body.data[0].category_ids.length).toBeGreaterThan(0);
  });

  test('GET /v1/product/search com limit=-1 devolve todos', async () => {
    const res = await request(app).get('/v1/product/search').query({ limit: -1 });
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(res.body.total);
    expect(res.body.total).toBeGreaterThanOrEqual(15);
  });

  test('GET /v1/product/search filtra por match', async () => {
    const res = await request(app).get('/v1/product/search').query({ match: 'Nike', limit: -1 });
    expect(res.status).toBe(200);
    expect(res.body.total).toBeGreaterThan(0);
    res.body.data.forEach((p) => {
      const texto = `${p.name} ${p.description}`.toLowerCase();
      expect(texto).toContain('nike');
    });
  });

  test('GET /v1/product/search filtra por price-range', async () => {
    const res = await request(app).get('/v1/product/search').query({
      'price-range': '200-400',
      limit: -1,
    });
    expect(res.status).toBe(200);
    res.body.data.forEach((p) => {
      expect(p.price).toBeGreaterThanOrEqual(200);
      expect(p.price).toBeLessThanOrEqual(400);
    });
  });

  test('GET /v1/product/search filtra por category_ids', async () => {
    const categorias = await request(app).get('/v1/category/search').query({ limit: -1 });
    const casual = categorias.body.data.find((c) => c.slug === 'casual');
    expect(casual).toBeDefined();

    const res = await request(app).get('/v1/product/search').query({
      category_ids: String(casual.id),
      limit: -1,
    });
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(5);
    res.body.data.forEach((p) => {
      expect(p.category_ids).toContain(casual.id);
    });
  });

  test('GET /v1/product/search respeita fields', async () => {
    const res = await request(app).get('/v1/product/search').query({
      fields: 'name,price',
      limit: 1,
    });
    expect(res.status).toBe(200);
    expect(res.body.data[0]).toHaveProperty('id');
    expect(res.body.data[0]).toHaveProperty('name');
    expect(res.body.data[0]).toHaveProperty('price');
    expect(res.body.data[0].images).toBeUndefined();
  });

  test('GET /v1/product/search retorna 400 com price-range inválido', async () => {
    const res = await request(app).get('/v1/product/search').query({ 'price-range': 'barato' });
    expect(res.status).toBe(400);
  });

  test('GET /v1/product/:id retorna o produto com imagens e opções', async () => {
    const lista = await request(app).get('/v1/product/search').query({ limit: 1 });
    const id = lista.body.data[0].id;

    const res = await request(app).get(`/v1/product/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(id);
    expect(Array.isArray(res.body.images)).toBe(true);
    expect(res.body.images[0].content).toMatch(/\/media\//);
    expect(res.body.options.some((o) => o.title === 'Tamanho')).toBe(true);
    expect(res.body.options.find((o) => o.title === 'Tamanho').values).toContain('39');
  });

  test('GET /v1/product/:id retorna 404 se não existir', async () => {
    const res = await request(app).get('/v1/product/999999');
    expect(res.status).toBe(404);
  });

  test('POST /v1/product retorna 401 sem token', async () => {
    const res = await request(app).post('/v1/product').send({
      name: 'Produto teste',
      slug: 'produto-teste',
      price: 10,
      price_with_discount: 8,
    });
    expect(res.status).toBe(401);
  });

  test('POST /v1/product cria produto com imagem em base64, radius 4px e value/values', async () => {
    const token = await loginAdmin();
    const categorias = await request(app).get('/v1/category/search').query({ limit: 1 });
    const slug = `produto-novo-${Date.now()}`;

    const res = await request(app)
      .post('/v1/product')
      .set('Authorization', `Bearer ${token}`)
      .send({
        enabled: true,
        name: 'Produto Novo',
        slug,
        stock: 7,
        description: 'Produto criado no teste',
        price: 119.9,
        price_with_discount: 99.9,
        category_ids: [categorias.body.data[0].id],
        images: [{ type: 'image/png', content: PNG_BASE64 }],
        options: [
          {
            title: 'Tamanho',
            shape: 'square',
            radius: '4px',
            type: 'text',
            value: ['PP', 'GG', 'M'],
          },
          {
            title: 'Cor',
            shape: 'circle',
            type: 'color',
            values: ['#000', '#333'],
          },
        ],
      });

    expect(res.status).toBe(201);
    expect(res.body.slug).toBe(slug);
    expect(res.body.images).toHaveLength(1);
    expect(res.body.images[0].content).toMatch(/\/uploads\//);
    expect(res.body.options).toHaveLength(2);

    const tamanho = res.body.options.find((o) => o.title === 'Tamanho');
    expect(tamanho.radius).toBe(4);
    expect(tamanho.values).toEqual(['PP', 'GG', 'M']);
  });

  test('POST /v1/product retorna 400 sem campos obrigatórios', async () => {
    const token = await loginAdmin();
    const res = await request(app)
      .post('/v1/product')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Incompleto' });
    expect(res.status).toBe(400);
  });

  test('PUT atualiza o produto, apaga uma opção e DELETE remove em cascade', async () => {
    const token = await loginAdmin();
    const slug = `produto-ciclo-${Date.now()}`;

    const criado = await request(app)
      .post('/v1/product')
      .set('Authorization', `Bearer ${token}`)
      .send({
        enabled: true,
        name: 'Produto Ciclo',
        slug,
        stock: 3,
        description: 'Vai ser atualizado',
        price: 50,
        price_with_discount: 40,
        images: [{ type: 'image/png', content: PNG_BASE64 }],
        options: [
          { title: 'Tamanho', type: 'text', values: ['P', 'M'] },
          { title: 'Cor', type: 'color', values: ['#000'] },
        ],
      });

    expect(criado.status).toBe(201);
    const optionId = criado.body.options.find((o) => o.title === 'Cor').id;
    const imageId = criado.body.images[0].id;

    const put = await request(app)
      .put(`/v1/product/${criado.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Produto Ciclo Atualizado',
        stock: 20,
        options: [{ id: optionId, deleted: true }],
        images: [{ id: imageId, deleted: true }],
      });

    expect(put.status).toBe(204);

    const consulta = await request(app).get(`/v1/product/${criado.body.id}`);
    expect(consulta.body.name).toBe('Produto Ciclo Atualizado');
    expect(consulta.body.stock).toBe(20);
    expect(consulta.body.options.some((o) => o.title === 'Cor')).toBe(false);
    expect(consulta.body.images).toHaveLength(0);

    const del = await request(app)
      .delete(`/v1/product/${criado.body.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(del.status).toBe(204);

    const depois = await request(app).get(`/v1/product/${criado.body.id}`);
    expect(depois.status).toBe(404);
  });

  test('DELETE /v1/product/:id retorna 401 sem token', async () => {
    const res = await request(app).delete('/v1/product/1');
    expect(res.status).toBe(401);
  });

  test('DELETE /v1/product/:id retorna 404 para produto inexistente', async () => {
    const token = await loginAdmin();
    const res = await request(app)
      .delete('/v1/product/999999')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
  });

  test('GET /v1/product/search filtra por option[id]', async () => {
    const lista = await request(app).get('/v1/product/search').query({ limit: 1 });
    const produto = lista.body.data[0];
    const opcao = produto.options.find((o) => o.title === 'Tamanho');
    expect(opcao).toBeDefined();

    const res = await request(app).get('/v1/product/search').query({
      [`option[${opcao.id}]`]: '39,40',
      limit: -1,
    });

    expect(res.status).toBe(200);
    expect(res.body.total).toBe(1);
    expect(res.body.data[0].id).toBe(produto.id);
  });
});
