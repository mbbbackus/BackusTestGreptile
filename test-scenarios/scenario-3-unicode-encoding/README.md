# Scenario 3: Unicode/Encoding Line Misalignment

## Bug Target
Unicode/tab mixing causes bot to comment on lines 14-15 instead of the actual changed line 10.

## The Change
Only change: Line 10 `farewell: "Au revoir"` → `farewell: "À bientôt"`

## Character/Encoding Issues
- Line 7: Contains Unicode emoji 🌟 and accented characters (émojis)
- Line 10: Contains Unicode characters (À, û)
- Line 12: Deliberately mixed tabs and spaces for alignment confusion
- These encoding variations cause byte-vs-character counting mismatches

## Expected Bug Behavior
- Bot should comment only on line 10 where the French farewell message changed
- Instead, bot comments on lines 14-15 (Spanish section)
- Bug occurs because Unicode characters and mixed whitespace throw off line position calculations

## Files
- `i18n-original.js` - Original with "Au revoir"
- `i18n.js` - Modified with "À bientôt"

## Root Cause
Bot uses different character counting methods:
1. API diff uses byte positions
2. File analysis uses character positions
3. Unicode characters (émojis, accents) have different byte vs character lengths
4. Mixed tabs/spaces further complicate position calculations