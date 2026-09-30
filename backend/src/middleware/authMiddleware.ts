import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types";
import { verifyToken } from "../utils/generateToken";
import { ApiError } from "../utils/apiError";
import { catchAsync } from "../utils/catchAsync";
import User from "../models/User";

// Identifies the caller from the Bearer token and attaches { userId, role } to req.user.
// Every downstream handler treats req.user as the only source of truth for identity —
// never a body/query field like userId sent by the client.
export const protect = catchAsync(
  async (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      throw ApiError.unauthorized("Authentication token missing");
    }

    const token = header.split(" ")[1];
    const payload = verifyToken(token);

    const user = await User.findById(payload.userId).select("_id isActive role");
    if (!user || !user.isActive) {
      throw ApiError.unauthorized("Account not found or deactivated");
    }

    req.user = { userId: payload.userId, role: payload.role };
    next();
  }
);
