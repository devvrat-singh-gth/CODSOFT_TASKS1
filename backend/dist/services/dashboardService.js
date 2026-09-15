"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = void 0;
const db_1 = __importDefault(require("../config/db"));
const getDashboardStats = async (ownerId) => {
    const [projects, tasks, completed, pending, overdue, todo, inProgress, review, done,] = await Promise.all([
        db_1.default.project.count({
            where: {
                ownerId,
            },
        }),
        db_1.default.task.count({
            where: {
                project: {
                    ownerId,
                },
            },
        }),
        db_1.default.task.count({
            where: {
                status: "DONE",
                project: {
                    ownerId,
                },
            },
        }),
        db_1.default.task.count({
            where: {
                status: {
                    not: "DONE",
                },
                project: {
                    ownerId,
                },
            },
        }),
        db_1.default.task.count({
            where: {
                dueDate: {
                    lt: new Date(),
                },
                status: {
                    not: "DONE",
                },
                project: {
                    ownerId,
                },
            },
        }),
        db_1.default.task.count({
            where: {
                status: "TODO",
                project: {
                    ownerId,
                },
            },
        }),
        db_1.default.task.count({
            where: {
                status: "IN_PROGRESS",
                project: {
                    ownerId,
                },
            },
        }),
        db_1.default.task.count({
            where: {
                status: "REVIEW",
                project: {
                    ownerId,
                },
            },
        }),
        db_1.default.task.count({
            where: {
                status: "DONE",
                project: {
                    ownerId,
                },
            },
        }),
    ]);
    return {
        projects,
        tasks,
        completed,
        pending,
        overdue,
        taskStatus: {
            todo,
            inProgress,
            review,
            done,
        },
    };
};
exports.getDashboardStats = getDashboardStats;
