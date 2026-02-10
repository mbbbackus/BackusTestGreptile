// App configuration
const config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  logLevel: process.env.LOG_LEVEL || 'info',
  secretKey: process.env.SECRET_KEY || 'development-secret'
};

function isDevelopment() {
  return config.env === 'development';
}

function isProduction() {
  return config.env === 'production';
}

module.exports = { config, isDevelopment, isProduction };
