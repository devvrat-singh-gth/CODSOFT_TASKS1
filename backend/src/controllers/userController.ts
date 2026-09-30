import { Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { sendSuccess } from "../utils/apiResponse";
import { AuthenticatedRequest } from "../types";
import * as userService from "../services/userService";

export const updateProfile = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const user = await userService.updateProfile(req.user!.userId, req.body, req.file);
  sendSuccess(res, user, "Profile updated");
});
