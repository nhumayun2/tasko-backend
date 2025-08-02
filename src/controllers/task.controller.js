import {
  createTask,
  getTasksByUserId,
  getTaskById,
  updateTask,
  deleteTask,
} from "../services/task.service.js";

// @desc  Create a new task
// @route POST /api/tasks
// @access Private
const createNewTaskController = async (req, res, next) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      category,
      points,
      dueDate,
      collaborators,
    } = req.body;
    const task = await createTask(
      req.user._id,
      title,
      description,
      status,
      priority,
      category,
      points,
      dueDate,
      collaborators // Pass the new collaborators field
    );
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

// @desc  Get all tasks for the authenticated user
// @route GET /api/tasks
// @access Private
const getTasksController = async (req, res, next) => {
  try {
    const tasks = await getTasksByUserId(req.user._id);
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

// @desc  Get all collaborative tasks for the authenticated user
// @route GET /api/tasks/collaborative
// @access Private
const getCollaborativeTasksController = async (req, res, next) => {
  try {
    const userId = req.user._id;
    // Find tasks where the user is either the owner or a collaborator
    const tasks = await Task.find({
      $or: [{ user: userId }, { collaborators: userId }],
    });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

// @desc  Get a single task by ID
// @route GET /api/tasks/:id
// @access Private
const getTaskByIdController = async (req, res, next) => {
  try {
    const task = await getTaskById(req.params.id, req.user._id);
    res.json(task);
  } catch (error) {
    next(error);
  }
};

// @desc  Update a task
// @route PUT /api/tasks/:id
// @access Private
const updateTaskController = async (req, res, next) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      category,
      points,
      dueDate,
      collaborators,
    } = req.body;
    const updateData = {
      title,
      description,
      status,
      priority,
      category,
      points,
      dueDate,
      collaborators, // Pass the new collaborators field
    };
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

// @desc  Delete a task
// @route DELETE /api/tasks/:id
// @access Private
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
  getCollaborativeTasksController,
};
