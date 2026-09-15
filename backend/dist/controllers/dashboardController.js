"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboard = void 0;
const dashboardService_1 = require("../services/dashboardService");
const getDashboard = async (req, res) => {
    try {
        const stats = await (0, dashboardService_1.getDashboardStats)(req.user.id);
        return res.json({
            success: true,
            data: stats,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error?.message ||
                "Unable to load dashboard data.",
        });
    }
};
exports.getDashboard = getDashboard;
