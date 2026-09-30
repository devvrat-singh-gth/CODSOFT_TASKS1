import { Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { sendSuccess } from "../utils/apiResponse";
import { AuthenticatedRequest } from "../types";
import * as orderService from "../services/orderService";

export const createOrder = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const { shippingAddress, paymentMethod } = req.body;
  const order = await orderService.createOrderFromCart(
    req.user!.userId,
    shippingAddress,
    paymentMethod
  );
  sendSuccess(res, order, "Order created", 201);
});

export const getMyOrders = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const result = await orderService.listMyOrders(req.user!.userId, req.query as never);
  sendSuccess(res, result);
});

export const getOrder = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const order = await orderService.getOrderById(req.params.id, req.user!.userId, req.user!.role);
  sendSuccess(res, order);
});

export const cancelOrder = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const order = await orderService.cancelOrder(req.params.id, req.user!.userId, req.user!.role);
  sendSuccess(res, order, "Order cancelled");
});

// --- Admin ---

export const getAllOrders = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const result = await orderService.listAllOrders(req.query as never);
  sendSuccess(res, result);
});

export const updateOrderStatus = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const order = await orderService.updateOrderStatus(req.params.id, req.body.status);
  sendSuccess(res, order, "Order status updated");
});

export const updateOrderPaymentStatus = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const order = await orderService.updateOrderPaymentStatus(req.params.id, req.body.status);
  sendSuccess(res, order, "Payment status updated");
});
