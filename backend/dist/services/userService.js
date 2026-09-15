"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUserIds = exports.getAssignableUsers = void 0;
const db_1 = __importDefault(require("../config/db"));
const getAssignableUsers = async (currentUserId) => {
    return db_1.default.user.findMany({
        where: {
            id: {
                not: currentUserId,
            },
        },
        select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
        },
        orderBy: {
            name: "asc",
        },
    });
};
exports.getAssignableUsers = getAssignableUsers;
const getAllUserIds = async () => {
    return db_1.default.user.findMany({
        select: {
            id: true,
        },
    });
};
exports.getAllUserIds = getAllUserIds;
