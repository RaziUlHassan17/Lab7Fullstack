const fs = require("fs");
const data = fs.readFileSync("students.txt", "utf8");
console.log(data);
