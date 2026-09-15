import { Router } from "express";

import {
  getAllNotifications,
  getUnreadCount,
  markRead,
  markAllRead,
  removeNotification,
} from "../controllers/notificationController";

import {
  protect,
} from "../middleware/authMiddleware";

const router = Router();

router.use(protect);

router.get(
  "/unread-count",
  getUnreadCount
);

router.get(
  "/",
  getAllNotifications
);

router.patch(
  "/read-all",
  markAllRead
);

router.patch(
  "/:id/read",
  markRead
);

router.delete(
  "/:id",
  removeNotification
);

export default router;