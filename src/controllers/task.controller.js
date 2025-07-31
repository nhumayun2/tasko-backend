import {
  createTask,
  getTasksByUserId,
  getTaskById,
  updateTask,
  deleteTask,
} from "../services/task.service.js";

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createNewTaskController = async (req, res, next) => {
  try {
    const { title, description, status, priority, category, points, dueDate } =
      req.body; // Added category, points
    const task = await createTask(
      req.user._id,
      title,
      description,
      status,
      priority,
      category,
      points,
      dueDate
    );
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tasks for the authenticated user
// @route   GET /api/tasks
// @access  Private
const getTasksController = async (req, res, next) => {
  try {
    const tasks = await getTasksByUserId(req.user._id);
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskByIdController = async (req, res, next) => {
  try {
    const task = await getTaskById(req.params.id, req.user._id);
    res.json(task);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTaskController = async (req, res, next) => {
  try {
    const { title, description, status, priority, category, points, dueDate } =
      req.body; // Added category, points
    const updateData = {
      title,
      description,
      status,
      priority,
      category,
      points,
      dueDate,
    }; // Added category, points
    const updatedTask = await updateTask(
      req.params.id,
      req.user._id,
      updateData
    );
    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTaskController = async (req, res, next) => {
  try {
    const message = await deleteTask(req.params.id, req.user._id);
    res.json(message);
  } catch (error) {
    next(error);
  }
};

export {
  createNewTaskController,
  getTasksController,
  getTaskByIdController,
  updateTaskController,
  deleteTaskController,
};
