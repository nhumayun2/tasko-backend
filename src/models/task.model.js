import mongoose from "mongoose";

const taskSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["To Do", "In Progress", "Done", "Pending", "Ongoing"],
      default: "To Do",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    category: {
      // Changed to enum
      type: String,
      enum: [
        "General",
        "Arts and Craft",
        "Nature",
        "Family",
        "Sport",
        "Friends",
        "Meditation",
        "Collaborative Task",
      ], // Figma categories
      default: "General",
      trim: true,
    },
    points: {
      type: Number,
      default: 0,
    },
    dueDate: {
      type: Date,
    },
    collaborators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
