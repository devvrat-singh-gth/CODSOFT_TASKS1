import prisma from "../config/db";

import {
  createNotification,
} from "./notificationService";

export const createProject = async (
  title: string,
  description: string | undefined,
  ownerId: string
) => {
  const project =
    await prisma.project.create({
      data: {
        title,
        description,
        ownerId,
      },
    });

  await createNotification({
    userId: ownerId,
    type: "PROJECT_CREATED",
    title: "Project created",
    message: `${project.title} was created.`,
    projectId: project.id,
  });

  return project;
};

export const getProjects = async (
  ownerId: string,
  page: number,
  limit: number
) => {
  const skip = (page - 1) * limit;

  const where = {
    ownerId,
  };

  const [projects, total] = await prisma.$transaction([
    prisma.project.findMany({
      where,
      include: {
        tasks: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    }),

    prisma.project.count({
      where,
    }),
  ]);

  return {
    projects,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getProjectById = async (
  projectId: string,
  ownerId: string
) => {
  return prisma.project.findFirst({
    where: {
      id: projectId,
      ownerId,
    },
    include: {
      tasks: true,
    },
  });
};

export const updateProject = async (
  projectId: string,
  ownerId: string,
  data: any
) => {
  const existingProject =
    await prisma.project.findFirst({
      where: {
        id: projectId,
        ownerId,
      },
    });

  if (!existingProject) {
    return { count: 0 };
  }

  const result =
    await prisma.project.updateMany({
      where: {
        id: projectId,
        ownerId,
      },
      data,
    });

  if (result.count > 0) {
    await createNotification({
      userId: ownerId,
      type: "PROJECT_UPDATED",
      title: "Project updated",
      message: `${existingProject.title} was updated.`,
      projectId,
    });
  }

  return result;
};

export const deleteProject = async (
  projectId: string,
  ownerId: string
) => {
  const project =
    await prisma.project.findFirst({
      where: {
        id: projectId,
        ownerId,
      },
    });

  if (!project) {
    return { count: 0 };
  }

  const projectTitle = project.title;

  const result =
    await prisma.project.deleteMany({
      where: {
        id: projectId,
        ownerId,
      },
    });

  if (result.count > 0) {
    await createNotification({
      userId: ownerId,
      type: "PROJECT_DELETED",
      title: "Project deleted",
      message: `${projectTitle} was deleted.`,
    });
  }

  return result;
};