const mongoose = require("mongoose");
require("dotenv").config();
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

// Define schemas

const UserSchema = new Schema(
  {
    // Schema definition here
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // todos: [{ type: ObjectId, ref: "Todo" }],
  },
  { timestamps: true }
);

const TodoSchema = new Schema(
  {
    // Schema definition here
    title: { type: String, required: true, maxlength: 100 },
    description: { type: String, maxlength: 500 },
    done: { type: Boolean, default: false },
    order: { type: Number, required: true },
    user: { type: ObjectId, ref: "User" },
    columnId: { type: Number, required: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
const Todo = mongoose.model("Todo", TodoSchema);

module.exports = {
  User,
  Todo,
};
