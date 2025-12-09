"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Package,
    ArrowRightLeft,
    CheckCircle2,
    Clock,
    AlertCircle
} from "lucide-react";
import Link from 'next/link';

const DepartmentPortalPage = () => {
    // Mock Data for "My Department" status
    const stats = {
        totalCustody: 45,
        pendingRequests: 3,
        pendingReturns: 1
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">بوابة الأقسام</h1>
                <p className="text-muted-foreground mt-2">إدارة موجودات القسم وطلبات التحويل والاستلام</p>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">موجودات بـ الذمة</CardTitle>
                        <Package className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalCustody}</div>
                        <p className="text-xs text-muted-foreground">مادة مسجلة على القسم</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">طلبات واردة</CardTitle>
                        <Clock className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{stats.pendingRequests}</div>
                        <p className="text-xs text-muted-foreground">بانتظار الموافقة</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">إرجاع معلق</CardTitle>
                        <AlertCircle className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{stats.pendingReturns}</div>
                        <p className="text-xs text-muted-foreground">بانتظار موافقة المخزن</p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="hover:border-primary/50 transition-colors">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5 text-primary" />
                            سجل الذمة (My Custody)
                        </CardTitle>
                        <CardDescription>عرض تفاصيل المواد الموجودة حالياً بعهدة القسم أو الموظفين</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild className="w-full" variant="outline">
                            <Link href="/department-portal/my-custody">
                                عرض السجل
                                <ArrowRightLeft className="mr-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="hover:border-primary/50 transition-colors">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                            الموافقات والطلبات (Approvals)
                        </CardTitle>
                        <CardDescription>الموافقة على استلام مواد محولة من أقسام أخرى أو من المخزن</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild className="w-full" variant="secondary">
                            <Link href="/department-portal/requests">
                                متابعة الطلبات
                                <span className="mr-auto bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs font-bold">
                                    {stats.pendingRequests}
                                </span>
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DepartmentPortalPage;
