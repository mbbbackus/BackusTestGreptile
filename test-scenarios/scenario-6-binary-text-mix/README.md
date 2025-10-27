# Scenario 6: Binary/Text File Mix

## Bug Target
Binary diff processing affects line positioning calculations for text files.

## File Structure
- **Binary files**: `assets/logo.png`, `assets/icon.jpg` (simulate image updates)
- **Text files**: `src/app.js`, `src/component.js` (actual code changes)

## Changes Made
1. `src/app.js` line 7: `<h1>Welcome!</h1>` → `<h1>Welcome to our app!</h1>`
2. `src/component.js` line 13: `console.log('loaded')` → `console.log('Image loaded successfully')`
3. Binary files are also "changed" (different binary content)

## Expected Bug Behavior
- Bot should comment only on lines 7 and 13 in the respective JS files
- Instead, binary file processing interferes with line number calculations
- Bot comments appear at incorrect line positions in text files
- For example, bot might comment on line 3 in `app.js` instead of line 7

## Files
- `assets/logo.png` - Simulated binary image file
- `assets/icon.jpg` - Another binary file
- `src/app-original.js` - Original app component
- `src/app.js` - Modified app component
- `src/component-original.js` - Original image component
- `src/component.js` - Modified image component

## Root Cause
Bot's diff processing algorithm handles binary and text files differently:
1. Binary files generate large byte-based diffs
2. Text files use line-based diffs
3. When processing mixed diffs, byte positions from binary files interfere with line positions in text files
4. This causes misalignment between actual changed lines and where comments are posted

This scenario tests edge cases where repos contain both binary assets and source code changes in the same PR.