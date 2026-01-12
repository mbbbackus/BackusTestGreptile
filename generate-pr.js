#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');
const https = require('https');

// Utility function templates that can be generated
const utilityFunctions = [
  {
    name: 'deepClone',
    code: `function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}`
  },
  {
    name: 'randomInt',
    code: `function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}`
  },
  {
    name: 'sleep',
    code: `function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}`
  },
  {
    name: 'isEmail',
    code: `function isEmail(str) {
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return emailRegex.test(str);
}`
  },
  {
    name: 'truncate',
    code: `function truncate(str, length) {
  return str.length > length ? str.slice(0, length) + '...' : str;
}`
  },
  {
    name: 'groupBy',
    code: `function groupBy(array, key) {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) result[group] = [];
    result[group].push(item);
    return result;
  }, {});
}`
  },
  {
    name: 'chunk',
    code: `function chunk(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}`
  },
  {
    name: 'flatten',
    code: `function flatten(array) {
  return array.reduce((flat, item) => {
    return flat.concat(Array.isArray(item) ? flatten(item) : item);
  }, []);
}`
  },
  {
    name: 'unique',
    code: `function unique(array) {
  return [...new Set(array)];
}`
  },
  {
    name: 'shuffle',
    code: `function shuffle(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}`
  },
  {
    name: 'camelCase',
    code: `function camelCase(str) {
  return str.replace(/[-_\\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
}`
  },
  {
    name: 'kebabCase',
    code: `function kebabCase(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\\s_]+/g, '-')
    .toLowerCase();
}`
  },
  {
    name: 'throttle',
    code: `function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}`
  },
  {
    name: 'memoize',
    code: `function memoize(func) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = func.apply(this, args);
    cache.set(key, result);
    return result;
  };
}`
  },
  {
    name: 'isObject',
    code: `function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}`
  },
  {
    name: 'merge',
    code: `function merge(target, source) {
  const result = { ...target };
  Object.keys(source).forEach(key => {
    if (isObject(source[key]) && isObject(result[key])) {
      result[key] = merge(result[key], source[key]);
    } else {
      result[key] = source[key];
    }
  });
  return result;
}`
  },
  {
    name: 'pick',
    code: `function pick(obj, keys) {
  return keys.reduce((result, key) => {
    if (key in obj) result[key] = obj[key];
    return result;
  }, {});
}`
  },
  {
    name: 'omit',
    code: `function omit(obj, keys) {
  const result = { ...obj };
  keys.forEach(key => delete result[key]);
  return result;
}`
  }
];

// Small tweak templates
const smallTweaks = [
  {
    name: 'addConsoleLog',
    description: 'Add console.log debugging statement',
    apply: (content, filename) => {
      const funcMatch = content.match(/function\s+(\w+)\s*\(/);
      if (!funcMatch) return { content, changed: false };
      const funcName = funcMatch[1];
      const newLog = `console.log('DEBUG: Entering ${funcName}');\n`;
      const insertPoint = content.indexOf('{', content.indexOf(`function ${funcName}`)) + 1;
      return {
        content: content.slice(0, insertPoint) + '\n  ' + newLog + content.slice(insertPoint),
        changed: true,
        detail: `debug log in ${funcName}`
      };
    }
  },
  {
    name: 'addTodoComment',
    description: 'Add TODO comment',
    apply: (content, filename) => {
      const todos = [
        '// TODO: Optimize this function for better performance',
        '// TODO: Add error handling here',
        '// FIXME: This might break with null values',
        '// TODO: Consider caching this result',
        '// TODO: Add unit tests for edge cases'
      ];
      const todo = todos[Math.floor(Math.random() * todos.length)];
      const funcMatch = content.match(/function\s+(\w+)\s*\(/);
      if (!funcMatch) return { content, changed: false };
      const funcName = funcMatch[1];
      const funcIndex = content.indexOf(`function ${funcName}`);
      return {
        content: content.slice(0, funcIndex) + todo + '\n' + content.slice(funcIndex),
        changed: true,
        detail: `TODO comment near ${funcName}`
      };
    }
  },
  {
    name: 'addUnusedVariable',
    description: 'Add unused variable declaration',
    apply: (content, filename) => {
      const varNames = ['tempResult', 'debugFlag', 'unusedConfig', 'legacyMode', 'cacheEnabled'];
      const varName = varNames[Math.floor(Math.random() * varNames.length)];
      const funcMatch = content.match(/function\s+(\w+)\s*\([^)]*\)\s*{/);
      if (!funcMatch) return { content, changed: false };
      const insertPoint = content.indexOf('{', content.indexOf(funcMatch[0])) + 1;
      return {
        content: content.slice(0, insertPoint) + `\n  const ${varName} = true;` + content.slice(insertPoint),
        changed: true,
        detail: `unused var '${varName}'`
      };
    }
  },
  {
    name: 'addExtraBlankLines',
    description: 'Add extra blank lines',
    apply: (content, filename) => {
      const lines = content.split('\n');
      const insertIndex = Math.floor(Math.random() * (lines.length - 5)) + 2;
      lines.splice(insertIndex, 0, '', '', '');
      return {
        content: lines.join('\n'),
        changed: true,
        detail: 'extra whitespace'
      };
    }
  },
  {
    name: 'addCommentedCode',
    description: 'Add commented-out code block',
    apply: (content, filename) => {
      const commentedBlocks = [
        '// const oldImplementation = (x) => x * 2;\n// console.log(oldImplementation(5));',
        '// function deprecatedHelper() {\n//   return null;\n// }',
        '// const DEBUG = true;\n// if (DEBUG) console.log("debug mode");',
        '// TODO: Remove this after testing\n// const testValue = 42;'
      ];
      const block = commentedBlocks[Math.floor(Math.random() * commentedBlocks.length)];
      const funcMatch = content.match(/function\s+(\w+)/);
      if (!funcMatch) return { content, changed: false };
      const funcIndex = content.indexOf(funcMatch[0]);
      return {
        content: content.slice(0, funcIndex) + block + '\n\n' + content.slice(funcIndex),
        changed: true,
        detail: 'commented-out code'
      };
    }
  }
];

// Larger refactor templates
const largerRefactors = [
  {
    name: 'addJSDocComments',
    description: 'Add JSDoc comments to functions',
    apply: (content, filename) => {
      const funcMatches = [...content.matchAll(/function\s+(\w+)\s*\(([^)]*)\)/g)];
      if (funcMatches.length === 0) return { content, changed: false };

      let newContent = content;
      let addedCount = 0;
      for (const match of funcMatches.slice(0, 3)) {
        const funcName = match[1];
        const params = match[2].split(',').map(p => p.trim()).filter(p => p);
        const jsdoc = `/**\n * ${funcName} - Auto-generated documentation\n${params.map(p => ` * @param {*} ${p}`).join('\n')}\n * @returns {*}\n */\n`;

        if (!newContent.includes(`/** \n * ${funcName}`)) {
          const funcIndex = newContent.indexOf(match[0]);
          newContent = newContent.slice(0, funcIndex) + jsdoc + newContent.slice(funcIndex);
          addedCount++;
        }
      }
      return {
        content: newContent,
        changed: addedCount > 0,
        detail: `JSDoc for ${addedCount} functions`
      };
    }
  },
  {
    name: 'renameParameters',
    description: 'Rename function parameters for consistency',
    apply: (content, filename) => {
      const renames = [
        { from: /\bfunc\b/g, to: 'callback' },
        { from: /\barr\b/g, to: 'array' },
        { from: /\bobj\b/g, to: 'object' },
        { from: /\bstr\b/g, to: 'string' },
        { from: /\bval\b/g, to: 'value' }
      ];

      let newContent = content;
      let applied = [];
      for (const rename of renames) {
        if (rename.from.test(newContent)) {
          newContent = newContent.replace(rename.from, rename.to);
          applied.push(`${rename.from.source} -> ${rename.to}`);
          break; // Only apply one rename per run
        }
      }

      return {
        content: newContent,
        changed: applied.length > 0,
        detail: applied.length > 0 ? `renamed params: ${applied[0]}` : ''
      };
    }
  },
  {
    name: 'reorderExports',
    description: 'Alphabetically reorder exports',
    apply: (content, filename) => {
      const exportsMatch = content.match(/module\.exports\s*=\s*{([^}]*)}/s);
      if (!exportsMatch) return { content, changed: false };

      const exportsList = exportsMatch[1]
        .split(',')
        .map(e => e.trim())
        .filter(e => e)
        .sort();

      const newExports = `module.exports = {\n  ${exportsList.join(',\n  ')}\n}`;
      return {
        content: content.replace(/module\.exports\s*=\s*{[^}]*}/s, newExports),
        changed: true,
        detail: 'alphabetized exports'
      };
    }
  }
];

// Big feature templates (1000+ lines)
const bigFeatures = [
  {
    name: 'validationFramework',
    description: 'Add comprehensive validation framework',
    files: [
      {
        path: 'src/validation/validators.js',
        content: `// Validation Framework
// Comprehensive validation utilities for data validation

class ValidationError extends Error {
  constructor(message, field, value) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.value = value;
  }
}

class ValidationRule {
  constructor(name, validator, message) {
    this.name = name;
    this.validator = validator;
    this.message = message;
  }

  validate(value, field) {
    if (!this.validator(value)) {
      throw new ValidationError(
        this.message.replace('{field}', field).replace('{value}', value),
        field,
        value
      );
    }
    return true;
  }
}

// String validators
const stringValidators = {
  required: new ValidationRule(
    'required',
    (value) => value !== null && value !== undefined && value !== '',
    '{field} is required'
  ),

  minLength: (min) => new ValidationRule(
    'minLength',
    (value) => typeof value === 'string' && value.length >= min,
    \`{field} must be at least \${min} characters\`
  ),

  maxLength: (max) => new ValidationRule(
    'maxLength',
    (value) => typeof value === 'string' && value.length <= max,
    \`{field} must be at most \${max} characters\`
  ),

  pattern: (regex, msg) => new ValidationRule(
    'pattern',
    (value) => regex.test(value),
    msg || '{field} has invalid format'
  ),

  email: new ValidationRule(
    'email',
    (value) => /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value),
    '{field} must be a valid email address'
  ),

  url: new ValidationRule(
    'url',
    (value) => {
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    },
    '{field} must be a valid URL'
  ),

  alphanumeric: new ValidationRule(
    'alphanumeric',
    (value) => /^[a-zA-Z0-9]+$/.test(value),
    '{field} must contain only letters and numbers'
  ),

  alpha: new ValidationRule(
    'alpha',
    (value) => /^[a-zA-Z]+$/.test(value),
    '{field} must contain only letters'
  ),

  numeric: new ValidationRule(
    'numeric',
    (value) => /^[0-9]+$/.test(value),
    '{field} must contain only numbers'
  ),

  lowercase: new ValidationRule(
    'lowercase',
    (value) => value === value.toLowerCase(),
    '{field} must be lowercase'
  ),

  uppercase: new ValidationRule(
    'uppercase',
    (value) => value === value.toUpperCase(),
    '{field} must be uppercase'
  )
};

// Number validators
const numberValidators = {
  min: (min) => new ValidationRule(
    'min',
    (value) => typeof value === 'number' && value >= min,
    \`{field} must be at least \${min}\`
  ),

  max: (max) => new ValidationRule(
    'max',
    (value) => typeof value === 'number' && value <= max,
    \`{field} must be at most \${max}\`
  ),

  positive: new ValidationRule(
    'positive',
    (value) => typeof value === 'number' && value > 0,
    '{field} must be positive'
  ),

  negative: new ValidationRule(
    'negative',
    (value) => typeof value === 'number' && value < 0,
    '{field} must be negative'
  ),

  integer: new ValidationRule(
    'integer',
    (value) => Number.isInteger(value),
    '{field} must be an integer'
  ),

  range: (min, max) => new ValidationRule(
    'range',
    (value) => typeof value === 'number' && value >= min && value <= max,
    \`{field} must be between \${min} and \${max}\`
  )
};

// Array validators
const arrayValidators = {
  minItems: (min) => new ValidationRule(
    'minItems',
    (value) => Array.isArray(value) && value.length >= min,
    \`{field} must have at least \${min} items\`
  ),

  maxItems: (max) => new ValidationRule(
    'maxItems',
    (value) => Array.isArray(value) && value.length <= max,
    \`{field} must have at most \${max} items\`
  ),

  uniqueItems: new ValidationRule(
    'uniqueItems',
    (value) => {
      if (!Array.isArray(value)) return false;
      const seen = new Set();
      for (const item of value) {
        const key = typeof item === 'object' ? JSON.stringify(item) : item;
        if (seen.has(key)) return false;
        seen.add(key);
      }
      return true;
    },
    '{field} must have unique items'
  ),

  contains: (item) => new ValidationRule(
    'contains',
    (value) => Array.isArray(value) && value.includes(item),
    \`{field} must contain \${item}\`
  )
};

// Object validators
const objectValidators = {
  hasKeys: (...keys) => new ValidationRule(
    'hasKeys',
    (value) => {
      if (typeof value !== 'object' || value === null) return false;
      return keys.every(key => key in value);
    },
    \`{field} must have keys: \${keys.join(', ')}\`
  ),

  keysMatch: (pattern) => new ValidationRule(
    'keysMatch',
    (value) => {
      if (typeof value !== 'object' || value === null) return false;
      return Object.keys(value).every(key => pattern.test(key));
    },
    '{field} keys must match pattern'
  )
};

// Date validators
const dateValidators = {
  before: (date) => new ValidationRule(
    'before',
    (value) => new Date(value) < new Date(date),
    \`{field} must be before \${date}\`
  ),

  after: (date) => new ValidationRule(
    'after',
    (value) => new Date(value) > new Date(date),
    \`{field} must be after \${date}\`
  ),

  dateRange: (start, end) => new ValidationRule(
    'dateRange',
    (value) => {
      const d = new Date(value);
      return d >= new Date(start) && d <= new Date(end);
    },
    \`{field} must be between \${start} and \${end}\`
  )
};

// Composite validators
const compositeValidators = {
  oneOf: (values) => new ValidationRule(
    'oneOf',
    (value) => values.includes(value),
    \`{field} must be one of: \${values.join(', ')}\`
  ),

  noneOf: (values) => new ValidationRule(
    'noneOf',
    (value) => !values.includes(value),
    \`{field} must not be any of: \${values.join(', ')}\`
  ),

  equals: (expected) => new ValidationRule(
    'equals',
    (value) => value === expected,
    \`{field} must equal \${expected}\`
  ),

  notEquals: (expected) => new ValidationRule(
    'notEquals',
    (value) => value !== expected,
    \`{field} must not equal \${expected}\`
  )
};

// Schema validator
class SchemaValidator {
  constructor(schema) {
    this.schema = schema;
  }

  validate(data) {
    const errors = [];

    for (const [field, rules] of Object.entries(this.schema)) {
      const value = data[field];

      for (const rule of Array.isArray(rules) ? rules : [rules]) {
        try {
          rule.validate(value, field);
        } catch (error) {
          if (error instanceof ValidationError) {
            errors.push(error);
          } else {
            throw error;
          }
        }
      }
    }

    if (errors.length > 0) {
      const error = new Error('Validation failed');
      error.name = 'ValidationErrors';
      error.errors = errors;
      throw error;
    }

    return true;
  }

  validateAsync(data) {
    return Promise.resolve(this.validate(data));
  }
}

// Validator builder
class ValidatorBuilder {
  constructor() {
    this.rules = [];
  }

  add(rule) {
    this.rules.push(rule);
    return this;
  }

  required() {
    return this.add(stringValidators.required);
  }

  minLength(min) {
    return this.add(stringValidators.minLength(min));
  }

  maxLength(max) {
    return this.add(stringValidators.maxLength(max));
  }

  pattern(regex, msg) {
    return this.add(stringValidators.pattern(regex, msg));
  }

  email() {
    return this.add(stringValidators.email);
  }

  url() {
    return this.add(stringValidators.url);
  }

  min(min) {
    return this.add(numberValidators.min(min));
  }

  max(max) {
    return this.add(numberValidators.max(max));
  }

  positive() {
    return this.add(numberValidators.positive);
  }

  integer() {
    return this.add(numberValidators.integer);
  }

  oneOf(values) {
    return this.add(compositeValidators.oneOf(values));
  }

  build() {
    return this.rules;
  }
}

function validator() {
  return new ValidatorBuilder();
}

module.exports = {
  ValidationError,
  ValidationRule,
  stringValidators,
  numberValidators,
  arrayValidators,
  objectValidators,
  dateValidators,
  compositeValidators,
  SchemaValidator,
  ValidatorBuilder,
  validator
};
`
      },
      {
        path: 'src/validation/index.js',
        content: `// Validation module entry point
const {
  ValidationError,
  ValidationRule,
  stringValidators,
  numberValidators,
  arrayValidators,
  objectValidators,
  dateValidators,
  compositeValidators,
  SchemaValidator,
  validator
} = require('./validators');

// Pre-built common schemas
const commonSchemas = {
  user: new SchemaValidator({
    email: [stringValidators.required, stringValidators.email],
    password: [stringValidators.required, stringValidators.minLength(8)],
    age: [numberValidators.min(18), numberValidators.max(120)]
  }),

  post: new SchemaValidator({
    title: [stringValidators.required, stringValidators.minLength(1), stringValidators.maxLength(200)],
    content: [stringValidators.required, stringValidators.minLength(10)],
    tags: [arrayValidators.minItems(1), arrayValidators.maxItems(5)]
  }),

  product: new SchemaValidator({
    name: [stringValidators.required, stringValidators.minLength(1)],
    price: [numberValidators.positive, numberValidators.min(0)],
    sku: [stringValidators.required, stringValidators.alphanumeric]
  })
};

// Validation middleware for Express
function validationMiddleware(schema) {
  return (req, res, next) => {
    try {
      schema.validate(req.body);
      next();
    } catch (error) {
      if (error.name === 'ValidationErrors') {
        res.status(400).json({
          error: 'Validation failed',
          details: error.errors.map(e => ({
            field: e.field,
            message: e.message,
            value: e.value
          }))
        });
      } else {
        next(error);
      }
    }
  };
}

// Sanitization helpers
const sanitizers = {
  trim: (str) => typeof str === 'string' ? str.trim() : str,
  toLowerCase: (str) => typeof str === 'string' ? str.toLowerCase() : str,
  toUpperCase: (str) => typeof str === 'string' ? str.toUpperCase() : str,
  removeWhitespace: (str) => typeof str === 'string' ? str.replace(/\\s+/g, '') : str,
  escapeHtml: (str) => {
    if (typeof str !== 'string') return str;
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;'
    };
    return str.replace(/[&<>"'/]/g, (char) => map[char]);
  },
  toNumber: (val) => {
    const num = Number(val);
    return isNaN(num) ? val : num;
  },
  toBoolean: (val) => {
    if (typeof val === 'boolean') return val;
    if (typeof val === 'string') {
      const lower = val.toLowerCase();
      if (lower === 'true' || lower === '1') return true;
      if (lower === 'false' || lower === '0') return false;
    }
    return Boolean(val);
  }
};

module.exports = {
  ValidationError,
  ValidationRule,
  stringValidators,
  numberValidators,
  arrayValidators,
  objectValidators,
  dateValidators,
  compositeValidators,
  SchemaValidator,
  validator,
  commonSchemas,
  validationMiddleware,
  sanitizers
};
`
      }
    ]
  },
  {
    name: 'dataProcessingPipeline',
    description: 'Add data processing pipeline framework',
    files: [
      {
        path: 'src/pipeline/processor.js',
        content: `// Data Processing Pipeline
// Framework for building data transformation pipelines

class ProcessingStep {
  constructor(name, processor, options = {}) {
    this.name = name;
    this.processor = processor;
    this.options = options;
    this.enabled = options.enabled !== false;
  }

  async process(data, context) {
    if (!this.enabled) {
      return data;
    }

    try {
      const result = await this.processor(data, context);
      return result;
    } catch (error) {
      if (this.options.onError === 'skip') {
        console.warn(\`Step "\${this.name}" failed, skipping:\`, error.message);
        return data;
      } else if (this.options.onError === 'default') {
        return this.options.defaultValue;
      } else {
        throw error;
      }
    }
  }
}

class Pipeline {
  constructor(name, options = {}) {
    this.name = name;
    this.steps = [];
    this.options = options;
    this.hooks = {
      beforePipeline: [],
      afterPipeline: [],
      beforeStep: [],
      afterStep: [],
      onError: []
    };
  }

  addStep(name, processor, options) {
    const step = new ProcessingStep(name, processor, options);
    this.steps.push(step);
    return this;
  }

  removeStep(name) {
    this.steps = this.steps.filter(step => step.name !== name);
    return this;
  }

  on(event, handler) {
    if (this.hooks[event]) {
      this.hooks[event].push(handler);
    }
    return this;
  }

  async runHooks(event, ...args) {
    for (const handler of this.hooks[event]) {
      await handler(...args);
    }
  }

  async process(data) {
    const context = {
      pipeline: this.name,
      startTime: Date.now(),
      metadata: {}
    };

    try {
      await this.runHooks('beforePipeline', data, context);

      let result = data;

      for (const step of this.steps) {
        await this.runHooks('beforeStep', result, step, context);

        const stepStartTime = Date.now();
        result = await step.process(result, context);

        context.metadata[step.name] = {
          duration: Date.now() - stepStartTime,
          timestamp: new Date().toISOString()
        };

        await this.runHooks('afterStep', result, step, context);
      }

      context.duration = Date.now() - context.startTime;
      await this.runHooks('afterPipeline', result, context);

      return result;
    } catch (error) {
      await this.runHooks('onError', error, data, context);
      throw error;
    }
  }

  async processBatch(dataArray, options = {}) {
    const { parallel = false, batchSize = 10 } = options;

    if (parallel) {
      if (batchSize && dataArray.length > batchSize) {
        const results = [];
        for (let i = 0; i < dataArray.length; i += batchSize) {
          const batch = dataArray.slice(i, i + batchSize);
          const batchResults = await Promise.all(
            batch.map(item => this.process(item))
          );
          results.push(...batchResults);
        }
        return results;
      } else {
        return Promise.all(dataArray.map(item => this.process(item)));
      }
    } else {
      const results = [];
      for (const item of dataArray) {
        results.push(await this.process(item));
      }
      return results;
    }
  }
}

// Common processors
const processors = {
  // Data transformation
  map: (fn) => async (data) => {
    if (Array.isArray(data)) {
      return data.map(fn);
    }
    return fn(data);
  },

  filter: (predicate) => async (data) => {
    if (Array.isArray(data)) {
      return data.filter(predicate);
    }
    return predicate(data) ? data : null;
  },

  flatMap: (fn) => async (data) => {
    if (Array.isArray(data)) {
      return data.flatMap(fn);
    }
    const result = fn(data);
    return Array.isArray(result) ? result : [result];
  },

  sort: (compareFn) => async (data) => {
    if (Array.isArray(data)) {
      return [...data].sort(compareFn);
    }
    return data;
  },

  unique: () => async (data) => {
    if (Array.isArray(data)) {
      return [...new Set(data)];
    }
    return data;
  },

  // Data validation
  validate: (schema) => async (data) => {
    // Assume we have a validation function
    return data; // Simplified
  },

  // Data enrichment
  enrich: (enricher) => async (data, context) => {
    const enrichment = await enricher(data, context);
    if (typeof data === 'object' && !Array.isArray(data)) {
      return { ...data, ...enrichment };
    }
    return data;
  },

  // Data aggregation
  groupBy: (keyFn) => async (data) => {
    if (!Array.isArray(data)) return data;

    const groups = {};
    for (const item of data) {
      const key = keyFn(item);
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    }
    return groups;
  },

  reduce: (reducer, initial) => async (data) => {
    if (Array.isArray(data)) {
      return data.reduce(reducer, initial);
    }
    return data;
  },

  // Data formatting
  stringify: () => async (data) => {
    return JSON.stringify(data, null, 2);
  },

  parse: () => async (data) => {
    if (typeof data === 'string') {
      try {
        return JSON.parse(data);
      } catch {
        return data;
      }
    }
    return data;
  },

  // Data cleaning
  trim: () => async (data) => {
    if (typeof data === 'string') {
      return data.trim();
    }
    if (typeof data === 'object' && !Array.isArray(data)) {
      const result = {};
      for (const [key, value] of Object.entries(data)) {
        result[key] = typeof value === 'string' ? value.trim() : value;
      }
      return result;
    }
    return data;
  },

  removeNulls: () => async (data) => {
    if (Array.isArray(data)) {
      return data.filter(item => item !== null && item !== undefined);
    }
    if (typeof data === 'object') {
      const result = {};
      for (const [key, value] of Object.entries(data)) {
        if (value !== null && value !== undefined) {
          result[key] = value;
        }
      }
      return result;
    }
    return data;
  },

  // Async operations
  delay: (ms) => async (data) => {
    await new Promise(resolve => setTimeout(resolve, ms));
    return data;
  },

  retry: (processor, options = {}) => {
    const { maxRetries = 3, delay = 1000 } = options;
    return async (data, context) => {
      let lastError;
      for (let i = 0; i < maxRetries; i++) {
        try {
          return await processor(data, context);
        } catch (error) {
          lastError = error;
          if (i < maxRetries - 1) {
            await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
          }
        }
      }
      throw lastError;
    };
  },

  // Conditional processing
  conditional: (predicate, thenProcessor, elseProcessor) => async (data, context) => {
    if (await predicate(data, context)) {
      return thenProcessor ? await thenProcessor(data, context) : data;
    } else {
      return elseProcessor ? await elseProcessor(data, context) : data;
    }
  },

  // Logging
  log: (message) => async (data, context) => {
    console.log(\`[\${context.pipeline}] \${message}\`, data);
    return data;
  },

  // Metrics
  measure: (metricName) => async (data, context) => {
    const start = Date.now();
    // Record metric
    context.metadata[\`metric_\${metricName}\`] = Date.now() - start;
    return data;
  }
};

// Pipeline builder
class PipelineBuilder {
  constructor(name) {
    this.pipeline = new Pipeline(name);
  }

  step(name, processor, options) {
    this.pipeline.addStep(name, processor, options);
    return this;
  }

  map(fn, options) {
    return this.step('map', processors.map(fn), options);
  }

  filter(predicate, options) {
    return this.step('filter', processors.filter(predicate), options);
  }

  sort(compareFn, options) {
    return this.step('sort', processors.sort(compareFn), options);
  }

  unique(options) {
    return this.step('unique', processors.unique(), options);
  }

  groupBy(keyFn, options) {
    return this.step('groupBy', processors.groupBy(keyFn), options);
  }

  validate(schema, options) {
    return this.step('validate', processors.validate(schema), options);
  }

  log(message, options) {
    return this.step('log', processors.log(message), options);
  }

  delay(ms, options) {
    return this.step('delay', processors.delay(ms), options);
  }

  build() {
    return this.pipeline;
  }
}

function createPipeline(name) {
  return new PipelineBuilder(name);
}

module.exports = {
  Pipeline,
  ProcessingStep,
  PipelineBuilder,
  createPipeline,
  processors
};
`
      }
    ]
  }
];

// Select operation type based on weights
function selectOperationType() {
  const rand = Math.random();
  if (rand < 0.6) return 'smallTweaks';
  if (rand < 0.9) return 'addUtilities';
  return 'largerRefactors';
}

// Get target files for operations
function getTargetFiles() {
  return ['src/utils.js', 'src/helpers.js', 'src/formatters.js', 'src/validators.js'];
}

// Default title fallback
function getDefaultTitle(operationType, details) {
  if (operationType === 'addUtilities') {
    return `Add ${details.functions.length} utility functions`;
  } else if (operationType === 'smallTweaks') {
    return `Code cleanup: ${details.changes.length} small fixes`;
  } else if (operationType === 'largerRefactors') {
    return `Refactor: ${details.changes[0] || 'code improvements'}`;
  } else if (operationType === 'bigFeature') {
    return `Add ${details.description}`;
  }
  return 'Code updates';
}

async function generatePRTitle(operationType, details) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.log('⚠️  ANTHROPIC_API_KEY not found, using default title');
    return getDefaultTitle(operationType, details);
  }

  let prompt;
  if (operationType === 'addUtilities') {
    const functionList = details.functions.map(f => `- ${f.name}`).join('\n');
    prompt = `Generate a concise, descriptive PR title (max 60 characters) for adding these utility functions to a JavaScript library:\n${functionList}\n\nTitle should describe what category/purpose these utilities serve. Return ONLY the title, no quotes or extra text.`;
  } else if (operationType === 'smallTweaks') {
    prompt = `Generate a concise PR title (max 60 characters) for a code cleanup PR that made these changes:\n${details.changes.join('\n')}\n\nReturn ONLY the title, no quotes or extra text.`;
  } else if (operationType === 'largerRefactors') {
    prompt = `Generate a concise PR title (max 60 characters) for a refactoring PR that:\n${details.changes.join('\n')}\n\nReturn ONLY the title, no quotes or extra text.`;
  } else if (operationType === 'bigFeature') {
    prompt = `Generate a concise PR title (max 60 characters) for adding a major new feature:\n${details.description}\n\nAdded ${details.lines} lines across ${details.files.length} files.\n\nReturn ONLY the title, no quotes or extra text.`;
  }

  const requestBody = JSON.stringify({
    model: 'claude-3-haiku-20240307',
    max_tokens: 100,
    messages: [{
      role: 'user',
      content: prompt
    }]
  });

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Length': Buffer.byteLength(requestBody)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode !== 200) {
          console.log(`⚠️  API returned status ${res.statusCode}`);
        }
        try {
          const response = JSON.parse(data);
          if (response.error) {
            console.log(`⚠️  API error: ${JSON.stringify(response.error)}`);
            resolve(getDefaultTitle(operationType, details));
            return;
          }
          const title = response.content[0].text.trim();
          resolve(title);
        } catch (error) {
          console.log(`⚠️  Failed to parse API response: ${error.message}`);
          console.log(`⚠️  Raw response: ${data.substring(0, 500)}`);
          resolve(getDefaultTitle(operationType, details));
        }
      });
    });

    req.on('error', (error) => {
      console.log('⚠️  API request failed, using default title');
      resolve(getDefaultTitle(operationType, details));
    });

    req.write(requestBody);
    req.end();
  });
}

// Execute small tweaks operation
function executeSmallTweaks() {
  const targetFiles = getTargetFiles();
  const numTweaks = Math.floor(Math.random() * 3) + 2; // 2-4 tweaks
  const shuffledTweaks = [...smallTweaks].sort(() => Math.random() - 0.5);
  const selectedTweaks = shuffledTweaks.slice(0, numTweaks);

  console.log(`\nApplying ${numTweaks} small tweaks...`);
  const changes = [];

  for (const tweak of selectedTweaks) {
    const targetFile = targetFiles[Math.floor(Math.random() * targetFiles.length)];
    if (!fs.existsSync(targetFile)) continue;

    const content = fs.readFileSync(targetFile, 'utf-8');
    const result = tweak.apply(content, targetFile);

    if (result.changed) {
      fs.writeFileSync(targetFile, result.content);
      console.log(`  ✓ ${tweak.description} in ${targetFile}`);
      changes.push(`- ${result.detail} (${targetFile})`);
    }
  }

  return { changes };
}

// Execute add utilities operation (original behavior)
function executeAddUtilities() {
  const numFunctions = Math.floor(Math.random() * 3) + 4; // 4-6 functions
  const shuffled = [...utilityFunctions].sort(() => Math.random() - 0.5);
  const selectedFunctions = shuffled.slice(0, numFunctions);

  console.log(`\nAdding ${numFunctions} utility functions...`);

  for (const func of selectedFunctions) {
    const fileOptions = getTargetFiles();
    const targetFile = fileOptions[Math.floor(Math.random() * fileOptions.length)];

    let content;
    if (fs.existsSync(targetFile)) {
      content = fs.readFileSync(targetFile, 'utf-8');
      const exportsIndex = content.lastIndexOf('module.exports');
      if (exportsIndex !== -1) {
        const beforeExports = content.slice(0, exportsIndex);
        const exportsSection = content.slice(exportsIndex);
        content = beforeExports + '\n' + func.code + '\n\n' + exportsSection;

        content = content.replace(/module\.exports\s*=\s*{([^}]*)}/s, (match, exports) => {
          const trimmedExports = exports.trim();
          const hasComma = trimmedExports.endsWith(',');
          return `module.exports = {${exports}${hasComma ? '' : ','}
  ${func.name}}`;
        });
      } else {
        content += '\n\n' + func.code + '\n\nmodule.exports = {\n  ' + func.name + '\n};\n';
      }
    } else {
      content = `// Utility functions\n\n${func.code}\n\nmodule.exports = {\n  ${func.name}\n};\n`;
    }

    fs.writeFileSync(targetFile, content);
    console.log(`  ✓ Added ${func.name} to ${targetFile}`);
  }

  return { functions: selectedFunctions };
}

// Execute larger refactors operation
function executeLargerRefactors() {
  const targetFiles = getTargetFiles();
  const numRefactors = Math.floor(Math.random() * 2) + 1; // 1-2 refactors
  const shuffledRefactors = [...largerRefactors].sort(() => Math.random() - 0.5);
  const selectedRefactors = shuffledRefactors.slice(0, numRefactors);

  console.log(`\nApplying ${numRefactors} refactors...`);
  const changes = [];

  for (const refactor of selectedRefactors) {
    const targetFile = targetFiles[Math.floor(Math.random() * targetFiles.length)];
    if (!fs.existsSync(targetFile)) continue;

    const content = fs.readFileSync(targetFile, 'utf-8');
    const result = refactor.apply(content, targetFile);

    if (result.changed) {
      fs.writeFileSync(targetFile, result.content);
      console.log(`  ✓ ${refactor.description} in ${targetFile}`);
      changes.push(`- ${result.detail} (${targetFile})`);
    }
  }

  return { changes };
}

// Execute big feature operation
function executeBigFeature() {
  const selectedFeature = bigFeatures[Math.floor(Math.random() * bigFeatures.length)];

  console.log(\`\\nAdding big feature: \${selectedFeature.name}...\`);

  const addedFiles = [];
  let totalLines = 0;

  for (const file of selectedFeature.files) {
    const dir = file.path.substring(0, file.path.lastIndexOf('/'));

    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write the file
    fs.writeFileSync(file.path, file.content);
    const lines = file.content.split('\\n').length;
    totalLines += lines;

    console.log(\`  ✓ Created \${file.path} (\${lines} lines)\`);
    addedFiles.push(file.path);
  }

  console.log(\`\\nTotal lines added: \${totalLines}\`);

  return {
    feature: selectedFeature.name,
    description: selectedFeature.description,
    files: addedFiles,
    lines: totalLines
  };
}

// Generate commit message based on operation type
function generateCommitMessage(operationType, details) {
  if (operationType === 'addUtilities') {
    const functionNames = details.functions.map(f => f.name).join(', ');
    return `Add utility functions: ${functionNames}\n\nThis commit adds ${details.functions.length} new utility functions.`;
  } else if (operationType === 'smallTweaks') {
    return `Code cleanup: small fixes\n\nChanges:\n${details.changes.join('\n')}`;
  } else if (operationType === 'largerRefactors') {
    return `Refactor: code improvements\n\nChanges:\n${details.changes.join('\n')}`;
  } else if (operationType === 'bigFeature') {
    return `Add ${details.description}\n\nThis commit adds ${details.lines} lines across ${details.files.length} files:\n${details.files.map(f => '- ' + f).join('\n')}`;
  }
  return 'Code updates';
}

// Generate PR description based on operation type
function generatePRDescription(operationType, details) {
  if (operationType === 'addUtilities') {
    return `This PR adds ${details.functions.length} new utility functions:\n\n${details.functions.map(f => '- ' + f.name).join('\n')}\n\nThese utilities provide commonly used helper functions.`;
  } else if (operationType === 'smallTweaks') {
    return `This PR includes small code cleanup changes:\n\n${details.changes.join('\n')}`;
  } else if (operationType === 'largerRefactors') {
    return `This PR refactors code for better maintainability:\n\n${details.changes.join('\n')}`;
  } else if (operationType === 'bigFeature') {
    return `This PR adds a major new feature: **${details.description}**\n\n## Changes\n\n- Added ${details.lines} lines of code\n- Created ${details.files.length} new files:\n\n${details.files.map(f => '  - \`' + f + '\`').join('\n')}\n\nThis is a substantial addition to the codebase that provides new functionality.`;
  }
  return 'Code updates';
}

async function main() {
  // Parse command-line arguments
  const args = process.argv.slice(2);
  let operationType;

  if (args.includes('--big-feature') || args.includes('--feature')) {
    operationType = 'bigFeature';
    console.log(`\n📋 Operation type: ${operationType} (forced by flag)`);
  } else if (args.includes('--big-refactor') || args.includes('--refactor')) {
    operationType = 'largerRefactors';
    console.log(`\n📋 Operation type: ${operationType} (forced by flag)`);
  } else if (args.includes('--small-tweaks') || args.includes('--tweaks')) {
    operationType = 'smallTweaks';
    console.log(`\n📋 Operation type: ${operationType} (forced by flag)`);
  } else if (args.includes('--add-utilities') || args.includes('--utilities')) {
    operationType = 'addUtilities';
    console.log(`\n📋 Operation type: ${operationType} (forced by flag)`);
  } else {
    // Select operation type randomly
    operationType = selectOperationType();
    console.log(`\n📋 Operation type: ${operationType}`);
  }

  // Generate branch name based on operation type
  const timestamp = Date.now();
  const branchPrefix = {
    smallTweaks: 'cleanup',
    addUtilities: 'feature/add-utilities',
    largerRefactors: 'refactor',
    bigFeature: 'feature/big'
  }[operationType];
  const branchName = `${branchPrefix}-${timestamp}`;

  console.log(`Creating branch: ${branchName}`);
  execSync(`git checkout -b ${branchName}`, { stdio: 'inherit' });

  // Execute the operation
  let details;
  if (operationType === 'smallTweaks') {
    details = executeSmallTweaks();
  } else if (operationType === 'addUtilities') {
    details = executeAddUtilities();
  } else if (operationType === 'largerRefactors') {
    details = executeLargerRefactors();
  } else if (operationType === 'bigFeature') {
    details = executeBigFeature();
  }

  // Check if any changes were made
  const hasChanges = details && (
    (details.changes && details.changes.length > 0) ||
    (details.functions && details.functions.length > 0) ||
    (details.files && details.files.length > 0)
  );

  if (!hasChanges) {
    console.log('\n⚠️  No changes were made. Aborting.');
    execSync('git checkout main', { stdio: 'inherit' });
    execSync(`git branch -D ${branchName}`, { stdio: 'inherit' });
    return;
  }

  // Stage and commit changes
  console.log('\nCommitting changes...');
  const commitMessage = generateCommitMessage(operationType, details);
  execSync('git add .', { stdio: 'inherit' });
  execSync(`git commit -m "${commitMessage.replace(/"/g, '\\"')}"`, { stdio: 'inherit' });

  // Push the branch
  console.log('\nPushing branch to remote...');
  execSync(`git push -u origin ${branchName}`, { stdio: 'inherit' });

  // Get GitHub project info
  const remoteUrl = execSync('git remote get-url origin').toString().trim();
  console.log(`\nRemote URL: ${remoteUrl}`);

  // Generate PR title with LLM
  console.log('\nGenerating PR title with LLM...');
  const prTitle = await generatePRTitle(operationType, details);
  console.log(`Generated title: ${prTitle}`);

  console.log('\nAttempting to create pull request...');

  try {
    const description = generatePRDescription(operationType, details);

    // Escape double quotes in title and description for shell command
    const escapedTitle = prTitle.replace(/"/g, '\\"');
    const escapedDescription = description.replace(/"/g, '\\"');

    const prOutput = execSync(
      `gh pr create --title "${escapedTitle}" --body "${escapedDescription}" --base main`,
      { encoding: 'utf-8' }
    );

    console.log('\n' + prOutput);

    const urlMatch = prOutput.match(/https:\/\/[^\s]+/);
    if (urlMatch) {
      console.log(`\n✅ Pull Request created successfully!`);
      console.log(`\n🔗 ${urlMatch[0]}`);
    }
  } catch (error) {
    console.log('\n⚠️  gh command not available or failed.');
    console.log(`\nBranch ${branchName} has been pushed successfully.`);
    console.log('\nTo create a pull request manually:');
    console.log(`1. Visit your GitHub repository`);
    console.log(`2. Click "Create pull request" for branch: ${branchName}`);
    console.log(`3. Target branch: main`);
  }
}

main().catch(error => {
  console.error('Error:', error.message);
  process.exit(1);
});
