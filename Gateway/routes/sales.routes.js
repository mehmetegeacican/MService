// routes/saleRoutes.js
const express = require('express');
const { getSales,getSaleHistory,createSale , updateSale, addSaleNote,editSaleNote} = require('../services/sales.service');  // Import SaleService functions

const router = express.Router();

// Protected routes (requires token)
router.get('/api/v1/sales', getSales);
router.get('/api/v1/sales/:saleId/history', getSaleHistory);
router.post('/api/v1/sales', createSale);
router.post('/api/v1/sales/:saleId/note', addSaleNote);
router.put('/api/v1/sales/:saleId', updateSale);
router.put('/api/v1/sales/:saleId/note/:noteId', editSaleNote);


module.exports = router;
