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

// Generate commit message based on operation type
function generateCommitMessage(operationType, details) {
  if (operationType === 'addUtilities') {
    const functionNames = details.functions.map(f => f.name).join(', ');
    return `Add utility functions: ${functionNames}\n\nThis commit adds ${details.functions.length} new utility functions.`;
  } else if (operationType === 'smallTweaks') {
    return `Code cleanup: small fixes\n\nChanges:\n${details.changes.join('\n')}`;
  } else if (operationType === 'largerRefactors') {
    return `Refactor: code improvements\n\nChanges:\n${details.changes.join('\n')}`;
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
  }
  return 'Code updates';
}

async function main() {
  // Select operation type
  const operationType = selectOperationType();
  console.log(`\n📋 Operation type: ${operationType}`);

  // Generate branch name based on operation type
  const timestamp = Date.now();
  const branchPrefix = {
    smallTweaks: 'cleanup',
    addUtilities: 'feature/add-utilities',
    largerRefactors: 'refactor'
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
  }

  // Check if any changes were made
  if (!details || (details.changes && details.changes.length === 0) || (details.functions && details.functions.length === 0)) {
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
