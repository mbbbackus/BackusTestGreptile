// API endpoints
const ENDPOINTS = {
  USERS: '/api/users',
  POSTS: '/api/posts',
  COMMENTS: '/api/comments',
  AUTH_LOGIN: '/api/auth/login',
  AUTH_LOGOUT: '/api/auth/logout'
};

function buildUrl(endpoint, params = {}) {
  let url = endpoint;
  for (const [key, value] of Object.entries(params)) {
    url = url.replace(':' + key, value);
  }
  return url;
}

module.exports = { ENDPOINTS, buildUrl };
