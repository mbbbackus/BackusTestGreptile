/**
 * Cache module usage examples
 *
 * This file demonstrates various use cases for the caching system
 */

const {
  CacheManager,
  LRUCache,
  memoize,
  memoizeAsync,
  createMultiLevelCache
} = require('./index');

// Example 1: Basic cache usage
function basicCacheExample() {
  console.log('\n=== Basic Cache Example ===');

  const cache = new CacheManager({
    maxSize: 100,
    ttl: 5000, // 5 seconds
    trackStats: true
  });

  // Set values
  cache.set('user:1', { id: 1, name: 'Alice' });
  cache.set('user:2', { id: 2, name: 'Bob' });

  // Get values
  console.log('User 1:', cache.get('user:1'));
  console.log('User 2:', cache.get('user:2'));

  // Check stats
  console.log('Stats:', cache.getStats());

  // Clean up
  cache.destroy();
}

// Example 2: LRU Cache
function lruCacheExample() {
  console.log('\n=== LRU Cache Example ===');

  const cache = new LRUCache({
    maxSize: 3, // Very small for demonstration
    ttl: 60000
  });

  // Fill the cache
  cache.set('a', 'Value A');
  cache.set('b', 'Value B');
  cache.set('c', 'Value C');

  console.log('Cache size:', cache.size());
  console.log('LRU key:', cache.getLRUKey()); // 'a'
  console.log('MRU key:', cache.getMRUKey()); // 'c'

  // Access 'a', making it most recently used
  cache.get('a');
  console.log('After accessing "a":');
  console.log('LRU key:', cache.getLRUKey()); // Now 'b'
  console.log('MRU key:', cache.getMRUKey()); // Now 'a'

  // Adding a new item will evict 'b'
  cache.set('d', 'Value D');
  console.log('After adding "d":');
  console.log('Has "b":', cache.has('b')); // false
  console.log('Cache keys:', cache.keys());

  cache.destroy();
}

// Example 3: Memoization for expensive computations
function memoizationExample() {
  console.log('\n=== Memoization Example ===');

  // Expensive Fibonacci calculation
  function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
  }

  // Memoized version
  const memoizedFib = memoize(fibonacci, {
    maxSize: 100,
    ttl: 60000
  });

  // First call - slow
  console.time('First call');
  console.log('Fib(35):', memoizedFib(35));
  console.timeEnd('First call');

  // Second call - instant (from cache)
  console.time('Second call');
  console.log('Fib(35):', memoizedFib(35));
  console.timeEnd('Second call');

  console.log('Cache stats:', memoizedFib.stats());

  memoizedFib.clear();
}

// Example 4: Async memoization for API calls
function asyncMemoizationExample() {
  console.log('\n=== Async Memoization Example ===');

  // Simulated API call
  async function fetchUser(userId) {
    console.log('Fetching user', userId, 'from API...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { id: userId, name: 'User ' + userId };
  }

  // Memoized version
  const cachedFetchUser = memoizeAsync(fetchUser, {
    maxSize: 50,
    ttl: 30000 // Cache for 30 seconds
  });

  // Make multiple concurrent requests
  Promise.all([
    cachedFetchUser(1),
    cachedFetchUser(1),
    cachedFetchUser(1)
  ]).then(results => {
    console.log('Results:', results);
    console.log('Cache stats:', cachedFetchUser.stats());
    cachedFetchUser.clear();
  });
}

// Example 5: Event handling
function eventHandlingExample() {
  console.log('\n=== Event Handling Example ===');

  const cache = new CacheManager({ maxSize: 10 });

  // Register event handlers
  cache.on('hit', ({ key }) => {
    console.log('Cache hit for key:', key);
  });

  cache.on('miss', ({ key }) => {
    console.log('Cache miss for key:', key);
  });

  cache.on('evict', ({ key }) => {
    console.log('Evicted key:', key);
  });

  // Trigger events
  cache.set('test', 'value');
  cache.get('test'); // Hit
  cache.get('missing'); // Miss

  cache.destroy();
}

// Example 6: Serialization and persistence
function serializationExample() {
  console.log('\n=== Serialization Example ===');

  const cache = new CacheManager({ maxSize: 100 });

  // Add some data
  cache.set('config:theme', 'dark');
  cache.set('config:language', 'en');
  cache.set('session:token', 'abc123');

  // Export to JSON
  const exported = cache.toJSON();
  console.log('Exported cache:', JSON.stringify(exported, null, 2));

  // Create new cache and import
  const newCache = new CacheManager();
  newCache.fromJSON(exported);

  console.log('Imported data:');
  console.log('Theme:', newCache.get('config:theme'));
  console.log('Language:', newCache.get('config:language'));

  cache.destroy();
  newCache.destroy();
}

// Example 7: Multi-level caching
function multiLevelCacheExample() {
  console.log('\n=== Multi-Level Cache Example ===');

  // L1: Fast, small cache (in-memory)
  const l1Cache = new CacheManager({
    maxSize: 10,
    ttl: 5000
  });

  // L2: Slower, larger cache
  const l2Cache = new CacheManager({
    maxSize: 100,
    ttl: 60000
  });

  // Create multi-level cache
  const cache = createMultiLevelCache([l1Cache, l2Cache]);

  // Set a value (goes to both levels)
  cache.set('data', { value: 'important' });

  // Clear L1 only
  l1Cache.clear();

  // Get will fetch from L2 and populate L1
  console.log('Data:', cache.get('data'));
  console.log('L1 size:', l1Cache.size());
  console.log('L2 size:', l2Cache.size());

  cache.clear();
}

// Example 8: Cache statistics and monitoring
function statisticsExample() {
  console.log('\n=== Statistics Example ===');

  const cache = new CacheManager({
    maxSize: 5,
    trackStats: true
  });

  // Perform various operations
  cache.set('a', 1);
  cache.set('b', 2);
  cache.set('c', 3);

  cache.get('a'); // Hit
  cache.get('b'); // Hit
  cache.get('missing'); // Miss
  cache.get('another-missing'); // Miss

  cache.delete('c');

  // Get comprehensive stats
  const stats = cache.getStats();
  console.log('Cache Statistics:');
  console.log('  Size:', stats.size);
  console.log('  Hits:', stats.hits);
  console.log('  Misses:', stats.misses);
  console.log('  Hit Rate:', (stats.hitRate * 100).toFixed(2) + '%');
  console.log('  Sets:', stats.sets);
  console.log('  Deletes:', stats.deletes);
  console.log('  Evictions:', stats.evictions);
  console.log('  Expirations:', stats.expirations);

  cache.destroy();
}

// Example 9: TTL and expiration
function ttlExample() {
  console.log('\n=== TTL Example ===');

  const cache = new CacheManager({
    ttl: 2000, // Default 2 seconds
    checkPeriod: 500 // Check every 500ms
  });

  // Set with default TTL
  cache.set('short-lived', 'expires in 2 seconds');

  // Set with custom TTL
  cache.set('long-lived', 'expires in 10 seconds', 10000);

  console.log('Initial values:');
  console.log('  Short:', cache.get('short-lived'));
  console.log('  Long:', cache.get('long-lived'));

  // Wait and check again
  setTimeout(() => {
    console.log('After 3 seconds:');
    console.log('  Short:', cache.get('short-lived')); // null (expired)
    console.log('  Long:', cache.get('long-lived')); // Still there
    cache.destroy();
  }, 3000);
}

// Example 10: Custom key generator for memoization
function customKeyGeneratorExample() {
  console.log('\n=== Custom Key Generator Example ===');

  // Function that takes an object as argument
  function processUser(user) {
    console.log('Processing user:', user.id);
    return {
      ...user,
      processed: true,
      timestamp: Date.now()
    };
  }

  // Memoize with custom key generator
  const memoizedProcess = memoize(processUser, {
    keyGenerator: ([user]) => 'user:' + user.id
  });

  const user1 = { id: 1, name: 'Alice' };
  const user2 = { id: 1, name: 'Alice Updated' };

  // First call
  const result1 = memoizedProcess(user1);
  console.log('First result:', result1);

  // Second call with different object but same ID - uses cache
  const result2 = memoizedProcess(user2);
  console.log('Second result:', result2);
  console.log('Same result?', result1 === result2);

  memoizedProcess.clear();
}

// Run all examples if this file is executed directly
if (require.main === module) {
  basicCacheExample();
  lruCacheExample();
  memoizationExample();
  asyncMemoizationExample();
  eventHandlingExample();
  serializationExample();
  multiLevelCacheExample();
  statisticsExample();
  ttlExample();
  customKeyGeneratorExample();
}

module.exports = {
  basicCacheExample,
  lruCacheExample,
  memoizationExample,
  asyncMemoizationExample,
  eventHandlingExample,
  serializationExample,
  multiLevelCacheExample,
  statisticsExample,
  ttlExample,
  customKeyGeneratorExample
};
