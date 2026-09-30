import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError";
import { env } from "../config/env";

// Centralized error handler. Every thrown error in the app — ApiError or
// otherwise — ends up here. Never leaks stack traces or raw Mongo errors to
// the client in production.
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  let statusCode = 500;
  let message = "Internal server error";

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err && typeof err === "object") {
    const anyErr = err as { name?: string; code?: number; message?: string; errors?: unknown };

    if (anyErr.name === "ValidationError") {
      statusCode = 400;
      message = anyErr.message || "Validation failed";
    } else if (anyErr.name === "CastError") {
      statusCode = 400;
      message = "Invalid identifier format";
    } else if (anyErr.code === 11000) {
      statusCode = 409;
      message = "Duplicate value violates a unique constraint";
    } else if (anyErr.message) {
      message = anyErr.message;
    }
  }

  if (!env.isProduction && statusCode === 500) {
    console.error(err);
  }

  res.status(statusCode).json({ success: false, message });
}
