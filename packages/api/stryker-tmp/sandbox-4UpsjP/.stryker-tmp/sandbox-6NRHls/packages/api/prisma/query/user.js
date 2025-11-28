// @ts-nocheck
// 
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserById = exports.updateUserById = exports.getUsers = exports.getUserById = exports.getUserByEmail = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getUserByEmail = async (email) => {
    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                accounts: true,
                twoFactorConfirmation: true,
            },
        });
        return user;
    }
    catch {
        return null;
    }
};
exports.getUserByEmail = getUserByEmail;
const getUserById = async (id) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                accounts: true,
                twoFactorConfirmation: true,
            },
        });
        return user;
    }
    catch {
        return null;
    }
};
exports.getUserById = getUserById;
const getUsers = async () => {
    try {
        const users = await prisma.user.findMany({
            include: {
                accounts: true,
                twoFactorConfirmation: true,
            },
        });
        return users;
    }
    catch {
        return null;
    }
};
exports.getUsers = getUsers;
const updateUserById = async (id, data) => {
    return prisma.user.update({
        where: { id },
        data,
    });
};
exports.updateUserById = updateUserById;
const deleteUserById = async (userId) => {
    await prisma.user.delete({
        where: { id: userId },
    });
};
exports.deleteUserById = deleteUserById;
//# sourceMappingURL=user.js.map