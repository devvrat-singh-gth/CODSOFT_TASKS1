import { Router } from "express";
import { register, login, me } from "../controllers/authController";
import { validate } from "../middleware/validateMiddleware";
import { registerSchema, loginSchema } from "../validators/authValidators";
import { protect } from "../middleware/authMiddleware";
import { authRateLimiter } from "../middleware/rateLimitMiddleware";

const router = Router();

router.post("/register", authRateLimiter, validate(registerSchema), register);
router.post("/login", authRateLimiter, validate(loginSchema), login);
router.get("/me", protect, me);

export default router;
