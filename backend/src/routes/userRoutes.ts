import { Router } from "express";
import * as ctrl from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";
import { upload } from "../middleware/uploadMiddleware";
import { validate } from "../middleware/validateMiddleware";
import { updateProfileSchema } from "../validators/authValidators";

const router = Router();
router.use(protect);

router.put("/profile", upload.single("avatar"), validate(updateProfileSchema), ctrl.updateProfile);

export default router;
