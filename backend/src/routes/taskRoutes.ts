import { Router } from "express";
import { body } from "express-validator";

import { protect } from "../middleware/authMiddleware";
import { validate } from "../middleware/validationMiddleware";

import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  updateTask,
} from "../controllers/taskController";

const router = Router();

router.use(protect);

router.post(
  "/",
  [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Task title is required")
      .isLength({ max: 200 })
      .withMessage(
        "Task title must be 200 characters or fewer"
      ),

    body("description")
      .optional({ nullable: true })
      .isString()
      .withMessage("Description must be a string")
      .isLength({ max: 2000 })
      .withMessage(
        "Description must be 2000 characters or fewer"
      ),

    body("projectId")
      .trim()
      .notEmpty()
      .withMessage("Project ID is required"),

    body("priority")
      .optional()
      .isIn([
        "LOW",
        "MEDIUM",
        "HIGH",
        "URGENT",
      ])
      .withMessage("Invalid priority"),

    body("status")
      .optional()
      .isIn([
        "TODO",
        "IN_PROGRESS",
        "REVIEW",
        "DONE",
      ])
      .withMessage("Invalid task status"),

body("dueDate")
  .notEmpty()
  .withMessage("Due date is required")
  .isISO8601()
  .withMessage("Invalid due date"),

    body("assignedToId")
      .optional({ nullable: true })
      .isString()
      .withMessage(
        "Assigned user ID must be a string"
      ),
  ],
  validate,
  createTask
);

router.get("/", getTasks);

router.get("/:id", getTask);

router.put(
  "/:id",
  [
    body("title")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Title cannot be empty")
      .isLength({ max: 200 })
      .withMessage(
        "Task title must be 200 characters or fewer"
      ),

    body("description")
      .optional({ nullable: true })
      .isString()
      .withMessage("Description must be a string")
      .isLength({ max: 2000 })
      .withMessage(
        "Description must be 2000 characters or fewer"
      ),

    body("priority")
      .optional()
      .isIn([
        "LOW",
        "MEDIUM",
        "HIGH",
        "URGENT",
      ])
      .withMessage("Invalid priority"),

    body("status")
      .optional()
      .isIn([
        "TODO",
        "IN_PROGRESS",
        "REVIEW",
        "DONE",
      ])
      .withMessage("Invalid task status"),

    body("dueDate")
      .optional({ nullable: true })
      .isISO8601()
      .withMessage("Invalid due date"),

    body("assignedToId")
      .optional({ nullable: true })
      .isString()
      .withMessage(
        "Assigned user ID must be a string"
      ),
  ],
  validate,
  updateTask
);

router.delete("/:id", deleteTask);

export default router;