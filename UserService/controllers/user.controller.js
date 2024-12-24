const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * Sign up a new user
 * @param {*} req 
 * @param {*} res 
 */
const signUp = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // Step 1 -- Check if user already exists
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Step 2 -- Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Step 3 -- Create a new user
        const newUser = new User({
            username: username,
            email: email,
            password: hashedPassword
        });
        await newUser.save();
        // Step 4 -- Create a JSON WEB TOKEN for the user
        const token = jwt.sign({ userId: newUser._id, role: newUser.role }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        res.status(201).json({ message: 'User created successfully', user: newUser , token: token});
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

/**
 * Logs in a user
 * @param {*} req 
 * @param {*} res 
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(req.headers['x-gateway-secret']);
        // Step 1 -- Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Step 2 -- Check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // Step 3 -- Create a JSON WEB TOKEN for the user
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        // Step 4 -- Send the token as response
        res.status(200).json({ message: 'Login successful', user:user, token: token });

    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

/**
 * Fetches all users
 * @param {*} req 
 * @param {*} res 
 */
const viewUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

/**
 * Updates a user
 * @param {*} req 
 * @param {*} res 
 */
const updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { username, email, password } = req.body;
        
        // NEW PASSWORD HASHING
        let hashedPassword = password
        if(password){
            hashedPassword = await bcrypt.hash(password, 10);
        }
        // Role Change -- Only Admin can change role

        const updatedUser = await User.findByIdAndUpdate(userId, { 
            username:username, 
            email:email, 
            password:hashedPassword,
        }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

module.exports = {
    signUp,
    login,
    viewUsers,
    updateUser,
};