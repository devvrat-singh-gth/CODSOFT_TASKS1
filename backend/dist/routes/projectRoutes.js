"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const authMiddleware_1 = require("../middleware/authMiddleware");
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const projectController_1 = require("../controllers/projectController");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.protect);
router.post("/", [
    (0, express_validator_1.body)("title")
        .trim()
        .notEmpty()
        .withMessage("Project title is required")
        .isLength({ max: 200 })
        .withMessage("Project title must be 200 characters or fewer"),
    (0, express_validator_1.body)("description")
        .optional({ nullable: true })
        .isString()
        .withMessage("Description must be a string")
        .isLength({ max: 2000 })
        .withMessage("Description must be 2000 characters or fewer"),
], validationMiddleware_1.validate, projectController_1.createProject);
router.get("/", projectController_1.getProjects);
router.get("/:id", projectController_1.getProject);
router.put("/:id", [
    (0, express_validator_1.body)("title")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Title cannot be empty")
        .isLength({ max: 200 })
        .withMessage("Project title must be 200 characters or fewer"),
    (0, express_validator_1.body)("description")
        .optional({ nullable: true })
        .isString()
        .withMessage("Description must be a string")
        .isLength({ max: 2000 })
        .withMessage("Description must be 2000 characters or fewer"),
    (0, express_validator_1.body)("status")
        .optional()
        .isIn([
        "PLANNING",
        "IN_PROGRESS",
        "COMPLETED",
    ])
        .withMessage("Invalid project status"),
], validationMiddleware_1.validate, projectController_1.updateProject);
router.delete("/:id", projectController_1.deleteProject);
exports.default = router;
