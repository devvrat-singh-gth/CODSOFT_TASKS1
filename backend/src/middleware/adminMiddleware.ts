import { Response, NextFunction } from "express";
import { AuthenticatedRequest, UserRole } from "../types";
import { ApiError } from "../utils/apiError";

// Must run after `protect`. Backend-side enforcement — never rely on the frontend
// hiding admin buttons.
export function requireAdmin(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== UserRole.ADMIN) {
    throw ApiError.forbidden("Admin access required");
  }
  next();
}
