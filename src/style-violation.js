// Simple file that violates R006: Variable declarations must use const by default

let message = 'Hello World'; // Should be const
let apiEndpoint = 'https://api.example.com'; // Should be const
var userName = 'testUser'; // Should be const, and avoid var

function greet() {
  let greeting = 'Welcome!'; // Should be const
  return greeting;
}

module.exports = { greet };