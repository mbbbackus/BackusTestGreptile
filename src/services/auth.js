// Authentication service
const crypto = require('crypto');

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function validateToken(token) {
  return token && token.length > 10;
}

function generateSession() {
  return crypto.randomBytes(32).toString('hex');
}

module.exports = { hashPassword, validateToken, generateSession };
