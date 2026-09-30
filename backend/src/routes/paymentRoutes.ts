import { Router } from "express";
import * as ctrl from "../controllers/paymentController";
import { protect } from "../middleware/authMiddleware";
import { validate } from "../middleware/validateMiddleware";
import { createRazorpayOrderSchema, verifyPaymentSchema } from "../validators/paymentValidators";

const router = Router();
router.use(protect);

router.post("/create-order", validate(createRazorpayOrderSchema), ctrl.createRazorpayOrder);
router.post("/verify", validate(verifyPaymentSchema), ctrl.verifyPayment);
router.post("/failed", ctrl.paymentFailed);

export default router;
