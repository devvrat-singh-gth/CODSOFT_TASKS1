import {
  Request,
  Response,
} from "express";

import { generateToken } from "../utils/jwt";

export const googleCallback = async (
  req: Request,
  res: Response
) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message:
        "Google authentication failed",
    });
  }

  const clientUrl =
    process.env.CLIENT_URL;

  if (!clientUrl) {
    return res.status(500).json({
      success: false,
      message:
        "CLIENT_URL is not configured",
    });
  }

  const token =
    generateToken(req.user.id);

  const redirectUrl =
    `${clientUrl.replace(/\/$/, "")}` +
    `/oauth/callback#token=` +
    encodeURIComponent(token);

  return res.redirect(redirectUrl);
};