import { NextRequest, NextResponse } from 'next/server';
import { mockDb } from '@/lib/mock-db';
import { jwtUtils } from '@/lib/jwt-utils';

export async function PUT(request: NextRequest) {
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

        const body = await request.json();
        const { currentPassword, newPassword } = body;

        // Validate input
        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                {
                    status: 'error',
                    message: 'كلمة المرور الحالية والجديدة مطلوبة',
                    errors: [
                        {
                            message: 'كلمة المرور الحالية والجديدة مطلوبة',
                        },
                    ],
                },
                { status: 400 }
            );
        }

        // Find user
        const user = mockDb.findUserById(decoded.userId);
        if (!user) {
            return NextResponse.json(
                {
                    status: 'error',
                    message: 'المستخدم غير موجود',
                    errors: [
                        {
                            message: 'المستخدم غير موجود',
                        },
                    ],
                },
                { status: 404 }
            );
        }

        // Verify current password
        if (user.password !== currentPassword) {
            return NextResponse.json(
                {
                    status: 'error',
                    message: 'كلمة المرور الحالية غير صحيحة',
                    errors: [
                        {
                            message: 'كلمة المرور الحالية غير صحيحة',
                            field: 'currentPassword',
                        },
                    ],
                },
                { status: 400 }
            );
        }

        // Update password
        const success = mockDb.updatePassword(decoded.userId, newPassword);

        if (!success) {
            return NextResponse.json(
                {
                    status: 'error',
                    message: 'فشل تحديث كلمة المرور',
                    errors: [
                        {
                            message: 'فشل تحديث كلمة المرور',
                        },
                    ],
                },
                { status: 500 }
            );
        }

        // Return success response
        return NextResponse.json(
            {
                status: 'success',
                message: 'تم تغيير كلمة المرور بنجاح',
                data: {
                    success: true,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Change password error:', error);
        return NextResponse.json(
            {
                status: 'error',
                message: 'حدث خطأ أثناء تغيير كلمة المرور',
                errors: [
                    {
                        message: 'حدث خطأ أثناء تغيير كلمة المرور',
                    },
                ],
            },
            { status: 500 }
        );
    }
}
