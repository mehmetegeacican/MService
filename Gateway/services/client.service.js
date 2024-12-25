const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const { CLIENT_SERVICE_URL , GATEWAY_SECRET_KEY} = process.env;

/**
 * Get Clients 
 * @param {*} req 
 * @param {*} res 
 */
const getClients = async (req, res) => { 
    try{
        const response = await axios.get(`${CLIENT_SERVICE_URL}/api/v1/clients`, {
            headers: { 
                Authorization: `Bearer ${req.headers['authorization'].split(' ')[1]}`,
                'x-gateway-secret': GATEWAY_SECRET_KEY 
            }
        });
        res.json(response.data);  // Return the response from ClientService

    } catch(error){
        res.status(500).json({message:'Error getting clients'});
    }
};

/**
 * Get Notes of the client
 * @param {*} req 
 * @param {*} res 
 */
const getNotesOfClient = async (req, res) => { 
    try{
        const response = await axios.get(`${CLIENT_SERVICE_URL}/api/v1/clients/${req.params.clientId}/notes`, {
            headers: { 
                Authorization: `Bearer ${req.headers['authorization'].split(' ')[1]}`,
                'x-gateway-secret': GATEWAY_SECRET_KEY 
            }
        });
        res.json(response.data);  // Return the response from ClientService
    } catch(error){
        console.error(error);
        res.status(500).json({message:'Error getting notes of client'});
    }
};

/**
 * Rerouting of the Create Client
 * @param {*} req 
 * @param {*} res 
 */
const createClient = async (req, res) => { 
    try{
        const response = await axios.post(`${CLIENT_SERVICE_URL}/api/v1/clients`, req.body, {
            headers: { 
                Authorization: `Bearer ${req.headers['authorization'].split(' ')[1]}`,
                'x-gateway-secret': GATEWAY_SECRET_KEY 
            }
        });
        res.json(response.data);  // Return the response from ClientService
    } catch(error){
        res.status(500).json({message:'Error creating client'});
    }
}
/**
 * Routing of the Update Client
 * @param {*} req 
 * @param {*} res 
 */
const updateClient = async (req, res) => { 
    try{
        const response = await axios.put(`${CLIENT_SERVICE_URL}/api/v1/clients/${req.params.clientId}`, req.body, {
            headers: { 
                Authorization: `Bearer ${req.headers['authorization'].split(' ')[1]}`,
                'x-gateway-secret': GATEWAY_SECRET_KEY 
            }
        });
        res.json(response.data);  // Return the response from ClientService
    } catch(error){
        res.status(500).json({message:'Error updating client'});
    }
}


/**
 * Routing of the Create Note
 * @param {*} req 
 * @param {*} res 
 */
const createNote = async (req, res) => {
    try {
        const response = await axios.post(`${CLIENT_SERVICE_URL}/api/v1/notes`, req.body, {
            headers: { 
                Authorization: `Bearer ${req.headers['authorization'].split(' ')[1]}`,
                'x-gateway-secret': GATEWAY_SECRET_KEY, 
            }
        });
        res.json(response.data);  // Return the response from ClientService
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Error creating note'});
    }
};

/**
 * Routing of the Update
 * @param {*} req 
 * @param {*} res 
 */
const updateNote = async (req,res) => {
    try {
        const response = await axios.put(`${CLIENT_SERVICE_URL}/api/v1/notes/${req.params.noteId}`, req.body, {
            headers: { 
                Authorization: `Bearer ${req.headers['authorization'].split(' ')[1]}`,
                'x-gateway-secret': GATEWAY_SECRET_KEY 
            }
        });
        res.json(response.data);  // Return the response from ClientService
    } catch (error) {
        res.status(500).send('Error updating note');
    }
}

module.exports = { createNote, updateNote , getClients, getNotesOfClient, createClient,updateClient};