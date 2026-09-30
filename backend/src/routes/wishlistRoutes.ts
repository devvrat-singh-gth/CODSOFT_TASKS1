import { Router } from "express";
import * as ctrl from "../controllers/wishlistController";
import { protect } from "../middleware/authMiddleware";

const router = Router();
router.use(protect);

router.get("/", ctrl.getWishlist);
router.post("/:productId", ctrl.addToWishlist);
router.delete("/:productId", ctrl.removeFromWishlist);
router.delete("/", ctrl.clearWishlist);

export default router;
