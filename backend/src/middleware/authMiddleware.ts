import {
  NextFunction,
  Request,
  Response,
} from "express";

import prisma from "../config/db";
import { verifyToken } from "../utils/jwt";

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader =
      req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const token =
      authHeader.split(" ")[1];

    const decoded =
      verifyToken(token);

    const user =
      await prisma.user.findUnique({
        where: {
          id: decoded.userId,
        },
        select: {
          id: true,
          email: true,
          name: true,
          avatarUrl: true,
        },
      });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;

    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};