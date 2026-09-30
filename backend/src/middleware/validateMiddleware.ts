import { Request, Response, NextFunction } from "express";
import { ZodTypeAny } from "zod";
import { ApiError } from "../utils/apiError";

// Validates req.body against a Zod schema and replaces it with the parsed
// (type-coerced, defaulted) result before the controller runs.
export function validate(schema: ZodTypeAny) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const message = result.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; ");
      return next(ApiError.badRequest(message));
    }
    req.body = result.data;
    next();
  };
}
