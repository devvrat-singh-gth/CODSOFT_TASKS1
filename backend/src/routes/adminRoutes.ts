import { Router } from "express";
import * as adminCtrl from "../controllers/adminController";
import * as orderCtrl from "../controllers/orderController";
import { protect } from "../middleware/authMiddleware";
import { requireAdmin } from "../middleware/adminMiddleware";

const router = Router();
router.use(protect, requireAdmin);

router.get("/dashboard", adminCtrl.getDashboard);

router.get("/users", adminCtrl.listUsers);
router.patch("/users/:id/status", adminCtrl.setUserActive);
router.patch("/users/:id/role", adminCtrl.setUserRole);

router.get("/orders", orderCtrl.getAllOrders);
router.get("/orders/:id", orderCtrl.getOrder);
router.put("/orders/:id/status", orderCtrl.updateOrderStatus);
router.put("/orders/:id/payment", orderCtrl.updateOrderPaymentStatus);

export default router;
