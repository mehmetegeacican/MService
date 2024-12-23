const express = require('express');
const {
    createNewNote,
    updateExistingNote,
} = require('../controller/note.controller');

const router = express.Router();

/**
 * @swagger
 * /api/v1/notes:
 *   post:
 *     summary: Creates a new note for the given client
 *     description: Create a new note.
 *     parameters:
 *       - in: body
 *         name: note
 *         description: Note information
 *         schema:
 *           type: object
 *           required:
 *             - title
 *             - content
 *             - clientId
 *           properties:
 *             title:
 *               type: string
 *             content:
 *               type: string
 *             clientId:
 *               type: string
 *     responses:
 *       201:
 *         description: Note created successfully
 *       400:
 *         description: All fields are required
 *       500:
 *         description: Internal Server Error
 */
router.post('/', createNewNote);

/**
 * @swagger
 * /api/v1/notes/:noteId:
 *   put:
 *     summary: Updates notes for the given client
 *     description: Update an existing note.
 *     parameters:
 *       - in: body
 *         name: note
 *         description: Note information
 *         schema:
 *           type: object
 *           required:
 *             - title
 *             - content
 *           properties:
 *             title:
 *               type: string
 *               example: Title
 *             content:
 *               type: string
 *               example: Content
 *     responses:
 *       200:
 *         description: Note updated successfully, returns the updated note
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *             note:
 *               type: object
 *               properties:
 *                  _id:
 *                    type: string
 *                  clientId:
 *                    type: string
 *                  content:
 *                     type: string
 *                  title: 
 *                      type: string
 *                  createdAt:
 *                      type: string
 *                  updatedAt:
 *                      type: string
 * 
 *               description: Note object
 *       404:
 *         description: Note not found
 *       500:
 *         description: Internal Server error
 */
router.put('/:noteId', updateExistingNote);

module.exports = router;