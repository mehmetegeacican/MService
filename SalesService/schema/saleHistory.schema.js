const mongoose = require('mongoose');

const saleHistorySchema = new mongoose.Schema({
    saleId: {
        type: String,
        required: true
    },
    statusChange: {
        type: String,
        required: true
    },
},{ timestamps: true });

module.exports = saleHistorySchema;