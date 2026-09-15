import { Request, Response } from "express";

import {
  generateDeadlineNotifications,
  getNotifications,
  getUnreadNotificationCount,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from "../services/notificationService";

export const getAllNotifications =
  async (
    req: Request,
    res: Response
  ) => {
try {
  await generateDeadlineNotifications(
    req.user!.id
  );

  const page = Math.max(
        Number(req.query.page) || 1,
        1
      );

      const limit = Math.min(
        Math.max(
          Number(req.query.limit) || 12,
          1
        ),
        50
      );

      const unreadOnly =
        req.query.unread === "true";

      const result =
        await getNotifications(
          req.user!.id,
          page,
          limit,
          unreadOnly
        );

      return res.json({
        success: true,
        data: result.notifications,
        pagination:
          result.pagination,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message:
          error?.message ||
          "Unable to load notifications.",
      });
    }
  };

export const getUnreadCount =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const count =
        await getUnreadNotificationCount(
          req.user!.id
        );

      return res.json({
        success: true,
        data: {
          count,
        },
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message:
          error?.message ||
          "Unable to load notification count.",
      });
    }
  };

export const markRead =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const result =
        await markNotificationRead(
          req.params.id as string,
          req.user!.id
        );

      if (result.count === 0) {
        return res.status(404).json({
          success: false,
          message:
            "Notification not found.",
        });
      }

      return res.json({
        success: true,
        message:
          "Notification marked as read.",
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message:
          error?.message ||
          "Unable to update notification.",
      });
    }
  };

export const markAllRead =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      await markAllNotificationsRead(
        req.user!.id
      );

      return res.json({
        success: true,
        message:
          "All notifications marked as read.",
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message:
          error?.message ||
          "Unable to update notifications.",
      });
    }
  };

export const removeNotification =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const result =
        await deleteNotification(
          req.params.id as string,
          req.user!.id
        );

      if (result.count === 0) {
        return res.status(404).json({
          success: false,
          message:
            "Notification not found.",
        });
      }

      return res.json({
        success: true,
        message:
          "Notification deleted.",
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message:
          error?.message ||
          "Unable to delete notification.",
      });
    }
  };