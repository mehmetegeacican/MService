const Client = require('../model/client.model');


/**
 * Gets Clients with filtering and sortby options
 * @param {*} req 
 * @param {*} res 
 */
const getClients = async (req, res) => {
    try {
        // Step 0 -- Filter and sort options from query
        const { name, email, company, sortBy = 'updatedAt', order = 'desc' } = req.query;
        // Step 1 -- Add the Filtering
        const filters = {};
        if (name) {
            filters.name = { $regex: name, $options: 'i' }; // Case-insensitive search
        }
        if (email) {
            filters.email = { $regex: email, $options: 'i' };
        }
        if (company) {
            filters.company = { $regex: company, $options: 'i' };
        }
        // Step 2 -- Add the Sorting
        const sort = {};
        sort[sortBy] = order === 'asc' ? 1 : -1;
        // Step 3 -- Fetch the clients
        const clients = await Client.find(filters).sort(sort);
        // Return the list of clients
        return res.status(200).json({
            success: true,
            data: clients,
        });
    } catch (error) {
        console.error('Error fetching clients:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

/**
 * Creates a Client
 * @param {*} req 
 * @param {*} res 
 */
const createClient = async (req, res) => {
    try {
        const { name, email, phone, company } = req.body;

        // Check if all required fields are present
        if (!name || !email || !phone || !company) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create the new client
        const newClient = new Client({
            name,
            email,
            phone,
            company,
        });

        await newClient.save();
        return res.status(201).json({ message: 'Client created successfully', client: newClient });
    } catch (error) {
        console.error('Error creating client:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

/**
 * Updates Existing Client
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const updateClient = async (req, res) => {
    try {
        // Step 0 -- Variables
        const { clientId } = req.params;
        const { name, email, phone, company } = req.body;

        // Step 1 -- Find the Client By ID
        const client = await Client.findById(clientId);

        // Check if the client exists
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        // Step 2 -- Update the Client
        if (name) {
            client.name = name;
        }
        if (email) {
            client.email = email;
        }
        if (phone) {
            client.phone = phone;
        }
        if (company) {
            client.company = company;
        }
        // Step 3 -- Save the updated client

        await client.save();
        return res.status(200).json({ message: 'Client updated successfully', client });

    } catch (error) {
        console.error('Error updating client:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}


module.exports = {
    getClients,
    createClient,
    updateClient
}