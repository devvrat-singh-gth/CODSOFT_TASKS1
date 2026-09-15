import { Request, Response } from "express";
import * as projectService from "../services/projectService";

export const createProject = async (
  req: Request,
  res: Response
) => {
  try {
    const { title, description } = req.body;
    const project =
      await projectService.createProject(
        title,
        description,
        req.user!.id
      );

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
export const getProjects = async (
  req: Request,
  res: Response
) => {
  try {
    const page =
      Math.max(Number(req.query.page) || 1, 1);

    const limit =
      Math.min(
        Math.max(Number(req.query.limit) || 10, 1),
        100
      );

    const result =
      await projectService.getProjects(
        req.user!.id,
        page,
        limit
      );

    res.json({
      success: true,
      data: result.projects,
      pagination: result.pagination,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProject = async (
  req: Request,
  res: Response
) => {
  try {
    const projectId = req.params.id as string;
    const project =
      await projectService.getProjectById(
        projectId,
        req.user!.id
      );

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
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProject = async (
  req: Request,
  res: Response
) => {
  try {
    const projectId =
      req.params.id as string;

    const result =
      await projectService.updateProject(
        projectId,
        req.user!.id,
        req.body
      );

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
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
export const deleteProject = async (
  req: Request,
  res: Response
) => {
  try {
    const projectId =
      req.params.id as string;

    const result =
      await projectService.deleteProject(
        projectId,
        req.user!.id
      );

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
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};