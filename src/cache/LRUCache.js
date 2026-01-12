const CacheManager = require('./CacheManager');

class LRUCache extends CacheManager {
  constructor(options = {}) {
    super(options);
    this.accessOrder = [];
  }

  get(key) {
    const value = super.get(key);
    if (value !== null) {
      this.updateAccessOrder(key);
    }
    return value;
  }

  set(key, value, ttl) {
    const existed = this.cache.has(key);
    const result = super.set(key, value, ttl);
    if (result) {
      if (existed) {
        this.updateAccessOrder(key);
      } else {
        this.accessOrder.push(key);
      }
    }
    return result;
  }

  delete(key) {
    const result = super.delete(key);
    if (result) {
      this.removeFromAccessOrder(key);
    }
    return result;
  }

  clear() {
    super.clear();
    this.accessOrder = [];
  }

  evictOne() {
    if (this.accessOrder.length === 0) {
      return false;
    }
    const lruKey = this.accessOrder.shift();
    this.cache.delete(lruKey);
    this.timestamps.delete(lruKey);
    this.ttls.delete(lruKey);
    if (this.trackStats) {
      this.stats.evictions++;
    }
    this.emit('evict', { key: lruKey, reason: 'lru' });
    return true;
  }

  updateAccessOrder(key) {
    this.removeFromAccessOrder(key);
    this.accessOrder.push(key);
  }

  removeFromAccessOrder(key) {
    const index = this.accessOrder.indexOf(key);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
    }
  }

  cleanup() {
    const now = Date.now();
    const expiredKeys = [];
    for (const [key, timestamp] of this.timestamps.entries()) {
      const ttl = this.ttls.get(key);
      if (now > timestamp + ttl) {
        expiredKeys.push(key);
      }
    }
    for (const key of expiredKeys) {
      this.cache.delete(key);
      this.timestamps.delete(key);
      this.ttls.delete(key);
      this.removeFromAccessOrder(key);
      if (this.trackStats) {
        this.stats.expirations++;
      }
      this.emit('expire', { key });
    }
    return expiredKeys.length;
  }

  getLRUKey() {
    return this.accessOrder.length > 0 ? this.accessOrder[0] : null;
  }

  getMRUKey() {
    return this.accessOrder.length > 0 ? this.accessOrder[this.accessOrder.length - 1] : null;
  }
}

module.exports = LRUCache;
