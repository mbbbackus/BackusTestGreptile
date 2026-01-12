const CacheManager = require('./CacheManager');
const LRUCache = require('./LRUCache');
const {
  memoize,
  memoizeAsync,
  createPersistentCache,
  createMultiLevelCache,
  batchOperations
} = require('./utils');

module.exports = {
  CacheManager,
  LRUCache,
  memoize,
  memoizeAsync,
  createPersistentCache,
  createMultiLevelCache,
  batchOperations,
  createCache: (options) => new CacheManager(options),
  createLRUCache: (options) => new LRUCache(options)
};
