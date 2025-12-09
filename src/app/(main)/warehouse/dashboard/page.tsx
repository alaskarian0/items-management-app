"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Package,
    Landmark,
    ArrowRight,
    Warehouse,
    Box,
    Settings2,
    TrendingUp,
    History
} from "lucide-react";
import { useRouter } from 'next/navigation';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { warehouses } from "@/lib/data/warehouse-data";

const WarehouseEntryPage = () => {
    const router = useRouter();
    const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>('');

    const handleEnter = (type: 'consumables' | 'assets') => {
        if (!selectedWarehouseId) {
            // Ideally show error, but for prototype we can default or just return
            return;
        }

        if (type === 'consumables') {
            router.push(`/warehouse/stock-balance?warehouse=${selectedWarehouseId}`);
        } else {
            router.push(`/fixed-assets/coding?warehouse=${selectedWarehouseId}`);
        }
    };

    // Flatten warehouses for dropdown
    const allWarehouses = warehouses;

    return (
        <div className="container mx-auto max-w-5xl py-10 space-y-8">

            {/* Header Section */}
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold tracking-tight text-primary">نظام إدارة المخازن المركزية</h1>
                <p className="text-xl text-muted-foreground">الرجاء اختيار المخزن ونوع العمليات للمتابعة</p>
            </div>

            {/* Warehouse Selection */}
            <Card className="border-2 border-primary/10 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Warehouse className="h-6 w-6 text-primary" />
                        اختيار المخزن
                    </CardTitle>
                    <CardDescription>حدد المخزن الذي تريد العمل عليه</CardDescription>
                </CardHeader>
                <CardContent>
                    <Select value={selectedWarehouseId} onValueChange={setSelectedWarehouseId}>
                        <SelectTrigger className="w-full h-12 text-lg">
                            <SelectValue placeholder="اختر المخزن..." />
                        </SelectTrigger>
                        <SelectContent>
                            {allWarehouses.map((wh) => (
                                <SelectItem key={wh.id} value={String(wh.id)}>
                                    {wh.name} {wh.code ? `(${wh.code})` : ''}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            {/* Entry Options - Only show if warehouse selected */}
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 transition-all duration-500 ${selectedWarehouseId ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4 pointer-events-none'}`}>

                {/* Consumables Option */}
                <Card
                    className="group hover:border-blue-500/50 hover:shadow-lg transition-all cursor-pointer relative overflow-hidden"
                    onClick={() => handleEnter('consumables')}
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150" />

                    <CardHeader className="text-center pt-10 pb-6">
                        <div className="mx-auto w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Package className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                        </div>
                        <CardTitle className="text-2xl mb-2">المواد المستهلكة (المخزون)</CardTitle>
                        <CardDescription className="text-base">
                            إدارة المواد الاستهلاكية، القرطاسية، الوقود، والمواد الغذائية
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Box className="h-4 w-4" />
                                <span>الرصيد المخزني</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4" />
                                <span>حركة المواد</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <History className="h-4 w-4" />
                                <span>سجل الإدخال والإخراج</span>
                            </div>
                        </div>
                        <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700">
                            دخول
                            <ArrowRight className="mr-2 h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>

                {/* Fixed Assets Option */}
                <Card
                    className="group hover:border-purple-500/50 hover:shadow-lg transition-all cursor-pointer relative overflow-hidden"
                    onClick={() => handleEnter('assets')}
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150" />

                    <CardHeader className="text-center pt-10 pb-6">
                        <div className="mx-auto w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Landmark className="h-10 w-10 text-purple-600 dark:text-purple-400" />
                        </div>
                        <CardTitle className="text-2xl mb-2">المواد الثابتة (الموجودات)</CardTitle>
                        <CardDescription className="text-base">
                            إدارة الأثاث، الأجهزة، الآليات، وتتبع الذمة والترميز
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Settings2 className="h-4 w-4" />
                                <span>الترميز والباركود</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Box className="h-4 w-4" />
                                <span>سجل الذمة</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <History className="h-4 w-4" />
                                <span>نقل الملكية والشطب</span>
                            </div>
                        </div>
                        <Button className="w-full mt-6 bg-purple-600 hover:bg-purple-700">
                            دخول
                            <ArrowRight className="mr-2 h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
};

export default WarehouseEntryPage;
