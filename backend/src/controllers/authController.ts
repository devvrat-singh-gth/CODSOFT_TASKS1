import {
  Request,
  Response,
} from "express";

import {
  validationResult,
} from "express-validator";

import {
  loginUser,
  registerUser,
} from "../services/authService";

export const register = async (
  req: Request,
  res: Response
) => {
  try {
    const errors =
      validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const {
      name,
      email,
      password,
    } = req.body;

    const result =
      await registerUser(
        name,
        email,
        password
      );

    return res.status(201).json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      email,
      password,
    } = req.body;

    const result =
      await loginUser(
        email,
        password
      );

    return res.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProfile = async (
  req: Request,
  res: Response
) => {
  return res.json({
    success: true,
    user: req.user,
  });
};