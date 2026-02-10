// Auth middleware
function requireAuth(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  next();
}

function optionalAuth(req, res, next) {
  const token = req.headers.authorization;
  if (token) {
    req.isAuthenticated = true;
  }
  next();
}

module.exports = { requireAuth, optionalAuth };
