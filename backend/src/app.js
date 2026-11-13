const path = require('path');
const express = require('express');
const cors = require('cors');
const qs = require('qs');
const swaggerUi = require('swagger-ui-express');
const routes = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');
const swaggerDocument = require('./docs/openapi.json');

const app = express();

// Sem isso, option[1]=39 vira um array e perdemos o ID da opção
app.set('query parser', (str) => qs.parse(str, { parseArrays: false }));

app.use(cors());

// 10mb para conseguir receber imagens em base64
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Imagens enviadas na API
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

// Imagens que já existem no front (pasta public do projeto)
app.use('/media', express.static(path.resolve(__dirname, '../../public')));

app.get('/', (req, res) => {
  res.json({
    projeto: 'Digital Store API',
    autor: 'João Victor Rocha Costa',
    docs: '/api-docs',
  });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  customSiteTitle: 'Digital Store API',
}));

app.get('/api-docs.json', (req, res) => {
  res.json(swaggerDocument);
});

app.use(routes);

// Rota não encontrada
app.use((req, res) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

app.use(errorHandler);

module.exports = app;
