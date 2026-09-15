"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const passport_1 = __importDefault(require("passport"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const projectRoutes_1 = __importDefault(require("./routes/projectRoutes"));
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
const oauthRoutes_1 = __importDefault(require("./routes/oauthRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const notificationRoutes_1 = __importDefault(require("./routes/notificationRoutes"));
require("./config/passport");
const errorMiddleware_1 = require("./middleware/errorMiddleware");
const app = (0, express_1.default)();
app.disable("x-powered-by");
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL,
}));
app.use(express_1.default.json({
    limit: "1mb",
}));
app.use(passport_1.default.initialize());
app.get("/", (_req, res) => {
    res.json({
        success: true,
        message: "Project Management API Running",
    });
});
app.use("/api/auth", authRoutes_1.default);
app.use("/api/oauth", oauthRoutes_1.default);
app.use("/api/projects", projectRoutes_1.default);
app.use("/api/tasks", taskRoutes_1.default);
app.use("/api/dashboard", dashboardRoutes_1.default);
app.use("/api/users", userRoutes_1.default);
app.use("/api/notifications", notificationRoutes_1.default);
// 404 handler
app.use((_req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});
// Error handler must be last
app.use(errorMiddleware_1.errorHandler);
const PORT = process.env.PORT || 5000;
const cleanupNotifications = async () => {
    try {
        const { deleteExpiredNotifications, } = await Promise.resolve().then(() => __importStar(require("./services/notificationService")));
        await deleteExpiredNotifications();
    }
    catch (error) {
        console.error("Notification cleanup failed:", error);
    }
};
const runDeadlineNotificationCheck = async () => {
    try {
        const users = await Promise.resolve().then(() => __importStar(require("./services/userService"))).then((module) => module.getAllUserIds());
        const { generateDeadlineNotifications, } = await Promise.resolve().then(() => __importStar(require("./services/notificationService")));
        for (const user of users) {
            await generateDeadlineNotifications(user.id);
        }
    }
    catch (error) {
        console.error("Deadline notification check failed:", error);
    }
};
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    void cleanupNotifications();
    void runDeadlineNotificationCheck();
    setInterval(() => {
        void cleanupNotifications();
        void runDeadlineNotificationCheck();
    }, 15 * 60 * 1000);
});
