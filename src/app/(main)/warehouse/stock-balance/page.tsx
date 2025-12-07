"use client";

import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { WarehouseSelector } from "@/components/warehouse/warehouse-selector";
import { useWarehouse } from "@/context/warehouse-context";

// --- MOCK DATA ---
const allItems = [
    { id: 1, name: 'كرسي مكتب', code: 'FUR-CHR-001', unit: 'قطعة', stock: 50, group: 'كراسي' },
    { id: 2, name: 'كرسي قاعة', code: 'FUR-CHR-002', unit: 'قطعة', stock: 200, group: 'كراسي' },
    { id: 3, name: 'طاولة اجتماعات', code: 'FUR-TBL-001', unit: 'قطعة', stock: 10, group: 'طاولات' },
    { id: 4, name: 'سجاد صحراوي 2*3 م', code: 'CRP-IND-001', unit: 'قطعة', stock: 120, group: 'سجاد صناعي' },
    { id: 5, name: 'سجاد إيراني', code: 'CRP-IND-002', unit: 'قطعة', stock: 75, group: 'سجاد صناعي' },
];

const itemGroups = ['كراسي', 'طاولات', 'سجاد صناعي'];

const StockBalancePage = () => {
    const { selectedWarehouse } = useWarehouse();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGroup, setSelectedGroup] = useState<string>('all');

    const filteredItems = useMemo(() => {
        return allItems.filter(item => {
            const matchesGroup = selectedGroup === 'all' || item.group === selectedGroup;
            const matchesSearch = searchTerm === '' ||
                                  item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  item.code.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesGroup && matchesSearch;
        });
    }, [searchTerm, selectedGroup]);

    // Show warehouse selection prompt if no warehouse selected
    if (!selectedWarehouse) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>الرصيد المخزني</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            الرجاء اختيار المخزن لعرض الرصيد المخزني
                        </AlertDescription>
                    </Alert>
                    <WarehouseSelector />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="space-y-4">
                <div className="flex items-start justify-between">
                    <CardTitle>الرصيد المخزني</CardTitle>
                    <div className="w-[300px]">
                        <WarehouseSelector />
                    </div>
                </div>
                <div className="text-sm text-muted-foreground bg-muted p-2 rounded-md">
                    المخزن المحدد: <span className="font-semibold">{selectedWarehouse.name}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                        placeholder="ابحث بالاسم أو الكود..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                        <SelectTrigger>
                            <SelectValue placeholder="فلترة حسب المجموعة..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">كل المجموعات</SelectItem>
                            {itemGroups.map(group => (
                                <SelectItem key={group} value={group}>{group}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent>
                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>كود المادة</TableHead>
                                <TableHead>اسم المادة</TableHead>
                                <TableHead>المجموعة</TableHead>
                                <TableHead>وحدة القياس</TableHead>
                                <TableHead>الرصيد الحالي</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredItems.length > 0 ? (
                                filteredItems.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-mono">{item.code}</TableCell>
                                        <TableCell className="font-medium">{item.name}</TableCell>
                                        <TableCell>{item.group}</TableCell>
                                        <TableCell>{item.unit}</TableCell>
                                        <TableCell className="font-bold text-lg">{item.stock}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center">
                                        لا توجد مواد تطابق معايير البحث.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
};

export default StockBalancePage;
