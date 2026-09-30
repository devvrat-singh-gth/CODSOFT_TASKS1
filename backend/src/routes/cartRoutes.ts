import { Router } from "express";
import * as ctrl from "../controllers/cartController";
import { protect } from "../middleware/authMiddleware";
import { validate } from "../middleware/validateMiddleware";
import { addCartItemSchema, updateCartItemSchema } from "../validators/cartValidators";

const router = Router();
router.use(protect);

router.get("/", ctrl.getCart);
router.post("/items", validate(addCartItemSchema), ctrl.addItem);
router.put("/items/:productId", validate(updateCartItemSchema), ctrl.updateItem);
router.delete("/items/:productId", ctrl.removeItem);
router.delete("/", ctrl.clearCart);

export default router;
