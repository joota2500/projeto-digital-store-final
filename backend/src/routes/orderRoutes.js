const express = require('express');
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');

const router = express.Router();

// Todas as rotas de pedido pedem login
router.post('/', auth, orderController.create);
router.get('/', auth, orderController.list);
// /:id/cancel precisa vir antes de /:id para o Express não confundir
router.put('/:id/cancel', auth, orderController.cancel);
router.get('/:id', auth, orderController.getById);

module.exports = router;
