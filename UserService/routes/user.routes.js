const express = require('express');
const {
    signUp,
    login,
    viewUsers,
    updateUser,
} = require('../controllers/user.controller');
const router = express.Router();


router.post('/signup', signUp);
router.post('/login', login);
// Middleware to protect routes that require authentication
router.get('/', viewUsers);
router.put('/:userId', updateUser);

module.exports = router;