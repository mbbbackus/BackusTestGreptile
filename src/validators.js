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

module.exports = {
  truncate
,
  truncate,
  flatten};
