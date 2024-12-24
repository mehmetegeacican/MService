const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'SalesService API',
            description: 'Sales Service API Documentation',
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
    apis: ['./routes/sales.routes.js'], 
};

module.exports = swaggerOptions