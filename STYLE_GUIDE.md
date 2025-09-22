# Project Style Guide

## Naming Conventions

### File Naming
- Use kebab-case for file names: `user-manager.js`, `api-utils.js`
- Use descriptive names that clearly indicate the file's purpose
- Avoid overly creative or whimsical names in production code

### Variable Naming
- Use camelCase for variables and function names: `userManager`, `formatDate`
- Use PascalCase for class names: `User`, `UserManager`, `Application`
- Use UPPER_SNAKE_CASE for constants: `API_ENDPOINT`, `MAX_RETRIES`

### Function Naming
- Use descriptive verbs: `createUser()`, `validateEmail()`, `formatDate()`
- Boolean functions should start with `is`, `has`, or `can`: `isActive`, `hasPermission()`
- Event handlers should start with `on` or `handle`: `onSubmit()`, `handleError()`

## Code Formatting Rules

### Variable Declarations
- **R006**: Use `const` by default, `let` only when reassignment is needed
- Avoid `var` completely

### Function Parameters
- **R010**: Functions with more than 3 parameters must use object destructuring
```javascript
// Good
function createUser({ name, email, role, department }) {
  // implementation
}

// Avoid
function createUser(name, email, role, department) {
  // implementation
}
```

### Error Handling
- **R003**: Use specific error types, not generic Error
- **R005**: All async operations must have explicit timeout handling

### Code Structure
- **R002**: No nested ternary operators - use if/else statements for readability
- **R008**: No magic strings - use enum or const declarations
- **R009**: All DOM queries must check for null before use

### Documentation
- **R001**: All exported functions MUST have JSDoc with @example tag
```javascript
/**
 * Formats a date to a readable string
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string
 * @example
 * const formatted = formatDate(new Date());
 * console.log(formatted); // "January 1, 2024"
 */
function formatDate(date) {
  // implementation
}
```

### API and Validation
- **R007**: All API responses must be validated with runtime type checking

## Code Organization

### Module Structure
- Use CommonJS module exports: `module.exports = { User, UserManager }`
- Group related functionality in classes
- Keep utility functions in separate modules

### Class Structure
- Constructor should initialize all required properties
- Public methods should be well-documented
- Private methods should be prefixed with underscore (convention)

### File Organization
```
src/
├── app.js          # Main application entry point
├── user.js         # User-related classes and logic
├── utils.js        # Utility functions
└── api.js          # API-related functionality
```

## Best Practices

### General
- Keep functions small and focused on a single responsibility
- Use meaningful variable names that explain intent
- Add comments only when necessary to explain "why", not "what"
- Handle errors gracefully with appropriate error messages

### Async/Await
- Always handle promise rejections
- Use try/catch blocks for error handling
- Implement timeouts for external operations

### Performance
- Avoid unnecessary computations in loops
- Use appropriate data structures (Map for key-value lookups)
- Implement debouncing for frequent operations

## Examples

### Good Code Examples
```javascript
// Good: Clear naming and structure
class UserManager {
  constructor() {
    this.users = new Map();
  }

  createUser(name, email) {
    const id = this.generateId();
    const user = new User(id, name, email);
    this.users.set(id, user);
    return user;
  }
}

// Good: Proper error handling
async function loadConfiguration() {
  try {
    const config = await fetchConfig();
    return this.validateConfig(config);
  } catch (error) {
    throw new ConfigurationError('Failed to load configuration', error);
  }
}
```

### Code to Avoid
```javascript
// Avoid: Magic strings
if (user.status === 'active') { } // Use constants instead

// Avoid: Generic errors
throw new Error('Something went wrong'); // Be specific

// Avoid: Nested ternaries
const result = condition1 ? (condition2 ? value1 : value2) : value3;
```

This style guide should be followed consistently across the project to maintain code quality and readability.