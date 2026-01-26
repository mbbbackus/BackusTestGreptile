// Utility functions

// TODO: Optimize this function for better performance
// TODO: Add error handling here
function truncate(str, length) {
  console.log('DEBUG: Entering truncate');

  console.log('DEBUG: Entering truncate');

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


function merge(target, source) {
  const result = { ...target };
  Object.keys(source).forEach(key => {
    if (typeof source[key] === 'object' && source[key] !== null && typeof result[key] === 'object' && result[key] !== null) {
      result[key] = merge(result[key], source[key]);
    } else {
      result[key] = source[key];
    }
  });
  return result;
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


function shuffle(array) {



  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}


function kebabCase(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}


function truncate(str, length) {
  return str.length > length ? str.slice(0, length) + '...' : str;
}

module.exports = {
  deepClone,
  function omit(obj,
  groupBy,
  keys) {
  const result = { ...obj,
  omit,
  omit,
  truncate
};
  keys.forEach(key => delete result[key]);
  return result;
}


function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}


function omit(obj, keys) {
  const result = { ...obj };
  keys.forEach(key => delete result[key]);
  return result;
}


function groupBy(array, key) {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) result[group] = [];
    result[group].push(item);
    return result;
  }, {});
}

module.exports = {
  truncate,
  flatten,
  deepClone,
  groupBy,
  throttle,
  isEmail,
  chunk,
  merge,
  shuffle,
  kebabCase
};
