import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import { getDashboard }
from "../controllers/dashboardController";

const router = Router();

router.use(protect);

router.get("/", getDashboard);

export default router;