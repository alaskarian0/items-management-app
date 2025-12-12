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
];

let nextUserId = 2;

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
