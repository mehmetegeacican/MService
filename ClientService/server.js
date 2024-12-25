const express = require('express');
const dotenv = require('dotenv');
const { connectMongoDB, disconnectMongo } = require('./config/dbConnection');

const swaggerOptions = require('./config/swagger');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const clientRoutes = require('./routes/client.routes');
const noteRoutes = require('./routes/note.routes');
const { checkGatewayCode } = require('./middleware/gateway.middleware');
dotenv.config();


const app = express();
const port = process.env.PORT || 5003;


// Middleware
// Middleware
const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(express.json()); // To parse incoming JSON requests


// Functions
const startServer = async () => {
    try {
        const isConnected = await connectMongoDB(process.env.MONGO_URI);
        if(isConnected){
            app.use(checkGatewayCode);
            app.use('/api/v1/notes', noteRoutes);
            app.use('/api/v1/clients', clientRoutes);
            
            app.listen(port, () => {
                console.log(`Server is running on port ${port}`);
            });
        }
        else{
            console.log("Error connecting to MongoDB");
        }
    } catch (err) {
        console.log("Server could not start: ",err);
    }
};

// Graceful shutdown
process.on('SIGINT', async () => {
    await disconnectMongo();
    process.exit(0);
});

// Start the server
startServer();