import { Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { sendSuccess } from "../utils/apiResponse";
import { AuthenticatedRequest } from "../types";
import * as authService from "../services/authService";

export const register = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const result = await authService.registerUser(req.body);
  sendSuccess(res, result, "Account created successfully", 201);
});

export const login = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const result = await authService.loginUser(req.body);
  sendSuccess(res, result, "Logged in successfully");
});

export const me = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const user = await authService.getCurrentUser(req.user!.userId);
  sendSuccess(res, user);
});
