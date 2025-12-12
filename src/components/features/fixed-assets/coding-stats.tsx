"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Barcode, CheckCircle2, XCircle } from "lucide-react";

interface CodingStatsProps {
  total: number;
  coded: number;
  pending: number;
}

export const CodingStats = ({ total, coded, pending }: CodingStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">إجمالي الموجودات</CardTitle>
          <Barcode className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{total}</div>
          <p className="text-xs text-muted-foreground">جميع الموجودات الثابتة</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">مرمزة</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{coded}</div>
          <p className="text-xs text-muted-foreground">تم تعيين باركود</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">بانتظار الترميز</CardTitle>
          <XCircle className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{pending}</div>
          <p className="text-xs text-muted-foreground">لم يتم تعيين باركود</p>
        </CardContent>
      </Card>
    </div>
  );
};
