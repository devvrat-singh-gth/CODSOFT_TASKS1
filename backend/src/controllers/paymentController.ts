import { Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { sendSuccess } from "../utils/apiResponse";
import { AuthenticatedRequest } from "../types";
import * as paymentService from "../services/paymentService";

export const createRazorpayOrder = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const result = await paymentService.createRazorpayOrder(req.body.orderId, req.user!.userId);
  sendSuccess(res, result, "Razorpay order created");
});

export const verifyPayment = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const result = await paymentService.verifyRazorpayPayment({
    ...req.body,
    userId: req.user!.userId,
  });
  sendSuccess(res, result, "Payment verified");
});

export const paymentFailed = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const order = await paymentService.handlePaymentFailure(req.body.orderId, req.user!.userId);
  sendSuccess(res, order, "Payment marked as failed");
});
