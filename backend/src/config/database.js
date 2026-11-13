const path = require('path');

// Carrega as variáveis do arquivo .env na raiz do backend
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// Configuração compartilhada entre os ambientes
const base = {
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  dialect: 'mysql',
  logging: false,
  define: {
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
};

module.exports = {
  development: { ...base },
  // Banco separado só para os testes automatizados
  test: {
    ...base,
    database: process.env.DB_NAME_TEST || 'digital_store_test',
  },
  production: { ...base },
};
