import {
  Request,
  Response,
} from "express";

import {
  getDashboardStats,
} from "../services/dashboardService";

export const getDashboard = async (
  req: Request,
  res: Response
) => {
  try {
    const stats =
      await getDashboardStats(
        req.user!.id
      );

    return res.json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Unable to load dashboard data.",
    });
  }
};