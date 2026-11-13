const { app, request, loginAdmin } = require('./helpers');

describe('Usuários', () => {
  test('GET / responde com o nome do projeto', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body.projeto).toBe('Digital Store API');
  });

  test('GET /api-docs.json devolve um OpenAPI válido', async () => {
    const res = await request(app).get('/api-docs.json');
    expect(res.status).toBe(200);
    expect(res.body.openapi).toMatch(/^3\./);
    expect(res.body.paths['/v1/user']).toBeDefined();
    expect(res.body.paths['/v1/user/token']).toBeDefined();
    expect(res.body.paths['/v1/product/search']).toBeDefined();
  });

  test('POST /v1/user cadastra um usuário e não devolve a senha', async () => {
    const email = `teste.${Date.now()}@mail.com`;
    const res = await request(app).post('/v1/user').send({
      firstname: 'Maria',
      surname: 'Silva',
      email,
      password: '123@123',
      confirmPassword: '123@123',
    });

    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.email).toBe(email);
    expect(res.body.password).toBeUndefined();
  });

  test('POST /v1/user retorna 400 se as senhas não conferem', async () => {
    const res = await request(app).post('/v1/user').send({
      firstname: 'Maria',
      surname: 'Silva',
      email: 'outra@mail.com',
      password: '123@123',
      confirmPassword: 'diferente',
    });
    expect(res.status).toBe(400);
  });

  test('POST /v1/user retorna 400 se o e-mail já existe', async () => {
    const res = await request(app).post('/v1/user').send({
      firstname: 'Admin',
      surname: 'Store',
      email: 'admin@digitalstore.com',
      password: '123@123',
      confirmPassword: '123@123',
    });
    expect(res.status).toBe(400);
  });

  test('POST /v1/user/token gera um token para o admin', async () => {
    const res = await request(app).post('/v1/user/token').send({
      email: 'admin@digitalstore.com',
      password: '123@123',
    });
    expect(res.status).toBe(200);
    expect(typeof res.body.token).toBe('string');
    expect(res.body.token.length).toBeGreaterThan(10);
  });

  test('POST /v1/user/token retorna 400 com senha errada', async () => {
    const res = await request(app).post('/v1/user/token').send({
      email: 'admin@digitalstore.com',
      password: 'senha-errada',
    });
    expect(res.status).toBe(400);
  });

  test('GET /v1/user/:id retorna o usuário sem senha', async () => {
    const res = await request(app).get('/v1/user/1');
    expect(res.status).toBe(200);
    expect(res.body.email).toBe('admin@digitalstore.com');
    expect(res.body.password).toBeUndefined();
  });

  test('GET /v1/user/:id retorna 404 se não existir', async () => {
    const res = await request(app).get('/v1/user/999999');
    expect(res.status).toBe(404);
  });

  test('PUT /v1/user/:id retorna 401 sem token', async () => {
    const res = await request(app).put('/v1/user/1').send({ firstname: 'Novo' });
    expect(res.status).toBe(401);
  });

  test('PUT /v1/user/:id retorna 401 com token inválido', async () => {
    const res = await request(app)
      .put('/v1/user/1')
      .set('Authorization', 'Bearer token-invalido')
      .send({ firstname: 'Novo' });
    expect(res.status).toBe(401);
  });

  test('PUT /v1/user/:id atualiza o usuário', async () => {
    const token = await loginAdmin();
    const email = `atualizado.${Date.now()}@mail.com`;

    const criado = await request(app).post('/v1/user').send({
      firstname: 'Pedro',
      surname: 'Souza',
      email,
      password: '123@123',
      confirmPassword: '123@123',
    });

    const res = await request(app)
      .put(`/v1/user/${criado.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ firstname: 'Pedro Atualizado', surname: 'Souza', email });

    expect(res.status).toBe(204);

    const consulta = await request(app).get(`/v1/user/${criado.body.id}`);
    expect(consulta.body.firstname).toBe('Pedro Atualizado');
  });

  test('PUT /v1/user/:id retorna 404 para usuário inexistente', async () => {
    const token = await loginAdmin();
    const res = await request(app)
      .put('/v1/user/999999')
      .set('Authorization', `Bearer ${token}`)
      .send({ firstname: 'Ninguem' });
    expect(res.status).toBe(404);
  });

  test('DELETE /v1/user/:id remove o usuário', async () => {
    const token = await loginAdmin();
    const email = `apagar.${Date.now()}@mail.com`;

    const criado = await request(app).post('/v1/user').send({
      firstname: 'Apagar',
      surname: 'Depois',
      email,
      password: '123@123',
      confirmPassword: '123@123',
    });

    const res = await request(app)
      .delete(`/v1/user/${criado.body.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(204);

    const consulta = await request(app).get(`/v1/user/${criado.body.id}`);
    expect(consulta.status).toBe(404);
  });
});
