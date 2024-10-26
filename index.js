const express = require("express");
const cors = require("cors");
const {
  getAllTodo,
  createTodo,
  updateTodo,
  deleteTodoById,
} = require("./routes/todo"); // importing callback functions for routes

const { signin, signup, me, auth } = require("./routes/user");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Get all todos
app.get("/todos", auth, getAllTodo);

// Add a new todo
app.post("/todos", auth, createTodo);

// Update a todo
app.put("/todos/:id", auth, updateTodo);

// Delete a todo
app.delete("/todos/:id", auth, deleteTodoById);

app.post("/signup", signup);

app.post("/signin", signin);

app.get("/me", auth, me);

// TODO: can you implement search todo route ???

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
