/**
 * Cache module - Advanced caching system
 *
 * @module cache
 */

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
  // Classes
  CacheManager,
  LRUCache,

  // Utilities
  memoize,
  memoizeAsync,
  createPersistentCache,
  createMultiLevelCache,
  batchOperations,

  // Factory function
  createCache: (options) => new CacheManager(options),
  createLRUCache: (options) => new LRUCache(options)
};
