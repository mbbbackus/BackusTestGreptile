
class RandomApp {
  constructor(name) {
    this.name = name;
  }

  greet() {
    return `Hello from ${this.name}`;
  }

  add(a, b) {
    return a + b;
  }

  randomNumber() {
    return Math.floor(Math.random() * 10000);
  }
}
