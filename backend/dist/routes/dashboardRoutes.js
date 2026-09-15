"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const dashboardController_1 = require("../controllers/dashboardController");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.protect);
router.get("/", dashboardController_1.getDashboard);
exports.default = router;
