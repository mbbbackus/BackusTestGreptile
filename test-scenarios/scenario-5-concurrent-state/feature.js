import { helper } from './utils';  // New line 1
import { config } from './config'; // New line 2

function calculate(a, b) {
  return a + b;  // Now line 5, but bot thinks it's line 2
}