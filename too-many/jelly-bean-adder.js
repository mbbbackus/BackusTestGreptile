class Calculator {
    constructor() {
        this.result = 0;
    }

    add(a, b) {
        return a + b;
    }

    subtract(a, b) {
        return a - b;
    }

    multiply(a, b) {
        return a * b;
    }

    divide(a, b) {
        if (b === 0) {
            throw new Error("Division by zero is not allowed");
        }
        return a / b;
    }

    power(a, b) {
        return Math.pow(a, b);
    }

    sqrt(a) {
        if (a < 0) {
            throw new Error("Square root of negative number is not allowed");
        }
        return Math.sqrt(a);
    }

    percentage(a, b) {
        return (a / 100) * b;
    }

    calculate(expression) {
        try {
            this.result = Function('"use strict"; return (' + expression + ')')();
            return this.result;
        } catch (error) {
            throw new Error("Invalid expression");
        }
    }

    clear() {
        this.result = 0;
        return this.result;
    }

    getResult() {
        return this.result;
    }
}

function runCalculatorDemo() {
    const calc = new Calculator();
    
    console.log("=== Calculator Demo ===");
    console.log("Addition: 5 + 3 =", calc.add(5, 3));
    console.log("Subtraction: 10 - 4 =", calc.subtract(10, 4));
    console.log("Multiplication: 6 * 7 =", calc.multiply(6, 7));
    console.log("Division: 15 / 3 =", calc.divide(15, 3));
    console.log("Power: 2^3 =", calc.power(2, 3));
    console.log("Square root: √16 =", calc.sqrt(16));
    console.log("Percentage: 20% of 150 =", calc.percentage(20, 150));
    
    console.log("\n=== Expression Calculator ===");
    console.log("Expression: (5 + 3) * 2 =", calc.calculate("(5 + 3) * 2"));
    console.log("Expression: 100 / (2 + 3) =", calc.calculate("100 / (2 + 3)"));
    
    console.log("\nCurrent result:", calc.getResult());
    calc.clear();
    console.log("After clear:", calc.getResult());
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Calculator;
} else if (typeof window !== 'undefined') {
    window.Calculator = Calculator;
}

if (typeof require !== 'undefined' && require.main === module) {
    runCalculatorDemo();
}