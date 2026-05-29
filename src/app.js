require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');

const errorHandler = require('./middleware/errorHandler');
const githubRoutes = require('./routes/githubRoutes');
const apiLimiter = require('./middleware/rateLimiter');
const swaggerSpecs = require('./config/swagger');
const { sequelize } = require('./config/database');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev')); // Logging

// Apply rate limiting to all requests
app.use(apiLimiter);

// Swagger Documentation Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Routes
app.use('/api/github', githubRoutes);

// Enhanced Health check route
app.get('/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).json({ status: 'OK', database: 'connected' });
  } catch (error) {
    res.status(503).json({ status: 'ERROR', database: 'disconnected' });
  }
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;
