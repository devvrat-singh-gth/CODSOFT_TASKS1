"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleCallback = void 0;
const jwt_1 = require("../utils/jwt");
const googleCallback = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Google authentication failed",
        });
    }
    const clientUrl = process.env.CLIENT_URL;
    if (!clientUrl) {
        return res.status(500).json({
            success: false,
            message: "CLIENT_URL is not configured",
        });
    }
    const token = (0, jwt_1.generateToken)(req.user.id);
    const redirectUrl = `${clientUrl.replace(/\/$/, "")}` +
        `/oauth/callback#token=` +
        encodeURIComponent(token);
    return res.redirect(redirectUrl);
};
exports.googleCallback = googleCallback;
