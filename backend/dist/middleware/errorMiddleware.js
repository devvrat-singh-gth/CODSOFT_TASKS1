"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    console.error(err);
    if (err.code === "P2002") {
        return res.status(409).json({
            success: false,
            message: "Duplicate record",
        });
    }
    return res.status(err.statusCode || 500).json({
        success: false,
        message: process.env.NODE_ENV === "production"
            ? "Internal Server Error"
            : err.message,
    });
};
exports.errorHandler = errorHandler;
