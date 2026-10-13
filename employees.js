// Task 2: Read employees.json, display the employees, add one employee, and save it.
const fs = require("fs");
const FILE = "employees.json";
const employees = JSON.parse(fs.readFileSync(FILE, "utf8"));

console.log("Current employees:");
console.log(employees);

// Add a sample employee only if this ID is not already present, so rerunning is safe.
const nextId = employees.length ? Math.max(...employees.map(employee => employee.id)) + 1 : 1;
if (!employees.some(employee => employee.name === "Hamza Iqbal")) {
  employees.push({ id: nextId, name: "Hamza Iqbal", position: "Backend Developer", salary: 80000 });
  fs.writeFileSync(FILE, JSON.stringify(employees, null, 2) + "\n", "utf8");
  console.log("Added Hamza Iqbal and updated employees.json.");
} else {
  console.log("Sample employee already exists; no duplicate was added.");
}
console.log("Updated employee count:", employees.length);
