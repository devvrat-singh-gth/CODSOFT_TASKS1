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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProject = exports.updateProject = exports.getProject = exports.getProjects = exports.createProject = void 0;
const projectService = __importStar(require("../services/projectService"));
const createProject = async (req, res) => {
    try {
        const { title, description } = req.body;
        const project = await projectService.createProject(title, description, req.user.id);
        res.status(201).json({
            success: true,
            data: project,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.createProject = createProject;
const getProjects = async (req, res) => {
    try {
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
        const result = await projectService.getProjects(req.user.id, page, limit);
        res.json({
            success: true,
            data: result.projects,
            pagination: result.pagination,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getProjects = getProjects;
const getProject = async (req, res) => {
    try {
        const projectId = req.params.id;
        const project = await projectService.getProjectById(projectId, req.user.id);
        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }
        res.json({
            success: true,
            data: project,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getProject = getProject;
const updateProject = async (req, res) => {
    try {
        const projectId = req.params.id;
        const result = await projectService.updateProject(projectId, req.user.id, req.body);
        if (result.count === 0) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }
        res.json({
            success: true,
            message: "Project updated",
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.updateProject = updateProject;
const deleteProject = async (req, res) => {
    try {
        const projectId = req.params.id;
        const result = await projectService.deleteProject(projectId, req.user.id);
        if (result.count === 0) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }
        res.json({
            success: true,
            message: "Project deleted",
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.deleteProject = deleteProject;
