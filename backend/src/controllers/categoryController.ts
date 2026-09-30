import { Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { sendSuccess } from "../utils/apiResponse";
import { AuthenticatedRequest } from "../types";
import * as categoryService from "../services/categoryService";

export const listCategories = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const categories = await categoryService.listCategories(req.query.activeOnly === "true");
  sendSuccess(res, categories);
});

export const getCategory = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const category = await categoryService.getCategoryById(req.params.id);
  sendSuccess(res, category);
});

export const createCategory = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const category = await categoryService.createCategory(req.body, req.file);
  sendSuccess(res, category, "Category created", 201);
});

export const updateCategory = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const category = await categoryService.updateCategory(req.params.id, req.body, req.file);
  sendSuccess(res, category, "Category updated");
});

export const deleteCategory = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  await categoryService.deleteCategory(req.params.id);
  sendSuccess(res, {}, "Category deleted");
});
