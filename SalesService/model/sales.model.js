const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema({
    clientId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    currentStatus: {
        type: String,
        enum: ['New', 'In Contact','Deal','Closed','Cancelled'],
        default: 'New',
    }
},{ timestamps: true });

const Sale = mongoose.model('Sale', salesSchema);

module.exports = Sale;
