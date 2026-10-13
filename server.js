// Student Management REST API (Task 3 plus CRUD and validation).
// Data is loaded from students.json and persisted after every successful change.
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "students.json");
app.use(express.json());

function loadStudents() {
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}
let students = loadStudents();
function saveStudents() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(students, null, 2) + "\n", "utf8");
}
function validStudentInput(body) {
  return body && typeof body.name === "string" && body.name.trim() &&
    typeof body.department === "string" && body.department.trim();
}

app.get("/", (req, res) => res.json({ message: "Student Management API", endpoints: ["GET /students", "GET /students/:id", "POST /students", "PUT /students/:id", "DELETE /students/:id", "GET /students/department/:department"] }));

app.get("/students", (req, res) => res.status(200).json(students));

// Department route is declared before /students/:id for clarity.
app.get("/students/department/:department", (req, res) => {
  const department = req.params.department.toLowerCase();
  const result = students.filter(student => student.department.toLowerCase() === department);
  return res.status(200).json(result);
});

app.get("/students/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.status(400).json({ message: "Student ID must be a positive integer" });
  const student = students.find(item => item.id === id);
  if (!student) return res.status(404).json({ message: "Student not found" });
  return res.status(200).json(student);
});

app.post("/students", (req, res) => {
  if (!validStudentInput(req.body)) return res.status(400).json({ message: "name and department are required as non-empty strings" });
  const newId = students.length ? Math.max(...students.map(item => item.id)) + 1 : 1;
  const newStudent = { id: newId, name: req.body.name.trim(), department: req.body.department.trim() };
  students.push(newStudent);
  saveStudents();
  return res.status(201).json(newStudent);
});

app.put("/students/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.status(400).json({ message: "Student ID must be a positive integer" });
  const student = students.find(item => item.id === id);
  if (!student) return res.status(404).json({ message: "Student not found" });
  if (!validStudentInput(req.body)) return res.status(400).json({ message: "name and department are required as non-empty strings" });
  student.name = req.body.name.trim();
  student.department = req.body.department.trim();
  saveStudents();
  return res.status(200).json(student);
});

app.delete("/students/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.status(400).json({ message: "Student ID must be a positive integer" });
  const index = students.findIndex(item => item.id === id);
  if (index === -1) return res.status(404).json({ message: "Student not found" });
  const [deletedStudent] = students.splice(index, 1);
  saveStudents();
  return res.status(200).json({ message: "Student deleted successfully", student: deletedStudent });
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && "body" in err) return res.status(400).json({ message: "Invalid JSON request body" });
  console.error(err);
  return res.status(500).json({ message: "Internal server error" });
});

app.listen(PORT, () => console.log(`Student API running at http://localhost:${PORT}`));
