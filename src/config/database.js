// Database configuration
const config = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'app',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres'
};

function getConnectionString() {
  return \`postgres://\${config.user}:\${config.password}@\${config.host}:\${config.port}/\${config.database}\`;
}

module.exports = { config, getConnectionString };
