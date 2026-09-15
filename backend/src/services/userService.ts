import prisma from "../config/db";

export const getAssignableUsers = async (
  currentUserId: string
) => {
  return prisma.user.findMany({
    where: {
      id: {
        not: currentUserId,
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
    },
    orderBy: {
      name: "asc",
    },
  });
};
export const getAllUserIds = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
    },
  });
};