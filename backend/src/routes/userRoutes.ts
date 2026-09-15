import { Router } from "express";

import {
  getUsers,
  getNotificationSettings,
  updateNotificationSettings,
} from "../controllers/userController";

import {
  protect,
} from "../middleware/authMiddleware";

const router = Router();

router.use(protect);

router.get("/", getUsers);

router.get(
  "/notification-settings",
  protect,
  getNotificationSettings
);

router.put(
  "/notification-settings",
  protect,
  updateNotificationSettings
);
export default router;