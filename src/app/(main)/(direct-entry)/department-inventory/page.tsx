"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClipboardList, Search, Download, Building2, Package } from "lucide-react";

// --- MOCK DATA ---
const departments = [
  { id: "all", name: "جميع الأقسام" },
  { id: "1", name: "قسم الشؤون الهندسية" },
  { id: "2", name: "قسم الشؤون الإدارية" },
  { id: "3", name: "قسم المحاسبة" },
  { id: "4", name: "قسم تقنية المعلومات" },
  { id: "5", name: "قسم الموارد البشرية" },
];

const departmentInventory = [
  {
    id: 1,
    itemName: "كرسي مكتب",
    itemCode: "FUR-CHR-001",
    department: "قسم الشؤون الهندسية",
    departmentId: "1",
    quantity: 25,
    unit: "قطعة",
    lastUpdate: "2024-03-15",
    condition: "جيد",
  },
  {
    id: 2,
    itemName: "طاولة اجتماعات",
    itemCode: "FUR-TBL-001",
    department: "قسم الشؤون الإدارية",
    departmentId: "2",
    quantity: 5,
    unit: "قطعة",
    lastUpdate: "2024-03-14",
    condition: "ممتاز",
  },
  {
    id: 3,
    itemName: "حاسوب محمول",
    itemCode: "TECH-LAP-001",
    department: "قسم تقنية المعلومات",
    departmentId: "4",
    quantity: 15,
    unit: "جهاز",
    lastUpdate: "2024-03-13",
    condition: "جيد",
  },
  {
    id: 4,
    itemName: "مكتب خشبي",
    itemCode: "FUR-DSK-001",
    department: "قسم المحاسبة",
    departmentId: "3",
    quantity: 10,
    unit: "قطعة",
    lastUpdate: "2024-03-12",
    condition: "جيد",
  },
  {
    id: 5,
    itemName: "خزانة ملفات",
    itemCode: "FUR-CAB-001",
    department: "قسم الموارد البشرية",
    departmentId: "5",
    quantity: 8,
    unit: "قطعة",
    lastUpdate: "2024-03-11",
    condition: "ممتاز",
  },
  {
    id: 6,
    itemName: "طابعة HP",
    itemCode: "TECH-PRT-001",
    department: "قسم الشؤون الإدارية",
    departmentId: "2",
    quantity: 3,
    unit: "جهاز",
    lastUpdate: "2024-03-10",
    condition: "جيد",
  },
  {
    id: 7,
    itemName: "كرسي مكتب",
    itemCode: "FUR-CHR-001",
    department: "قسم المحاسبة",
    departmentId: "3",
    quantity: 12,
    unit: "قطعة",
    lastUpdate: "2024-03-09",
    condition: "مقبول",
  },
];

const DepartmentInventoryPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");

  // Filter inventory
  const filteredInventory = useMemo(() => {
    return departmentInventory.filter((item) => {
      const matchesSearch =
        searchTerm === "" ||
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.department.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDepartment =
        selectedDepartment === "all" || item.departmentId === selectedDepartment;

      return matchesSearch && matchesDepartment;
    });
  }, [searchTerm, selectedDepartment]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalItems = filteredInventory.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    const totalTypes = filteredInventory.length;
    const departmentsWithItems = new Set(
      filteredInventory.map((item) => item.departmentId)
    ).size;

    return {
      totalItems,
      totalTypes,
      departmentsWithItems,
    };
  }, [filteredInventory]);

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "ممتاز":
        return "bg-green-500";
      case "جيد":
        return "bg-blue-500";
      case "مقبول":
        return "bg-yellow-500";
      case "سيء":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <ClipboardList className="h-8 w-8 text-blue-600" />
          جرد الأقسام
        </h2>
        <p className="text-muted-foreground mt-1">
          عرض وإدارة المواد الموجودة حالياً في الأقسام المختلفة
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              إجمالي الكميات
            </CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.totalItems}
            </div>
            <p className="text-xs text-muted-foreground">وحدة في الأقسام</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">أنواع المواد</CardTitle>
            <Package className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.totalTypes}
            </div>
            <p className="text-xs text-muted-foreground">نوع مختلف</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الأقسام النشطة</CardTitle>
            <Building2 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {stats.departmentsWithItems}
            </div>
            <p className="text-xs text-muted-foreground">قسم لديه مواد</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>تفاصيل جرد الأقسام</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filters */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">البحث والتصفية</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative md:col-span-2">
                <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="ابحث بالمادة أو الكود أو القسم..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-8"
                />
              </div>
              <Select
                value={selectedDepartment}
                onValueChange={setSelectedDepartment}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر القسم..." />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Inventory Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">
                جدول المواد ({filteredInventory.length})
              </Label>
              <Button variant="outline" size="sm">
                <Download className="ml-2 h-4 w-4" />
                تصدير Excel
              </Button>
            </div>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الكود</TableHead>
                    <TableHead>اسم المادة</TableHead>
                    <TableHead>القسم</TableHead>
                    <TableHead>الكمية</TableHead>
                    <TableHead>الوحدة</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>آخر تحديث</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center text-muted-foreground h-24"
                      >
                        لا توجد مواد تطابق معايير البحث
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredInventory.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Badge variant="outline" className="font-mono">
                            {item.itemCode}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {item.itemName}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            {item.department}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-bold text-lg text-blue-600">
                            {item.quantity}
                          </span>
                        </TableCell>
                        <TableCell>{item.unit}</TableCell>
                        <TableCell>
                          <Badge className={getConditionColor(item.condition)}>
                            {item.condition}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {item.lastUpdate}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DepartmentInventoryPage;
