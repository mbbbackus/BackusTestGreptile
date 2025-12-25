// Utility functions

function truncate(str, length) {
  return str.length > length ? str.slice(0, length) + '...' : str;
}

module.exports = {
  truncate
};
