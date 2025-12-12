import { NextRequest, NextResponse } from 'next/server';
import { mockDb } from '@/lib/mock-db';
import { jwtUtils } from '@/lib/jwt-utils';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userName, password } = body;

        // Validate input
        if (!userName || !password) {
            return NextResponse.json(
                {
                    status: 'error',
                    message: 'اسم المستخدم وكلمة المرور مطلوبان',
                    errors: [
                        {
                            message: 'اسم المستخدم وكلمة المرور مطلوبان',
                            field: 'userName',
                        },
                    ],
                },
                { status: 400 }
            );
        }

        // Verify credentials
        const user = mockDb.verifyPassword(userName, password);

        if (!user) {
            return NextResponse.json(
                {
                    status: 'error',
                    message: 'اسم المستخدم أو كلمة المرور غير صحيحة',
                    errors: [
                        {
                            message: 'اسم المستخدم أو كلمة المرور غير صحيحة',
                            field: 'userName',
                        },
                    ],
                },
                { status: 401 }
            );
        }

        // Generate JWT token
        const userWithoutPassword = mockDb.getUserWithoutPassword(user);
        const token = jwtUtils.generateToken(userWithoutPassword);

        // Return success response
        return NextResponse.json(
            {
                status: 'success',
                message: 'تم تسجيل الدخول بنجاح',
                data: {
                    access_token: token,
                    user: userWithoutPassword,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            {
                status: 'error',
                message: 'حدث خطأ أثناء تسجيل الدخول',
                errors: [
                    {
                        message: 'حدث خطأ أثناء تسجيل الدخول',
                    },
                ],
            },
            { status: 500 }
        );
    }
}
