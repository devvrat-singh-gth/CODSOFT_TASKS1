import { Router } from "express";
import { body } from "express-validator";

import { protect } from "../middleware/authMiddleware";
import { validate } from "../middleware/validationMiddleware";

import {
  createProject,
  deleteProject,
  getProject,
  getProjects,
  updateProject,
} from "../controllers/projectController";

const router = Router();

router.use(protect);

router.post(
  "/",
  [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Project title is required")
      .isLength({ max: 200 })
      .withMessage(
        "Project title must be 200 characters or fewer"
      ),

    body("description")
      .optional({ nullable: true })
      .isString()
      .withMessage("Description must be a string")
      .isLength({ max: 2000 })
      .withMessage(
        "Description must be 2000 characters or fewer"
      ),
  ],
  validate,
  createProject
);

router.get("/", getProjects);

router.get("/:id", getProject);

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
        "Project title must be 200 characters or fewer"
      ),

    body("description")
      .optional({ nullable: true })
      .isString()
      .withMessage("Description must be a string")
      .isLength({ max: 2000 })
      .withMessage(
        "Description must be 2000 characters or fewer"
      ),

    body("status")
      .optional()
      .isIn([
        "PLANNING",
        "IN_PROGRESS",
        "COMPLETED",
      ])
      .withMessage("Invalid project status"),
  ],
  validate,
  updateProject
);

router.delete("/:id", deleteProject);

export default router;