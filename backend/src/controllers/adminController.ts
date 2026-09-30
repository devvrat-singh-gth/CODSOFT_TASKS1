import { Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { sendSuccess } from "../utils/apiResponse";
import { AuthenticatedRequest } from "../types";
import * as adminService from "../services/adminService";
import * as userService from "../services/userService";

export const getDashboard = catchAsync(async (_req: AuthenticatedRequest, res: Response) => {
  const stats = await adminService.getDashboardStats();
  sendSuccess(res, stats);
});

export const listUsers = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const result = await userService.listUsers(req.query as never);
  sendSuccess(res, result);
});

export const setUserActive = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const user = await userService.setUserActive(req.params.id, req.body.isActive);
  sendSuccess(res, user, "User status updated");
});

export const setUserRole = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const user = await userService.setUserRole(req.params.id, req.body.role);
  sendSuccess(res, user, "User role updated");
});
