const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
    clientId:{
        type:String,
        required:true
    }
},{ timestamps: true });

// Create and export the model
const Note = mongoose.model('Note', noteSchema);

module.exports = Note;