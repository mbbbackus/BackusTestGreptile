// Auth controller
const authService = require('../services/auth');

function handleLogin(req, res) {
  const { email, password } = req.body;
  const hash = authService.hashPassword(password);
  const session = authService.generateSession();
  res.json({ session, email });
}

function handleLogout(req, res) {
  res.json({ success: true });
}

function handleValidate(req, res) {
  const token = req.headers.authorization;
  const valid = authService.validateToken(token);
  res.json({ valid });
}

module.exports = { handleLogin, handleLogout, handleValidate };
