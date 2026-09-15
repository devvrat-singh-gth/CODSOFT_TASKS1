import prisma from "../config/db";

import {
  createNotification,
} from "./notificationService";

export const createTask = async (
  data: {
    title: string;
    description?: string;
    priority?: string;
    status?: string;
    dueDate?: string;
    projectId: string;
    assignedToId?: string;
  },
  ownerId: string
) => {
  const project =
    await prisma.project.findFirst({
      where: {
        id: data.projectId,
        ownerId,
      },
    });

  if (!project) {
    throw new Error("Project not found");
  }

  if (data.assignedToId) {
    const assignedUser =
      await prisma.user.findUnique({
        where: {
          id: data.assignedToId,
        },
      });

    if (!assignedUser) {
      throw new Error(
        "Assigned user not found"
      );
    }
  }

const task =
  await prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      priority: data.priority as any,
      status: data.status as any,
      dueDate: data.dueDate
        ? new Date(data.dueDate)
        : undefined,
      projectId: data.projectId,
      assignedToId:
        data.assignedToId || undefined,
    },
  });

await createNotification({
  userId: ownerId,
  type: "TASK_CREATED",
  title: "Task created",
  message: `${task.title} was created.`,
  taskId: task.id,
  projectId: project.id,
});

if (
  data.assignedToId &&
  data.assignedToId !== ownerId
) {
    await createNotification({
      userId: data.assignedToId,
      type: "TASK_ASSIGNED",
      title: "Task assigned to you",
      message: `${task.title} was assigned to you in ${project.title}.`,
      taskId: task.id,
      projectId: project.id,
    });
  }

  return task;
};

export const getTasks = async (
  ownerId: string,
  page: number,
  limit: number,
  search?: string,
  status?: string,
  priority?: string
) => {
  const skip = (page - 1) * limit;

  const where = {
    project: {
      ownerId,
    },

    ...(search && {
      title: {
        contains: search,
        mode: "insensitive" as const,
      },
    }),

    ...(status && {
      status: status as any,
    }),

    ...(priority && {
      priority: priority as any,
    }),
  };

  const [
    tasks,
    total,
  ] = await prisma.$transaction([
    prisma.task.findMany({
      where,
      include: {
        project: true,
        assignedTo: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    }),

    prisma.task.count({
      where,
    }),
  ]);

  return {
    tasks,
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

export const getTaskById = async (
  taskId: string,
  ownerId: string
) => {
  return prisma.task.findFirst({
    where: {
      id: taskId,
      project: {
        ownerId,
      },
    },
    include: {
      project: true,
      assignedTo: true,
    },
  });
};

export const updateTask = async (
  taskId: string,
  ownerId: string,
  data: {
    title?: string;
    description?: string | null;
    priority?: string;
    status?: string;
    dueDate?: string | null;
    assignedToId?: string | null;
  }
) => {
  if (data.assignedToId) {
    const assignedUser =
      await prisma.user.findUnique({
        where: {
          id: data.assignedToId,
        },
      });

    if (!assignedUser) {
      throw new Error(
        "Assigned user not found"
      );
    }
  }

  const existingTask =
    await prisma.task.findFirst({
      where: {
        id: taskId,
        project: {
          ownerId,
        },
      },
      include: {
        project: true,
      },
    });

  if (!existingTask) {
    return {
      count: 0,
    };
  }

  const updateData: {
    title?: string;
    description?: string | null;
    priority?: any;
    status?: any;
    dueDate?: Date | null;
    assignedToId?: string | null;
  } = {};

  if (data.title !== undefined) {
    updateData.title = data.title;
  }

  if (data.description !== undefined) {
    updateData.description =
      data.description;
  }

  if (data.priority !== undefined) {
    updateData.priority =
      data.priority as any;
  }

  if (data.status !== undefined) {
    updateData.status =
      data.status as any;
  }

  if (data.dueDate !== undefined) {
    updateData.dueDate =
      data.dueDate === null
        ? null
        : new Date(data.dueDate);
  }

  if (
    data.assignedToId !== undefined
  ) {
    updateData.assignedToId =
      data.assignedToId;
  }

  const result =
    await prisma.task.updateMany({
      where: {
        id: taskId,
        project: {
          ownerId,
        },
      },
      data: updateData,
    });

  if (result.count === 0) {
    return result;
  }
if (
  data.title !== undefined ||
  data.description !== undefined ||
  data.priority !== undefined ||
  data.dueDate !== undefined
) {
  await createNotification({
    userId: ownerId,
    type: "TASK_UPDATED",
    title: "Task updated",
    message: `${existingTask.title} was updated.`,
    taskId: existingTask.id,
    projectId: existingTask.projectId,
  });
}
  const assignedToId =
    data.assignedToId !== undefined
      ? data.assignedToId
      : existingTask.assignedToId;

  const statusChanged =
    data.status !== undefined &&
    data.status !== existingTask.status;

  const assignmentChanged =
    data.assignedToId !== undefined &&
    data.assignedToId !==
      existingTask.assignedToId;

  if (
    assignmentChanged &&
    assignedToId &&
    assignedToId !== ownerId
  ) {
    await createNotification({
      userId: assignedToId,
      type: "TASK_ASSIGNED",
      title: "Task assigned to you",
      message: `${existingTask.title} was assigned to you in ${existingTask.project.title}.`,
      taskId: existingTask.id,
      projectId: existingTask.projectId,
    });
  }

  if (
    statusChanged &&
    assignedToId &&
    assignedToId !== ownerId
  ) {
    const nextStatus =
      data.status!;

    const isCompleted =
      nextStatus === "DONE";

    const readableStatus =
      nextStatus
        .replace(/_/g, " ")
        .toLowerCase();

    await createNotification({
      userId: assignedToId,
      type: isCompleted
        ? "TASK_COMPLETED"
        : "TASK_STATUS_CHANGED",
      title: isCompleted
        ? "Task completed"
        : "Task status updated",
      message: isCompleted
        ? `${existingTask.title} was marked as completed.`
        : `${existingTask.title} is now ${readableStatus}.`,
      taskId: existingTask.id,
      projectId: existingTask.projectId,
    });
  }

  return result;
};
export const deleteTask = async (
  taskId: string,
  ownerId: string
) => {
  const task =
    await prisma.task.findFirst({
      where: {
        id: taskId,
        project: {
          ownerId,
        },
      },
    });

  if (!task) {
    return { count: 0 };
  }

  const result =
    await prisma.task.deleteMany({
      where: {
        id: taskId,
        project: {
          ownerId,
        },
      },
    });

  if (result.count > 0) {
await createNotification({
  userId: ownerId,
  type: "TASK_DELETED",
  title: "Task deleted",
  message: `${task.title} was deleted.`,
  taskId: task.id,
  projectId: task.projectId,
});
  }

  return result;
};