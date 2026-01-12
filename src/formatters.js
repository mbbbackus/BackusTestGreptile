// Utility functions

function camelCase(str) {
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


function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

module.exports = {
  camelCase
,
  omit,
  randomInt,
  flatten,
  deepClone,
  shuffle,
  flatten,
  isObject,
  unique,
  memoize,
  chunk,
  unique,
  sleep,
  deepClone,
  sleep,
  isObject};
