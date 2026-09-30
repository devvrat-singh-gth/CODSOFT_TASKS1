import User from "../models/User";
import { ApiError } from "../utils/apiError";
import { parsePagination, buildPaginationMeta } from "../utils/pagination";
import { uploadImage, deleteImage } from "./cloudinaryService";

export async function updateProfile(
  userId: string,
  data: Partial<{ name: string; phone: string; address: unknown }>,
  avatarFile?: Express.Multer.File
) {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound("User not found");

  if (avatarFile) {
    if (user.avatar?.publicId) await deleteImage(user.avatar.publicId);
    const uploaded = await uploadImage(avatarFile.buffer, "ecommerce/avatars");
    user.avatar = { url: uploaded.url, publicId: uploaded.publicId };
  }

  Object.assign(user, data);
  await user.save();
  return user;
}

// Admin: paginated user listing.
export async function listUsers(query: Record<string, unknown>) {
  const { page, limit, skip } = parsePagination(query);
  const [users, total] = await Promise.all([
    User.find().select("-password").sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(),
  ]);
  return { users, pagination: buildPaginationMeta(total, page, limit) };
}

export async function setUserActive(userId: string, isActive: boolean) {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound("User not found");
  user.isActive = isActive;
  await user.save();
  return user;
}

export async function setUserRole(userId: string, role: "CUSTOMER" | "ADMIN") {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound("User not found");
  user.role = role as never;
  await user.save();
  return user;
}
