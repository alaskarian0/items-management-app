"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { WarehouseSelector } from "@/components/warehouse/warehouse-selector";
import { useWarehouse } from "@/context/warehouse-context";

const ItemMovementPage = () => {
    const { selectedWarehouse } = useWarehouse();

    // Show warehouse selection prompt if no warehouse selected
    if (!selectedWarehouse) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>حركة المواد</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            الرجاء اختيار المخزن لعرض حركة المواد
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
                    <CardTitle>حركة المواد</CardTitle>
                    <div className="w-[300px]">
                        <WarehouseSelector />
                    </div>
                </div>
                <div className="text-sm text-muted-foreground bg-muted p-2 rounded-md">
                    المخزن المحدد: <span className="font-semibold">{selectedWarehouse.name}</span>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground text-center py-8">
                    سيتم إضافة محتوى حركة المواد قريباً...
                </p>
            </CardContent>
        </Card>
    );
};

export default ItemMovementPage;
