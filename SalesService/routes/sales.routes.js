const express = require('express');
const {
    getSales,
    getSaleNotes,
    createSale,
    updateSale,
    getSaleHistory,
    addSaleNote,
    editSaleNote
    
} = require('../controller/sales.controller');


const router = express.Router();

/**
 * @swagger
 * /api/v1/sales:
 *   get:
 *     summary: Retrieve sales based on filters
 *     description: Fetch a list of sales filtered by clientId or userId and sorted by specified attributes.
 *     parameters:
 *       - in: query
 *         name: clientId
 *         required: false
 *         description: Filter sales by the client's ID.
 *         schema:
 *           type: string
 *       - in: query
 *         name: userId
 *         required: false
 *         description: Filter sales by the user's ID (salesperson).
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         required: false
 *         description: Attribute to sort sales by (default is updatedAt).
 *         schema:
 *           type: string
 *           enum: [createdAt, updatedAt]
 *           default: updatedAt
 *       - in: query
 *         name: order
 *         required: false
 *         description: Sort order (asc for ascending, desc for descending).
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       200:
 *         description: A list of filtered and sorted sales.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: ID of the sale.
 *                       clientId:
 *                         type: string
 *                         description: ID of the associated client.
 *                       userId:
 *                         type: string
 *                         description: ID of the associated user (salesperson).
 *                       currentStatus:
 *                         type: string
 *                         description: Current status of the sale.
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: The date and time when the sale was created.
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: The date and time when the sale was last updated.
 *       500:
 *         description: Internal server error.
 */
router.get('/', getSales);

/**
 * @swagger
 * /api/v1/sales/{saleId}/history:
 *   get:
 *     summary: Retrieve the sale history of a specific sale
 *     description: Fetch the historical status changes of a specific sale, sorted by the most recent first.
 *     parameters:
 *       - in: path
 *         name: saleId
 *         required: true
 *         description: The ID of the sale whose history is to be retrieved.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of historical status changes for the specified sale.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: ID of the sale history entry.
 *                       saleId:
 *                         type: string
 *                         description: ID of the associated sale.
 *                       statusChange:
 *                         type: string
 *                         description: The status change recorded in the history.
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: The date and time when the status change occurred.
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: The date and time when the history entry was last updated.
 *       404:
 *         description: Sale history not found.
 *       500:
 *         description: Internal server error.
 */
router.get('/:saleId/history', getSaleHistory);

router.get('/:saleId/notes',getSaleNotes);

/**
 * @swagger
 * /api/v1/sales:
 *   post:
 *     summary: Create a new sale
 *     description: Create a new sale associated with a specific client and user (salesman).
 *     parameters:
 *       - in: body
 *         name: sale
 *         description: Sale Information
 *         schema:
 *           type: object
 *           required:
 *             - clientId
 *             - userId
 *           properties:
 *             clientId:
 *               type: string
 *               example: "5f5b0c5f68f9b1a2d8d9e4d7"
 *             userId:
 *               type: string
 *               example: "5f5b0c5f68f9b1a2d8d9e4d8"
 *     responses:
 *       201:
 *         description: Sale created successfully, returns the sale
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               description: Indicates if the operation was successful
 *               example: true
 *             data:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: ID of the newly created sale
 *                   example: "5f5b0c5f68f9b1a2d8d9e4d9"
 *                 clientId:
 *                   type: string
 *                   description: ID of the associated client
 *                   example: "5f5b0c5f68f9b1a2d8d9e4d7"
 *                 userId:
 *                   type: string
 *                   description: ID of the associated user (salesman)
 *                   example: "5f5b0c5f68f9b1a2d8d9e4d8"
 *                 currentStatus:
 *                   type: string
 *                   enum: ["New", "Contacted", "Deal", "Closed"]
 *                   description: The initial status of the sale
 *                   example: "New"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: The date and time when the sale was created
 *                   example: "2024-12-24T12:00:00Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: The date and time when the sale was last updated
 *                   example: "2024-12-24T12:30:00Z"
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */

router.post('/', createSale);

/**
 * @swagger
 * /api/v1/sales/{saleId}/note:
 *   post:
 *     summary: Add a new note to a sale
 *     description: Adds a new note to an existing sale by sale ID.
 *     parameters:
 *       - in: path
 *         name: saleId
 *         required: true
 *         description: The ID of the sale to which the note will be added.
 *         schema:
 *           type: string
 *           example: "5f5b0c5f68f9b1a2d8d9e4d9"
 *       - in: body
 *         name: note
 *         description: The note content to be added to the sale.
 *         schema:
 *           type: object
 *           required:
 *             - note
 *           properties:
 *             note:
 *               type: string
 *               description: The content of the note to be added to the sale.
 *               example: "Discussed contract terms with the client."
 *     responses:
 *       201:
 *         description: Sale note added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: ID of the newly created sale note
 *                       example: "5f5b0c5f68f9b1a2d8d9e4da"
 *                     saleId:
 *                       type: string
 *                       description: ID of the associated sale
 *                       example: "5f5b0c5f68f9b1a2d8d9e4d9"
 *                     note:
 *                       type: string
 *                       description: Content of the note
 *                       example: "Discussed contract terms with the client."
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: The date and time when the note was created
 *                       example: "2024-12-24T12:45:00Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: The date and time when the note was last updated
 *                       example: "2024-12-24T12:45:00Z"
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: Sale not found
 *       500:
 *         description: Internal server error
 */
router.post('/:saleId/note', addSaleNote);

/**
 * @swagger
 * /api/v1/sales/{saleId}/note/{noteId}:
 *   put:
 *     summary: Edit an existing sale note
 *     description: Edits an existing note related to a sale.
 *     parameters:
 *       - in: path
 *         name: saleId
 *         required: true
 *         description: The ID of the sale to which the note is related.
 *         schema:
 *           type: string
 *           example: "60adf3d8f3fefb001ca3c378"
 *       - in: path
 *         name: noteId
 *         required: true
 *         description: The ID of the note to be updated.
 *         schema:
 *           type: string
 *           example: "60adf3d8f3fefb001ca3c379"
 *       - in: body
 *         name: note
 *         description: The updated content of the sale note.
 *         schema:
 *           type: object
 *           required:
 *             - note
 *           properties:
 *             note:
 *               type: string
 *               example: "Updated note content here."
 *     responses:
 *       200:
 *         description: Sale note updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: "Sale note updated successfully."
 *                 saleNote:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: ID of the updated sale note.
 *                       example: "60adf3d8f3fefb001ca3c379"
 *                     saleId:
 *                       type: string
 *                       description: ID of the associated sale.
 *                       example: "60adf3d8f3fefb001ca3c378"
 *                     note:
 *                       type: string
 *                       description: The content of the sale note.
 *                       example: "Updated note content here."
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: The date when the sale note was created.
 *                       example: "2024-12-24T12:45:00Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: The date when the sale note was last updated.
 *                       example: "2024-12-24T13:00:00Z"
 *       404:
 *         description: Sale note not found.
 *       500:
 *         description: Internal Server error.
 */
router.put('/:saleId/note/:noteId', editSaleNote);

/**
 * @swagger
 * /api/v1/sales/{saleId}:
 *   put:
 *     summary: Update an existing sale
 *     description: Updates details of an existing sale, including its status, user, and client.
 *     parameters:
 *       - in: path
 *         name: saleId
 *         required: true
 *         description: The ID of the sale to be updated.
 *         schema:
 *           type: string
 *           example: "60adf3d8f3fefb001ca3c378"
 *       - in: body
 *         name: sale
 *         description: The updated sale details.
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               enum: ["New", "In Contact", "Deal", "Closed", "Cancelled"]
 *               example: "Closed"
 *               description: The updated status of the sale.
 *             userId:
 *               type: string
 *               example: "60adf3d8f3fefb001ca3c379"
 *               description: The ID of the user handling the sale.
 *             clientId:
 *               type: string
 *               example: "60adf3d8f3fefb001ca3c37a"
 *               description: The ID of the client associated with the sale.
 *     responses:
 *       200:
 *         description: Sale updated successfully, returns the updated sale.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Sale updated successfully."
 *                 sale:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: ID of the updated sale.
 *                       example: "60adf3d8f3fefb001ca3c378"
 *                     clientId:
 *                       type: string
 *                       description: ID of the associated client.
 *                       example: "60adf3d8f3fefb001ca3c37a"
 *                     userId:
 *                       type: string
 *                       description: ID of the user handling the sale.
 *                       example: "60adf3d8f3fefb001ca3c379"
 *                     currentStatus:
 *                       type: string
 *                       description: The current status of the sale.
 *                       example: "Closed"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: The date when the sale was created.
 *                       example: "2024-12-24T12:45:00Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: The date when the sale was last updated.
 *                       example: "2024-12-24T13:00:00Z"
 *       404:
 *         description: Sale not found.
 *       400:
 *         description: Invalid status or missing required fields.
 *       500:
 *         description: Internal Server error.
 */
router.put('/:saleId', updateSale);



module.exports = router;