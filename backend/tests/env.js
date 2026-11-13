const path = require('path');

// Precisa rodar antes de qualquer import dos models
process.env.NODE_ENV = 'test';
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
