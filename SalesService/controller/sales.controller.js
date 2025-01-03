const Sale = require('../model/sale.model');
const SaleNote = require('../model/saleNote.model');
const SaleHistory = require('../model/saleHistory.model');


/**
 * Retrieves Sales based on Filters
 * @param {*} req 
 * @param {*} res 
 */
const getSales = async (req, res) => {
    try {
        // Step 0 -- Filter Options
        const { clientId, userId, sortBy = 'updatedAt', order = 'desc' } = req.query;
        // Step 1 -- Add the Filtering
        const filters = {};
        if (clientId) {
            filters.clientId = clientId;
        }
        if (userId) {
            filters.userId = userId;
        }
        // Step 2 -- Add the Sorting
        const sort = {};
        sort[sortBy] = order === 'asc' ? 1 : -1;
        // Step 3 -- Fetch the sales
        const sales = await Sale.find(filters).sort(sort);
        // Return the list of sales
        return res.status(200).json({
            success: true,
            data: sales,
        });
    } catch (error) {
        console.error('Error fetching sales:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

/**
 * Retrieves the Sale History of a Specific Sale
 * @param {*} req 
 * @param {*} res 
 */
const getSaleHistory = async (req, res) => {
    try {
        const { saleId } = req.params;
        const saleHistory = await SaleHistory.find({ saleId }).sort({ createdAt: 'desc' });
        return res.status(200).json({
            success: true,
            data: saleHistory,
        });
    } catch (error) {
        console.error('Error fetching sale history:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

/**
 * Craete a new sale
 * @param {*} req 
 * @param {*} res 
 */
const createSale = async (req, res) => {
    try {
        // Step 0 -- Variables
        const { clientId, userId } = req.body;
        // Step 1 -- Make sure that the client and user exist
        if (!clientId || !userId) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        // Step 2 -- Create the sale
        const newSale = new Sale({
            clientId: clientId,
            userId: userId
        });
        const sale = await newSale.save();
        // Return the sale
        return res.status(201).json({
            success: true,
            data: sale,
        });
    } catch (error) {
        console.error('Error creating sale:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

/**
 * Updates Existing Sale
 * @param {*} req 
 * @param {*} res 
 */
const updateSale = async (req, res) => {
    try {
        // Step 0 -- Variables
        const { saleId } = req.params;
        const { status, userId, clientId } = req.body;
        // Step 1 -- Make sure that the sale exists
        const sale = await Sale.findById(saleId);
        if (!sale) {
            return res.status(404).json({ message: 'Sale not found' });
        }
        // Step 2 -- Update the sale
        const updateFields = {};
        if (status) {
            // Step 3 -- Validate status
            if (!['New', 'In Contact', 'Deal', 'Closed', 'Cancelled'].includes(status)) {
                return res.status(400).json({ message: 'Invalid status' });
            }

            // Step 4 -- Add the sale history
            const newSaleHistory = new SaleHistory({
                saleId: saleId,
                statusChange: sale.currentStatus + "-" + status,
            });
            await newSaleHistory.save();

            updateFields.currentStatus = status;
        }
        if (userId) {
            updateFields.userId = userId;
        }

        if (clientId) {
            updateFields.clientId = clientId;
        }

        // Step 5 -- Update the sale using findByIdAndUpdate
        const updatedSale = await Sale.findByIdAndUpdate(saleId, updateFields, { new: true });

        // Step 6 -- Return the updated sale
        return res.status(200).json({
            success: true,
            data: updatedSale,
        });

    } catch (error) {
        console.error('Error updating sale:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};


/**
 * Gets Sale Notes of a Specific Sale
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const getSaleNotes = async (req, res) => {
    try {
        const {saleId} = req.params;
        const {
            sortBy='updatedAt', sort='desc'
        } = req.query;
        // Step 1 -- Fetch sale notes from the database using the sale ID
        const saleNotes = await SaleNote.find({ saleId }).sort({ [sortBy]: sort === 'desc' ? -1 : 1 });
        // Step 2 -- Respond with the sale notes
        return res.status(200).json(saleNotes);
    } catch (e) {
        console.error('Error getting sale notes:', e);
        return res.status(500).json({ message: 'Internal Server Error' });
    }

}

/**
 * Adds a New Sale Note
 * @param {*} req 
 * @param {*} res 
 */
const addSaleNote = async (req, res) => {
    try {
        // Step 0 -- Variables
        const { saleId } = req.params;
        const { note } = req.body;
        // Step 1 -- Make sure that the sale exists
        const sale = await Sale.findById(saleId);
        if (!sale) {
            return res.status(404).json({ message: 'Sale not found' });
        }
        // Step 2 -- Add the sale note
        const newSaleNote = new SaleNote({
            saleId: saleId,
            note: note,
        });
        await newSaleNote.save();
        // Return the sale note
        return res.status(201).json({
            success: true,
            data: newSaleNote,
        });
    } catch (error) {
        console.error('Error adding sale note:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

/**
 * Edits an Existing Sale Note
 * @param {*} req 
 * @param {*} res 
 */
const editSaleNote = async (req, res) => {
    try {
        // Step 0 -- Variables
        const { noteId } = req.params;
        const { note } = req.body;

        // Step 1 -- Make sure that the sale note exists
        const saleNote = await SaleNote.findByIdAndUpdate(
            noteId,
            { note },
            { new: true }
        );

        // Step 2 -- Return 404 if sale not was not found
        if (!saleNote) {
            return res.status(404).json({ message: 'Sale note not found' });
        }

        // Return the updated sale note
        return res.status(200).json({
            success: true,
            data: saleNote,
        });

    } catch (error) {
        console.error('Error editing sale note:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};




module.exports = {
    getSales,
    getSaleNotes,
    createSale,
    updateSale,
    addSaleNote,
    editSaleNote,
    getSaleHistory
};