"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { assetCustodies, getAssetById } from "@/lib/data/fixed-assets-data";
import { Download, Package, Printer, Search, UserCircle } from "lucide-react";
import { useState } from 'react';

const MyCustodyPage = () => {
    const [searchTerm, setSearchTerm] = useState('');

    // Mock: Filter data to simulate "My Department Only" view
    // In a real app, this would filter by the logged-in user's department
    const myAssets = assetCustodies.map(custody => {
        const asset = getAssetById(custody.assetId);
        return {
            ...custody,
            assetName: asset?.name || 'Unknown',
            assetCode: asset?.assetCode || 'Unknown',
        };
    }).slice(0, 5); // Just show a few as demo

    const filteredAssets = myAssets.filter(asset =>
        asset.assetName.includes(searchTerm) ||
        asset.assetCode.includes(searchTerm) ||
        asset.employeeName.includes(searchTerm)
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">سجل الذمة (My Custody)</h1>
                    <p className="text-muted-foreground">المواد المسجلة بعهدة القسم وموظفيه</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Printer className="mr-2 h-4 w-4" />
                        طباعة السجل
                    </Button>
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        تصدير Excel
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            الموجودات الحالية
                        </CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="بحث في السجل..."
                                className="pr-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table dir="rtl">
                        <TableHeader>
                            <TableRow>
                                <TableHead>المادة</TableHead>
                                <TableHead>الرمز</TableHead>
                                <TableHead>بعهدة الموظف</TableHead>
                                <TableHead>تاريخ الاستلام</TableHead>
                                <TableHead>الحالة الفنية</TableHead>
                                <TableHead>ملاحظات</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAssets.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        لا توجد مواد مطابقة للبحث
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredAssets.map((asset) => (
                                    <TableRow key={asset.id}>
                                        <TableCell className="font-medium">{asset.assetName}</TableCell>
                                        <TableCell>
                                            <code className="bg-muted px-2 py-1 rounded text-sm">{asset.assetCode}</code>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <UserCircle className="h-4 w-4 text-muted-foreground" />
                                                {asset.employeeName}
                                            </div>
                                        </TableCell>
                                        <TableCell>{typeof asset.startDate === 'string' ? asset.startDate : asset.startDate.toLocaleDateString('ar-SA')}</TableCell>
                                        <TableCell>
                                            <Badge variant={asset.condition === 'excellent' ? 'default' : 'secondary'}>
                                                {asset.condition === 'excellent' ? 'ممتاز' : 'جيد'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm">{asset.notes || '-'}</TableCell>
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

export default MyCustodyPage;
