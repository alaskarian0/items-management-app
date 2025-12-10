import { NextRequest, NextResponse } from 'next/server';
import { mockDb } from '@/lib/mock-db';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userName, fullName, role } = body;

        // Validate input
        if (!userName || !fullName || !role) {
            return NextResponse.json(
                {
                    status: 'error',
                    message: 'جميع الحقول مطلوبة',
                    errors: [
                        {
                            message: 'جميع الحقول مطلوبة',
                        },
                    ],
                },
                { status: 400 }
            );
        }

        // Check if username already exists
        const existingUser = mockDb.findUserByUsername(userName);
        if (existingUser) {
            return NextResponse.json(
                {
                    status: 'error',
                    message: 'اسم المستخدم موجود بالفعل',
                    errors: [
                        {
                            message: 'اسم المستخدم موجود بالفعل',
                            field: 'userName',
                        },
                    ],
                },
                { status: 409 }
            );
        }

        // Create new user
        const { user, defaultPassword } = mockDb.createUser({
            userName,
            fullName,
            role,
        });

        // Return success response with user data and default password
        return NextResponse.json(
            {
                status: 'success',
                message: 'تم إنشاء المستخدم بنجاح',
                data: {
                    ...user,
                    defaultPassword,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Register error:', error);
        return NextResponse.json(
            {
                status: 'error',
                message: 'حدث خطأ أثناء إنشاء المستخدم',
                errors: [
                    {
                        message: 'حدث خطأ أثناء إنشاء المستخدم',
                    },
                ],
            },
            { status: 500 }
        );
    }
}
