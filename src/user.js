// User management module
class User {
  constructor(id, name, email) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.createdAt = new Date();
    this.isActive = true;
    this.metadata = { source: 'system', version: '1.0' };
  }

  getFullInfo() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      createdAt: this.createdAt,
      isActive: this.isActive
    };
  }

  updateEmail(newEmail) {
    if (this.validateEmail(newEmail)) {
      this.email = newEmail;
      return true;
    }
    return false;
  }

  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  deactivate() {
    this.isActive = false;
  }

  activate() {
    this.isActive = true;
  }
}

class UserManager {
  constructor() {
    this.users = new Map();
  }

  createUser(name, email) {
    const id = Date.now().toString();
    const user = new User(id, name, email);
    this.users.set(id, user);
    return user;
  }

  getUser(id) {
    return this.users.get(id);
  }

  getAllUsers() {
    return Array.from(this.users.values());
  }

  deleteUser(id) {
    return this.users.delete(id);
  }

  findUserByEmail(email) {
    for (let user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }
}

module.exports = { User, UserManager };