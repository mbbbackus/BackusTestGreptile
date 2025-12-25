#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');

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

function main() {
  // Generate a random branch name
  const timestamp = Date.now();
  const branchName = `feature/add-utilities-${timestamp}`;

  console.log(`Creating branch: ${branchName}`);
  execSync(`git checkout -b ${branchName}`, { stdio: 'inherit' });

  // Select 4+ random utility functions
  const numFunctions = Math.floor(Math.random() * 3) + 4; // 4-6 functions
  const shuffled = [...utilityFunctions].sort(() => Math.random() - 0.5);
  const selectedFunctions = shuffled.slice(0, numFunctions);

  console.log(`\nGenerating ${numFunctions} utility functions...`);

  // Create/modify files with the new functions
  const changedFiles = new Set();

  for (const func of selectedFunctions) {
    // Randomly decide which file to add to
    const fileOptions = ['src/utils.js', 'src/helpers.js', 'src/formatters.js', 'src/validators.js'];
    const targetFile = fileOptions[Math.floor(Math.random() * fileOptions.length)];

    let content;
    if (fs.existsSync(targetFile)) {
      content = fs.readFileSync(targetFile, 'utf-8');
      // Add function before module.exports
      const exportsIndex = content.lastIndexOf('module.exports');
      if (exportsIndex !== -1) {
        const beforeExports = content.slice(0, exportsIndex);
        const exportsSection = content.slice(exportsIndex);
        content = beforeExports + '\n' + func.code + '\n\n' + exportsSection;

        // Add to exports
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
      // Create new file
      content = `// Utility functions\n\n${func.code}\n\nmodule.exports = {\n  ${func.name}\n};\n`;
    }

    fs.writeFileSync(targetFile, content);
    changedFiles.add(targetFile);
    console.log(`  ✓ Added ${func.name} to ${targetFile}`);
  }

  // Stage and commit changes
  console.log('\nCommitting changes...');
  const functionNames = selectedFunctions.map(f => f.name).join(', ');
  const commitMessage = `Add utility functions: ${functionNames}

This commit adds ${numFunctions} new utility functions to enhance the utilities library:
${selectedFunctions.map(f => `- ${f.name}`).join('\n')}`;

  execSync('git add .', { stdio: 'inherit' });
  execSync(`git commit -m "${commitMessage.replace(/"/g, '\\"')}"`, { stdio: 'inherit' });

  // Push the branch
  console.log('\nPushing branch to remote...');
  execSync(`git push -u origin ${branchName}`, { stdio: 'inherit' });

  // Get GitHub project info
  const remoteUrl = execSync('git remote get-url origin').toString().trim();
  console.log(`\nRemote URL: ${remoteUrl}`);

  // Try to create PR with gh
  console.log('\nAttempting to create pull request...');

  try {
    const description = `This PR adds ${numFunctions} new utility functions to enhance our utilities library:\n\n${selectedFunctions.map(f => `- ${f.name}`).join('\n')}\n\nThese utilities provide commonly used helper functions for TypeScript/JavaScript projects.`;

    const prOutput = execSync(
      `gh pr create --title "Add ${numFunctions} utility functions" --body "${description}" --base main`,
      { encoding: 'utf-8' }
    );

    console.log('\n' + prOutput);

    // Extract PR URL from output
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

main();
