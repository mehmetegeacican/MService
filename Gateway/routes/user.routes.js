// routes/userRoutes.js
const express = require('express');
const { login, signup , getUsers, updateUser} = require('../services/user.service');  // Import UserService functions
const { verifyToken } = require('../middleware/auth.middleware');  // Token verification middleware

const router = express.Router();

// Public routes (login/signup)
router.post('/api/v1/users/login', login);
router.post('/api/v1/users/signup', signup);

router.get('/api/v1/users',verifyToken, getUsers);
router.put('/api/v1/users/:userId', verifyToken, updateUser);

module.exports = router;
