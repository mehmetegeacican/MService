const axios = require('axios');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const { USER_SERVICE_URL , GATEWAY_SECRET_KEY} = process.env;


/**
 * Forwarding Login request to UserService
 * @param {*} req 
 * @param {*} res 
 */
const login = async (req, res) => {
    try {
        const response = await axios.post(`${USER_SERVICE_URL}/api/v1/users/login`, req.body , {
            headers: {
                'x-gateway-secret': GATEWAY_SECRET_KEY,  // Secret key header
            },
        });
        res.json(response.data);  // Return the token
    } catch (error) {
        console.error(error);
        res.status(500).json({message : 'Error logging in'});
    }
};

/**
 * Forwarding Sign Up request to UserService
 * @param {*} req 
 * @param {*} res 
 */
const signup = async (req, res) => {
    try {
        const response = await axios.post(`${USER_SERVICE_URL}/api/v1/users/signup`, req.body,{
            headers: {
                'x-gateway-secret': GATEWAY_SECRET_KEY,  // Secret key header
            },
        });
        res.json(response.data);  // Return the token
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Error signing up'});
    }
};

/**
 * Gets All Users (Auth required)
 * @param {*} req 
 * @param {*} res 
 */
const getUsers = async (req, res) => {
    try {
        const response = await axios.get(`${USER_SERVICE_URL}/api/v1/users`, {
            headers: { 
                Authorization: `Bearer ${req.headers['authorization'].split(' ')[1]}`,
                'x-gateway-secret': GATEWAY_SECRET_KEY,
            }
        });
        res.json(response.data);  // Return the response from UserService
    } catch (error) {
        res.status(500).json({message:'Error getting users'});
    }
};

/**
 * Update User Reroute
 * @param {*} req 
 * @param {*} res 
 */
const updateUser = async (req,res) => {
    try {

        const response = await axios.put(`${USER_SERVICE_URL}/api/v1/users/${req.params.userId}`, req.body, {
            headers: { 
                Authorization: `Bearer ${req.headers['authorization'].split(' ')[1]}`,
                'x-gateway-secret': GATEWAY_SECRET_KEY,
            }
        });
        res.json(response.data);  // Return the response from UserService
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Error updating users'});
    }
};

module.exports = { login, signup , getUsers, updateUser};

