const express = require('express');
const {
    getSales,
    createSale,
    updateSale,
    getSaleHistory
} = require('../controller/sales.controller');


const router = express.Router();

router.get('/', getSales);

router.get('/:saleId/history', getSaleHistory);

router.post('/', createSale);

router.put('/:saleId', updateSale);

module.exports = router;