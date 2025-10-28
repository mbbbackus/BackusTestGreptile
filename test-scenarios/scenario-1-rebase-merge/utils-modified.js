// After merge and subsequent modification - this is what causes the bug
function oldFunction() {
  return 42; // CHANGED: was return 1; - this small change should only affect this line
}

function helperFunction(x) {
  return x * 2;
}

// Added during merge commit - these lines can confuse the bot
function mergeAddedFunction() {
  return 'added during merge';
}

function anotherMergeFunction(a, b) {
  return a + b;
}

module.exports = {
  oldFunction,
  helperFunction,
  mergeAddedFunction,
  anotherMergeFunction
};