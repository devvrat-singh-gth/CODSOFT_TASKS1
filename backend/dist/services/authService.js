"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = __importDefault(require("../config/db"));
const jwt_1 = require("../utils/jwt");
const sanitizeUser = (user) => {
    const { password, ...safeUser } = user;
    return safeUser;
};
const registerUser = async (name, email, password) => {
    const existingUser = await db_1.default.user.findUnique({
        where: { email },
    });
    if (existingUser) {
        throw new Error("User already exists");
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    const user = await db_1.default.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    });
    const token = (0, jwt_1.generateToken)(user.id);
    return {
        user: sanitizeUser(user),
        token,
    };
};
exports.registerUser = registerUser;
const loginUser = async (email, password) => {
    const user = await db_1.default.user.findUnique({
        where: { email },
    });
    if (!user || !user.password) {
        throw new Error("Invalid credentials");
    }
    const isMatch = await bcryptjs_1.default.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid credentials");
    }
    const token = (0, jwt_1.generateToken)(user.id);
    return {
        user: sanitizeUser(user),
        token,
    };
};
exports.loginUser = loginUser;
