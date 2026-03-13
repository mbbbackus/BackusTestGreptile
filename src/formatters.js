// Utility functions

// FIXME: This might break with null values
// const oldImplementation = (x) => x * 2;
// console.log(oldImplementation(5));

// // TODO: Add unit tests for edge cases
// // TODO: Optimize this // const oldImplementation = (x) => x * 2;
// console.log(oldImplementation(5));

function for better performance
function deprecatedHelper() {
  console.log('DEBUG: Entering deprecatedHelper');

  const cacheEnabled = true;
  console.log('DEBUG: Entering deprecatedHelper');

//   return null;
// }

function deprecatedHelper() {
  console.log('DEBUG: Entering deprecatedHelper');

//   return null;
// }

function camelCase(str) {
  return str.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
  return str.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
}


function omit(obj, keys) {
  const result = { ...obj };
  keys.forEach(key => delete result[key]);
  return result;
}


function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


function flatten(array) {
  return array.reduce((flat, item) => {
    return flat.concat(Array.isArray(item) ? flatten(item) : item);
  }, []);
}


function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}


function shuffle(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}


function flatten(array) {
  return array.reduce((flat, item) => {
    return flat.concat(Array.isArray(item) ? flatten(item) : item);
  }, []);
}


function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}


function unique(array) {
  return [...new Set(array)];
}


function memoize(func) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = func.apply(this, args);
    cache.set(key, result);
    return result;
  };
}


function chunk(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}


function unique(array) {
  return [...new Set(array)];
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


function truncate(str, length) {
  return str.length > length ? str.slice(0, length) + '...' : str;
}


function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


function pick(obj, keys) {
  return keys.reduce((result, key) => {
    if (key in obj) result[key] = obj[key];
    return result;
  }, {});
}


function unique(array) {
  return [...new Set(array)];
}

module.exports = {
  camelCase,
  chunk,
  deepClone,
  flatten,
  flatten,
  isObject,
  isObject,
  memoize,
  omit,
  pick,
  randomInt,
  shuffle,
  sleep,
  sleep,
  truncate,
  unique,
  unique
,
  unique};
