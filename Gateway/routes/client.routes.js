// routes/clientRoutes.js
const express = require('express');
const { createNote } = require('../services/client.service');  // Import ClientService functions

const router = express.Router();

// Protected routes (requires token)
router.post('/api/v1/notes', createNote);


module.exports = router;
