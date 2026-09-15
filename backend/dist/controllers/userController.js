"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNotificationSettings = exports.getNotificationSettings = exports.getUsers = void 0;
const db_1 = __importDefault(require("../config/db"));
const userService_1 = require("../services/userService");
const getUsers = async (req, res) => {
    try {
        const users = await (0, userService_1.getAssignableUsers)(req.user.id);
        return res.json({
            success: true,
            data: users,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error?.message ||
                "Unable to load users.",
        });
    }
};
exports.getUsers = getUsers;
const getNotificationSettings = async (req, res, next) => {
    try {
        const settings = await db_1.default.user.findUnique({
            where: {
                id: req.user.id,
            },
            select: {
                dueSoonNotifications: true,
                overdueNotifications: true,
                assignmentNotifications: true,
                statusNotifications: true,
                browserPopups: true,
                notificationSound: true,
                notificationRetentionDays: true,
            },
        });
        return res.json({
            success: true,
            data: settings,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getNotificationSettings = getNotificationSettings;
const updateNotificationSettings = async (req, res, next) => {
    try {
        const updated = await db_1.default.user.update({
            where: {
                id: req.user.id,
            },
            data: {
                dueSoonNotifications: req.body
                    .dueSoonNotifications,
                overdueNotifications: req.body
                    .overdueNotifications,
                assignmentNotifications: req.body
                    .assignmentNotifications,
                statusNotifications: req.body
                    .statusNotifications,
                browserPopups: req.body.browserPopups,
                notificationSound: req.body.notificationSound,
                notificationRetentionDays: req.body
                    .notificationRetentionDays,
            },
        });
        return res.json({
            success: true,
            data: updated,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateNotificationSettings = updateNotificationSettings;
