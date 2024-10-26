const { Todo, User } = require("../db/index");
// let todos = [
//   { id: 1, title: "sample todo", description: "this is my first todo" },
// ];

async function getAllTodo(req, res, next) {
  const username = req.user;
  try {
    const user = await User.findOne({ username });
    if (user) {
      const todos = await Todo.find({ user: user._id });
      res.status(200).json({ todos });
    } else {
      res.status(404).json({ msg: "user not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "error fetching todos" });
  }
}

async function createTodo(req, res, next) {
  // console.log(req.body);
  const { title, description, done, order, columnId } = req.body;
  // console.log(title, order, columnId);
  const username = req.user;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      res.status(404).json({ msg: "user not found" });
    }
    const newTodo = new Todo({
      title,
      description,
      done: done || false,
      order,
      user: user._id,
      columnId,
    });
    await newTodo.save();
    res.status(200).json({ msg: "todo created", todo: newTodo });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "error creating todo" });
  }
}
async function updateTodo(req, res, next) {
  const { title, description, done, order, columnId } = req.body;
  const todoId = req.params.id;
  try {
    const todo = await Todo.findById(todoId);
    if (!todo) {
      res.status(404).json({ msg: "could not find todo" });
    }
    if (title) todo.title = title;
    if (description) todo.description = description;
    if (typeof done !== "undefined") todo.done = done;
    if (order) todo.order = order;
    if (columnId) todo.columnId = columnId;

    await todo.save();
    res.status(200).json({ msg: "todo updated", todo });
  } catch (err) {
    res.status(500).json({ msg: "could not update todo" });
  }
}

// async function deleteTodo(req, res, next) {
//   //  write here
//   const id = req.params.id;
//   const index = todos.findIndex((t) => t.id == id);
//   console.log("index of todo" + index);
//   if (index > -1) {
//     todos.splice(index, 1);
//     res.status(200).json({ todos: todos });
//   } else {
//     res.status(404).json({ msg: "could not find todo" });
//   }
// }

async function deleteTodoById(req, res, next) {
  //  write here
  const todoId = req.params.id;
  try {
    const deletedTodo = await Todo.findByIdAndDelete(todoId);
    if (!deletedTodo) {
      res.status(404).json({ msg: "could not find todo" });
    } else {
      res.status(200).json({ msg: "deleted todo", todo: deletedTodo });
    }
  } catch (err) {
    res.status(500).json({ msg: "could not delete todo" });
  }
}

module.exports = {
  getAllTodo,
  createTodo,
  updateTodo,
  deleteTodoById,
};
