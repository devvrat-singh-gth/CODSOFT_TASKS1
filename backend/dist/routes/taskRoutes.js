"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const authMiddleware_1 = require("../middleware/authMiddleware");
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const taskController_1 = require("../controllers/taskController");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.protect);
router.post("/", [
    (0, express_validator_1.body)("title")
        .trim()
        .notEmpty()
        .withMessage("Task title is required")
        .isLength({ max: 200 })
        .withMessage("Task title must be 200 characters or fewer"),
    (0, express_validator_1.body)("description")
        .optional({ nullable: true })
        .isString()
        .withMessage("Description must be a string")
        .isLength({ max: 2000 })
        .withMessage("Description must be 2000 characters or fewer"),
    (0, express_validator_1.body)("projectId")
        .trim()
        .notEmpty()
        .withMessage("Project ID is required"),
    (0, express_validator_1.body)("priority")
        .optional()
        .isIn([
        "LOW",
        "MEDIUM",
        "HIGH",
        "URGENT",
    ])
        .withMessage("Invalid priority"),
    (0, express_validator_1.body)("status")
        .optional()
        .isIn([
        "TODO",
        "IN_PROGRESS",
        "REVIEW",
        "DONE",
    ])
        .withMessage("Invalid task status"),
    (0, express_validator_1.body)("dueDate")
        .notEmpty()
        .withMessage("Due date is required")
        .isISO8601()
        .withMessage("Invalid due date"),
    (0, express_validator_1.body)("assignedToId")
        .optional({ nullable: true })
        .isString()
        .withMessage("Assigned user ID must be a string"),
], validationMiddleware_1.validate, taskController_1.createTask);
router.get("/", taskController_1.getTasks);
router.get("/:id", taskController_1.getTask);
router.put("/:id", [
    (0, express_validator_1.body)("title")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Title cannot be empty")
        .isLength({ max: 200 })
        .withMessage("Task title must be 200 characters or fewer"),
    (0, express_validator_1.body)("description")
        .optional({ nullable: true })
        .isString()
        .withMessage("Description must be a string")
        .isLength({ max: 2000 })
        .withMessage("Description must be 2000 characters or fewer"),
    (0, express_validator_1.body)("priority")
        .optional()
        .isIn([
        "LOW",
        "MEDIUM",
        "HIGH",
        "URGENT",
    ])
        .withMessage("Invalid priority"),
    (0, express_validator_1.body)("status")
        .optional()
        .isIn([
        "TODO",
        "IN_PROGRESS",
        "REVIEW",
        "DONE",
    ])
        .withMessage("Invalid task status"),
    (0, express_validator_1.body)("dueDate")
        .optional({ nullable: true })
        .isISO8601()
        .withMessage("Invalid due date"),
    (0, express_validator_1.body)("assignedToId")
        .optional({ nullable: true })
        .isString()
        .withMessage("Assigned user ID must be a string"),
], validationMiddleware_1.validate, taskController_1.updateTask);
router.delete("/:id", taskController_1.deleteTask);
exports.default = router;
