const express = require('express');
const {
    signUp,
    login,
    viewUsers,
    updateUser,
} = require('../controllers/user.controller');
const router = express.Router();

/**
 * @swagger
 * /api/v1/users/signup:
 *   post:
 *     summary: Sign up a new user
 *     description: Create a new user account.
 *     parameters:
 *       - in: body
 *         name: user
 *         description: User information
 *         schema:
 *           type: object
 *           required:
 *             - username
 *             - email
 *             - password
 *           properties:
 *             username:
 *               type: string
 *             email:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: User already exists
 */
router.post('/signup', signUp);

/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     summary: Login an existing user
 *     description: Allows an existing user to log in by providing their email and password.
 *     parameters:
 *       - in: body
 *         name: user
 *         description: User credentials for login
 *         schema:
 *           type: object
 *           required:
 *             - email
 *             - password
 *           properties:
 *             email:
 *               type: string
 *               example: user@example.com
 *             password:
 *               type: string
 *               example: password123
 *     responses:
 *       200:
 *         description: Login successful, returns a JWT token
 *         schema:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *               description: JWT token
 *       400:
 *         description: Invalid credentials or missing fields
 *       500:
 *         description: Server error
 */
router.post('/login', login);

// Middleware to protect routes that require authentication
/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: View all users
 *     description: Retrieve all users from the database.
 *     responses:
 *       200:
 *         description: A list of users
 *       500:
 *         description: Server error
 */
router.get('/', viewUsers);

/**
 * @swagger
 * /api/v1/users/{userId}:
 *   put:
 *     summary: Update user information
 *     description: Update a user's details by their userId.
 *     parameters:
 *       - in: path
 *         name: userId
 *         description: User ID
 *         required: true
 *         type: string
 *       - in: body
 *         name: user
 *         description: Updated user data
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *             email:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */
router.put('/:userId', updateUser);

module.exports = router;