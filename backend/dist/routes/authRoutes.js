"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const rateLimit_1 = require("../middleware/rateLimit");
const router = (0, express_1.Router)();
router.post("/register", rateLimit_1.authLimiter, [
    (0, express_validator_1.body)("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ max: 100 })
        .withMessage("Name must be 100 characters or fewer"),
    (0, express_validator_1.body)("email")
        .trim()
        .isEmail()
        .withMessage("Valid email is required")
        .normalizeEmail(),
    (0, express_validator_1.body)("password")
        .isString()
        .isLength({ min: 6, max: 100 })
        .withMessage("Password must be between 6 and 100 characters"),
], validationMiddleware_1.validate, authController_1.register);
router.post("/login", rateLimit_1.authLimiter, [
    (0, express_validator_1.body)("email")
        .trim()
        .isEmail()
        .withMessage("Valid email is required")
        .normalizeEmail(),
    (0, express_validator_1.body)("password")
        .isString()
        .notEmpty()
        .withMessage("Password is required"),
], validationMiddleware_1.validate, authController_1.login);
router.get("/me", authMiddleware_1.protect, authController_1.getProfile);
exports.default = router;
