"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.getTaskById = exports.getTasks = exports.createTask = void 0;
const db_1 = __importDefault(require("../config/db"));
const notificationService_1 = require("./notificationService");
const createTask = async (data, ownerId) => {
    const project = await db_1.default.project.findFirst({
        where: {
            id: data.projectId,
            ownerId,
        },
    });
    if (!project) {
        throw new Error("Project not found");
    }
    if (data.assignedToId) {
        const assignedUser = await db_1.default.user.findUnique({
            where: {
                id: data.assignedToId,
            },
        });
        if (!assignedUser) {
            throw new Error("Assigned user not found");
        }
    }
    const task = await db_1.default.task.create({
        data: {
            title: data.title,
            description: data.description,
            priority: data.priority,
            status: data.status,
            dueDate: data.dueDate
                ? new Date(data.dueDate)
                : undefined,
            projectId: data.projectId,
            assignedToId: data.assignedToId || undefined,
        },
    });
    await (0, notificationService_1.createNotification)({
        userId: ownerId,
        type: "TASK_CREATED",
        title: "Task created",
        message: `${task.title} was created.`,
        taskId: task.id,
        projectId: project.id,
    });
    if (data.assignedToId &&
        data.assignedToId !== ownerId) {
        await (0, notificationService_1.createNotification)({
            userId: data.assignedToId,
            type: "TASK_ASSIGNED",
            title: "Task assigned to you",
            message: `${task.title} was assigned to you in ${project.title}.`,
            taskId: task.id,
            projectId: project.id,
        });
    }
    return task;
};
exports.createTask = createTask;
const getTasks = async (ownerId, page, limit, search, status, priority) => {
    const skip = (page - 1) * limit;
    const where = {
        project: {
            ownerId,
        },
        ...(search && {
            title: {
                contains: search,
                mode: "insensitive",
            },
        }),
        ...(status && {
            status: status,
        }),
        ...(priority && {
            priority: priority,
        }),
    };
    const [tasks, total,] = await db_1.default.$transaction([
        db_1.default.task.findMany({
            where,
            include: {
                project: true,
                assignedTo: true,
            },
            orderBy: {
                createdAt: "desc",
            },
            skip,
            take: limit,
        }),
        db_1.default.task.count({
            where,
        }),
    ]);
    return {
        tasks,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};
exports.getTasks = getTasks;
const getTaskById = async (taskId, ownerId) => {
    return db_1.default.task.findFirst({
        where: {
            id: taskId,
            project: {
                ownerId,
            },
        },
        include: {
            project: true,
            assignedTo: true,
        },
    });
};
exports.getTaskById = getTaskById;
const updateTask = async (taskId, ownerId, data) => {
    if (data.assignedToId) {
        const assignedUser = await db_1.default.user.findUnique({
            where: {
                id: data.assignedToId,
            },
        });
        if (!assignedUser) {
            throw new Error("Assigned user not found");
        }
    }
    const existingTask = await db_1.default.task.findFirst({
        where: {
            id: taskId,
            project: {
                ownerId,
            },
        },
        include: {
            project: true,
        },
    });
    if (!existingTask) {
        return {
            count: 0,
        };
    }
    const updateData = {};
    if (data.title !== undefined) {
        updateData.title = data.title;
    }
    if (data.description !== undefined) {
        updateData.description =
            data.description;
    }
    if (data.priority !== undefined) {
        updateData.priority =
            data.priority;
    }
    if (data.status !== undefined) {
        updateData.status =
            data.status;
    }
    if (data.dueDate !== undefined) {
        updateData.dueDate =
            data.dueDate === null
                ? null
                : new Date(data.dueDate);
    }
    if (data.assignedToId !== undefined) {
        updateData.assignedToId =
            data.assignedToId;
    }
    const result = await db_1.default.task.updateMany({
        where: {
            id: taskId,
            project: {
                ownerId,
            },
        },
        data: updateData,
    });
    if (result.count === 0) {
        return result;
    }
    if (data.title !== undefined ||
        data.description !== undefined ||
        data.priority !== undefined ||
        data.dueDate !== undefined) {
        await (0, notificationService_1.createNotification)({
            userId: ownerId,
            type: "TASK_UPDATED",
            title: "Task updated",
            message: `${existingTask.title} was updated.`,
            taskId: existingTask.id,
            projectId: existingTask.projectId,
        });
    }
    const assignedToId = data.assignedToId !== undefined
        ? data.assignedToId
        : existingTask.assignedToId;
    const statusChanged = data.status !== undefined &&
        data.status !== existingTask.status;
    const assignmentChanged = data.assignedToId !== undefined &&
        data.assignedToId !==
            existingTask.assignedToId;
    if (assignmentChanged &&
        assignedToId &&
        assignedToId !== ownerId) {
        await (0, notificationService_1.createNotification)({
            userId: assignedToId,
            type: "TASK_ASSIGNED",
            title: "Task assigned to you",
            message: `${existingTask.title} was assigned to you in ${existingTask.project.title}.`,
            taskId: existingTask.id,
            projectId: existingTask.projectId,
        });
    }
    if (statusChanged &&
        assignedToId &&
        assignedToId !== ownerId) {
        const nextStatus = data.status;
        const isCompleted = nextStatus === "DONE";
        const readableStatus = nextStatus
            .replace(/_/g, " ")
            .toLowerCase();
        await (0, notificationService_1.createNotification)({
            userId: assignedToId,
            type: isCompleted
                ? "TASK_COMPLETED"
                : "TASK_STATUS_CHANGED",
            title: isCompleted
                ? "Task completed"
                : "Task status updated",
            message: isCompleted
                ? `${existingTask.title} was marked as completed.`
                : `${existingTask.title} is now ${readableStatus}.`,
            taskId: existingTask.id,
            projectId: existingTask.projectId,
        });
    }
    return result;
};
exports.updateTask = updateTask;
const deleteTask = async (taskId, ownerId) => {
    const task = await db_1.default.task.findFirst({
        where: {
            id: taskId,
            project: {
                ownerId,
            },
        },
    });
    if (!task) {
        return { count: 0 };
    }
    const result = await db_1.default.task.deleteMany({
        where: {
            id: taskId,
            project: {
                ownerId,
            },
        },
    });
    if (result.count > 0) {
        await (0, notificationService_1.createNotification)({
            userId: ownerId,
            type: "TASK_DELETED",
            title: "Task deleted",
            message: `${task.title} was deleted.`,
            taskId: task.id,
            projectId: task.projectId,
        });
    }
    return result;
};
exports.deleteTask = deleteTask;
