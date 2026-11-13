const express = require('express');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

const router = express.Router();

// /token precisa vir antes de /:id para não ser confundido com um ID
router.post('/token', userController.login);
router.post('/', userController.create);
router.get('/:id', userController.getById);
router.put('/:id', auth, userController.update);
router.delete('/:id', auth, userController.remove);

module.exports = router;
