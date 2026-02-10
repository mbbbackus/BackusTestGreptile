// Validation middleware
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validateBody(schema) {
  return (req, res, next) => {
    for (const [key, validator] of Object.entries(schema)) {
      if (!validator(req.body[key])) {
        res.status(400).json({ error: `Invalid ${key}` });
        return;
      }
    }
    next();
  };
}

module.exports = { validateEmail, validateBody };
