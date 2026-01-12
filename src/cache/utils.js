const CacheManager = require('./CacheManager');

function memoize(fn, options = {}) {
  const cache = new CacheManager(options);
  const keyGenerator = options.keyGenerator || ((args) => JSON.stringify(args));
  const memoized = function(...args) {
    const key = keyGenerator(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
  memoized.cache = cache;
  memoized.clear = () => cache.clear();
  memoized.delete = (key) => cache.delete(key);
  memoized.stats = () => cache.getStats();
  return memoized;
}

function memoizeAsync(fn, options = {}) {
  const cache = new CacheManager(options);
  const keyGenerator = options.keyGenerator || ((args) => JSON.stringify(args));
  const pendingPromises = new Map();
  const memoized = async function(...args) {
    const key = keyGenerator(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    if (pendingPromises.has(key)) {
      return pendingPromises.get(key);
    }
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

function createPersistentCache(persistKey, options = {}) {
  const cache = new CacheManager(options);
  try {
    const stored = options.storage ? options.storage.getItem(persistKey) : null;
    if (stored) {
      const data = JSON.parse(stored);
      cache.fromJSON(data);
    }
  } catch (error) {
    console.warn('Failed to load cache from storage:', error);
  }
  const savePeriod = options.savePeriod || 60000;
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
  if (saveTimer.unref) {
    saveTimer.unref();
  }
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

function createMultiLevelCache(caches) {
  if (!Array.isArray(caches) || caches.length === 0) {
    throw new Error('Must provide at least one cache');
  }
  return {
    get(key) {
      for (let i = 0; i < caches.length; i++) {
        const value = caches[i].get(key);
        if (value !== null) {
          for (let j = 0; j < i; j++) {
            caches[j].set(key, value);
          }
          return value;
        }
      }
      return null;
    },
    set(key, value, ttl) {
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

function batchOperations(cache, fn) {
  const originalCheckPeriod = cache.checkPeriod;
  cache.stopCleanupTimer();
  try {
    return fn();
  } finally {
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
