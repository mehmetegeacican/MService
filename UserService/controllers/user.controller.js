const User = require('../models/User');

/**
 * Sign up a new user
 * @param {*} req 
 * @param {*} res 
 */
const signUp = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        console.log("req.body",req.body)
        // Step 1 -- Check if user already exists
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        console.log("existingUser",existingUser);
        // Step 2 -- Create a new user
        const newUser = new User({ 
            username:username, 
            email:email, 
            password:password 
        });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully', user: newUser });
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

        // Step 1 -- Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Step 2 -- Check if password is correct
        if (user.password !== password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        res.status(200).json({ message: 'Login successful', user });

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

        const updatedUser = await User.findByIdAndUpdate(userId, { username, email, password }, { new: true });

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