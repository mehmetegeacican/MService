const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'ClientService API',
            description: 'Client Service API Documentation',
            version: '1',
            contact: {
                name: 'Mehmet Ege Acican',
            },
        },
        servers: [
            {
                url: 'http://localhost:5000', 
            },
        ],
    },
    apis: ['./routes/client.routes.js','./routes/note.routes.js'], 
};

module.exports = swaggerOptions