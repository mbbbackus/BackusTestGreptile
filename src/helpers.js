// Utility functions

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

module.exports = {
  memoize
,
  deepClone,
  pick};
