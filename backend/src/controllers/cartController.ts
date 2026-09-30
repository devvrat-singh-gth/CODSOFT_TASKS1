import { Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { sendSuccess } from "../utils/apiResponse";
import { AuthenticatedRequest } from "../types";
import * as cartService from "../services/cartService";

export const getCart = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const result = await cartService.getCart(req.user!.userId);
  sendSuccess(res, result);
});

export const addItem = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const { productId, quantity } = req.body;
  const result = await cartService.addItemToCart(req.user!.userId, productId, quantity);
  sendSuccess(res, result, "Item added to cart");
});

export const updateItem = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const result = await cartService.updateCartItem(
    req.user!.userId,
    req.params.productId,
    req.body.quantity
  );
  sendSuccess(res, result, "Cart updated");
});

export const removeItem = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const result = await cartService.removeCartItem(req.user!.userId, req.params.productId);
  sendSuccess(res, result, "Item removed from cart");
});

export const clearCart = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const result = await cartService.clearCart(req.user!.userId);
  sendSuccess(res, result, "Cart cleared");
});
