const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'UserService API',
            description: 'User Service API Documentation',
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
    apis: ['./routes/user.routes.js'], 
};

module.exports = swaggerOptions