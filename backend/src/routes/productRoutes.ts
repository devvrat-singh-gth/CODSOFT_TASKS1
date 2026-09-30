import { Router } from "express";
import * as ctrl from "../controllers/productController";
import { protect } from "../middleware/authMiddleware";
import { requireAdmin } from "../middleware/adminMiddleware";
import { validate } from "../middleware/validateMiddleware";
import { createProductSchema, updateProductSchema } from "../validators/productValidators";
import { upload } from "../middleware/uploadMiddleware";
import reviewRouter from "./reviewRoutes";

const router = Router();

// Nested review routes: GET/POST /api/products/:productId/reviews
router.use("/:productId/reviews", reviewRouter);

router.get("/", ctrl.listProducts);
router.get("/:id", ctrl.getProduct);

router.post(
  "/",
  protect,
  requireAdmin,
  upload.array("images", 6),
  validate(createProductSchema),
  ctrl.createProduct
);
router.put(
  "/:id",
  protect,
  requireAdmin,
  upload.array("images", 6),
  validate(updateProductSchema),
  ctrl.updateProduct
);
router.patch("/:id/status", protect, requireAdmin, ctrl.setProductActive);
router.delete("/:id/images/:publicId", protect, requireAdmin, ctrl.deleteProductImage);
router.delete("/:id", protect, requireAdmin, ctrl.deleteProduct);

export default router;
