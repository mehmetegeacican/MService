const express = require('express');
const {
    getSales,
    createSale,
    updateSale,
    getSaleHistory,
    addSaleNote,
    editSaleNote
    
} = require('../controller/sales.controller');


const router = express.Router();

router.get('/', getSales);

router.get('/:saleId/history', getSaleHistory);

router.post('/', createSale);

router.post('/:saleId/note', addSaleNote);

router.put('/:saleId/note/:noteId', editSaleNote);

router.put('/:saleId', updateSale);

module.exports = router;