// routes/clientRoutes.js
const express = require('express');
const { createNote, updateNote ,getClients ,getNotesOfClient, createClient,updateClient} = require('../services/client.service');  // Import ClientService functions

const router = express.Router();



// Protected routes (requires token)
router.get('/api/v1/clients', getClients);
router.get('/api/v1/clients/:clientId/notes', getNotesOfClient);
router.post('/api/v1/notes', createNote);
router.post('/api/v1/clients', createClient);
router.put('/api/v1/clients/:clientId', updateClient);
router.put('/api/v1/notes/:noteId', updateNote);


module.exports = router;
