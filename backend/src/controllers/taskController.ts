import { Request, Response } from "express";
import * as taskService from "../services/taskService";

export const createTask = async (
  req: Request,
  res: Response
) => {
  try {
    const task = await taskService.createTask(
      req.body,
      req.user!.id
    );

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getTasks = async (
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

    const search =
      req.query.search as string | undefined;

    const status =
      req.query.status as string | undefined;

    const priority =
      req.query.priority as string | undefined;

    const result =
      await taskService.getTasks(
        req.user!.id,
        page,
        limit,
        search,
        status,
        priority
      );

    res.json({
      success: true,
      data: result.tasks,
      pagination: result.pagination,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getTask = async (
  req: Request,
  res: Response
) => {
  try {
    const task =
      await taskService.getTaskById(
        req.params.id as string,
        req.user!.id
      );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.json({
      success: true,
      data: task,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
export const updateTask = async (
  req: Request,
  res: Response
) => {
  try {
    const result =
      await taskService.updateTask(
        req.params.id as string,
        req.user!.id,
        req.body
      );

    if (result.count === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.json({
      success: true,
      message: "Task updated",
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
export const deleteTask = async (
  req: Request,
  res: Response
) => {
  try {
    const result =
      await taskService.deleteTask(
        req.params.id as string,
        req.user!.id
      );

    if (result.count === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.json({
      success: true,
      message: "Task deleted",
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};