const express = require('express');
const {
    getClients,
    createClient,
    updateClient,
} = require('../controller/client.controller');
const router = express.Router();


router.get('/', getClients);

router.post('/', createClient);

router.put('/:clientId', updateClient);


module.exports = router;