const mongoose = require('mongoose');

const saleNoteSchema = new mongoose.Schema({
    saleId: {
        type: String,
        required: true
    },
    note: {
        type: String,
        required: true
    },
},{ timestamps: true });


module.exports = saleNoteSchema;