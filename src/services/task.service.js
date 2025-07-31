import Task from "../models/task.model.js";

// Create a new task
const createTask = async (
  userId,
  title,
  description,
  status,
  priority,
  category,
  points,
  dueDate
) => {
  const task = await Task.create({
    user: userId,
    title,
    description,
    status,
    priority,
    category, // Added category
    points, // Added points
    dueDate,
  });
  return task;
};

// Get all tasks for a specific user
const getTasksByUserId = async (userId) => {
  const tasks = await Task.find({ user: userId });
  return tasks;
};

// Get a single task by ID for a specific user
const getTaskById = async (taskId, userId) => {
  const task = await Task.findOne({ _id: taskId, user: userId });
  if (!task) {
    throw new Error("Task not found or not authorized");
  }
  return task;
};

// Update a task
const updateTask = async (taskId, userId, updateData) => {
  const task = await Task.findOne({ _id: taskId, user: userId });

  if (!task) {
    throw new Error("Task not found or not authorized");
  }

  // Update fields if they are provided in updateData
  task.title = updateData.title !== undefined ? updateData.title : task.title;
  task.description =
    updateData.description !== undefined
      ? updateData.description
      : task.description;
  task.status =
    updateData.status !== undefined ? updateData.status : task.status;
  task.priority =
    updateData.priority !== undefined ? updateData.priority : task.priority;
  task.category =
    updateData.category !== undefined ? updateData.category : task.category; // Added category
  task.points =
    updateData.points !== undefined ? updateData.points : task.points; // Added points
  task.dueDate =
    updateData.dueDate !== undefined ? updateData.dueDate : task.dueDate;

  const updatedTask = await task.save();
  return updatedTask;
};

// Delete a task
const deleteTask = async (taskId, userId) => {
  const task = await Task.findOne({ _id: taskId, user: userId });

  if (!task) {
    throw new Error("Task not found or not authorized");
  }

  await Task.deleteOne({ _id: taskId });
  return { message: "Task removed" };
};

export { createTask, getTasksByUserId, getTaskById, updateTask, deleteTask };
