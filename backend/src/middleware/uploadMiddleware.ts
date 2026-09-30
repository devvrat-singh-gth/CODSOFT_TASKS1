import multer from "multer";
import { ApiError } from "../utils/apiError";

// Memory storage: files are buffered and streamed straight to Cloudinary,
// never written to disk or to MongoDB.
const storage = multer.memoryStorage();

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new ApiError(400, "Only image uploads are allowed"));
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 6 },
});
