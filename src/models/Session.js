// Session model
class Session {
  constructor(userId, token) {
    this.userId = userId;
    this.token = token;
    this.createdAt = new Date();
    this.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  }

  isExpired() {
    return new Date() > this.expiresAt;
  }

  refresh() {
    this.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  }
}

module.exports = Session;
