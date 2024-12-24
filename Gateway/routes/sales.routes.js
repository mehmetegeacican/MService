// routes/saleRoutes.js
const express = require('express');
const { createSale } = require('../services/sales.service');  // Import SaleService functions

const router = express.Router();

// Protected routes (requires token)
router.post('/api/v1/sales', createSale);


module.exports = router;
