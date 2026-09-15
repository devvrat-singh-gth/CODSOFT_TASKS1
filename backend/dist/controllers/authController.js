"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.login = exports.register = void 0;
const express_validator_1 = require("express-validator");
const authService_1 = require("../services/authService");
const register = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }
        const { name, email, password, } = req.body;
        const result = await (0, authService_1.registerUser)(name, email, password);
        return res.status(201).json({
            success: true,
            ...result,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password, } = req.body;
        const result = await (0, authService_1.loginUser)(email, password);
        return res.json({
            success: true,
            ...result,
        });
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: error.message,
        });
    }
};
exports.login = login;
const getProfile = async (req, res) => {
    return res.json({
        success: true,
        user: req.user,
    });
};
exports.getProfile = getProfile;
