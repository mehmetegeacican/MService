const mongoose = require('mongoose');
const saleHistorySchema = require('../schema/saleHistory.schema');

const SaleHistory = mongoose.model('SaleHistory', saleHistorySchema);

module.exports = SaleHistory;
