/**
 * Mock Database for Development
 * This is an in-memory database for testing authentication
 * Data will be lost on server restart
 */

import type { User } from '@/store/auth/authTypes';

interface MockUser extends User {
    password: string;
}

// In-memory user storage
// eslint-disable-next-line prefer-const
let users: MockUser[] = [
    {
        id: 1,
        userName: 'admin',
        password: 'admin1', // In production, this should be hashed
        fullName: 'مدير النظام',
        role: 'admin',
        isTempPass: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    // Warehouse Users
    {
        id: 2,
        userName: 'furniture_admin',
        password: 'furniture123',
        fullName: 'مسؤول مخزن الأثاث والممتلكات العامة',
        role: 'warehouse_manager',
        warehouse: 'furniture',
        isTempPass: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 3,
        userName: 'carpet_admin',
        password: 'carpet123',
        fullName: 'مسؤول مخزن السجاد والمفروشات',
        role: 'warehouse_manager',
        warehouse: 'carpet',
        isTempPass: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 4,
        userName: 'general_admin',
        password: 'general123',
        fullName: 'مسؤول مخزن المواد العامة',
        role: 'admin',
        warehouse: 'general',
        isTempPass: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 5,
        userName: 'construction_admin',
        password: 'construction123',
        fullName: 'مسؤول مخزن المواد الإنشائية',
        role: 'warehouse_manager',
        warehouse: 'construction',
        isTempPass: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 6,
        userName: 'dry_admin',
        password: 'dry123',
        fullName: 'مسؤول مخزن المواد الجافة',
        role: 'warehouse_manager',
        warehouse: 'dry',
        isTempPass: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 7,
        userName: 'frozen_admin',
        password: 'frozen123',
        fullName: 'مسؤول مخزن المواد المجمّدة',
        role: 'warehouse_manager',
        warehouse: 'frozen',
        isTempPass: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 8,
        userName: 'fuel_admin',
        password: 'fuel123',
        fullName: 'مسؤول مخزن الوقود والزيوت',
        role: 'warehouse_manager',
        warehouse: 'fuel',
        isTempPass: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 9,
        userName: 'consumable_admin',
        password: 'consumable123',
        fullName: 'مسؤول مخزن المواد المستهلكة',
        role: 'warehouse_manager',
        warehouse: 'consumable',
        isTempPass: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 10,
        userName: 'law_enforcement_admin',
        password: 'law123',
        fullName: 'مسؤول مخزن قسم حفظ النظام',
        role: 'warehouse_manager',
        warehouse: 'law_enforcement',
        isTempPass: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

let nextUserId = 11;

export const mockDb = {
    // Get all users (without passwords)
    getAllUsers: (): User[] => {
        return users.map(({ password, ...user }) => user);
    },

    // Find user by username
    findUserByUsername: (userName: string): MockUser | undefined => {
        return users.find((u) => u.userName === userName);
    },

    // Find user by ID
    findUserById: (id: number): MockUser | undefined => {
        return users.find((u) => u.id === id);
    },

    // Create new user
    createUser: (userData: {
        userName: string;
        fullName: string;
        role: string;
    }): { user: User; defaultPassword: string } => {
        // Generate default password
        const defaultPassword = `temp${Math.random().toString(36).slice(2, 8)}`;

        const newUser: MockUser = {
            id: nextUserId++,
            userName: userData.userName,
            fullName: userData.fullName,
            role: userData.role,
            password: defaultPassword,
            isTempPass: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        users.push(newUser);

        const { password, ...userWithoutPassword } = newUser;
        return { user: userWithoutPassword, defaultPassword };
    },

    // Update user password
    updatePassword: (userId: number, newPassword: string): boolean => {
        const user = users.find((u) => u.id === userId);
        if (!user) return false;

        user.password = newPassword;
        user.isTempPass = false;
        user.updatedAt = new Date().toISOString();
        return true;
    },

    // Verify password
    verifyPassword: (userName: string, password: string): MockUser | null => {
        const user = users.find((u) => u.userName === userName);
        if (!user || user.password !== password) {
            return null;
        }
        return user;
    },

    // Get user without password
    getUserWithoutPassword: (user: MockUser): User => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    },
};
