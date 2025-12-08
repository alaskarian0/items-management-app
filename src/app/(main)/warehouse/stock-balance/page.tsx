"use client";

import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Boxes, Search } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { WarehouseSelector } from "@/components/warehouse/warehouse-selector";
import { useWarehouse } from "@/context/warehouse-context";

// --- MOCK DATA ---
const allItems = [
  {
    id: 1,
    name: "كرسي مكتب",
    code: "FUR-CHR-001",
    unit: "قطعة",
    stock: 50,
    group: "كراسي",
  },
  {
    id: 2,
    name: "كرسي قاعة",
    code: "FUR-CHR-002",
    unit: "قطعة",
    stock: 200,
    group: "كراسي",
  },
  {
    id: 3,
    name: "طاولة اجتماعات",
    code: "FUR-TBL-001",
    unit: "قطعة",
    stock: 10,
    group: "طاولات",
  },
  {
    id: 4,
    name: "سجاد صحراوي 2*3 م",
    code: "CRP-IND-001",
    unit: "قطعة",
    stock: 120,
    group: "سجاد صناعي",
  },
  {
    id: 5,
    name: "سجاد إيراني",
    code: "CRP-IND-002",
    unit: "قطعة",
    stock: 75,
    group: "سجاد صناعي",
  },
  {
    id: 6,
    name: "مكتب خشبي",
    code: "FUR-DSK-001",
    unit: "قطعة",
    stock: 35,
    group: "مكاتب",
  },
  {
    id: 7,
    name: "خزانة ملفات",
    code: "FUR-CAB-001",
    unit: "قطعة",
    stock: 15,
    group: "خزائن",
  },
];

const itemGroups = ["كراسي", "طاولات", "سجاد صناعي", "مكاتب", "خزائن"];

const StockBalancePage = () => {
  const { selectedWarehouse } = useWarehouse();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string>("all");

  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      const matchesGroup =
        selectedGroup === "all" || item.group === selectedGroup;
      const matchesSearch =
        searchTerm === "" ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesGroup && matchesSearch;
    });
  }, [searchTerm, selectedGroup]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalItems = filteredItems.length;
    const totalStock = filteredItems.reduce((sum, item) => sum + item.stock, 0);
    return { totalItems, totalStock };
  }, [filteredItems]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Boxes className="h-8 w-8" />
          الرصيد المخزني
        </h2>
        <p className="text-muted-foreground mt-1">
          عرض وإدارة الأرصدة الحالية لجميع المواد في المخزن المحدد
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
                  الرجاء اختيار المخزن لعرض الرصيد المخزني
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

      {/* Statistics Cards */}
      {selectedWarehouse && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                إجمالي الأصناف
              </CardTitle>
              <Boxes className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalItems}</div>
              <p className="text-xs text-muted-foreground">صنف متوفر</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                إجمالي الكميات
              </CardTitle>
              <Boxes className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.totalStock}
              </div>
              <p className="text-xs text-muted-foreground">وحدة في المخزن</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                المجموعات النشطة
              </CardTitle>
              <Boxes className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {itemGroups.length}
              </div>
              <p className="text-xs text-muted-foreground">مجموعة</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Stock Balance Content */}
      {selectedWarehouse && (
        <Card>
          <CardHeader>
            <CardTitle>تفاصيل الرصيد المخزني</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Filters */}
            <div className="space-y-2">
              <Label className="text-base font-semibold">البحث والتصفية</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="ابحث بالاسم أو الكود..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-8"
                  />
                </div>
                <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                  <SelectTrigger>
                    <SelectValue placeholder="فلترة حسب المجموعة..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">كل المجموعات</SelectItem>
                    {itemGroups.map((group) => (
                      <SelectItem key={group} value={group}>
                        {group}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Stock Table */}
            <div className="space-y-2">
              <Label className="text-base font-semibold">جدول المواد</Label>
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
                          <TableCell>
                            <Badge variant="outline" className="font-mono">
                              {item.code}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            {item.name}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{item.group}</Badge>
                          </TableCell>
                          <TableCell>{item.unit}</TableCell>
                          <TableCell>
                            <span className="font-bold text-lg text-blue-600">
                              {item.stock}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center text-muted-foreground h-24"
                        >
                          لا توجد مواد تطابق معايير البحث
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StockBalancePage;
