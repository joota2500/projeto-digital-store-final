const path = require('path');
const { execSync } = require('child_process');
const mysql = require('mysql2/promise');

const raiz = path.resolve(__dirname, '..');

// Cria o banco de teste (se ainda não existir), roda migrations e seeds
beforeAll(async () => {
  const conexao = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
  });

  await conexao.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME_TEST}\``);
  await conexao.end();

  const env = { ...process.env, NODE_ENV: 'test' };
  const opcoes = { cwd: raiz, env, stdio: 'pipe' };

  try {
    execSync('npx sequelize-cli db:migrate:undo:all', opcoes);
  } catch (err) {
    // Se ainda não existir tabela de migrations, seguimos em frente
  }

  execSync('npx sequelize-cli db:migrate', opcoes);
  execSync('npx sequelize-cli db:seed:all', opcoes);
});

afterAll(async () => {
  const { sequelize } = require('../src/models');
  await sequelize.close();
});
