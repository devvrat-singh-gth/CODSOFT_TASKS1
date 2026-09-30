import { Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { sendSuccess } from "../utils/apiResponse";
import { AuthenticatedRequest } from "../types";
import * as wishlistService from "../services/wishlistService";

export const getWishlist = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const wishlist = await wishlistService.getWishlist(req.user!.userId);
  sendSuccess(res, wishlist);
});

export const addToWishlist = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const wishlist = await wishlistService.addToWishlist(req.user!.userId, req.params.productId);
  sendSuccess(res, wishlist, "Added to wishlist");
});

export const removeFromWishlist = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const wishlist = await wishlistService.removeFromWishlist(req.user!.userId, req.params.productId);
  sendSuccess(res, wishlist, "Removed from wishlist");
});

export const clearWishlist = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const wishlist = await wishlistService.clearWishlist(req.user!.userId);
  sendSuccess(res, wishlist, "Wishlist cleared");
});
