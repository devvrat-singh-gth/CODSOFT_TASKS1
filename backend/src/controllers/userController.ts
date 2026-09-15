import {
  Request,
  Response,
  NextFunction,
} from "express";

import prisma from "../config/db";

import {
  getAssignableUsers,
} from "../services/userService";

export const getUsers = async (
  req: Request,
  res: Response
) => {
  try {
    const users =
      await getAssignableUsers(
        req.user!.id
      );

    return res.json({
      success: true,
      data: users,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Unable to load users.",
    });
  }
};
export const getNotificationSettings =
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const settings =
        await prisma.user.findUnique({
         where: {
  id: req.user!.id,
},
          select: {
            dueSoonNotifications:
              true,
            overdueNotifications:
              true,
            assignmentNotifications:
              true,
            statusNotifications:
              true,
            browserPopups:
              true,
            notificationSound:
              true,
            notificationRetentionDays:
              true,
          },
        });

      return res.json({
        success: true,
        data: settings,
      });
    } catch (error) {
      next(error);
    }
  };

export const updateNotificationSettings =
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const updated =
        await prisma.user.update({
          where: {
            id: req.user!.id,
          },
          data: {
            dueSoonNotifications:
              req.body
                .dueSoonNotifications,
            overdueNotifications:
              req.body
                .overdueNotifications,
            assignmentNotifications:
              req.body
                .assignmentNotifications,
            statusNotifications:
              req.body
                .statusNotifications,
            browserPopups:
              req.body.browserPopups,
            notificationSound:
              req.body.notificationSound,
            notificationRetentionDays:
              req.body
                .notificationRetentionDays,
          },
        });

      return res.json({
        success: true,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  };