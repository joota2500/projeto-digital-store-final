const express = require('express');
const userRoutes = require('./userRoutes');
const categoryRoutes = require('./categoryRoutes');
const productRoutes = require('./productRoutes');
const orderRoutes = require('./orderRoutes');

const router = express.Router();

router.use('/v1/user', userRoutes);
router.use('/v1/category', categoryRoutes);
router.use('/v1/product', productRoutes);
router.use('/v1/order', orderRoutes);

module.exports = router;
