// Utility functions

function truncate(str, length) {
  return str.length > length ? str.slice(0, length) + '...' : str;
}


function truncate(str, length) {
  return str.length > length ? str.slice(0, length) + '...' : str;
}


function flatten(array) {
  return array.reduce((flat, item) => {
    return flat.concat(Array.isArray(item) ? flatten(item) : item);
  }, []);
}


function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}


function groupBy(array, key) {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) result[group] = [];
    result[group].push(item);
    return result;
  }, {});
}


function truncate(str, length) {
  return str.length > length ? str.slice(0, length) + '...' : str;
}


function truncate(str, length) {
  return str.length > length ? str.slice(0, length) + '...' : str;
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


function isEmail(str) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(str);
}


function chunk(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

module.exports = {
  truncate
,
  truncate,
  flatten,
  deepClone,
  groupBy,
  truncate,
  truncate,
  throttle,
  isEmail,
  chunk};
