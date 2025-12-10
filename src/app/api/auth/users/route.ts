import { NextRequest, NextResponse } from 'next/server';
import { mockDb } from '@/lib/mock-db';
import { jwtUtils } from '@/lib/jwt-utils';

export async function GET(request: NextRequest) {
    try {
        // Extract and verify token
        const authHeader = request.headers.get('authorization');
        const token = jwtUtils.extractTokenFromHeader(authHeader);

        if (!token) {
            return NextResponse.json(
                {
                    status: 'error',
                    message: 'غير مصرح',
                    errors: [
                        {
                            message: 'غير مصرح',
                        },
                    ],
                },
                { status: 401 }
            );
        }

        const decoded = jwtUtils.verifyToken(token);
        if (!decoded) {
            return NextResponse.json(
                {
                    status: 'error',
                    message: 'رمز غير صالح',
                    errors: [
                        {
                            message: 'رمز غير صالح',
                        },
                    ],
                },
                { status: 401 }
            );
        }

        // Get pagination parameters from query string
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const perPage = parseInt(searchParams.get('per_page') || '10', 10);

        // Get all users
        const allUsers = mockDb.getAllUsers();

        // Calculate pagination
        const totalItems = allUsers.length;
        const totalPages = Math.ceil(totalItems / perPage);
        const startIndex = (page - 1) * perPage;
        const endIndex = startIndex + perPage;
        const paginatedUsers = allUsers.slice(startIndex, endIndex);

        // Return success response with pagination
        return NextResponse.json(
            {
                status: 'success',
                message: 'تم جلب المستخدمين بنجاح',
                data: {
                    items: paginatedUsers,
                    pagination: {
                        current_page: page,
                        per_page: perPage,
                        total_items: totalItems,
                        total_pages: totalPages,
                    },
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Get users error:', error);
        return NextResponse.json(
            {
                status: 'error',
                message: 'حدث خطأ أثناء جلب المستخدمين',
                errors: [
                    {
                        message: 'حدث خطأ أثناء جلب المستخدمين',
                    },
                ],
            },
            { status: 500 }
        );
    }
}
