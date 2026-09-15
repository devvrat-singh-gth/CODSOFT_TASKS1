"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProject = exports.updateProject = exports.getProjectById = exports.getProjects = exports.createProject = void 0;
const db_1 = __importDefault(require("../config/db"));
const notificationService_1 = require("./notificationService");
const createProject = async (title, description, ownerId) => {
    const project = await db_1.default.project.create({
        data: {
            title,
            description,
            ownerId,
        },
    });
    await (0, notificationService_1.createNotification)({
        userId: ownerId,
        type: "PROJECT_CREATED",
        title: "Project created",
        message: `${project.title} was created.`,
        projectId: project.id,
    });
    return project;
};
exports.createProject = createProject;
const getProjects = async (ownerId, page, limit) => {
    const skip = (page - 1) * limit;
    const where = {
        ownerId,
    };
    const [projects, total] = await db_1.default.$transaction([
        db_1.default.project.findMany({
            where,
            include: {
                tasks: true,
            },
            orderBy: {
                createdAt: "desc",
            },
            skip,
            take: limit,
        }),
        db_1.default.project.count({
            where,
        }),
    ]);
    return {
        projects,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};
exports.getProjects = getProjects;
const getProjectById = async (projectId, ownerId) => {
    return db_1.default.project.findFirst({
        where: {
            id: projectId,
            ownerId,
        },
        include: {
            tasks: true,
        },
    });
};
exports.getProjectById = getProjectById;
const updateProject = async (projectId, ownerId, data) => {
    const existingProject = await db_1.default.project.findFirst({
        where: {
            id: projectId,
            ownerId,
        },
    });
    if (!existingProject) {
        return { count: 0 };
    }
    const result = await db_1.default.project.updateMany({
        where: {
            id: projectId,
            ownerId,
        },
        data,
    });
    if (result.count > 0) {
        await (0, notificationService_1.createNotification)({
            userId: ownerId,
            type: "PROJECT_UPDATED",
            title: "Project updated",
            message: `${existingProject.title} was updated.`,
            projectId,
        });
    }
    return result;
};
exports.updateProject = updateProject;
const deleteProject = async (projectId, ownerId) => {
    const project = await db_1.default.project.findFirst({
        where: {
            id: projectId,
            ownerId,
        },
    });
    if (!project) {
        return { count: 0 };
    }
    const projectTitle = project.title;
    const result = await db_1.default.project.deleteMany({
        where: {
            id: projectId,
            ownerId,
        },
    });
    if (result.count > 0) {
        await (0, notificationService_1.createNotification)({
            userId: ownerId,
            type: "PROJECT_DELETED",
            title: "Project deleted",
            message: `${projectTitle} was deleted.`,
        });
    }
    return result;
};
exports.deleteProject = deleteProject;
