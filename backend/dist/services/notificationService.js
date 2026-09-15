"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNotification = exports.markAllNotificationsRead = exports.markNotificationRead = exports.getUnreadNotificationCount = exports.getNotifications = exports.generateDeadlineNotifications = exports.createNotification = exports.deleteExpiredNotifications = void 0;
const db_1 = __importDefault(require("../config/db"));
const getExpiryDate = (retentionDays) => {
    const date = new Date();
    date.setDate(date.getDate() + retentionDays);
    return date;
};
const deleteExpiredNotifications = async (userId) => {
    return db_1.default.notification.deleteMany({
        where: {
            expiresAt: {
                lte: new Date(),
            },
            ...(userId
                ? {
                    userId,
                }
                : {}),
        },
    });
};
exports.deleteExpiredNotifications = deleteExpiredNotifications;
const createNotification = async ({ userId, type, title, message, taskId, projectId, }) => {
    const user = await db_1.default.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            notificationRetentionDays: true,
        },
    });
    return db_1.default.notification.create({
        data: {
            userId,
            type,
            title,
            message,
            taskId,
            projectId,
            expiresAt: getExpiryDate(user?.notificationRetentionDays ??
                90),
        },
    });
};
exports.createNotification = createNotification;
const generateDeadlineNotifications = async (userId) => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setHours(tomorrow.getHours() + 24);
    const tasks = await db_1.default.task.findMany({
        where: {
            assignedToId: userId,
            status: {
                not: "DONE",
            },
            dueDate: {
                not: null,
            },
        },
        include: {
            project: true,
        },
    });
    for (const task of tasks) {
        if (!task.dueDate) {
            continue;
        }
        const dueDate = new Date(task.dueDate);
        const isOverdue = dueDate < now;
        const isDueSoon = dueDate >= now &&
            dueDate <= tomorrow;
        if (!isOverdue && !isDueSoon) {
            continue;
        }
        const type = isOverdue
            ? "TASK_OVERDUE"
            : "TASK_DUE_SOON";
        const existing = await db_1.default.notification.findFirst({
            where: {
                userId,
                taskId: task.id,
                type,
            },
        });
        if (existing) {
            continue;
        }
        await (0, exports.createNotification)({
            userId,
            type,
            title: isOverdue
                ? "Task overdue"
                : "Task due soon",
            message: isOverdue
                ? `${task.title} is overdue.`
                : `${task.title} is due within the next 24 hours.`,
            taskId: task.id,
            projectId: task.projectId,
        });
    }
};
exports.generateDeadlineNotifications = generateDeadlineNotifications;
const getNotifications = async (userId, page, limit, unreadOnly = false) => {
    await (0, exports.deleteExpiredNotifications)(userId);
    const skip = (page - 1) * limit;
    const where = {
        userId,
        ...(unreadOnly
            ? {
                readAt: null,
            }
            : {}),
    };
    const [notifications, total,] = await db_1.default.$transaction([
        db_1.default.notification.findMany({
            where,
            include: {
                task: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
                project: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            skip,
            take: limit,
        }),
        db_1.default.notification.count({
            where,
        }),
    ]);
    return {
        notifications,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};
exports.getNotifications = getNotifications;
const getUnreadNotificationCount = async (userId) => {
    await (0, exports.deleteExpiredNotifications)(userId);
    return db_1.default.notification.count({
        where: {
            userId,
            readAt: null,
        },
    });
};
exports.getUnreadNotificationCount = getUnreadNotificationCount;
const markNotificationRead = async (notificationId, userId) => {
    return db_1.default.notification.updateMany({
        where: {
            id: notificationId,
            userId,
        },
        data: {
            readAt: new Date(),
        },
    });
};
exports.markNotificationRead = markNotificationRead;
const markAllNotificationsRead = async (userId) => {
    return db_1.default.notification.updateMany({
        where: {
            userId,
            readAt: null,
        },
        data: {
            readAt: new Date(),
        },
    });
};
exports.markAllNotificationsRead = markAllNotificationsRead;
const deleteNotification = async (notificationId, userId) => {
    return db_1.default.notification.deleteMany({
        where: {
            id: notificationId,
            userId,
        },
    });
};
exports.deleteNotification = deleteNotification;
