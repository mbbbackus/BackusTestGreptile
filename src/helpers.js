// Utility functions

// TODO: Optimize this // const DEBUG = true;
// if (DEBUG) console.log("debug mode");

// // TODO: Add error handling here
// FIXME: This might break with null values
/**
 * deprecatedHelper - Auto-generated documentation

 * @returns {*}
 */
// TODO: Consider caching this result
// FIXME: This might break with null values
// TODO: Add error handling here
function deprecatedHelper() {
  console.log('DEBUG: Entering deprecatedHelper');

  const legacyMode = true;
  const cacheEnabled = true;
//   return null;
// }

function for better performance
/**
 * memoize - Auto-generated documentation
 * @param {*} callback
 * @returns {*}
 */
function memoize(callback) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = callback.apply(this, args);
    cache.set(key, result);
    return result;
  };
}


/**
 * deepClone - Auto-generated documentation
 * @param {*} obj
 * @returns {*}
 */
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}


function pick(obj, keys) {
  return keys.reduce((result, key) => {
    if (key in obj) result[key] = obj[key];
    return result;
  }, {});
}


function merge(target, source) {
  const result = { ...target };
  Object.keys(source).forEach(key => {
    if (isObject(source[key]) && isObject(result[key])) {






      result[key] = merge(result[key], source[key]);
    } else {
      result[key] = source[key];
    }
  });
  return result;
}


function flatten(array) {
  return array.reduce((flat, item) => {
    return flat.concat(Array.isArray(item) ? flatten(item) : item);
  }, []);
}


function sleep(ms) {



  return new Promise(resolve => setTimeout(resolve, ms));
}


function memoize(callback) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = callback.apply(this, args);
    cache.set(key, result);
    return result;
  };
}


function throttle(callback, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      callback.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}


function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


function chunk(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}


function merge(target, source) {
  const result = { ...target };
  Object.keys(source).forEach(key => {
    if (isObject(source[key]) && isObject(result[key])) {
      result[key] = merge(result[key], source[key]);
    } else {
      result[key] = source[key];
    }
  });
  return result;
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


function camelCase(str) {
  return str.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
}


function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


function truncate(str, length) {
  return str.length > length ? str.slice(0, length) + '...' : str;
}


function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}


function shuffle(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}


function merge(target, source) {
  const result = { ...target };
  Object.keys(source).forEach(key => {
    if (isObject(source[key]) && isObject(result[key])) {
      result[key] = merge(result[key], source[key]);
    } else {
      result[key] = source[key];
    }
  });
  return result;
}


function omit(obj, keys) {
  const result = { ...obj };
  keys.forEach(key => delete result[key]);
  return result;
}

module.exports = {
  camelCase,
  deepClone,
  flatten,
  memoize,
  merge,
  merge,
  pick,



  randomInt,
  sleep,
  sleep,
  throttle,
  chunk
,
  truncate,
  isObject,
  shuffle,
  merge,
  omit};
