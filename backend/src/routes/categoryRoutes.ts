import { Router } from "express";
import * as ctrl from "../controllers/categoryController";
import { protect } from "../middleware/authMiddleware";
import { requireAdmin } from "../middleware/adminMiddleware";
import { validate } from "../middleware/validateMiddleware";
import { createCategorySchema, updateCategorySchema } from "../validators/categoryValidators";
import { upload } from "../middleware/uploadMiddleware";

const router = Router();

router.get("/", ctrl.listCategories);
router.get("/:id", ctrl.getCategory);

router.post(
  "/",
  protect,
  requireAdmin,
  upload.single("image"),
  validate(createCategorySchema),
  ctrl.createCategory
);
router.put(
  "/:id",
  protect,
  requireAdmin,
  upload.single("image"),
  validate(updateCategorySchema),
  ctrl.updateCategory
);
router.delete("/:id", protect, requireAdmin, ctrl.deleteCategory);

export default router;
