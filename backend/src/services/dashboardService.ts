import prisma from "../config/db";

export const getDashboardStats = async (
  ownerId: string
) => {
  const [
    projects,
    tasks,
    completed,
    pending,
    overdue,
    todo,
    inProgress,
    review,
    done,
  ] = await Promise.all([
    prisma.project.count({
      where: {
        ownerId,
      },
    }),

    prisma.task.count({
      where: {
        project: {
          ownerId,
        },
      },
    }),

    prisma.task.count({
      where: {
        status: "DONE",
        project: {
          ownerId,
        },
      },
    }),

    prisma.task.count({
      where: {
        status: {
          not: "DONE",
        },
        project: {
          ownerId,
        },
      },
    }),

    prisma.task.count({
      where: {
        dueDate: {
          lt: new Date(),
        },
        status: {
          not: "DONE",
        },
        project: {
          ownerId,
        },
      },
    }),

    prisma.task.count({
      where: {
        status: "TODO",
        project: {
          ownerId,
        },
      },
    }),

    prisma.task.count({
      where: {
        status: "IN_PROGRESS",
        project: {
          ownerId,
        },
      },
    }),

    prisma.task.count({
      where: {
        status: "REVIEW",
        project: {
          ownerId,
        },
      },
    }),

    prisma.task.count({
      where: {
        status: "DONE",
        project: {
          ownerId,
        },
      },
    }),
  ]);

  return {
    projects,
    tasks,
    completed,
    pending,
    overdue,

    taskStatus: {
      todo,
      inProgress,
      review,
      done,
    },
  };
};