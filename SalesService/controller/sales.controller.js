const Sale = require('../model/sale.model');
const SaleNote = require('../model/saleNote.model');
const SaleHistory = require('../model/saleHistory.model');


/**
 * Retrieves Sales based on Filters
 * @param {*} req 
 * @param {*} res 
 */
const getSales = async (req, res) => { 
    try{
        // Step 0 -- Filter Options
        const {clientId,userId,sortBy='updatedAt',order='desc'} = req.query;
        // Step 1 -- Add the Filtering
        const filters = {};
        if(clientId){
            filters.clientId = clientId;
        }
        if(userId){
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
 * Craete a new sale
 * @param {*} req 
 * @param {*} res 
 */
const createSale = async (req, res) => { 
    try{
        // Step 0 -- Variables
        const {clientId,userId} = req.body;
        // Step 1 -- Make sure that the client and user exist
        if(!clientId|| !userId){
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
    } catch(error) {
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
    try{
        // Step 0 -- Variables
        const {saleId} = req.params;
        const {status,userId,clientId} = req.body;
        // Step 1 -- Make sure that the sale exists
        const sale = await Sale.findById(saleId);
        if(!sale){
            return res.status(404).json({ message: 'Sale not found' });
        }
        // Step 2 -- Update the sale
        if(status){
            // Step 3 -- Add the sale history
            console.log(status);
            if(!['New', 'In Contact','Deal','Closed','Cancelled'].includes(status)){
                return res.status(400).json({ message: 'Invalid status' });
            }
            const newSaleHistory = new SaleHistory({
                saleId: saleId,
                statusChange: sale.currentStatus + "-" + status,
            });
            await newSaleHistory.save();
            sale.currentStatus = status;
        }
        if(userId){
            sale.userId = userId;
        }
        if(clientId){
            sale.clientId = clientId;
        }
        // Step 4 -- Save the sale
        await sale.save();
        // Return the sale
        return res.status(200).json({
            success: true,
            data: sale,
        });

    } catch(error) {
        console.error('Error updating sale:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

/**
 * Adds a New Sale Note
 * @param {*} req 
 * @param {*} res 
 */
const addSaleNote = async (req, res) => { 
    try{
        // Step 0 -- Variables
        const {saleId} = req.params;
        const {note} = req.body;
        // Step 1 -- Make sure that the sale exists
        const sale = await Sale.findById(saleId);
        if(!sale){
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
    } catch(error) {
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
    try{
        // Step 0 -- Variables
        const {noteId} = req.params;
        const {note} = req.body;
        // Step 1 -- Make sure that the sale note exists
        const saleNote = await SaleNote.findById(noteId);
        if(!saleNote){
            return res.status(404).json({ message: 'Sale note not found' });
        }
        // Step 2 -- Update the sale note
        saleNote.note = note;
        // Step 3 -- Save the sale note
        await saleNote.save();
        // Return the sale note
        return res.status(200).json({
            success: true,
            data: saleNote,
        });

    } catch(error) {
        console.error('Error editing sale note:', error);
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
    } catch(error) {
        console.error('Error fetching sale history:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};


module.exports = { 
    getSales,
    createSale,
    updateSale,
    addSaleNote,
    editSaleNote,
    getSaleHistory
};