// Cache examples demonstrating various use cases
const { CacheManager, LRUCache, memoize, memoizeAsync, createMultiLevelCache } = require('./index');

// Example 1: Basic cache
function basicExample() {
  const cache = new CacheManager({ maxSize: 100, ttl: 5000 });
  cache.set('user:1', { id: 1, name: 'Alice' });
  cache.set('user:2', { id: 2, name: 'Bob' });
  console.log('User 1:', cache.get('user:1'));
  console.log('Stats:', cache.getStats());
  cache.destroy();
}

// Example 2: LRU cache
function lruExample() {
  const cache = new LRUCache({ maxSize: 3, ttl: 60000 });
  cache.set('a', 'Value A');
  cache.set('b', 'Value B');
  cache.set('c', 'Value C');
  console.log('LRU key:', cache.getLRUKey());
  cache.get('a');
  console.log('After access, LRU key:', cache.getLRUKey());
  cache.destroy();
}

// Example 3: Memoization
function memoExample() {
  function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
  }
  const memoizedFib = memoize(fibonacci, { maxSize: 100 });
  console.log('Fib(35):', memoizedFib(35));
  console.log('Stats:', memoizedFib.stats());
}

// Example 4: Async memoization
async function asyncMemoExample() {
  async function fetchUser(userId) {
    await new Promise(r => setTimeout(r, 100));
    return { id: userId, name: 'User ' + userId };
  }
  const cached = memoizeAsync(fetchUser, { ttl: 30000 });
  const results = await Promise.all([cached(1), cached(1), cached(1)]);
  console.log('Results:', results);
}

// Example 5: Event handling
function eventExample() {
  const cache = new CacheManager({ maxSize: 10 });
  cache.on('hit', ({ key }) => console.log('Hit:', key));
  cache.on('miss', ({ key }) => console.log('Miss:', key));
  cache.set('test', 'value');
  cache.get('test');
  cache.get('missing');
  cache.destroy();
}

// Example 6: Serialization
function serializationExample() {
  const cache = new CacheManager();
  cache.set('config:theme', 'dark');
  cache.set('config:lang', 'en');
  const exported = cache.toJSON();
  const newCache = new CacheManager();
  newCache.fromJSON(exported);
  console.log('Theme:', newCache.get('config:theme'));
  cache.destroy();
  newCache.destroy();
}

// Example 7: Multi-level cache
function multiLevelExample() {
  const l1 = new CacheManager({ maxSize: 10, ttl: 5000 });
  const l2 = new CacheManager({ maxSize: 100, ttl: 60000 });
  const cache = createMultiLevelCache([l1, l2]);
  cache.set('data', { value: 'important' });
  l1.clear();
  console.log('Data:', cache.get('data'));
  console.log('L1 size:', l1.size());
}

// Example 8: Statistics
function statsExample() {
  const cache = new CacheManager({ maxSize: 5 });
  cache.set('a', 1);
  cache.set('b', 2);
  cache.get('a');
  cache.get('missing');
  const stats = cache.getStats();
  console.log('Hit rate:', (stats.hitRate * 100).toFixed(2) + '%');
  cache.destroy();
}

// Example 9: TTL expiration
function ttlExample() {
  const cache = new CacheManager({ ttl: 2000 });
  cache.set('short', 'expires soon');
  cache.set('long', 'expires later', 10000);
  console.log('Initial:', cache.get('short'));
  setTimeout(() => {
    console.log('After 3s:', cache.get('short'));
    cache.destroy();
  }, 3000);
}

// Example 10: Custom key generator
function customKeyExample() {
  function process(user) {
    console.log('Processing:', user.id);
    return { ...user, processed: true };
  }
  const memoized = memoize(process, {
    keyGenerator: ([user]) => 'user:' + user.id
  });
  const u1 = { id: 1, name: 'Alice' };
  const u2 = { id: 1, name: 'Alice Updated' };
  const r1 = memoized(u1);
  const r2 = memoized(u2);
  console.log('Same result:', r1 === r2);
}

module.exports = {
  basicExample,
  lruExample,
  memoExample,
  asyncMemoExample,
  eventExample,
  serializationExample,
  multiLevelExample,
  statsExample,
  ttlExample,
  customKeyExample
};
