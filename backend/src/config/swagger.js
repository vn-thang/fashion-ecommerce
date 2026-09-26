const path = require('path');
const swaggerAutogen = require('swagger-autogen')({
  openapi: '3.0.0',
  writeOutputFile: false,
  disableLogs: true,
});
const swaggerUi = require('swagger-ui-express');

const featureTags = [
  { prefix: '/auth', name: 'Authentication' },
  { prefix: '/categories', name: 'Category' },
  { prefix: '/brands', name: 'Brand' },
  { prefix: '/products', name: 'Product' },
  { prefix: '/cart', name: 'Cart' },
  { prefix: '/users', name: 'User' },
  { prefix: '/coupons', name: 'Coupon' },
  { prefix: '/order', name: 'Order' },
  { prefix: '/orders', name: 'Order' },
  { prefix: '/review', name: 'Review' },
  { prefix: '/storeSetting', name: 'Store Settings' },
  { prefix: '/banners', name: 'Banner' },
  { prefix: '/flashSales', name: 'Flash Sale' },
  { prefix: '/payments', name: 'Payment' },
  { prefix: '/inventory', name: 'Inventory' },
  { prefix: '/dashboard', name: 'Dashboard' },
  { prefix: '/auditLog', name: 'Audit Log' },
  { prefix: '/notifications', name: 'Notification' },
  { prefix: '/conversations', name: 'Chat' },
  { prefix: '/returns', name: 'Return' },
];

const swaggerDocument = {
  info: {
    title: 'Fashion Hub API',
    description: 'API documentation for the Fashion Hub backend.',
    version: '1.0.0',
  },
  servers: [{ url: '/api' }],
  tags: [...new Set(featureTags.map(({ name }) => name))].map((name) => ({ name })),
};

const endpointsFile = './routes/index.js';
const outputFile = path.join(__dirname, '../../swagger-output.json');

const configureSwagger = async (app) => {
  const result = await swaggerAutogen(outputFile, [endpointsFile], swaggerDocument);

  if (!result.success) {
    throw new Error('Failed to generate Swagger API documentation.');
  }

  for (const [routePath, operations] of Object.entries(result.data.paths)) {
    const featurePath = routePath.replace(/^\/admin(?=\/)/, '');
    const feature = featureTags.find(({ prefix }) =>
      featurePath === prefix || featurePath.startsWith(`${prefix}/`)
    );
    const tag = feature?.name || 'Other';

    for (const operation of Object.values(operations)) {
      if (operation && typeof operation === 'object') {
        operation.tags = [tag];
      }
    }
  }

  app.get('/api-docs.json', (_req, res) => res.json(result.data));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(result.data));
};

module.exports = configureSwagger;