// User controller
const userService = require('../services/user');

function handleCreate(req, res) {
  const { id, name, email } = req.body;
  const user = userService.createUser(id, name, email);
  res.json(user);
}

function handleGet(req, res) {
  const user = userService.getUser(req.params.id);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  res.json(user);
}

function handleUpdate(req, res) {
  const user = userService.updateUser(req.params.id, req.body);
  res.json(user);
}

module.exports = { handleCreate, handleGet, handleUpdate };
