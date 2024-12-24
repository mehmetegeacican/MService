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

const SaleNote = mongoose.model('SaleNote', saleNoteSchema);

module.exports = SaleNote;