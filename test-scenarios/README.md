# Code Review Bot Line Commenting Bug Test Scenarios

These scenarios are designed to trigger distant line commenting bugs in code review bots that use GitHub's REST API for positioning comments.

## 🎯 Priority Scenarios

### **Scenario 1: Rebase/Merge History Manipulation** ⭐
**Target**: Bot calculates wrong base commit, comments on merge content instead of actual changes
- Small change: `return 1;` → `return 42;`
- Expected bug: Comments on lines 14-18 (merge-added functions) instead of line 2
- **Root cause**: Complex git history confuses base commit selection

### **Scenario 3: Unicode/Encoding Line Misalignment** ⭐
**Target**: Unicode characters and mixed whitespace break line position calculations
- Small change: `"Au revoir"` → `"À bientôt"` (line 10)
- Expected bug: Comments on lines 14-15 (Spanish section) instead of line 10
- **Root cause**: Byte vs character counting mismatches with Unicode

## 📋 Complete Scenario List

| # | Scenario | Bug Target | Key Files |
|---|----------|------------|-----------|
| 1 | **Rebase/Merge History** | Wrong base commit calculation | `utils.js`, `utils-modified.js` |
| 2 | **Cross-File Dependencies** | Comments in unchanged imported files | `types.ts`, `user-service.ts` |
| 3 | **Unicode/Encoding** | Character counting misalignment | `i18n.js` |
| 4 | **Package-Lock Edge Case** | Generated file position confusion | `package.json`, `src/index.js` |
| 5 | **Concurrent State Mismatch** | Race condition between analysis and posting | `feature.js` |
| 6 | **Binary/Text File Mix** | Binary diffs affect text positioning | `src/app.js`, `assets/` |

## 🔍 Analysis Focus Areas

### Line Number Calculation Bugs
- `line` vs `position` vs `original_line` discrepancies (Scenarios 1, 3, 5)
- File content vs diff mismatch (Scenarios 2, 4)
- Generated content interference (Scenario 4)

### Character/Encoding Issues
- Unicode character byte length differences (Scenario 3)
- Mixed tab/space whitespace (Scenario 3)
- Binary file byte counting (Scenario 6)

### Git History Complexity
- Merge commit content confusion (Scenario 1)
- Force-push history rewrites (Scenario 1)
- Multiple file diff processing (Scenario 4)

### Cross-File Analysis
- Import/dependency chain triggering (Scenario 2)
- Pattern matching across files (Scenario 2)
- Concurrent file modifications (Scenario 5)

## 🧪 Testing Approach

1. **Start with Scenarios 1 & 3** - highest complexity, most likely to trigger bugs
2. **Use realistic git histories** - create actual commits and merges for Scenario 1
3. **Test with real Unicode** - ensure proper character encoding in Scenario 3
4. **Monitor API responses** - check `line`, `position`, `original_line` values
5. **Verify comment positioning** - confirm comments appear where expected vs actual

Each scenario includes original and modified versions of files to simulate realistic code review diffs that would trigger the bot's analysis and commenting logic.