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

const initialRequests: TransferRequest[] = [
    {
        id: 1,
        assetName: "طابعة ليزرية HP Pro",
        assetCode: "IT-PRT-022",
        fromDepartment: "المخزن الرئيسي",
        fromUser: "أمين المخزن",
        date: "2024-03-10",
        status: "pending",
        reason: "تجهيز مكتبي حسب الطلب رقم 44"
    },
    {
        id: 2,
        assetName: "مكتب خشب زان 160سم",
        assetCode: "FUR-DSK-105",
        fromDepartment: "قسم الشؤون الإدارية",
        fromUser: "أحمد علي",
        date: "2024-03-11",
        status: "pending",
        reason: "فائض عن الحاجة - نقل ملكية"
    },
    {
        id: 3,
        assetName: "كرسي دوار طبي",
        assetCode: "FUR-CHR-088",
        fromDepartment: "شعبة الصيانة",
        fromUser: "سعيد محمد",
        date: "2024-03-09",
        status: "pending",
        reason: "استبدال تالف"
    }
];

const DepartmentRequestsPage = () => {
    const [requests, setRequests] = useState<TransferRequest[]>(initialRequests);

    const handleAction = (id: number, action: 'approve' | 'reject') => {
        // In a real app, this would call an API
        setRequests(requests.map(req =>
            req.id === id ? { ...req, status: action === 'approve' ? 'approved' : 'rejected' } : req
        ));
        // For prototype visualization, we keep them in the list but update status
        // Or filter them out: setRequests(requests.filter(req => req.id !== id));
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
                                <TableHead>المادة</TableHead>
                                <TableHead>الرمز</TableHead>
                                <TableHead>جهة الإرسال</TableHead>
                                <TableHead>المرسل</TableHead>
                                <TableHead>التاريخ</TableHead>
                                <TableHead>السبب</TableHead>
                                <TableHead>الحالة</TableHead>
                                <TableHead className="text-center">الإجراء</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {requests.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                        لا توجد طلبات معلقة
                                    </TableCell>
                                </TableRow>
                            ) : (
                                requests.map((request) => (
                                    <TableRow key={request.id} className={request.status !== 'pending' ? 'bg-muted/50' : ''}>
                                        <TableCell className="font-medium">{request.assetName}</TableCell>
                                        <TableCell>
                                            <code className="bg-muted px-2 py-1 rounded text-sm">{request.assetCode}</code>
                                        </TableCell>
                                        <TableCell>{request.fromDepartment}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-muted-foreground" />
                                                {request.fromUser}
                                            </div>
                                        </TableCell>
                                        <TableCell>{request.date}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{request.reason}</TableCell>
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
                                                        onClick={() => handleAction(request.id, 'approve')}
                                                    >
                                                        <Check className="h-4 w-4 ml-1" />
                                                        قبول
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => handleAction(request.id, 'reject')}
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
