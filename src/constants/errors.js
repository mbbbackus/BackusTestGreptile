// Error constants
const ERRORS = {
  NOT_FOUND: { code: 'NOT_FOUND', message: 'Resource not found' },
  UNAUTHORIZED: { code: 'UNAUTHORIZED', message: 'Authentication required' },
  FORBIDDEN: { code: 'FORBIDDEN', message: 'Access denied' },
  VALIDATION: { code: 'VALIDATION', message: 'Validation failed' },
  SERVER_ERROR: { code: 'SERVER_ERROR', message: 'Internal server error' }
};

function createError(type, details) {
  return { ...ERRORS[type], details };
}

module.exports = { ERRORS, createError };
