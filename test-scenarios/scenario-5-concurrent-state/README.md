# Scenario 5: Concurrent File State Mismatch

## Bug Target
Bot references old line numbers in its analysis but posts comments using new line positions.

## The Race Condition
1. Bot fetches and analyzes `feature-original.js` (3 lines total)
2. Bot sees `return a + b;` on line 2
3. **Concurrent change occurs**: imports added to top of file
4. Bot tries to comment using new file state where the line is now line 5
5. Bot's comment references line 2 analysis but posts at line 5 position

## Expected Bug Behavior
- Bot analyzes the calculation on line 2 in the original file
- Concurrent changes add imports, shifting everything down
- Bot posts comment at line 5 (where the code moved) but references analysis from line 2
- This creates mismatch between comment content and actual line being referenced

## Files
- `feature-original.js` - Initial 3-line file
- `feature.js` - After concurrent import additions (5 lines)
- `utils.js` - Support file for imports
- `config.js` - Support file for imports

## Root Cause
Race condition between:
1. Bot's file analysis (using old line numbers)
2. File state when posting comments (using new line numbers)
3. GitHub API position calculations (potentially using different baseline)

This simulates real-world scenarios where files change between bot analysis and comment posting.