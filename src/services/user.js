// User service
const users = new Map();

function createUser(id, name, email) {
  const user = { id, name, email, createdAt: new Date() };
  users.set(id, user);
  return user;
}

function getUser(id) {
  return users.get(id);
}

function updateUser(id, updates) {
  const user = users.get(id);
  if (!user) return null;
  Object.assign(user, updates);
  return user;
}

function deleteUser(id) {
  return users.delete(id);
}

module.exports = { createUser, getUser, updateUser, deleteUser };
