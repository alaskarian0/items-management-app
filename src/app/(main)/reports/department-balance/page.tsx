"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Building2,
  Search,
  Download,
  Filter,
  TrendingUp,
  TrendingDown,
  Package,
  Users,
  BarChart3,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import Link from "next/link";

// Mock data for department balance reports
const departmentData = [
  {
    id: 1,
    department: "قسم الشؤون الهندسية",
    division: "شعبة الهندسة المدنية",
    unit: "وحدة التخطيط",
    totalItems: 45,
    totalValue: 8750000,
    lastUpdate: new Date(2024, 11, 8),
    responsiblePerson: "أحمد محمد علي",
    status: "good",
    criticalItems: 2,
    lowStockItems: 5,
    issues: [
      { item: "كرسي مكتب", issue: "يحتاج صيانة" },
      { item: "طاولة اجتماعات", issue: "خدش على السطح" },
    ],
  },
  {
    id: 2,
    department: "قسم الشؤون الإدارية",
    division: "شعبة الشؤون الإدارية",
    unit: "وحدة الموارد البشرية",
    totalItems: 32,
    totalValue: 5250000,
    lastUpdate: new Date(2024, 11, 7),
    responsiblePerson: "فاطمة حسن",
    status: "warning",
    criticalItems: 5,
    lowStockItems: 8,
    issues: [
      { item: "كمبيوتر محمول", issue: "بطارية ضعيفة" },
      { item: "طابعة", issue: "تحتاج حبر" },
    ],
  },
  {
    id: 3,
    department: "قسم الشؤون الهندسية",
    division: "شعبة الهندسة الكهربائية",
    unit: "وحدة الصيانة الكهربائية",
    totalItems: 67,
    totalValue: 12300000,
    lastUpdate: new Date(2024, 11, 6),
    responsiblePerson: "محمد خالد",
    status: "critical",
    criticalItems: 12,
    lowStockItems: 15,
    issues: [
      { item: "معدات قياس", issue: "غير معايرة" },
      { item: "أسلاك كهربائية", issue: "كمية غير كافية" },
    ],
  },
  {
    id: 4,
    department: "قسم الشؤون الهندسية",
    division: "شعبة الهندسة الميكانيكية",
    unit: "وحدة الصيانة الميكانيكية",
    totalItems: 28,
    totalValue: 6800000,
    lastUpdate: new Date(2024, 11, 8),
    responsiblePerson: "علي حسن",
    status: "good",
    criticalItems: 1,
    lowStockItems: 3,
    issues: [],
  },
  {
    id: 5,
    department: "قسم الشؤون المالية",
    division: "شعبة الشؤون المالية",
    unit: "وحدة الشؤون المالية",
    totalItems: 15,
    totalValue: 3200000,
    lastUpdate: new Date(2024, 11, 5),
    responsiblePerson: "نورا أحمد",
    status: "good",
    criticalItems: 0,
    lowStockItems: 2,
    issues: [
      { item: "خزنة ملفات", issue: "قفل معطل" },
    ],
  },
];

const DepartmentBalanceReportsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("department");

  const departments = [
    "قسم الشؤون الهندسية",
    "قسم الشؤون الإدارية",
    "قسم الشؤون المالية",
  ];

  const sortOptions = [
    { value: "department", label: "اسم القسم" },
    { value: "items", label: "عدد المواد" },
    { value: "value", label: "القيمة" },
    { value: "update", label: "آخر تحديث" },
  ];

  const filteredData = useMemo(() => {
    let filtered = departmentData;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (dept) =>
          dept.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dept.division.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dept.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dept.responsiblePerson.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply department filter
    if (departmentFilter !== "all") {
      filtered = filtered.filter((dept) => dept.department === departmentFilter);
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((dept) => dept.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "items":
          return b.totalItems - a.totalItems;
        case "value":
          return b.totalValue - a.totalValue;
        case "update":
          return b.lastUpdate.getTime() - a.lastUpdate.getTime();
        default:
          return a.department.localeCompare(b.department);
      }
    });

    return filtered;
  }, [searchTerm, departmentFilter, statusFilter, sortBy]);

  const statistics = useMemo(() => {
    const totalDepartments = new Set(filteredData.map(d => d.department)).size;
    const totalUnits = filteredData.length;
    const totalItems = filteredData.reduce((sum, d) => sum + d.totalItems, 0);
    const totalValue = filteredData.reduce((sum, d) => sum + d.totalValue, 0);
    const criticalDepartments = filteredData.filter(d => d.status === "critical").length;

    return { totalDepartments, totalUnits, totalItems, totalValue, criticalDepartments };
  }, [filteredData]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "critical":
        return <Badge variant="destructive">حرج</Badge>;
      case "warning":
        return <Badge variant="secondary">تنبيه</Badge>;
      default:
        return <Badge variant="default">جيد</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "warning":
        return <TrendingDown className="h-4 w-4 text-yellow-600" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
  };

  const exportReport = (format: "pdf" | "excel") => {
    console.log(`Exporting department balance report as ${format}`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <Link href="/reports">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                العودة للتقارير
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Building2 className="h-8 w-8" />
            رصيد الأقسام
          </h1>
          <p className="text-muted-foreground mt-1">
            عرض المواد التي تم إصدارها إلى الأقسام المختلفة وتتبع حالتها
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الأقسام</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalDepartments}</div>
            <p className="text-xs text-muted-foreground">قسم</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الوحدات</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {statistics.totalUnits}
            </div>
            <p className="text-xs text-muted-foreground">وحدة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المواد</CardTitle>
            <Package className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {statistics.totalItems}
            </div>
            <p className="text-xs text-muted-foreground">مادة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">القيمة الإجمالية</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {(statistics.totalValue / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-muted-foreground">دينار عراقي</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">أقسام حرجة</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {statistics.criticalDepartments}
            </div>
            <p className="text-xs text-muted-foreground">تحتاج متابعة</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            الفلاتر والبحث
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ابحث عن قسم أو مسؤول..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>

            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="القسم..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأقسام</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="الحالة..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="good">جيد</SelectItem>
                <SelectItem value="warning">تنبيه</SelectItem>
                <SelectItem value="critical">حرج</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="الترتيب حسب..." />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Export Buttons */}
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => exportReport("excel")} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              تصدير Excel
            </Button>
            <Button variant="outline" onClick={() => exportReport("pdf")} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              تصدير PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Departments Table */}
      <Card>
        <CardHeader>
          <CardTitle>تفاصيل رصيد الأقسام</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">القسم</TableHead>
                  <TableHead className="text-right">الشعبة</TableHead>
                  <TableHead className="text-right">الوحدة</TableHead>
                  <TableHead className="text-right">المسؤول</TableHead>
                  <TableHead className="text-right">عدد المواد</TableHead>
                  <TableHead className="text-right">القيمة</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">الجرد</TableHead>
                  <TableHead className="text-right">المشاكل</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((dept) => (
                  <TableRow key={dept.id}>
                    <TableCell className="font-medium">{dept.department}</TableCell>
                    <TableCell>{dept.division}</TableCell>
                    <TableCell>{dept.unit}</TableCell>
                    <TableCell>{dept.responsiblePerson}</TableCell>
                    <TableCell className="font-medium">{dept.totalItems}</TableCell>
                    <TableCell className="font-medium">
                      {(dept.totalValue / 1000000).toFixed(1)}M
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(dept.status)}
                        {getStatusBadge(dept.status)}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {format(dept.lastUpdate, "yyyy-MM-dd", { locale: ar })}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm text-red-600">
                          {dept.criticalItems} مواد حرجة
                        </div>
                        <div className="text-sm text-yellow-600">
                          {dept.lowStockItems} مواد منخفضة
                        </div>
                        {dept.issues.length > 0 && (
                          <div className="text-xs text-muted-foreground">
                            {dept.issues.length} مشكلة مفتوحة
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Critical Departments Alert */}
      {statistics.criticalDepartments > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              أقسام تحتاج متابعة عاجلة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-800">
              هناك {statistics.criticalDepartments} أقسام تحتاج إلى متابعة عاجلة بسبب وجود مواد في حالة حرجة أو مشاكل تحتاج حل.
            </p>
            <div className="mt-3 space-y-2">
              {filteredData
                .filter(dept => dept.status === "critical")
                .map(dept => (
                  <div key={dept.id} className="flex items-center justify-between bg-white p-2 rounded border border-red-200">
                    <span className="font-medium">{dept.unit}</span>
                    <span className="text-sm text-red-600">
                      {dept.criticalItems} مواد حرجة
                    </span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DepartmentBalanceReportsPage;