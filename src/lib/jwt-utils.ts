/**
 * JWT Utilities for Mock Authentication
 * Simple JWT token generation and verification
 */

import type { User } from '@/store/auth/authTypes';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';
const TOKEN_EXPIRY = '24h'; // 24 hours

// Simple base64 encoding/decoding for mock JWT
// In production, use a proper JWT library like jsonwebtoken
export const jwtUtils = {
    // Generate a mock JWT token
    generateToken: (user: User): string => {
        const header = {
            alg: 'HS256',
            typ: 'JWT',
        };

        const payload = {
            userId: user.id,
            userName: user.userName,
            role: user.role,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
        };

        const headerBase64 = Buffer.from(JSON.stringify(header)).toString('base64url');
        const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64url');

        // Simple signature (in production, use proper HMAC)
        const signature = Buffer.from(
            `${headerBase64}.${payloadBase64}.${JWT_SECRET}`
        ).toString('base64url');

        return `${headerBase64}.${payloadBase64}.${signature}`;
    },

    // Verify and decode token
    verifyToken: (token: string): { userId: number; userName: string; role: string } | null => {
        try {
            const parts = token.split('.');
            if (parts.length !== 3) return null;

            const [headerBase64, payloadBase64, signature] = parts;

            // Verify signature
            const expectedSignature = Buffer.from(
                `${headerBase64}.${payloadBase64}.${JWT_SECRET}`
            ).toString('base64url');

            if (signature !== expectedSignature) return null;

            // Decode payload
            const payload = JSON.parse(Buffer.from(payloadBase64, 'base64url').toString());

            // Check expiration
            if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
                return null;
            }

            return {
                userId: payload.userId,
                userName: payload.userName,
                role: payload.role,
            };
        } catch (error) {
            return null;
        }
    },

    // Extract token from Authorization header
    extractTokenFromHeader: (authHeader: string | null): string | null => {
        if (!authHeader) return null;

        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') return null;

        return parts[1];
    },
};
