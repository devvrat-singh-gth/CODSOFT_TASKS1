import { Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { sendSuccess } from "../utils/apiResponse";
import { AuthenticatedRequest, UserRole } from "../types";
import * as reviewService from "../services/reviewService";

export const listProductReviews = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const result = await reviewService.listProductReviews(req.params.productId, req.query as never);
  sendSuccess(res, result);
});

export const createReview = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const review = await reviewService.createReview(req.user!.userId, req.params.productId, req.body);
  sendSuccess(res, review, "Review submitted", 201);
});

export const updateReview = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const review = await reviewService.updateReview(req.user!.userId, req.params.id, req.body);
  sendSuccess(res, review, "Review updated");
});

export const deleteReview = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  await reviewService.deleteReview(
    req.user!.userId,
    req.params.id,
    req.user!.role === UserRole.ADMIN
  );
  sendSuccess(res, {}, "Review deleted");
});
