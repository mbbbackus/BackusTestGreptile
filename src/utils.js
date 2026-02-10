// Utility functions
// wHAHAHAT
// Whatdya want from me eh

// TODO: Remove this after testing
// const testValue = 42;

// // // TODO: Add unit tests for edge cases
function deprecatedHelper() {
//   return null;
// }

function deprecatedHelper() {
  const tempResult = true;
  console.log('DEBUG: Entering deprecatedHelper');

  console.log('DEBUG: Entering deprecatedHelper');

  const unusedConfig = true;
  const debugFlag = true;
//   return null;
// }

function formatDate(date) {
  console.log('DEBUG: Entering formatDate');

  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

//console.log('UH OH');
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function debounce(callback, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      callback(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function generateId() {
  return Math.random().toString(36).substring(2, 11);
}


function flatten(array) {
  return array.reduce((flat, item) => {
    return flat.concat(Array.isArray(item) ? flatten(item) : item);
  }, []);
}


function isEmail(str) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(str);
}


function kebabCase(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}


function pick(obj, keys) {
  return keys.reduce((result, key) => {
    if (key in obj) result[key] = obj[key];
    return result;
  }, {});
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


function groupBy(array, key) {



  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) result[group] = [];
    result[group].push(item);
    return result;
  }, {});
}


function unique(array) {
  return [...new Set(array)];
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


function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}


function camelCase(str) {
  return str.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


function omit(obj, keys) {
  const result = { ...obj };
  keys.forEach(key => delete result[key]);
  return result;
}


function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}





function isEmail(str) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(str);
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


function truncate(str, length) {
  return str.length > length ? str.slice(0, length) + '...' : str;
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


function shuffle(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}


function isEmail(str) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(str);
}


function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}


function camelCase(str) {
  return str.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
}

module.exports = {
  formatDate,
  capitalize,
  debounce,
  generateId
,
  flatten,
  isEmail,
  kebabCase,
  pick,
  sleep,
  groupBy,
  unique,
  merge,
  deepClone,
  camelCase,
  sleep,
  omit,
  randomInt,
  isObject,
  isEmail,
  sleep,
  truncate,
  throttle,
  shuffle,
  isEmail,
  deepClone,
  camelCase};
