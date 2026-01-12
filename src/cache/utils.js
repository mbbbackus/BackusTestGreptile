/**
 * Cache utility functions
 */

const CacheManager = require('./CacheManager');

/**
 * Memoization decorator using cache
 * @param {Function} fn - Function to memoize
 * @param {Object} options - Cache options
 * @returns {Function} Memoized function
 */
function memoize(fn, options = {}) {
  const cache = new CacheManager(options);
  const keyGenerator = options.keyGenerator || ((args) => JSON.stringify(args));

  const memoized = function(...args) {
    const key = keyGenerator(args);

    // Check cache first
    if (cache.has(key)) {
      return cache.get(key);
    }

    // Compute and cache result
    const result = fn.apply(this, args);
    cache.set(key, result);

    return result;
  };

  // Attach cache methods to memoized function
  memoized.cache = cache;
  memoized.clear = () => cache.clear();
  memoized.delete = (key) => cache.delete(key);
  memoized.stats = () => cache.getStats();

  return memoized;
}

/**
 * Async memoization decorator
 * @param {Function} fn - Async function to memoize
 * @param {Object} options - Cache options
 * @returns {Function} Memoized async function
 */
function memoizeAsync(fn, options = {}) {
  const cache = new CacheManager(options);
  const keyGenerator = options.keyGenerator || ((args) => JSON.stringify(args));
  const pendingPromises = new Map();

  const memoized = async function(...args) {
    const key = keyGenerator(args);

    // Check cache first
    if (cache.has(key)) {
      return cache.get(key);
    }

    // Check if already pending
    if (pendingPromises.has(key)) {
      return pendingPromises.get(key);
    }

    // Compute result
    const promise = fn.apply(this, args)
      .then(result => {
        cache.set(key, result);
        pendingPromises.delete(key);
        return result;
      })
      .catch(error => {
        pendingPromises.delete(key);
        throw error;
      });

    pendingPromises.set(key, promise);
    return promise;
  };

  memoized.cache = cache;
  memoized.clear = () => {
    cache.clear();
    pendingPromises.clear();
  };
  memoized.delete = (key) => cache.delete(key);
  memoized.stats = () => cache.getStats();

  return memoized;
}

/**
 * Creates a cache with automatic persistence
 * @param {string} persistKey - Key for localStorage/file storage
 * @param {Object} options - Cache options
 * @returns {CacheManager} Cache instance with persistence
 */
function createPersistentCache(persistKey, options = {}) {
  const cache = new CacheManager(options);

  // Try to load from storage
  try {
    const stored = options.storage ? options.storage.getItem(persistKey) : null;
    if (stored) {
      const data = JSON.parse(stored);
      cache.fromJSON(data);
    }
  } catch (error) {
    console.warn('Failed to load cache from storage:', error);
  }

  // Save periodically
  const savePeriod = options.savePeriod || 60000; // 1 minute
  const saveTimer = setInterval(() => {
    try {
      const data = cache.toJSON();
      const serialized = JSON.stringify(data);
      if (options.storage) {
        options.storage.setItem(persistKey, serialized);
      }
    } catch (error) {
      console.warn('Failed to save cache to storage:', error);
    }
  }, savePeriod);

  // Don't prevent exit
  if (saveTimer.unref) {
    saveTimer.unref();
  }

  // Override destroy to save one last time
  const originalDestroy = cache.destroy.bind(cache);
  cache.destroy = function() {
    clearInterval(saveTimer);

    try {
      const data = cache.toJSON();
      const serialized = JSON.stringify(data);
      if (options.storage) {
        options.storage.setItem(persistKey, serialized);
      }
    } catch (error) {
      console.warn('Failed to save cache on destroy:', error);
    }

    originalDestroy();
  };

  return cache;
}

/**
 * Creates a multi-level cache
 * @param {Array<CacheManager>} caches - Array of caches in order (fastest first)
 * @returns {Object} Multi-level cache interface
 */
function createMultiLevelCache(caches) {
  if (!Array.isArray(caches) || caches.length === 0) {
    throw new Error('Must provide at least one cache');
  }

  return {
    get(key) {
      for (let i = 0; i < caches.length; i++) {
        const value = caches[i].get(key);

        if (value !== null) {
          // Populate higher level caches
          for (let j = 0; j < i; j++) {
            caches[j].set(key, value);
          }

          return value;
        }
      }

      return null;
    },

    set(key, value, ttl) {
      // Set in all levels
      for (const cache of caches) {
        cache.set(key, value, ttl);
      }
    },

    has(key) {
      return this.get(key) !== null;
    },

    delete(key) {
      let deleted = false;
      for (const cache of caches) {
        if (cache.delete(key)) {
          deleted = true;
        }
      }
      return deleted;
    },

    clear() {
      for (const cache of caches) {
        cache.clear();
      }
    },

    getStats() {
      return caches.map(cache => cache.getStats());
    }
  };
}

/**
 * Batches multiple cache operations
 * @param {CacheManager} cache - Cache instance
 * @param {Function} fn - Function that performs cache operations
 * @returns {*} Result of the function
 */
function batchOperations(cache, fn) {
  // Temporarily disable cleanup
  const originalCheckPeriod = cache.checkPeriod;
  cache.stopCleanupTimer();

  try {
    return fn();
  } finally {
    // Re-enable cleanup
    cache.checkPeriod = originalCheckPeriod;
    cache.startCleanupTimer();
    cache.cleanup();
  }
}

module.exports = {
  memoize,
  memoizeAsync,
  createPersistentCache,
  createMultiLevelCache,
  batchOperations
};
