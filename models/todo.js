const mongoose = require('mongoose');
const toDoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'title 必填']
    },
    done: Boolean,
    createdAt: {
      type: Date,
      default: Date.now,
      select: false,
    } 
  },
  {
    versionKey: false
  }
)
const Todo = mongoose.model('Todo', toDoSchema);

module.exports = Todo;