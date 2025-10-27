# Scenario 1: Rebase/Merge History Manipulation

## Bug Target
Bot calculates wrong base commit, comments on lines from merge commit instead of actual changes.

## Simulation Steps
1. Create feature branch with `utils.js` containing `function oldFunction() { return 1; }`
2. Progress main branch with `main-feature.js` and `config.js`
3. Create merge commit combining both branches (adds `mergeAddedFunction`)
4. Make small change: `return 1;` → `return 42;` in `oldFunction`
5. Force-push history rewrite

## Expected Bug Behavior
- Bot should comment only on line 2 where `return 1;` changes to `return 42;`
- Instead, bot comments on lines 14-18 (the merge-added functions) due to wrong base commit calculation
- Bot confuses the merge commit content with the actual diff

## Files
- `utils.js` - Original file
- `utils-modified.js` - After merge + subsequent change
- `main-feature.js` - Main branch progress
- `config.js` - Main branch progress