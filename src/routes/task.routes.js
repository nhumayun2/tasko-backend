import express from "express";
import {
  createNewTaskController,
  getTasksController,
  getTaskByIdController,
  updateTaskController,
  deleteTaskController,
  getCollaborativeTasksController, // Import the new controller
} from "../controllers/task.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import {
  taskValidationRules,
  validate,
} from "../middlewares/validation.middleware.js"; // Import task validation

const router = express.Router();

// All task routes are protected
router
  .route("/")
  .post(protect, taskValidationRules(), validate, createNewTaskController) // Apply validation
  .get(protect, getTasksController);

// New route to get collaborative tasks
router.route("/collaborative").get(protect, getCollaborativeTasksController);

router
  .route("/:id")
  .get(protect, getTaskByIdController)
  .put(protect, taskValidationRules(), validate, updateTaskController) // Apply validation
  .delete(protect, deleteTaskController);

export default router;
