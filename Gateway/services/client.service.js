const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const { CLIENT_SERVICE_URL } = process.env;



/**
 * Routing of the Create Note
 * @param {*} req 
 * @param {*} res 
 */
const createNote = async (req, res) => {
    try {
        const response = await axios.post(`${CLIENT_SERVICE_URL}/api/v1/notes`, req.body, {
            headers: { Authorization: `Bearer ${req.headers['authorization'].split(' ')[1]}` }
        });
        res.json(response.data);  // Return the response from ClientService
    } catch (error) {
        res.status(500).send('Error creating note');
    }
};

module.exports = { createNote };