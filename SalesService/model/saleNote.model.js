const mongoose = require('mongoose');
const saleNoteSchema = require('../schema/saleNote.schema');

const SaleNote = mongoose.model('SaleNote', saleNoteSchema);

module.exports = SaleNote;