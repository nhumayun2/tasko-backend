import express from "express";
import {
  createNewTaskController,
  getTasksController,
  getTaskByIdController,
  updateTaskController,
  deleteTaskController,
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

router
  .route("/:id")
  .get(protect, getTaskByIdController)
  .put(protect, taskValidationRules(), validate, updateTaskController) // Apply validation
  .delete(protect, deleteTaskController);

export default router;
