"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  History,
  PackagePlus,
  PackageMinus,
  Calendar,
  Search,
  Filter,
  Download,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type MovementType = "entry" | "issuance" | "transfer";

type ItemMovement = {
  id: string;
  date: string;
  itemName: string;
  itemCode: string;
  type: MovementType;
  quantity: number;
  unit: string;
  warehouse: string;
  department?: string;
  documentNumber: string;
  notes?: string;
  performedBy: string;
};

// Mock data
const mockMovements: ItemMovement[] = [
  {
    id: "1",
    date: "2024-03-15 10:30",
    itemName: "كرسي مكتب دوار",
    itemCode: "FUR-CHR-001",
    type: "entry",
    quantity: 50,
    unit: "قطعة",
    warehouse: "المخزن الرئيسي",
    documentNumber: "ENT-2024-001",
    performedBy: "أحمد محمد",
    notes: "إدخال من المورد الرئيسي",
  },
  {
    id: "2",
    date: "2024-03-15 14:20",
    itemName: "كرسي مكتب دوار",
    itemCode: "FUR-CHR-001",
    type: "issuance",
    quantity: 10,
    unit: "قطعة",
    warehouse: "المخزن الرئيسي",
    department: "قسم الموارد البشرية",
    documentNumber: "ISS-2024-045",
    performedBy: "سارة علي",
  },
  {
    id: "3",
    date: "2024-03-14 11:45",
    itemName: "ورق طباعة A4",
    itemCode: "OFF-PAP-002",
    type: "entry",
    quantity: 500,
    unit: "حزمة",
    warehouse: "مخزن المواد الاستهلاكية",
    documentNumber: "ENT-2024-002",
    performedBy: "أحمد محمد",
  },
  {
    id: "4",
    date: "2024-03-14 15:30",
    itemName: "ورق طباعة A4",
    itemCode: "OFF-PAP-002",
    type: "issuance",
    quantity: 50,
    unit: "حزمة",
    warehouse: "مخزن المواد الاستهلاكية",
    department: "قسم المحاسبة",
    documentNumber: "ISS-2024-046",
    performedBy: "سارة علي",
  },
  {
    id: "5",
    date: "2024-03-13 09:15",
    itemName: "طاولة اجتماعات",
    itemCode: "FUR-TBL-003",
    type: "entry",
    quantity: 5,
    unit: "قطعة",
    warehouse: "مخزن الأثاث",
    documentNumber: "ENT-2024-003",
    performedBy: "خالد حسن",
  },
  {
    id: "6",
    date: "2024-03-12 16:00",
    itemName: "حاسوب محمول",
    itemCode: "TECH-LAP-004",
    type: "issuance",
    quantity: 3,
    unit: "جهاز",
    warehouse: "مخزن المواد الثابتة",
    department: "قسم تقنية المعلومات",
    documentNumber: "ISS-2024-047",
    performedBy: "محمد عبدالله",
  },
];

const ItemMovementReportPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [warehouseFilter, setWarehouseFilter] = useState<string>("all");

  // Calculate statistics
  const stats = useMemo(() => {
    const totalEntries = mockMovements.filter((m) => m.type === "entry").length;
    const totalIssuances = mockMovements.filter(
      (m) => m.type === "issuance"
    ).length;
    const totalQuantityIn = mockMovements
      .filter((m) => m.type === "entry")
      .reduce((sum, m) => sum + m.quantity, 0);
    const totalQuantityOut = mockMovements
      .filter((m) => m.type === "issuance")
      .reduce((sum, m) => sum + m.quantity, 0);

    return {
      totalMovements: mockMovements.length,
      totalEntries,
      totalIssuances,
      totalQuantityIn,
      totalQuantityOut,
      netMovement: totalQuantityIn - totalQuantityOut,
    };
  }, []);

  // Filter movements
  const filteredMovements = useMemo(() => {
    return mockMovements.filter((movement) => {
      const matchesSearch =
        searchTerm === "" ||
        movement.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movement.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movement.documentNumber.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = typeFilter === "all" || movement.type === typeFilter;

      const matchesWarehouse =
        warehouseFilter === "all" || movement.warehouse === warehouseFilter;

      return matchesSearch && matchesType && matchesWarehouse;
    });
  }, [searchTerm, typeFilter, warehouseFilter]);

  const getTypeColor = (type: MovementType) => {
    switch (type) {
      case "entry":
        return "bg-green-500";
      case "issuance":
        return "bg-blue-500";
      case "transfer":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const getTypeLabel = (type: MovementType) => {
    switch (type) {
      case "entry":
        return "إدخال";
      case "issuance":
        return "إصدار";
      case "transfer":
        return "نقل";
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">تقرير حركة المواد</h2>
        <p className="text-muted-foreground mt-1">
          تتبع شامل لجميع عمليات إدخال وإصدار المواد
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الحركات</CardTitle>
            <History className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMovements}</div>
            <p className="text-xs text-muted-foreground">عملية مسجلة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">عمليات الإدخال</CardTitle>
            <PackagePlus className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.totalEntries}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.totalQuantityIn} وحدة
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">عمليات الإصدار</CardTitle>
            <PackageMinus className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.totalIssuances}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.totalQuantityOut} وحدة
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">صافي الحركة</CardTitle>
            {stats.netMovement >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${stats.netMovement >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {stats.netMovement > 0 ? "+" : ""}
              {stats.netMovement}
            </div>
            <p className="text-xs text-muted-foreground">وحدة</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            البحث والتصفية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ابحث عن مادة أو كود..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-8"
              />
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="نوع الحركة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                <SelectItem value="entry">إدخال</SelectItem>
                <SelectItem value="issuance">إصدار</SelectItem>
                <SelectItem value="transfer">نقل</SelectItem>
              </SelectContent>
            </Select>

            <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
              <SelectTrigger>
                <SelectValue placeholder="المخزن" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المخازن</SelectItem>
                <SelectItem value="المخزن الرئيسي">المخزن الرئيسي</SelectItem>
                <SelectItem value="مخزن المواد الثابتة">
                  مخزن المواد الثابتة
                </SelectItem>
                <SelectItem value="مخزن المواد الاستهلاكية">
                  مخزن المواد الاستهلاكية
                </SelectItem>
                <SelectItem value="مخزن الأثاث">مخزن الأثاث</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="w-full">
              <Download className="ml-2 h-4 w-4" />
              تصدير التقرير
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Movements Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <History className="h-5 w-5" />
              سجل الحركات ({filteredMovements.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>التاريخ</TableHead>
                  <TableHead>اسم المادة</TableHead>
                  <TableHead>الكود</TableHead>
                  <TableHead>النوع</TableHead>
                  <TableHead>الكمية</TableHead>
                  <TableHead>المخزن</TableHead>
                  <TableHead>القسم</TableHead>
                  <TableHead>رقم المستند</TableHead>
                  <TableHead>المنفذ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMovements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center h-24">
                      لا توجد حركات تطابق معايير البحث
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMovements.map((movement) => (
                    <TableRow key={movement.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {movement.date}
                        </div>
                      </TableCell>
                      <TableCell>{movement.itemName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{movement.itemCode}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getTypeColor(movement.type)}>
                          {getTypeLabel(movement.type)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold">
                          {movement.type === "entry" ? "+" : "-"}
                          {movement.quantity}
                        </span>{" "}
                        {movement.unit}
                      </TableCell>
                      <TableCell className="text-sm">
                        {movement.warehouse}
                      </TableCell>
                      <TableCell className="text-sm">
                        {movement.department || "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {movement.documentNumber}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {movement.performedBy}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ItemMovementReportPage;
