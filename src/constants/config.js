// App configuration constants
const CONFIG = {
  APP_NAME: 'MyApp',
  VERSION: '1.0.0',
  API_BASE_URL: process.env.API_URL || 'http://localhost:3000',
  MAX_ITEMS_PER_PAGE: 20,
  SESSION_TIMEOUT: 30 * 60 * 1000
};

module.exports = CONFIG;
