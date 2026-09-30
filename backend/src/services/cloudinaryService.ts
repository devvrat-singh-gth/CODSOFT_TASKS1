import cloudinary, { isCloudinaryConfigured } from "../config/cloudinary";
import { ApiError } from "../utils/apiError";

export interface UploadResult {
  url: string;
  publicId: string;
}

// Streams a buffer (from multer memoryStorage) directly to Cloudinary —
// nothing ever touches local disk or MongoDB.
export function uploadImage(buffer: Buffer, folder = "ecommerce/products"): Promise<UploadResult> {
  if (!isCloudinaryConfigured) {
    throw ApiError.internal("Image upload is not configured on this server");
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error || !result) return reject(error || new Error("Upload failed"));
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(buffer);
  });
}

export async function deleteImage(publicId: string): Promise<void> {
  if (!isCloudinaryConfigured || !publicId) return;
  await cloudinary.uploader.destroy(publicId);
}
