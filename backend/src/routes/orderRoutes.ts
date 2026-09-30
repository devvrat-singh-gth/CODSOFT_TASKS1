import { Router } from "express";
import * as ctrl from "../controllers/orderController";
import { protect } from "../middleware/authMiddleware";
import { validate } from "../middleware/validateMiddleware";
import { createOrderSchema } from "../validators/orderValidators";

const router = Router();
router.use(protect);

router.post("/", validate(createOrderSchema), ctrl.createOrder);
router.get("/", ctrl.getMyOrders);
router.get("/:id", ctrl.getOrder);
router.put("/:id/cancel", ctrl.cancelOrder);

export default router;
