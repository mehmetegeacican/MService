// services/saleService.js
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const { SALE_SERVICE_URL } = process.env;

// Example: Forward create sale request to SaleService
const createSale = async (req, res) => {
  try {
    const response = await axios.post(`${SALE_SERVICE_URL}/api/v1/sales`, req.body, {
      headers: { Authorization: `Bearer ${req.headers['authorization'].split(' ')[1]}` }
    });
    res.json(response.data);  // Return the response from SaleService
  } catch (error) {
    res.status(500).send('Error creating sale');
  }
};

module.exports = { createSale };
