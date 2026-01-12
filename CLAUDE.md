# BackusTestGreptile - PR Generation Script

## Overview

This repository contains `generate-pr.js`, a script that automatically generates PRs with code changes for volume testing purposes.

## generate-pr.js

**IMPORTANT**: The script is now located at `/Users/bbackus/Desktop/DummyRepos/generate-pr.js` (outside this repo).

Use the `genpr` alias to run it from any branch:
```bash
genpr --big-feature
genpr --add-utilities
# etc.
```

### What It Does

The script automatically:
1. Selects an operation type (weighted random or via flag)
2. Applies code changes to JS files in the repository
3. Creates a new branch with appropriate naming
4. Generates an LLM-powered PR title via Anthropic API
5. Commits changes and creates a PR via GitHub CLI

### Operation Types (Weighted Random Selection)

| Type | Weight | Description |
|------|--------|-------------|
| `smallTweaks` | 60% | Minor code quality changes (console.logs, TODOs, unused vars, blank lines, commented code) |
| `addUtilities` | 30% | Adds 4-6 new utility functions to files |
| `largerRefactors` | 10% | Structural changes (JSDoc comments, parameter renames, export reordering) |
| `bigFeature` | Flag only | Adds 1400+ line API reference documentation file |

### Branch Naming Conventions

- Small tweaks: `cleanup-{timestamp}`
- Add utilities: `feature/add-utilities-{timestamp}`
- Larger refactors: `refactor-{timestamp}`
- Big feature: `feature/big-{timestamp}`

### Environment Requirements

- `ANTHROPIC_API_KEY` - Required for LLM title generation (uses `claude-3-haiku-20240307`)
- GitHub CLI (`gh`) must be authenticated

### Running the Script

```bash
# Random operation type (weighted selection)
node generate-pr.js

# Force a specific operation type
node generate-pr.js --big-feature     # or --feature (1000+ lines)
node generate-pr.js --big-refactor    # or --refactor
node generate-pr.js --small-tweaks    # or --tweaks
node generate-pr.js --add-utilities   # or --utilities
```

### Key Implementation Details

- **LLM Title Generation**: Uses Anthropic API with operation-specific prompts. Falls back to default titles if API fails.
- **Small Tweaks**: Applies 2-4 random tweaks from the template pool
- **Add Utilities**: Adds 4-6 utility functions (original behavior)
- **Larger Refactors**: Applies 1-2 structural refactoring operations
- **Big Features**: Copies `big-feature-template.md` (1400+ lines) to `docs/API-REFERENCE.md`

### Files Modified

The script targets `.js` files in the repository, excluding `generate-pr.js` itself.
