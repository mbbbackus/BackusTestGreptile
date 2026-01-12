/**
 * CacheManager - Advanced caching system with TTL support
 *
 * Features:
 * - Time-to-live (TTL) expiration
 * - Maximum size limits with automatic eviction
 * - Statistics tracking (hits, misses, evictions)
 * - Multiple eviction strategies
 * - Serialization support
 * - Event emitters for cache operations
 */

class CacheManager {
  /**
   * Creates a new CacheManager instance
   * @param {Object} options - Configuration options
   * @param {number} options.maxSize - Maximum number of items in cache (default: 1000)
   * @param {number} options.ttl - Default time-to-live in milliseconds (default: 3600000)
   * @param {boolean} options.checkPeriod - Interval for automatic cleanup in ms (default: 60000)
   * @param {boolean} options.trackStats - Whether to track statistics (default: true)
   */
  constructor(options = {}) {
    this.maxSize = options.maxSize || 1000;
    this.ttl = options.ttl || 3600000; // 1 hour default
    this.checkPeriod = options.checkPeriod || 60000; // 1 minute
    this.trackStats = options.trackStats !== false;

    // Core storage
    this.cache = new Map();
    this.timestamps = new Map();
    this.ttls = new Map();

    // Statistics
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
      evictions: 0,
      expirations: 0
    };

    // Event handlers
    this.eventHandlers = {
      hit: [],
      miss: [],
      set: [],
      delete: [],
      evict: [],
      expire: []
    };

    // Start automatic cleanup if enabled
    if (this.checkPeriod > 0) {
      this.startCleanupTimer();
    }
  }

  /**
   * Sets a value in the cache
   * @param {string} key - Cache key
   * @param {*} value - Value to cache
   * @param {number} ttl - Optional TTL override in milliseconds
   * @returns {boolean} Whether the set was successful
   */
  set(key, value, ttl = this.ttl) {
    // Validate inputs
    if (key === null || key === undefined) {
      throw new Error('Cache key cannot be null or undefined');
    }

    // Check if we need to evict
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      this.evictOne();
    }

    // Store the value
    this.cache.set(key, value);
    this.timestamps.set(key, Date.now());
    this.ttls.set(key, ttl);

    // Update stats
    if (this.trackStats) {
      this.stats.sets++;
    }

    // Emit event
    this.emit('set', { key, value, ttl });

    return true;
  }

  /**
   * Gets a value from the cache
   * @param {string} key - Cache key
   * @returns {*} The cached value or null if not found/expired
   */
  get(key) {
    // Check if key exists
    if (!this.cache.has(key)) {
      if (this.trackStats) {
        this.stats.misses++;
      }
      this.emit('miss', { key });
      return null;
    }

    // Check if expired
    const timestamp = this.timestamps.get(key);
    const ttl = this.ttls.get(key);
    const now = Date.now();

    if (now > timestamp + ttl) {
      // Expired - remove it
      this.cache.delete(key);
      this.timestamps.delete(key);
      this.ttls.delete(key);

      if (this.trackStats) {
        this.stats.misses++;
        this.stats.expirations++;
      }

      this.emit('expire', { key });
      return null;
    }

    // Valid hit
    if (this.trackStats) {
      this.stats.hits++;
    }

    const value = this.cache.get(key);
    this.emit('hit', { key, value });

    return value;
  }

  /**
   * Checks if a key exists and is not expired
   * @param {string} key - Cache key
   * @returns {boolean} Whether the key exists
   */
  has(key) {
    return this.get(key) !== null;
  }

  /**
   * Deletes a key from the cache
   * @param {string} key - Cache key
   * @returns {boolean} Whether the key was deleted
   */
  delete(key) {
    const existed = this.cache.has(key);

    this.cache.delete(key);
    this.timestamps.delete(key);
    this.ttls.delete(key);

    if (existed && this.trackStats) {
      this.stats.deletes++;
    }

    if (existed) {
      this.emit('delete', { key });
    }

    return existed;
  }

  /**
   * Clears all items from the cache
   */
  clear() {
    const size = this.cache.size;

    this.cache.clear();
    this.timestamps.clear();
    this.ttls.clear();

    // Reset stats except totals
    if (this.trackStats) {
      this.stats.deletes += size;
    }
  }

  /**
   * Returns the current size of the cache
   * @returns {number} Number of items in cache
   */
  size() {
    this.cleanup();
    return this.cache.size;
  }

  /**
   * Removes expired items from the cache
   * @returns {number} Number of items removed
   */
  cleanup() {
    const now = Date.now();
    let removed = 0;

    for (const [key, timestamp] of this.timestamps.entries()) {
      const ttl = this.ttls.get(key);
      if (now > timestamp + ttl) {
        this.cache.delete(key);
        this.timestamps.delete(key);
        this.ttls.delete(key);
        removed++;

        if (this.trackStats) {
          this.stats.expirations++;
        }

        this.emit('expire', { key });
      }
    }

    return removed;
  }

  /**
   * Evicts one item from the cache (FIFO strategy)
   * Override this method to implement different eviction strategies
   * @returns {boolean} Whether an item was evicted
   */
  evictOne() {
    if (this.cache.size === 0) {
      return false;
    }

    // FIFO - remove oldest inserted
    const oldestKey = this.cache.keys().next().value;
    this.cache.delete(oldestKey);
    this.timestamps.delete(oldestKey);
    this.ttls.delete(oldestKey);

    if (this.trackStats) {
      this.stats.evictions++;
    }

    this.emit('evict', { key: oldestKey });

    return true;
  }

  /**
   * Gets all keys in the cache (excluding expired)
   * @returns {Array<string>} Array of cache keys
   */
  keys() {
    this.cleanup();
    return Array.from(this.cache.keys());
  }

  /**
   * Gets all values in the cache (excluding expired)
   * @returns {Array<*>} Array of cache values
   */
  values() {
    this.cleanup();
    return Array.from(this.cache.values());
  }

  /**
   * Gets all entries in the cache (excluding expired)
   * @returns {Array<[string, *]>} Array of [key, value] pairs
   */
  entries() {
    this.cleanup();
    return Array.from(this.cache.entries());
  }

  /**
   * Returns cache statistics
   * @returns {Object} Statistics object
   */
  getStats() {
    return {
      ...this.stats,
      size: this.cache.size,
      hitRate: this.stats.hits / (this.stats.hits + this.stats.misses) || 0
    };
  }

  /**
   * Resets cache statistics
   */
  resetStats() {
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
      evictions: 0,
      expirations: 0
    };
  }

  /**
   * Registers an event handler
   * @param {string} event - Event name (hit, miss, set, delete, evict, expire)
   * @param {Function} handler - Event handler function
   */
  on(event, handler) {
    if (this.eventHandlers[event]) {
      this.eventHandlers[event].push(handler);
    }
  }

  /**
   * Emits an event to all registered handlers
   * @param {string} event - Event name
   * @param {Object} data - Event data
   */
  emit(event, data) {
    if (this.eventHandlers[event]) {
      for (const handler of this.eventHandlers[event]) {
        try {
          handler(data);
        } catch (error) {
          console.error('Error in event handler:', error);
        }
      }
    }
  }

  /**
   * Starts the automatic cleanup timer
   */
  startCleanupTimer() {
    if (this.cleanupTimer) {
      return;
    }

    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.checkPeriod);

    // Don't prevent process exit
    if (this.cleanupTimer.unref) {
      this.cleanupTimer.unref();
    }
  }

  /**
   * Stops the automatic cleanup timer
   */
  stopCleanupTimer() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }

  /**
   * Exports cache to JSON
   * @returns {Object} Serialized cache data
   */
  toJSON() {
    this.cleanup();

    const data = {
      entries: [],
      stats: this.stats,
      config: {
        maxSize: this.maxSize,
        ttl: this.ttl,
        checkPeriod: this.checkPeriod
      }
    };

    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      const timestamp = this.timestamps.get(key);
      const ttl = this.ttls.get(key);
      const remainingTtl = timestamp + ttl - now;

      data.entries.push({
        key,
        value,
        remainingTtl
      });
    }

    return data;
  }

  /**
   * Imports cache from JSON
   * @param {Object} data - Serialized cache data
   */
  fromJSON(data) {
    this.clear();

    if (data.config) {
      this.maxSize = data.config.maxSize;
      this.ttl = data.config.ttl;
      this.checkPeriod = data.config.checkPeriod;
    }

    if (data.stats) {
      this.stats = { ...data.stats };
    }

    if (data.entries) {
      for (const entry of data.entries) {
        if (entry.remainingTtl > 0) {
          this.set(entry.key, entry.value, entry.remainingTtl);
        }
      }
    }
  }

  /**
   * Cleanup on destruction
   */
  destroy() {
    this.stopCleanupTimer();
    this.clear();
    this.eventHandlers = {};
  }
}

module.exports = CacheManager;
