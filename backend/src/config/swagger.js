const path = require('path');
const swaggerAutogen = require('swagger-autogen')({
  openapi: '3.0.0',
  writeOutputFile: false,
  disableLogs: true,
});
const swaggerUi = require('swagger-ui-express');

const swaggerDocument = {
  info: {
    title: 'Fashion Hub API',
    description: 'API documentation for the Fashion Hub backend.',
    version: '1.0.0',
  },
  servers: [{ url: '/api' }],
};

const endpointsFile = './routes/index.js';
const outputFile = path.join(__dirname, '../../swagger-output.json');

const configureSwagger = async (app) => {
  const result = await swaggerAutogen(outputFile, [endpointsFile], swaggerDocument);

  if (!result.success) {
    throw new Error('Failed to generate Swagger API documentation.');
  }

  app.get('/api-docs.json', (_req, res) => res.json(result.data));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(result.data));
};

module.exports = configureSwagger;