import { Router } from "express";
import { body } from "express-validator";

import {
  getProfile,
  login,
  register,
} from "../controllers/authController";

import { protect } from "../middleware/authMiddleware";
import { validate } from "../middleware/validationMiddleware";
import { authLimiter } from "../middleware/rateLimit";

const router = Router();

router.post(
  "/register",
  authLimiter,
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ max: 100 })
      .withMessage("Name must be 100 characters or fewer"),

    body("email")
      .trim()
      .isEmail()
      .withMessage("Valid email is required")
      .normalizeEmail(),

    body("password")
      .isString()
      .isLength({ min: 6, max: 100 })
      .withMessage(
        "Password must be between 6 and 100 characters"
      ),
  ],
  validate,
  register
);

router.post(
  "/login",
  authLimiter,
  [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Valid email is required")
      .normalizeEmail(),

    body("password")
      .isString()
      .notEmpty()
      .withMessage("Password is required"),
  ],
  validate,
  login
);

router.get(
  "/me",
  protect,
  getProfile
);

export default router;