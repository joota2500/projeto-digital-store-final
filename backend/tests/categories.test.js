const { app, request, loginAdmin } = require('./helpers');

describe('Categorias', () => {
  test('GET /v1/category/search lista as categorias do seed', async () => {
    const res = await request(app).get('/v1/category/search').query({ limit: -1 });
    expect(res.status).toBe(200);
    expect(res.body.total).toBeGreaterThanOrEqual(4);
    expect(res.body.limit).toBe(-1);
    expect(res.body.data.some((c) => c.slug === 'casual')).toBe(true);
    expect(res.body.data.some((c) => c.slug === 'esporte-lazer')).toBe(true);
  });

  test('GET /v1/category/search respeita fields e use_in_menu', async () => {
    const res = await request(app).get('/v1/category/search').query({
      fields: 'name,slug',
      use_in_menu: true,
      limit: -1,
    });
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0]).toHaveProperty('id');
    expect(res.body.data[0]).toHaveProperty('name');
    expect(res.body.data[0]).toHaveProperty('slug');
    expect(res.body.data[0].use_in_menu).toBeUndefined();
  });

  test('GET /v1/category/search retorna 400 com limit inválido', async () => {
    const res = await request(app).get('/v1/category/search').query({ limit: 'abc' });
    expect(res.status).toBe(400);
  });

  test('GET /v1/category/:id retorna a categoria', async () => {
    const lista = await request(app).get('/v1/category/search').query({ limit: 1 });
    const id = lista.body.data[0].id;

    const res = await request(app).get(`/v1/category/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(id);
    expect(res.body.name).toBeDefined();
  });

  test('GET /v1/category/:id retorna 404 se não existir', async () => {
    const res = await request(app).get('/v1/category/999999');
    expect(res.status).toBe(404);
  });

  test('POST /v1/category retorna 401 sem token', async () => {
    const res = await request(app).post('/v1/category').send({
      name: 'Ofertas',
      slug: 'ofertas',
      use_in_menu: true,
    });
    expect(res.status).toBe(401);
  });

  test('POST /v1/category cria uma categoria', async () => {
    const token = await loginAdmin();
    const slug = `ofertas-${Date.now()}`;
    const res = await request(app)
      .post('/v1/category')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Ofertas', slug, use_in_menu: true });

    expect(res.status).toBe(201);
    expect(res.body.slug).toBe(slug);
    expect(res.body.use_in_menu).toBe(true);
  });

  test('POST /v1/category retorna 400 sem nome', async () => {
    const token = await loginAdmin();
    const res = await request(app)
      .post('/v1/category')
      .set('Authorization', `Bearer ${token}`)
      .send({ slug: 'sem-nome' });
    expect(res.status).toBe(400);
  });

  test('PUT /v1/category/:id atualiza e DELETE remove', async () => {
    const token = await loginAdmin();
    const criado = await request(app)
      .post('/v1/category')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Temp', slug: `temp-${Date.now()}`, use_in_menu: false });

    const put = await request(app)
      .put(`/v1/category/${criado.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Temp Atualizada', slug: criado.body.slug, use_in_menu: true });

    expect(put.status).toBe(204);

    const consulta = await request(app).get(`/v1/category/${criado.body.id}`);
    expect(consulta.body.name).toBe('Temp Atualizada');
    expect(consulta.body.use_in_menu).toBe(true);

    const del = await request(app)
      .delete(`/v1/category/${criado.body.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(del.status).toBe(204);

    const depois = await request(app).get(`/v1/category/${criado.body.id}`);
    expect(depois.status).toBe(404);
  });

  test('PUT /v1/category/:id retorna 404 para categoria inexistente', async () => {
    const token = await loginAdmin();
    const res = await request(app)
      .put('/v1/category/999999')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Nada' });
    expect(res.status).toBe(404);
  });
});
