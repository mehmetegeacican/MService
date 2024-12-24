const express = require('express');
const {
    getSales,
    createSale
} = require('../controller/sales.controller');


const router = express.Router();

router.get('/', getSales);

router.post('/', createSale);

module.exports = router;