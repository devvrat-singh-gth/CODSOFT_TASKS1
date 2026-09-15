import bcrypt from "bcryptjs";
import prisma from "../config/db";
import { generateToken } from "../utils/jwt";

const sanitizeUser = (user: any) => {
  const { password, ...safeUser } = user;
  return safeUser;
};

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const existingUser =
    await prisma.user.findUnique({
      where: { email },
    });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword =
    await bcrypt.hash(password, 10);

  const user =
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

  const token = generateToken(user.id);

  return {
    user: sanitizeUser(user),
    token,
  };
};

export const loginUser = async (
  email: string,
  password: string
) => {
  const user =
    await prisma.user.findUnique({
      where: { email },
    });

  if (!user || !user.password) {
    throw new Error("Invalid credentials");
  }

  const isMatch =
    await bcrypt.compare(
      password,
      user.password
    );

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken(user.id);

  return {
    user: sanitizeUser(user),
    token,
  };
};