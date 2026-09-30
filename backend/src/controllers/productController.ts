import { Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { sendSuccess } from "../utils/apiResponse";
import { AuthenticatedRequest } from "../types";
import * as productService from "../services/productService";

export const listProducts = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const { products, pagination } = await productService.listProducts(req.query as never);
  sendSuccess(res, { products, pagination });
});

export const getProduct = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const product = await productService.getProductById(req.params.id);
  sendSuccess(res, product);
});

export const createProduct = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const files = (req.files as Express.Multer.File[]) || [];
  const product = await productService.createProduct(req.body, files);
  sendSuccess(res, product, "Product created", 201);
});

export const updateProduct = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const files = (req.files as Express.Multer.File[]) || [];
  const product = await productService.updateProduct(req.params.id, req.body, files);
  sendSuccess(res, product, "Product updated");
});

export const deleteProductImage = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const product = await productService.deleteProductImage(req.params.id, req.params.publicId);
  sendSuccess(res, product, "Image removed");
});

export const deleteProduct = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  await productService.deleteProduct(req.params.id);
  sendSuccess(res, {}, "Product deleted");
});

export const setProductActive = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const product = await productService.setProductActive(req.params.id, req.body.isActive);
  sendSuccess(res, product, "Product status updated");
});
