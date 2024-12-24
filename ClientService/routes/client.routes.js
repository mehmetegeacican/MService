const express = require('express');
const {
    getClients,
    createClient,
    updateClient,
    getNotesOfClient
} = require('../controller/client.controller');
const router = express.Router();

/**
 * @swagger
 * /api/v1/clients:
 *   get:
 *     summary: View all clients with filtering options 
 *     description: Retrieve all clients from the database with filtering options.
 *     responses:
 *       200:
 *         description: A list of users
 *       500:
 *         description: Server error
 */
router.get('/', getClients);

/**
 * @swagger
 * /api/v1/clients/{clientId}/notes:
 *   get:
 *     summary: Get all notes for a specific client
 *     description: Retrieve all notes associated with a specific client by providing the client's ID.
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         description: ID of the client whose notes you want to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of notes associated with the client.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: ID of the note.
 *                       title:
 *                         type: string
 *                         description: Title of the note.
 *                       content:
 *                         type: string
 *                         description: Content of the note.
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: The date and time when the note was created.
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: The date and time when the note was last updated.
 *       404:
 *         description: Client not found.
 *       500:
 *         description: Internal server error.
 */
router.get('/:clientId/notes', getNotesOfClient);

/**
 * @swagger
 * /api/v1/clients:
 *   post:
 *     summary: Create a new client
 *     description: Create a new client in the database
 *     parameters:
 *       - in: body
 *         name: client
 *         description: Client Information
 *         schema:
 *           type: object
 *           required:
 *             - name
 *             - email
 *             - phone
 *             - company
 *           properties:
 *             name:
 *               type: string
 *               example: John Doe
 *             email:
 *               type: string
 *               example: johndoe@email.com
 *             phone:
 *               type: string
 *               example: 1234567890
 *             company:
 *               type: string
 *               example: ABC Company
 *     responses:
 *       201:
 *         description: Client created successfully, returns the client
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Client created successfully
 *             client:
 *               type: object
 *               properties:
 *                  name:
 *                      type: string
 *                      description: Name of the client
 *                  email:
 *                      type: string
 *                      description: Email of the client
 *                  phone:
 *                      type: string
 *                      description: Phone number of the client
 *                  company:
 *                      type: string
 *                      description: Company of the client
 *       400:
 *         description: All fields are required
 *       500:
 *         description: Internal Server error
 */
router.post('/', createClient);


/**
 * @swagger
 * /api/v1/clients/:clientId:
 *   put:
 *     summary: Updates clients
 *     description: Update an existing client.
 *     parameters:
 *       - in: body
 *         name: client
 *         description: Client information
 *         schema:
 *           type: object
 *           required:
 *             - name
 *             - email
 *             - phone
 *             - company
 *           properties:
 *             name:
 *               type: string
 *               example: Name
 *             email:
 *               type: string
 *               example: name@email.com
 *             phone:
 *               type: string
 *               example: 1234567890
 *             company:
 *               type: string
 *               example: Company
 *     responses:
 *       200:
 *         description: Client updated successfully, returns the updated client
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *             client:
 *               type: object
 *               properties:
 *                  _id:
 *                    type: string
 *                  name:
 *                    type: string
 *                  email:
 *                     type: string
 *                  phone: 
 *                      type: string
 *                  company:
 *                      type: string
 *                  createdAt:
 *                      type: string
 *                  updatedAt:
 *                      type: string
 * 
 *               description: Client object
 *       404:
 *         description: Client not found
 *       500:
 *         description: Internal Server error
 */
router.put('/:clientId', updateClient);



module.exports = router;