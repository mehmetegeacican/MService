const express = require('express');
const dotenv = require('dotenv');
const {verifyToken} = require('./middleware/auth.middleware');  // Token verification middleware
const userRoutes = require('./routes/user.routes');  // User-related routes
const clientRoutes = require('./routes/client.routes');  // Client-related routes
const saleRoutes = require('./routes/sales.routes');  // Sale-related routes

dotenv.config();

const app = express();
app.use(express.json());

// Public routes (login/signup)
app.use(userRoutes)

// Protected routes (requires token)
app.use(verifyToken);  // Apply token verification middleware

// Example protected routes
app.use(clientRoutes);
app.use(saleRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});