"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, History } from "lucide-react";
import { WarehouseSelector } from "@/components/warehouse/warehouse-selector";
import { useWarehouse } from "@/context/warehouse-context";

const ItemMovementPage = () => {
  const { selectedWarehouse } = useWarehouse();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <History className="h-8 w-8" />
          حركة المواد
        </h2>
        <p className="text-muted-foreground mt-1">
          تتبع ومراقبة جميع حركات المواد داخل وخارج المخزن
        </p>
      </div>

      {/* Warehouse Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">اختيار المخزن</CardTitle>
        </CardHeader>
        <CardContent>
          {!selectedWarehouse ? (
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  الرجاء اختيار المخزن لعرض حركة المواد
                </AlertDescription>
              </Alert>
              <WarehouseSelector />
            </div>
          ) : (
            <div className="space-y-4">
              <WarehouseSelector />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Movement Content */}
      {selectedWarehouse && (
        <Card>
          <CardHeader>
            <CardTitle>سجل حركة المواد</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <History className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg">
                سيتم إضافة محتوى حركة المواد قريباً...
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                سيشمل هذا القسم جميع عمليات الإدخال والإصدار للمواد
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ItemMovementPage;
