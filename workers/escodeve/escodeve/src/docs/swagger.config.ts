export const swaggerConfig = {
  openapi: '3.0.0',
  info: {
    title: 'Escodev API',
    version: '1.0.0',
    description: 'API Escodev pour la gestion scolaire'
  },
  servers: [
    { url: 'http://127.0.0.1:8790', description: 'Développement' }
  ],
  paths: {
    // Copiez les paths depuis manager/src/docs/swagger.config.ts
  }
};
