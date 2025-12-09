"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Check, X, ArrowRightLeft, User } from "lucide-react";
import { useAllPendingRequests } from "@/hooks/use-inventory";
import { db } from "@/lib/db";
import { toast } from "sonner";

// Mock Data for Requests
type TransferRequest = {
    id: number;
    assetName: string;
    assetCode: string;
    fromDepartment: string;
    fromUser: string;
    date: string;
    status: 'pending' | 'approved' | 'rejected';
    reason?: string;
};


const DepartmentRequestsPage = () => {
    const requests = useAllPendingRequests() || [];

    const handleAction = async (id: number, action: 'approve' | 'reject') => {
        try {
            await db.requests.update(id, {
                status: action === 'approve' ? 'approved' : 'rejected',
                processedAt: new Date(),
                processedBy: 'Current User' // In real app, get from auth
            });

            toast.success(action === 'approve' ? 'تم قبول الطلب' : 'تم رفض الطلب');
        } catch (error) {
            console.error(error);
            toast.error('حدث خطأ أثناء معالجة الطلب');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">طلبات التحويل والاستلام</h1>
                    <p className="text-muted-foreground">الموافقة على نقل ذمة المواد إلى قسمك</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ArrowRightLeft className="h-5 w-5" />
                        الطلبات الواردة
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table dir="rtl">
                        <TableHeader>
                            <TableRow>
                                <TableHead>المواد المطلوبة</TableHead>
                                <TableHead>القسم</TableHead>
                                <TableHead>طالب الطلب</TableHead>
                                <TableHead>التاريخ</TableHead>
                                <TableHead>الملاحظات</TableHead>
                                <TableHead>الحالة</TableHead>
                                <TableHead className="text-center">الإجراء</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {requests.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                        لا توجد طلبات معلقة
                                    </TableCell>
                                </TableRow>
                            ) : (
                                requests.map((request) => (
                                    <TableRow key={request.id} className={request.status !== 'pending' ? 'bg-muted/50' : ''}>
                                        <TableCell className="font-medium">
                                            {request.items?.length || 0} مادة
                                        </TableCell>
                                        <TableCell>قسم #{request.departmentId}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-muted-foreground" />
                                                {request.requestedBy}
                                            </div>
                                        </TableCell>
                                        <TableCell>{new Date(request.createdAt).toLocaleDateString('ar-SA')}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{request.notes || '-'}</TableCell>
                                        <TableCell>
                                            {request.status === 'pending' && <Badge variant="outline" className="border-orange-500 text-orange-600">قيد الانتظار</Badge>}
                                            {request.status === 'approved' && <Badge variant="default" className="bg-green-600">تم القبول</Badge>}
                                            {request.status === 'rejected' && <Badge variant="destructive">تم الرفض</Badge>}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {request.status === 'pending' && (
                                                <div className="flex items-center justify-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        className="bg-green-600 hover:bg-green-700"
                                                        onClick={() => handleAction(request.id!, 'approve')}
                                                    >
                                                        <Check className="h-4 w-4 ml-1" />
                                                        قبول
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => handleAction(request.id!, 'reject')}
                                                    >
                                                        <X className="h-4 w-4 ml-1" />
                                                        رفض
                                                    </Button>
                                                </div>
                                            )}
                                            {request.status !== 'pending' && (
                                                <span className="text-xs text-muted-foreground">تمت المعالجة</span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default DepartmentRequestsPage;
