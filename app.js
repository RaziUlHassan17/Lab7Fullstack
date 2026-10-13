// Task 1: Import and use the calculator module.
const calculator = require("./calculator");

console.log("Addition:", calculator.add(10, 5));
console.log("Subtraction:", calculator.subtract(10, 5));
console.log("Multiplication:", calculator.multiply(10, 5));
console.log("Division:", calculator.divide(10, 5));

try {
  console.log("Division by zero:", calculator.divide(10, 0));
} catch (error) {
  console.log("Error:", error.message);
}
