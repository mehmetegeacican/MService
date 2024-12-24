const mongoose = require('mongoose');
const noteSchema = require('../schema/note.schema');

// Create and export the model
const Note = mongoose.model('Note', noteSchema);

module.exports = Note;