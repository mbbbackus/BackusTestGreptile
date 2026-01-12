/**
 * LRUCache - Least Recently Used cache implementation
 *
 * Extends CacheManager with LRU eviction strategy
 */

const CacheManager = require('./CacheManager');

class LRUCache extends CacheManager {
  /**
   * Creates a new LRUCache instance
   * @param {Object} options - Configuration options (same as CacheManager)
   */
  constructor(options = {}) {
    super(options);

    // Track access order for LRU
    this.accessOrder = [];
  }

  /**
   * Gets a value and updates access order
   * @param {string} key - Cache key
   * @returns {*} The cached value or null
   */
  get(key) {
    const value = super.get(key);

    if (value !== null) {
      // Move to end (most recently used)
      this.updateAccessOrder(key);
    }

    return value;
  }

  /**
   * Sets a value and updates access order
   * @param {string} key - Cache key
   * @param {*} value - Value to cache
   * @param {number} ttl - Optional TTL override
   * @returns {boolean} Whether the set was successful
   */
  set(key, value, ttl) {
    const existed = this.cache.has(key);

    // Let parent handle the actual set
    const result = super.set(key, value, ttl);

    if (result) {
      if (existed) {
        // Update existing key position
        this.updateAccessOrder(key);
      } else {
        // New key - add to end
        this.accessOrder.push(key);
      }
    }

    return result;
  }

  /**
   * Deletes a key and removes from access order
   * @param {string} key - Cache key
   * @returns {boolean} Whether the key was deleted
   */
  delete(key) {
    const result = super.delete(key);

    if (result) {
      this.removeFromAccessOrder(key);
    }

    return result;
  }

  /**
   * Clears cache and access order
   */
  clear() {
    super.clear();
    this.accessOrder = [];
  }

  /**
   * Evicts the least recently used item
   * @returns {boolean} Whether an item was evicted
   */
  evictOne() {
    if (this.accessOrder.length === 0) {
      return false;
    }

    // Remove least recently used (first in array)
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

  /**
   * Updates access order for a key (moves to end)
   * @param {string} key - Cache key
   */
  updateAccessOrder(key) {
    this.removeFromAccessOrder(key);
    this.accessOrder.push(key);
  }

  /**
   * Removes a key from access order
   * @param {string} key - Cache key
   */
  removeFromAccessOrder(key) {
    const index = this.accessOrder.indexOf(key);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
    }
  }

  /**
   * Cleanup expired items and update access order
   * @returns {number} Number of items removed
   */
  cleanup() {
    const now = Date.now();
    const expiredKeys = [];

    for (const [key, timestamp] of this.timestamps.entries()) {
      const ttl = this.ttls.get(key);
      if (now > timestamp + ttl) {
        expiredKeys.push(key);
      }
    }

    // Remove expired keys
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

  /**
   * Gets the least recently used key
   * @returns {string|null} The LRU key or null if empty
   */
  getLRUKey() {
    return this.accessOrder.length > 0 ? this.accessOrder[0] : null;
  }

  /**
   * Gets the most recently used key
   * @returns {string|null} The MRU key or null if empty
   */
  getMRUKey() {
    return this.accessOrder.length > 0 ? this.accessOrder[this.accessOrder.length - 1] : null;
  }
}

module.exports = LRUCache;
