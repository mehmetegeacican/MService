const mongoose = require('mongoose');
const salesSchema = require('../schema/sale.schema');

const Sale = mongoose.model('Sale', salesSchema);

module.exports = Sale;
