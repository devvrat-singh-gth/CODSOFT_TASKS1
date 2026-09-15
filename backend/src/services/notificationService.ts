import prisma from "../config/db";
import { NotificationType } from "../generated/prisma/enums";
const getExpiryDate = (
  retentionDays: number
) => {
  const date = new Date();

  date.setDate(
    date.getDate() + retentionDays
  );

  return date;
};
export const deleteExpiredNotifications =
  async (userId?: string) => {
    return prisma.notification.deleteMany({
      where: {
        expiresAt: {
          lte: new Date(),
        },
        ...(userId
          ? {
              userId,
            }
          : {}),
      },
    });
  };
type CreateNotificationInput = {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  taskId?: string;
  projectId?: string;
};

export const createNotification =
  async ({
    userId,
    type,
    title,
    message,
    taskId,
    projectId,
  }: CreateNotificationInput) => {
    const user =
      await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          notificationRetentionDays:
            true,
        },
      });

    return prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        taskId,
        projectId,
        expiresAt:
          getExpiryDate(
            user?.notificationRetentionDays ??
              90
          ),
      },
    });
  };
export const generateDeadlineNotifications =
  async (userId: string) => {
    const now = new Date();

    const tomorrow = new Date(now);
    tomorrow.setHours(
      tomorrow.getHours() + 24
    );

    const tasks =
      await prisma.task.findMany({
        where: {
          assignedToId: userId,
          status: {
            not: "DONE",
          },
          dueDate: {
            not: null,
          },
        },
        include: {
          project: true,
        },
      });

    for (const task of tasks) {
      if (!task.dueDate) {
        continue;
      }

      const dueDate =
        new Date(task.dueDate);

      const isOverdue =
        dueDate < now;

      const isDueSoon =
        dueDate >= now &&
        dueDate <= tomorrow;

      if (!isOverdue && !isDueSoon) {
        continue;
      }

      const type = isOverdue
        ? "TASK_OVERDUE"
        : "TASK_DUE_SOON";

      const existing =
        await prisma.notification.findFirst({
          where: {
            userId,
            taskId: task.id,
            type,
          },
        });

      if (existing) {
        continue;
      }

      await createNotification({
        userId,
        type,
        title: isOverdue
          ? "Task overdue"
          : "Task due soon",
        message: isOverdue
          ? `${task.title} is overdue.`
          : `${task.title} is due within the next 24 hours.`,
        taskId: task.id,
        projectId: task.projectId,
      });
    }
  };
export const getNotifications =
  async (
    userId: string,
    page: number,
    limit: number,
    unreadOnly = false
  ) => {
    await deleteExpiredNotifications(
      userId
    );

    const skip = (page - 1) * limit;

    const where = {
      userId,
      ...(unreadOnly
        ? {
            readAt: null,
          }
        : {}),
    };

    const [
      notifications,
      total,
    ] = await prisma.$transaction([
      prisma.notification.findMany({
        where,
        include: {
          task: {
            select: {
              id: true,
              title: true,
            },
          },
          project: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),

      prisma.notification.count({
        where,
      }),
    ]);

    return {
      notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(
          total / limit
        ),
      },
    };
  };

export const getUnreadNotificationCount =
  async (userId: string) => {
    await deleteExpiredNotifications(
      userId
    );

    return prisma.notification.count({
      where: {
        userId,
        readAt: null,
      },
    });
  };

export const markNotificationRead =
  async (
    notificationId: string,
    userId: string
  ) => {
    return prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId,
      },
      data: {
        readAt: new Date(),
      },
    });
  };

export const markAllNotificationsRead =
  async (userId: string) => {
    return prisma.notification.updateMany({
      where: {
        userId,
        readAt: null,
      },
      data: {
        readAt: new Date(),
      },
    });
  };

export const deleteNotification =
  async (
    notificationId: string,
    userId: string
  ) => {
    return prisma.notification.deleteMany({
      where: {
        id: notificationId,
        userId,
      },
    });
  };