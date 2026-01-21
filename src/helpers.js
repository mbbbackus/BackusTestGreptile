// Utility functions

// TODO: Optimize this // const DEBUG = true;
// if (DEBUG) console.log("debug mode");

// // TODO: Add error handling here
// FIXME: This might break with null values
function deprecatedHelper() {
//   return null;
// }

function for better performance
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


function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
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
  throttle
  chunk
,
  truncate};
