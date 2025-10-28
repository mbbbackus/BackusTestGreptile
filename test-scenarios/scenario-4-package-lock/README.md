# Scenario 4: Generated File Package-Lock Edge Case

## Bug Target
Bot tries to comment on line positions in package-lock.json that don't correspond to actual source lines, causing comments to appear on distant lines in src/index.js.

## Changes Made
1. `package.json`: Added `"lodash": "^4.17.21"` dependency
2. `package-lock.json`: Auto-generated 200+ lines of dependency tree
3. `src/index.js`: Changed `'Hello world'` → `'Hello universe'`

## Expected Bug Behavior
- Bot should comment only on line 1 in `src/index.js` where the string changed
- Instead, bot gets confused by the massive package-lock.json diff
- Bot incorrectly maps line positions from package-lock.json to src/index.js
- Comments appear on non-existent lines or completely unrelated positions

## Files
- `package-original.json` - Original without lodash
- `package.json` - With lodash dependency added
- `package-lock.json` - Large auto-generated file with 150+ lines
- `src/index-original.js` - Original "Hello world"
- `src/index.js` - Modified "Hello universe"

## Root Cause
Bot's line positioning algorithm gets overwhelmed by:
1. Large generated files with hundreds of line changes
2. Multiple files in single diff (package.json + package-lock.json + src/index.js)
3. Position calculations that reference the wrong file context
4. Auto-generated content confusing the actual source change detection