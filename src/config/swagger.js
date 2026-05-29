const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'GitHub Profile Analyzer API',
      version: '1.0.0',
      description: 'API to fetch and analyze GitHub profiles',
    },
    servers: [
      {
        url: 'https://github-profile-analyzer-pw6s.onrender.com',
        description: 'Production server',
      },
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Path to the API docs inside routes
};

const specs = swaggerJsdoc(options);

module.exports = specs;
