"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const db_1 = __importDefault(require("../config/db"));
const jwt_1 = require("../utils/jwt");
const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader ||
            !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const token = authHeader.split(" ")[1];
        const decoded = (0, jwt_1.verifyToken)(token);
        const user = await db_1.default.user.findUnique({
            where: {
                id: decoded.userId,
            },
            select: {
                id: true,
                email: true,
                name: true,
                avatarUrl: true,
            },
        });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }
        req.user = user;
        next();
    }
    catch {
        return res.status(401).json({
            success: false,
            message: "Invalid token",
        });
    }
};
exports.protect = protect;
