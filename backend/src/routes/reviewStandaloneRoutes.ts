import { Router } from "express";
import * as ctrl from "../controllers/reviewController";
import { protect } from "../middleware/authMiddleware";
import { validate } from "../middleware/validateMiddleware";
import { updateReviewSchema } from "../validators/reviewValidators";

// Standalone /api/reviews/:id for edit/delete, since those don't need a productId.
const router = Router();

router.put("/:id", protect, validate(updateReviewSchema), ctrl.updateReview);
router.delete("/:id", protect, ctrl.deleteReview);

export default router;
