// Another main branch file
const config = {
  environment: 'production',
  database: {
    host: 'localhost',
    port: 5432,
    name: 'app_db'
  },
  features: {
    enableCaching: true,
    enableLogging: true,
    maxRetries: 3
  }
};

module.exports = config;