import bcrypt from "bcryptjs";
import User, { IUser } from "../models/User";
import { ApiError } from "../utils/apiError";
import { generateToken } from "../utils/generateToken";
import { UserRole } from "../types";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

function toPublicUser(user: IUser) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    phone: user.phone,
    address: user.address,
  };
}

export async function registerUser(input: RegisterInput) {
  const existing = await User.findOne({ email: input.email });
  if (existing) throw ApiError.conflict("An account with this email already exists");

  const hashed = await bcrypt.hash(input.password, 10);
  const user = await User.create({
    name: input.name,
    email: input.email,
    password: hashed,
    role: UserRole.CUSTOMER,
  });

  const token = generateToken({ userId: user._id.toString(), role: user.role });
  return { user: toPublicUser(user), token };
}

export async function loginUser(input: LoginInput) {
  const user = await User.findOne({ email: input.email }).select("+password");
  if (!user) throw ApiError.unauthorized("Invalid email or password");
  if (!user.isActive) throw ApiError.forbidden("Account has been deactivated");

  const matches = await bcrypt.compare(input.password, user.password);
  if (!matches) throw ApiError.unauthorized("Invalid email or password");

  const token = generateToken({ userId: user._id.toString(), role: user.role });
  return { user: toPublicUser(user), token };
}

export async function getCurrentUser(userId: string) {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound("User not found");
  return toPublicUser(user);
}
