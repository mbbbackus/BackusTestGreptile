#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');
const https = require('https');

// Utility function templates that can be generated
const utilityFunctions = [
  {
    name: 'deepClone',
    code: `function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}`
  },
  {
    name: 'randomInt',
    code: `function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}`
  },
  {
    name: 'sleep',
    code: `function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}`
  },
  {
    name: 'isEmail',
    code: `function isEmail(str) {
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return emailRegex.test(str);
}`
  },
  {
    name: 'truncate',
    code: `function truncate(str, length) {
  return str.length > length ? str.slice(0, length) + '...' : str;
}`
  },
  {
    name: 'groupBy',
    code: `function groupBy(array, key) {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) result[group] = [];
    result[group].push(item);
    return result;
  }, {});
}`
  },
  {
    name: 'chunk',
    code: `function chunk(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}`
  },
  {
    name: 'flatten',
    code: `function flatten(array) {
  return array.reduce((flat, item) => {
    return flat.concat(Array.isArray(item) ? flatten(item) : item);
  }, []);
}`
  },
  {
    name: 'unique',
    code: `function unique(array) {
  return [...new Set(array)];
}`
  },
  {
    name: 'shuffle',
    code: `function shuffle(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}`
  },
  {
    name: 'camelCase',
    code: `function camelCase(str) {
  return str.replace(/[-_\\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
}`
  },
  {
    name: 'kebabCase',
    code: `function kebabCase(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\\s_]+/g, '-')
    .toLowerCase();
}`
  },
  {
    name: 'throttle',
    code: `function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}`
  },
  {
    name: 'memoize',
    code: `function memoize(func) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = func.apply(this, args);
    cache.set(key, result);
    return result;
  };
}`
  },
  {
    name: 'isObject',
    code: `function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}`
  },
  {
    name: 'merge',
    code: `function merge(target, source) {
  const result = { ...target };
  Object.keys(source).forEach(key => {
    if (isObject(source[key]) && isObject(result[key])) {
      result[key] = merge(result[key], source[key]);
    } else {
      result[key] = source[key];
    }
  });
  return result;
}`
  },
  {
    name: 'pick',
    code: `function pick(obj, keys) {
  return keys.reduce((result, key) => {
    if (key in obj) result[key] = obj[key];
    return result;
  }, {});
}`
  },
  {
    name: 'omit',
    code: `function omit(obj, keys) {
  const result = { ...obj };
  keys.forEach(key => delete result[key]);
  return result;
}`
  }
];

// Small tweak templates
const smallTweaks = [
  {
    name: 'addConsoleLog',
    description: 'Add console.log debugging statement',
    apply: (content, filename) => {
      const funcMatch = content.match(/function\s+(\w+)\s*\(/);
      if (!funcMatch) return { content, changed: false };
      const funcName = funcMatch[1];
      const newLog = `console.log('DEBUG: Entering ${funcName}');\n`;
      const insertPoint = content.indexOf('{', content.indexOf(`function ${funcName}`)) + 1;
      return {
        content: content.slice(0, insertPoint) + '\n  ' + newLog + content.slice(insertPoint),
        changed: true,
        detail: `debug log in ${funcName}`
      };
    }
  },
  {
    name: 'addTodoComment',
    description: 'Add TODO comment',
    apply: (content, filename) => {
      const todos = [
        '// TODO: Optimize this function for better performance',
        '// TODO: Add error handling here',
        '// FIXME: This might break with null values',
        '// TODO: Consider caching this result',
        '// TODO: Add unit tests for edge cases'
      ];
      const todo = todos[Math.floor(Math.random() * todos.length)];
      const funcMatch = content.match(/function\s+(\w+)\s*\(/);
      if (!funcMatch) return { content, changed: false };
      const funcName = funcMatch[1];
      const funcIndex = content.indexOf(`function ${funcName}`);
      return {
        content: content.slice(0, funcIndex) + todo + '\n' + content.slice(funcIndex),
        changed: true,
        detail: `TODO comment near ${funcName}`
      };
    }
  },
  {
    name: 'addUnusedVariable',
    description: 'Add unused variable declaration',
    apply: (content, filename) => {
      const varNames = ['tempResult', 'debugFlag', 'unusedConfig', 'legacyMode', 'cacheEnabled'];
      const varName = varNames[Math.floor(Math.random() * varNames.length)];
      const funcMatch = content.match(/function\s+(\w+)\s*\([^)]*\)\s*{/);
      if (!funcMatch) return { content, changed: false };
      const insertPoint = content.indexOf('{', content.indexOf(funcMatch[0])) + 1;
      return {
        content: content.slice(0, insertPoint) + `\n  const ${varName} = true;` + content.slice(insertPoint),
        changed: true,
        detail: `unused var '${varName}'`
      };
    }
  },
  {
    name: 'addExtraBlankLines',
    description: 'Add extra blank lines',
    apply: (content, filename) => {
      const lines = content.split('\n');
      const insertIndex = Math.floor(Math.random() * (lines.length - 5)) + 2;
      lines.splice(insertIndex, 0, '', '', '');
      return {
        content: lines.join('\n'),
        changed: true,
        detail: 'extra whitespace'
      };
    }
  },
  {
    name: 'addCommentedCode',
    description: 'Add commented-out code block',
    apply: (content, filename) => {
      const commentedBlocks = [
        '// const oldImplementation = (x) => x * 2;\n// console.log(oldImplementation(5));',
        '// function deprecatedHelper() {\n//   return null;\n// }',
        '// const DEBUG = true;\n// if (DEBUG) console.log("debug mode");',
        '// TODO: Remove this after testing\n// const testValue = 42;'
      ];
      const block = commentedBlocks[Math.floor(Math.random() * commentedBlocks.length)];
      const funcMatch = content.match(/function\s+(\w+)/);
      if (!funcMatch) return { content, changed: false };
      const funcIndex = content.indexOf(funcMatch[0]);
      return {
        content: content.slice(0, funcIndex) + block + '\n\n' + content.slice(funcIndex),
        changed: true,
        detail: 'commented-out code'
      };
    }
  }
];

// Larger refactor templates
const largerRefactors = [
  {
    name: 'addJSDocComments',
    description: 'Add JSDoc comments to functions',
    apply: (content, filename) => {
      const funcMatches = [...content.matchAll(/function\s+(\w+)\s*\(([^)]*)\)/g)];
      if (funcMatches.length === 0) return { content, changed: false };

      let newContent = content;
      let addedCount = 0;
      for (const match of funcMatches.slice(0, 3)) {
        const funcName = match[1];
        const params = match[2].split(',').map(p => p.trim()).filter(p => p);
        const jsdoc = `/**\n * ${funcName} - Auto-generated documentation\n${params.map(p => ` * @param {*} ${p}`).join('\n')}\n * @returns {*}\n */\n`;

        if (!newContent.includes(`/** \n * ${funcName}`)) {
          const funcIndex = newContent.indexOf(match[0]);
          newContent = newContent.slice(0, funcIndex) + jsdoc + newContent.slice(funcIndex);
          addedCount++;
        }
      }
      return {
        content: newContent,
        changed: addedCount > 0,
        detail: `JSDoc for ${addedCount} functions`
      };
    }
  },
  {
    name: 'renameParameters',
    description: 'Rename function parameters for consistency',
    apply: (content, filename) => {
      const renames = [
        { from: /\bfunc\b/g, to: 'callback' },
        { from: /\barr\b/g, to: 'array' },
        { from: /\bobj\b/g, to: 'object' },
        { from: /\bstr\b/g, to: 'string' },
        { from: /\bval\b/g, to: 'value' }
      ];

      let newContent = content;
      let applied = [];
      for (const rename of renames) {
        if (rename.from.test(newContent)) {
          newContent = newContent.replace(rename.from, rename.to);
          applied.push(`${rename.from.source} -> ${rename.to}`);
          break; // Only apply one rename per run
        }
      }

      return {
        content: newContent,
        changed: applied.length > 0,
        detail: applied.length > 0 ? `renamed params: ${applied[0]}` : ''
      };
    }
  },
  {
    name: 'reorderExports',
    description: 'Alphabetically reorder exports',
    apply: (content, filename) => {
      const exportsMatch = content.match(/module\.exports\s*=\s*{([^}]*)}/s);
      if (!exportsMatch) return { content, changed: false };

      const exportsList = exportsMatch[1]
        .split(',')
        .map(e => e.trim())
        .filter(e => e)
        .sort();

      const newExports = `module.exports = {\n  ${exportsList.join(',\n  ')}\n}`;
      return {
        content: content.replace(/module\.exports\s*=\s*{[^}]*}/s, newExports),
        changed: true,
        detail: 'alphabetized exports'
      };
    }
  }
];


// Select operation type based on weights
function selectOperationType() {
  const rand = Math.random();
  if (rand < 0.6) return 'smallTweaks';
  if (rand < 0.9) return 'addUtilities';
  return 'largerRefactors';
}

// Get target files for operations
function getTargetFiles() {
  return ['src/utils.js', 'src/helpers.js', 'src/formatters.js', 'src/validators.js'];
}

// Default title fallback
function getDefaultTitle(operationType, details) {
  if (operationType === 'addUtilities') {
    return `Add ${details.functions.length} utility functions`;
  } else if (operationType === 'smallTweaks') {
    return `Code cleanup: ${details.changes.length} small fixes`;
  } else if (operationType === 'largerRefactors') {
    return `Refactor: ${details.changes[0] || 'code improvements'}`;
  } else if (operationType === 'bigFeature') {
    return `Add ${details.description}`;
  }
  return 'Code updates';
}

async function generatePRTitle(operationType, details) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.log('⚠️  ANTHROPIC_API_KEY not found, using default title');
    return getDefaultTitle(operationType, details);
  }

  let prompt;
  if (operationType === 'addUtilities') {
    const functionList = details.functions.map(f => `- ${f.name}`).join('\n');
    prompt = `Generate a concise, descriptive PR title (max 60 characters) for adding these utility functions to a JavaScript library:\n${functionList}\n\nTitle should describe what category/purpose these utilities serve. Return ONLY the title, no quotes or extra text.`;
  } else if (operationType === 'smallTweaks') {
    prompt = `Generate a concise PR title (max 60 characters) for a code cleanup PR that made these changes:\n${details.changes.join('\n')}\n\nReturn ONLY the title, no quotes or extra text.`;
  } else if (operationType === 'largerRefactors') {
    prompt = `Generate a concise PR title (max 60 characters) for a refactoring PR that:\n${details.changes.join('\n')}\n\nReturn ONLY the title, no quotes or extra text.`;
  } else if (operationType === 'bigFeature') {
    prompt = `Generate a concise PR title (max 60 characters) for adding a major new feature:\n${details.description}\n\nAdded ${details.lines} lines across ${details.files.length} files.\n\nReturn ONLY the title, no quotes or extra text.`;
  }

  const requestBody = JSON.stringify({
    model: 'claude-3-haiku-20240307',
    max_tokens: 100,
    messages: [{
      role: 'user',
      content: prompt
    }]
  });

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Length': Buffer.byteLength(requestBody)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode !== 200) {
          console.log(`⚠️  API returned status ${res.statusCode}`);
        }
        try {
          const response = JSON.parse(data);
          if (response.error) {
            console.log(`⚠️  API error: ${JSON.stringify(response.error)}`);
            resolve(getDefaultTitle(operationType, details));
            return;
          }
          const title = response.content[0].text.trim();
          resolve(title);
        } catch (error) {
          console.log(`⚠️  Failed to parse API response: ${error.message}`);
          console.log(`⚠️  Raw response: ${data.substring(0, 500)}`);
          resolve(getDefaultTitle(operationType, details));
        }
      });
    });

    req.on('error', (error) => {
      console.log('⚠️  API request failed, using default title');
      resolve(getDefaultTitle(operationType, details));
    });

    req.write(requestBody);
    req.end();
  });
}

// Execute small tweaks operation
function executeSmallTweaks() {
  const targetFiles = getTargetFiles();
  const numTweaks = Math.floor(Math.random() * 3) + 2; // 2-4 tweaks
  const shuffledTweaks = [...smallTweaks].sort(() => Math.random() - 0.5);
  const selectedTweaks = shuffledTweaks.slice(0, numTweaks);

  console.log(`\nApplying ${numTweaks} small tweaks...`);
  const changes = [];

  for (const tweak of selectedTweaks) {
    const targetFile = targetFiles[Math.floor(Math.random() * targetFiles.length)];
    if (!fs.existsSync(targetFile)) continue;

    const content = fs.readFileSync(targetFile, 'utf-8');
    const result = tweak.apply(content, targetFile);

    if (result.changed) {
      fs.writeFileSync(targetFile, result.content);
      console.log(`  ✓ ${tweak.description} in ${targetFile}`);
      changes.push(`- ${result.detail} (${targetFile})`);
    }
  }

  return { changes };
}

// Execute add utilities operation (original behavior)
function executeAddUtilities() {
  const numFunctions = Math.floor(Math.random() * 3) + 4; // 4-6 functions
  const shuffled = [...utilityFunctions].sort(() => Math.random() - 0.5);
  const selectedFunctions = shuffled.slice(0, numFunctions);

  console.log(`\nAdding ${numFunctions} utility functions...`);

  for (const func of selectedFunctions) {
    const fileOptions = getTargetFiles();
    const targetFile = fileOptions[Math.floor(Math.random() * fileOptions.length)];

    let content;
    if (fs.existsSync(targetFile)) {
      content = fs.readFileSync(targetFile, 'utf-8');
      const exportsIndex = content.lastIndexOf('module.exports');
      if (exportsIndex !== -1) {
        const beforeExports = content.slice(0, exportsIndex);
        const exportsSection = content.slice(exportsIndex);
        content = beforeExports + '\n' + func.code + '\n\n' + exportsSection;

        content = content.replace(/module\.exports\s*=\s*{([^}]*)}/s, (match, exports) => {
          const trimmedExports = exports.trim();
          const hasComma = trimmedExports.endsWith(',');
          return `module.exports = {${exports}${hasComma ? '' : ','}
  ${func.name}}`;
        });
      } else {
        content += '\n\n' + func.code + '\n\nmodule.exports = {\n  ' + func.name + '\n};\n';
      }
    } else {
      content = `// Utility functions\n\n${func.code}\n\nmodule.exports = {\n  ${func.name}\n};\n`;
    }

    fs.writeFileSync(targetFile, content);
    console.log(`  ✓ Added ${func.name} to ${targetFile}`);
  }

  return { functions: selectedFunctions };
}

// Execute larger refactors operation
function executeLargerRefactors() {
  const targetFiles = getTargetFiles();
  const numRefactors = Math.floor(Math.random() * 2) + 1; // 1-2 refactors
  const shuffledRefactors = [...largerRefactors].sort(() => Math.random() - 0.5);
  const selectedRefactors = shuffledRefactors.slice(0, numRefactors);

  console.log(`\nApplying ${numRefactors} refactors...`);
  const changes = [];

  for (const refactor of selectedRefactors) {
    const targetFile = targetFiles[Math.floor(Math.random() * targetFiles.length)];
    if (!fs.existsSync(targetFile)) continue;

    const content = fs.readFileSync(targetFile, 'utf-8');
    const result = refactor.apply(content, targetFile);

    if (result.changed) {
      fs.writeFileSync(targetFile, result.content);
      console.log(`  ✓ ${refactor.description} in ${targetFile}`);
      changes.push(`- ${result.detail} (${targetFile})`);
    }
  }

  return { changes };
}

// Execute big feature operation
function executeBigFeature() {
  console.log('\nAdding big feature: advanced caching system...');

  const files = [];

  // File 1: Main cache implementation (expanded with more features)
  files.push({
    path: 'src/cache/CacheManager.js',
    content: `/**
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
`
  });

  // File 2: LRU Cache implementation
  files.push({
    path: 'src/cache/LRUCache.js',
    content: `/**
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
`
  });

  // File 3: Cache utilities
  files.push({
    path: 'src/cache/utils.js',
    content: `/**
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
`
  });

  // File 4: Index/exports
  files.push({
    path: 'src/cache/index.js',
    content: `/**
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
`
  });

  let totalLines = 0;
  const addedFiles = [];

  // Create all files
  for (const file of files) {
    const dir = file.path.substring(0, file.path.lastIndexOf('/'));

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(file.path, file.content);
    const lines = file.content.split('\n').length;
    totalLines += lines;

    console.log(`  ✓ Created ${file.path} (${lines} lines)`);
    addedFiles.push(file.path);
  }

  console.log(`\nTotal lines added: ${totalLines}`);

  return {
    feature: 'caching-system',
    description: 'comprehensive caching system with LRU, memoization, and persistence',
    files: addedFiles,
    lines: totalLines
  };
}

// Generate commit message based on operation type
function generateCommitMessage(operationType, details) {
  if (operationType === 'addUtilities') {
    const functionNames = details.functions.map(f => f.name).join(', ');
    return `Add utility functions: ${functionNames}\n\nThis commit adds ${details.functions.length} new utility functions.`;
  } else if (operationType === 'smallTweaks') {
    return `Code cleanup: small fixes\n\nChanges:\n${details.changes.join('\n')}`;
  } else if (operationType === 'largerRefactors') {
    return `Refactor: code improvements\n\nChanges:\n${details.changes.join('\n')}`;
  } else if (operationType === 'bigFeature') {
    return `Add ${details.description}\n\nThis commit adds ${details.lines} lines across ${details.files.length} files:\n${details.files.map(f => '- ' + f).join('\n')}`;
  }
  return 'Code updates';
}

// Generate PR description based on operation type
function generatePRDescription(operationType, details) {
  if (operationType === 'addUtilities') {
    return `This PR adds ${details.functions.length} new utility functions:\n\n${details.functions.map(f => '- ' + f.name).join('\n')}\n\nThese utilities provide commonly used helper functions.`;
  } else if (operationType === 'smallTweaks') {
    return `This PR includes small code cleanup changes:\n\n${details.changes.join('\n')}`;
  } else if (operationType === 'largerRefactors') {
    return `This PR refactors code for better maintainability:\n\n${details.changes.join('\n')}`;
  } else if (operationType === 'bigFeature') {
    return `This PR adds a major new feature: **${details.description}**\n\n## Changes\n\n- Added ${details.lines} lines of code\n- Created ${details.files.length} new files:\n\n${details.files.map(f => '  - \`' + f + '\`').join('\n')}\n\nThis is a substantial addition to the codebase that provides new functionality.`;
  }
  return 'Code updates';
}

async function main() {
  // Parse command-line arguments
  const args = process.argv.slice(2);
  let operationType;

  if (args.includes('--big-feature') || args.includes('--feature')) {
    operationType = 'bigFeature';
    console.log(`\n📋 Operation type: ${operationType} (forced by flag)`);
  } else if (args.includes('--big-refactor') || args.includes('--refactor')) {
    operationType = 'largerRefactors';
    console.log(`\n📋 Operation type: ${operationType} (forced by flag)`);
  } else if (args.includes('--small-tweaks') || args.includes('--tweaks')) {
    operationType = 'smallTweaks';
    console.log(`\n📋 Operation type: ${operationType} (forced by flag)`);
  } else if (args.includes('--add-utilities') || args.includes('--utilities')) {
    operationType = 'addUtilities';
    console.log(`\n📋 Operation type: ${operationType} (forced by flag)`);
  } else {
    // Select operation type randomly
    operationType = selectOperationType();
    console.log(`\n📋 Operation type: ${operationType}`);
  }

  // Generate branch name based on operation type
  const timestamp = Date.now();
  const branchPrefix = {
    smallTweaks: 'cleanup',
    addUtilities: 'feature/add-utilities',
    largerRefactors: 'refactor',
    bigFeature: 'feature/big'
  }[operationType];
  const branchName = `${branchPrefix}-${timestamp}`;

  console.log(`Creating branch: ${branchName}`);
  execSync(`git checkout -b ${branchName}`, { stdio: 'inherit' });

  // Execute the operation
  let details;
  if (operationType === 'smallTweaks') {
    details = executeSmallTweaks();
  } else if (operationType === 'addUtilities') {
    details = executeAddUtilities();
  } else if (operationType === 'largerRefactors') {
    details = executeLargerRefactors();
  } else if (operationType === 'bigFeature') {
    details = executeBigFeature();
  }

  // Check if any changes were made
  const hasChanges = details && (
    (details.changes && details.changes.length > 0) ||
    (details.functions && details.functions.length > 0) ||
    (details.files && details.files.length > 0)
  );

  if (!hasChanges) {
    console.log('\n⚠️  No changes were made. Aborting.');
    execSync('git checkout main', { stdio: 'inherit' });
    execSync(`git branch -D ${branchName}`, { stdio: 'inherit' });
    return;
  }

  // Stage and commit changes
  console.log('\nCommitting changes...');
  const commitMessage = generateCommitMessage(operationType, details);
  execSync('git add .', { stdio: 'inherit' });
  execSync(`git commit -m "${commitMessage.replace(/"/g, '\\"')}"`, { stdio: 'inherit' });

  // Push the branch
  console.log('\nPushing branch to remote...');
  execSync(`git push -u origin ${branchName}`, { stdio: 'inherit' });

  // Get GitHub project info
  const remoteUrl = execSync('git remote get-url origin').toString().trim();
  console.log(`\nRemote URL: ${remoteUrl}`);

  // Generate PR title with LLM
  console.log('\nGenerating PR title with LLM...');
  const prTitle = await generatePRTitle(operationType, details);
  console.log(`Generated title: ${prTitle}`);

  console.log('\nAttempting to create pull request...');

  try {
    const description = generatePRDescription(operationType, details);

    // Escape double quotes in title and description for shell command
    const escapedTitle = prTitle.replace(/"/g, '\\"');
    const escapedDescription = description.replace(/"/g, '\\"');

    const prOutput = execSync(
      `gh pr create --title "${escapedTitle}" --body "${escapedDescription}" --base main`,
      { encoding: 'utf-8' }
    );

    console.log('\n' + prOutput);

    const urlMatch = prOutput.match(/https:\/\/[^\s]+/);
    if (urlMatch) {
      console.log(`\n✅ Pull Request created successfully!`);
      console.log(`\n🔗 ${urlMatch[0]}`);
    }
  } catch (error) {
    console.log('\n⚠️  gh command not available or failed.');
    console.log(`\nBranch ${branchName} has been pushed successfully.`);
    console.log('\nTo create a pull request manually:');
    console.log(`1. Visit your GitHub repository`);
    console.log(`2. Click "Create pull request" for branch: ${branchName}`);
    console.log(`3. Target branch: main`);
  }
}

main().catch(error => {
  console.error('Error:', error.message);
  process.exit(1);
});
