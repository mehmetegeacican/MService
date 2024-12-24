const mongoose = require('mongoose');
const clientSchema = require('../schema/client.schema');



// Create and export the model
const Client = mongoose.model('Client', clientSchema);

module.exports = Client;