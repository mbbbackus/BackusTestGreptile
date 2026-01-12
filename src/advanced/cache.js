// Advanced Caching System
class CacheManager {
  constructor(options = {}) {
    this.maxSize = options.maxSize || 1000;
    this.ttl = options.ttl || 3600000;
    this.cache = new Map();
    this.timestamps = new Map();
  }

  set(key, value, ttl = this.ttl) {
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
      this.timestamps.delete(oldestKey);
    }
    this.cache.set(key, value);
    this.timestamps.set(key, Date.now() + ttl);
  }

  get(key) {
    if (!this.cache.has(key)) return null;
    const expiry = this.timestamps.get(key);
    if (Date.now() > expiry) {
      this.cache.delete(key);
      this.timestamps.delete(key);
      return null;
    }
    return this.cache.get(key);
  }

  has(key) {
    return this.get(key) !== null;
  }

  delete(key) {
    this.cache.delete(key);
    this.timestamps.delete(key);
  }

  clear() {
    this.cache.clear();
    this.timestamps.clear();
  }

  size() {
    this.cleanup();
    return this.cache.size;
  }

  cleanup() {
    const now = Date.now();
    for (const [key, expiry] of this.timestamps.entries()) {
      if (now > expiry) {
        this.cache.delete(key);
        this.timestamps.delete(key);
      }
    }
  }

  keys() {
    this.cleanup();
    return Array.from(this.cache.keys());
  }

  values() {
    this.cleanup();
    return Array.from(this.cache.values());
  }

  entries() {
    this.cleanup();
    return Array.from(this.cache.entries());
  }
}

class LRUCache extends CacheManager {
  constructor(options) {
    super(options);
    this.accessOrder = [];
  }

  get(key) {
    const value = super.get(key);
    if (value !== null) {
      const index = this.accessOrder.indexOf(key);
      if (index > -1) {
        this.accessOrder.splice(index, 1);
      }
      this.accessOrder.push(key);
    }
    return value;
  }

  set(key, value, ttl) {
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      const lruKey = this.accessOrder.shift();
      this.cache.delete(lruKey);
      this.timestamps.delete(lruKey);
    }
    super.set(key, value, ttl);
    this.accessOrder.push(key);
  }
}

function memoize(fn, options = {}) {
  const cache = new CacheManager(options);
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

module.exports = { CacheManager, LRUCache, memoize };
