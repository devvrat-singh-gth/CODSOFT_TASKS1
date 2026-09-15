"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeNotification = exports.markAllRead = exports.markRead = exports.getUnreadCount = exports.getAllNotifications = void 0;
const notificationService_1 = require("../services/notificationService");
const getAllNotifications = async (req, res) => {
    try {
        await (0, notificationService_1.generateDeadlineNotifications)(req.user.id);
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.min(Math.max(Number(req.query.limit) || 12, 1), 50);
        const unreadOnly = req.query.unread === "true";
        const result = await (0, notificationService_1.getNotifications)(req.user.id, page, limit, unreadOnly);
        return res.json({
            success: true,
            data: result.notifications,
            pagination: result.pagination,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error?.message ||
                "Unable to load notifications.",
        });
    }
};
exports.getAllNotifications = getAllNotifications;
const getUnreadCount = async (req, res) => {
    try {
        const count = await (0, notificationService_1.getUnreadNotificationCount)(req.user.id);
        return res.json({
            success: true,
            data: {
                count,
            },
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error?.message ||
                "Unable to load notification count.",
        });
    }
};
exports.getUnreadCount = getUnreadCount;
const markRead = async (req, res) => {
    try {
        const result = await (0, notificationService_1.markNotificationRead)(req.params.id, req.user.id);
        if (result.count === 0) {
            return res.status(404).json({
                success: false,
                message: "Notification not found.",
            });
        }
        return res.json({
            success: true,
            message: "Notification marked as read.",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error?.message ||
                "Unable to update notification.",
        });
    }
};
exports.markRead = markRead;
const markAllRead = async (req, res) => {
    try {
        await (0, notificationService_1.markAllNotificationsRead)(req.user.id);
        return res.json({
            success: true,
            message: "All notifications marked as read.",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error?.message ||
                "Unable to update notifications.",
        });
    }
};
exports.markAllRead = markAllRead;
const removeNotification = async (req, res) => {
    try {
        const result = await (0, notificationService_1.deleteNotification)(req.params.id, req.user.id);
        if (result.count === 0) {
            return res.status(404).json({
                success: false,
                message: "Notification not found.",
            });
        }
        return res.json({
            success: true,
            message: "Notification deleted.",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error?.message ||
                "Unable to delete notification.",
        });
    }
};
exports.removeNotification = removeNotification;
