import mongoose from "mongoose";

const taskSchema = mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
});

mongoose.models = {}

const Task = new mongoose.model("Task", taskSchema);

export default Task;
