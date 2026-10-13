// Assignment: Book Management REST API with JSON file persistence.
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, "books.json");
app.use(express.json());
let books = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
function saveBooks() { fs.writeFileSync(DATA_FILE, JSON.stringify(books, null, 2) + "\n", "utf8"); }
function validBook(body) {
  return body && typeof body.title === "string" && body.title.trim() &&
    typeof body.author === "string" && body.author.trim() &&
    typeof body.price === "number" && Number.isFinite(body.price) && body.price >= 0;
}

app.get("/", (req, res) => res.json({ message: "Book Management API", endpoints: ["GET /books", "GET /books/:id", "POST /books", "PUT /books/:id", "DELETE /books/:id"] }));
app.get("/books", (req, res) => res.status(200).json(books));
app.get("/books/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.status(400).json({ message: "Book ID must be a positive integer" });
  const book = books.find(item => item.id === id);
  if (!book) return res.status(404).json({ message: "Book not found" });
  return res.status(200).json(book);
});
app.post("/books", (req, res) => {
  if (!validBook(req.body)) return res.status(400).json({ message: "title and author must be non-empty strings and price must be a non-negative number" });
  const id = books.length ? Math.max(...books.map(item => item.id)) + 1 : 1;
  const book = { id, title: req.body.title.trim(), author: req.body.author.trim(), price: req.body.price };
  books.push(book); saveBooks();
  return res.status(201).json(book);
});
app.put("/books/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.status(400).json({ message: "Book ID must be a positive integer" });
  const book = books.find(item => item.id === id);
  if (!book) return res.status(404).json({ message: "Book not found" });
  if (!validBook(req.body)) return res.status(400).json({ message: "title and author must be non-empty strings and price must be a non-negative number" });
  book.title = req.body.title.trim(); book.author = req.body.author.trim(); book.price = req.body.price;
  saveBooks();
  return res.status(200).json(book);
});
app.delete("/books/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.status(400).json({ message: "Book ID must be a positive integer" });
  const index = books.findIndex(item => item.id === id);
  if (index === -1) return res.status(404).json({ message: "Book not found" });
  const [deletedBook] = books.splice(index, 1); saveBooks();
  return res.status(200).json({ message: "Book deleted successfully", book: deletedBook });
});
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && "body" in err) return res.status(400).json({ message: "Invalid JSON request body" });
  console.error(err); return res.status(500).json({ message: "Internal server error" });
});
app.listen(PORT, () => console.log(`Book API running at http://localhost:${PORT}`));
