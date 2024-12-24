const mongoose = require('mongoose');
const noteSchema = require('../schema/note.schema');

const clientSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        phone: {
            type: String,
            required: true,
            trim: true,
        },
        company: {
            type: String,
            required: true,
            trim: true,
        },
        /*
        notes: [
            {
                type : noteSchema
            },
        ], // Array of note references
        */
    },
    {
        timestamps: true, // Adds createdAt and updatedAt fields automatically
    }
);


module.exports = clientSchema;