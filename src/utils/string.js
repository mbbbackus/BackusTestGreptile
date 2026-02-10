// String utilities
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function truncate(str, length) {
  return str.length > length ? str.slice(0, length) + '...' : str;
}

function slugify(str) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

module.exports = { capitalize, truncate, slugify };
