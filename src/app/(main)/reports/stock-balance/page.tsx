"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { WarehouseSelector } from "@/components/warehouse/warehouse-selector";
import { usePageTitle } from "@/context/breadcrumb-context";
import { useWarehouse } from "@/context/warehouse-context";
import {
  AlertTriangle,
  ArrowLeft,
  Boxes,
  Filter,
  Search,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

// Mock data for stock balance reports
const stockData = [
  {
    id: 1,
    code: "FUR-CHR-001",
    name: "كرسي مكتب",
    category: "كراسي",
    currentStock: 50,
    minStock: 20,
    maxStock: 100,
    unit: "قطعة",
    lastUpdated: "2024-12-08",
    supplier: "شركة النبلاء",
    averageCost: 25000,
    totalValue: 1250000,
    status: "normal",
    department: "قسم الشؤون الهندسية",
    division: "شعبة الهندسة المدنية",
    unitName: "وحدة التخطيط",
  },
  {
    id: 2,
    code: "FUR-TBL-001",
    name: "طاولة اجتماعات",
    category: "طاولات",
    currentStock: 10,
    minStock: 15,
    maxStock: 50,
    unit: "قطعة",
    lastUpdated: "2024-12-07",
    supplier: "موردون متحدون",
    averageCost: 75000,
    totalValue: 750000,
    status: "low",
    department: "قسم الشؤون الإدارية",
    division: "شعبة الشؤون الإدارية",
    unitName: "وحدة الموارد البشرية",
  },
  {
    id: 3,
    code: "CRP-IND-001",
    name: "سجاد صحراوي 2*3 م",
    category: "سجاد صناعي",
    currentStock: 120,
    minStock: 30,
    maxStock: 200,
    unit: "قطعة",
    lastUpdated: "2024-12-08",
    supplier: "منظمة الهلال الأحمر",
    averageCost: 45000,
    totalValue: 5400000,
    status: "normal",
    department: "قسم الشؤون الهندسية",
    division: "شعبة الهندسة الكهربائية",
    unitName: "وحدة الصيانة الكهربائية",
  },
  {
    id: 4,
    code: "ELE-DSP-001",
    name: "شاشة عرض",
    category: "إلكترونيات",
    currentStock: 5,
    minStock: 10,
    maxStock: 25,
    unit: "قطعة",
    lastUpdated: "2024-12-06",
    supplier: "شركة التقنية المتقدمة",
    averageCost: 450000,
    totalValue: 2250000,
    status: "critical",
    department: "قسم الشؤون الهندسية",
    division: "شعبة الهندسة الميكانيكية",
    unitName: "وحدة الصيانة الميكانيكية",
  },
  {
    id: 5,
    code: "FUR-DSK-001",
    name: "مكتب خشبي",
    category: "مكاتب",
    currentStock: 35,
    minStock: 20,
    maxStock: 60,
    unit: "قطعة",
    lastUpdated: "2024-12-08",
    supplier: "مورّد الأثاث الحديث",
    averageCost: 85000,
    totalValue: 2975000,
    status: "normal",
    department: "قسم الشؤون الإدارية",
    division: "شعبة الشؤون الإدارية",
    unitName: "وحدة الشؤون المالية",
  },
  {
    id: 6,
    code: "FUR-CAB-001",
    name: "خزانة ملفات",
    category: "خزائن",
    currentStock: 15,
    minStock: 20,
    maxStock: 40,
    unit: "قطعة",
    lastUpdated: "2024-12-05",
    supplier: "مورّد الأثاث الحديث",
    averageCost: 120000,
    totalValue: 1800000,
    status: "low",
    department: "قسم الشؤون الإدارية",
    division: "شعبة الشؤون الإدارية",
    unitName: "وحدة الموارد البشرية",
  },
];

const StockBalanceReportsPage = () => {
  usePageTitle("تقارير الرصيد المخزني");

  const { selectedWarehouse } = useWarehouse();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [divisionFilter, setDivisionFilter] = useState<string>("all");
  const [unitFilter, setUnitFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");

  const categories = [
    "كراسي",
    "طاولات",
    "سجاد صناعي",
    "إلكترونيات",
    "مكاتب",
    "خزائن",
  ];
  const departments = ["قسم الشؤون الهندسية", "قسم الشؤون الإدارية"];
  const divisions = [
    "شعبة الهندسة المدنية",
    "شعبة الهندسة الكهربائية",
    "شعبة الهندسة الميكانيكية",
    "شعبة الشؤون الإدارية",
    "شعبة الشؤون المالية",
    "شعبة الموارد البشرية",
  ];
  const units = [
    "وحدة التخطيط",
    "وحدة الموارد البشرية",
    "وحدة الصيانة الكهربائية",
    "وحدة الصيانة الميكانيكية",
    "وحدة الشؤون المالية",
  ];
  const sortOptions = [
    { value: "name", label: "اسم المادة" },
    { value: "stock", label: "الرصيد" },
    { value: "value", label: "القيمة" },
    { value: "code", label: "الكود" },
  ];

  const filteredData = useMemo(() => {
    let filtered = stockData;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.division.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.unitName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((item) => item.category === categoryFilter);
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    // Apply department filter
    if (departmentFilter !== "all") {
      filtered = filtered.filter(
        (item) => item.department === departmentFilter
      );
    }

    // Apply division filter
    if (divisionFilter !== "all") {
      filtered = filtered.filter((item) => item.division === divisionFilter);
    }

    // Apply unit filter
    if (unitFilter !== "all") {
      filtered = filtered.filter((item) => item.unitName === unitFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "stock":
          return b.currentStock - a.currentStock;
        case "value":
          return b.totalValue - a.totalValue;
        case "code":
          return a.code.localeCompare(b.code);
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [
    searchTerm,
    categoryFilter,
    statusFilter,
    departmentFilter,
    divisionFilter,
    unitFilter,
    sortBy,
  ]);

  const statistics = useMemo(() => {
    const totalItems = filteredData.length;
    const totalValue = filteredData.reduce(
      (sum, item) => sum + item.totalValue,
      0
    );
    const lowStock = filteredData.filter(
      (item) => item.status === "low" || item.status === "critical"
    ).length;
    const criticalStock = filteredData.filter(
      (item) => item.status === "critical"
    ).length;

    return { totalItems, totalValue, lowStock, criticalStock };
  }, [filteredData]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "critical":
        return <Badge variant="destructive">حرج</Badge>;
      case "low":
        return <Badge variant="secondary">منخفض</Badge>;
      default:
        return <Badge variant="default">طبيعي</Badge>;
    }
  };

  const getStockColor = (current: number, min: number, max: number) => {
    if (current <= min) return "text-red-600";
    if (current >= max) return "text-orange-600";
    return "text-green-600";
  };

  const exportReport = (format: "pdf" | "excel") => {
    console.log(`Exporting stock balance report as ${format}`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Boxes className="h-8 w-8" />
            تقارير الرصيد المخزني
          </h1>
          <p className="text-muted-foreground mt-1">
            تقارير شاملة عن الأرصدة الحالية والمستويات الحرجة للمواد
          </p>
        </div>
      </div>

      {/* Warehouse Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">اختيار المخزن</CardTitle>
        </CardHeader>
        <CardContent>
          {!selectedWarehouse ? (
            <WarehouseSelector />
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    {selectedWarehouse.name}
                  </Badge>
                </div>
                <WarehouseSelector />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedWarehouse && (
        <>
          {/* Statistics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  إجمالي الأصناف
                </CardTitle>
                <Boxes className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {statistics.totalItems}
                </div>
                <p className="text-xs text-muted-foreground">صنف نشط</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  القيمة الإجمالية
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {(statistics.totalValue / 1000000).toFixed(1)}M
                </div>
                <p className="text-xs text-muted-foreground">دينار عراقي</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  مخزون منخفض
                </CardTitle>
                <TrendingDown className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {statistics.lowStock}
                </div>
                <p className="text-xs text-muted-foreground">
                  صنف يحتاج إعادة طلب
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  مخزون خطير
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {statistics.criticalStock}
                </div>
                <p className="text-xs text-muted-foreground">صنف طارئ</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
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
                    placeholder="ابحث عن مادة، قسم، أو وحدة..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                </div>

                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="الفئة..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الفئات</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
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
                    <SelectItem value="normal">طبيعي</SelectItem>
                    <SelectItem value="low">منخفض</SelectItem>
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                <Select
                  value={departmentFilter}
                  onValueChange={setDepartmentFilter}
                >
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

                <Select
                  value={divisionFilter}
                  onValueChange={setDivisionFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="الشعبة..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الشعب</SelectItem>
                    {divisions.map((division) => (
                      <SelectItem key={division} value={division}>
                        {division}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={unitFilter} onValueChange={setUnitFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="الوحدة..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الوحدات</SelectItem>
                    {units.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => exportReport("excel")}
                  size="sm"
                >
                  Excel
                </Button>
                <Button
                  variant="outline"
                  onClick={() => exportReport("pdf")}
                  size="sm"
                >
                  PDF
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stock Balance Table */}
          <Card>
            <CardHeader>
              <CardTitle>تفاصيل الرصيد المخزني</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">كود المادة</TableHead>
                      <TableHead className="text-right">اسم المادة</TableHead>
                      <TableHead className="text-right">الفئة</TableHead>
                      <TableHead className="text-right">القسم</TableHead>
                      <TableHead className="text-right">الشعبة</TableHead>
                      <TableHead className="text-right">الوحدة</TableHead>
                      <TableHead className="text-right">الحد الأدنى</TableHead>
                      <TableHead className="text-right">الحد الأعلى</TableHead>
                      <TableHead className="text-right">
                        الرصيد الحالي
                      </TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">المورد</TableHead>
                      <TableHead className="text-right">القيمة</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((item) => (
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
                          <Badge variant="secondary">{item.category}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {item.department}
                        </TableCell>
                        <TableCell className="text-sm">
                          {item.division}
                        </TableCell>
                        <TableCell className="text-sm">
                          {item.unitName}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.minStock}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.maxStock}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`font-bold ${getStockColor(
                              item.currentStock,
                              item.minStock,
                              item.maxStock
                            )}`}
                          >
                            {item.currentStock}
                          </span>
                        </TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                        <TableCell className="text-sm">
                          {item.supplier}
                        </TableCell>
                        <TableCell className="font-medium text-right">
                          {item.totalValue.toLocaleString('ar-IQ', {
                            style: 'currency',
                            currency: 'د.ع',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                          })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default StockBalanceReportsPage;
