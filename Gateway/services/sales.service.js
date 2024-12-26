// services/saleService.js
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const { SALE_SERVICE_URL, GATEWAY_SECRET_KEY } = process.env;


/**
 * Routing for getting sales api
 * @param {*} req 
 * @param {*} res 
 */
const getSales = async (req, res) => {
  try {
    const response = await axios.get(`${SALE_SERVICE_URL}/api/v1/sales`, {
      headers: {
        Authorization: `Bearer ${req.headers['authorization'].split(' ')[1]}`,
        'x-gateway-secret': GATEWAY_SECRET_KEY
      }
    });
    res.json(response.data);  // Return the response from SaleService

  } catch (error) {
    res.status(500).json({ message: 'Error getting sales' });
  }
}

/**
 * Routing for creating a sale api
 * @param {*} req 
 * @param {*} res 
 */
const createSale = async (req, res) => {
  try {
    const response = await axios.post(`${SALE_SERVICE_URL}/api/v1/sales`, req.body, {
      headers: {
        Authorization: `Bearer ${req.headers['authorization'].split(' ')[1]}`,
        'x-gateway-secret': GATEWAY_SECRET_KEY
      }
    });
    res.json(response.data);  // Return the response from SaleService
  } catch (error) {
    res.status(500).json({message:'Error creating sale'});
  }
};

/**
 * Routing for updating a sale api
 * @param {*} req 
 * @param {*} res 
 */
const updateSale = async (req, res) => {
  try {
    const response = await axios.put(`${SALE_SERVICE_URL}/api/v1/sales/${req.params.saleId}`, req.body, {
      headers: {
        Authorization: `Bearer ${req.headers['authorization'].split(' ')[1]}`,
        'x-gateway-secret': GATEWAY_SECRET_KEY
      }
    });
    res.json(response.data);  // Return the response from SaleService

  } catch (error) {
    res.status(500).json({ message: 'Error updating sale' });
  }
};

/**
 * Routing for adding a note to a sale api
 * @param {*} req 
 * @param {*} res 
 */
const addSaleNote = async (req, res) => {
  try {
    const response = await axios.post(`${SALE_SERVICE_URL}/api/v1/sales/${req.params.saleId}/note`, req.body, {
      headers: {
        Authorization: `Bearer ${req.headers['authorization'].split(' ')[1]}`,
        'x-gateway-secret': GATEWAY_SECRET_KEY
      }
    });
    res.json(response.data);  // Return the response from SaleService
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding note to sale' });
  }
};

/**
 * Routing for editing a note to a sale api
 * @param {*} req 
 * @param {*} res 
 */
const editSaleNote = async (req, res) => {
  try {
    const response = await axios.put(`${SALE_SERVICE_URL}/api/v1/sales/${req.params.saleId}/note/${req.params.noteId}`, req.body, {
      headers: {
        Authorization: `Bearer ${req.headers['authorization'].split(' ')[1]}`,
        'x-gateway-secret': GATEWAY_SECRET_KEY
      }
    });
    res.json(response.data);  // Return the response from SaleService
  } catch (error) {
    res.status(500).json({ message: 'Error editing note' });
  }
}

/**
 * Routing for API Sales History
 * @param {*} req 
 * @param {*} res 
 */
const getSaleHistory = async (req, res) => {
  try {
    const response = await axios.get(`${SALE_SERVICE_URL}/api/v1/sales/${req.params.saleId}/history`, {
      headers: {
        Authorization: `Bearer ${req.headers['authorization'].split(' ')[1]}`,
        'x-gateway-secret': GATEWAY_SECRET_KEY
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error getting sale history' });
  }
};


module.exports = { getSales, getSaleHistory, createSale, updateSale, addSaleNote, editSaleNote };
