const express = require('express');
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');

const router = express.Router();

// /search precisa vir antes de /:id
router.get('/search', productController.search);
router.get('/:id', productController.getById);
router.post('/', auth, productController.create);
router.put('/:id', auth, productController.update);
router.delete('/:id', auth, productController.remove);

module.exports = router;
