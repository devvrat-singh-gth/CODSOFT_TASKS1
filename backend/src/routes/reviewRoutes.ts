import { Router } from "express";
import * as ctrl from "../controllers/reviewController";
import { protect } from "../middleware/authMiddleware";
import { validate } from "../middleware/validateMiddleware";
import { createReviewSchema } from "../validators/reviewValidators";

// mergeParams so :productId from the parent router (productRoutes) is visible here
const router = Router({ mergeParams: true });

router.get("/", ctrl.listProductReviews);
router.post("/", protect, validate(createReviewSchema), ctrl.createReview);

export default router;
