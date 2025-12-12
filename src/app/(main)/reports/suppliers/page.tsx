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
  Truck,
  Search,
  Download,
  Filter,
  TrendingUp,
  TrendingDown,
  Package,
  Phone,
  Mail,
  MapPin,
  Calendar,
  BarChart3,
} from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import Link from "next/link";

// Mock data for suppliers reports
const suppliersData = [
  {
    id: 1,
    name: "شركة النبلاء",
    code: "SUP-001",
    phone: "+964 770 123 4567",
    email: "info@alnobalaa.iq",
    address: "بغداد، الكرادة",
    category: "الأثاث المكتبي",
    rating: 4.5,
    totalOrders: 45,
    totalValue: 250000000,
    lastOrder: new Date(2024, 11, 5),
    status: "active",
    paymentTerms: "30 يوم",
    avgDeliveryTime: "7 أيام",
  },
  {
    id: 2,
    name: "موردون متحدون",
    code: "SUP-002",
    phone: "+964 770 234 5678",
    email: "sales@unitedsuppliers.iq",
    address: "أربيل، منطقة الصناعية",
    category: "المعدات المكتبية",
    rating: 4.2,
    totalOrders: 32,
    totalValue: 180000000,
    lastOrder: new Date(2024, 11, 1),
    status: "active",
    paymentTerms: "15 يوم",
    avgDeliveryTime: "5 أيام",
  },
  {
    id: 3,
    name: "منظمة الهلال الأحمر",
    code: "SUP-003",
    phone: "+964 770 345 6789",
    email: "donations@redcrescent.iq",
    address: "بغداد، المنصور",
    category: "منظمات خيرية",
    rating: 5.0,
    totalOrders: 12,
    totalValue: 0,
    lastOrder: new Date(2024, 11, 6),
    status: "active",
    paymentTerms: "تبرع",
    avgDeliveryTime: "3 أيام",
  },
  {
    id: 4,
    name: "شركة التقنية المتقدمة",
    code: "SUP-004",
    phone: "+964 770 456 7890",
    email: "info@advancedtech.iq",
    address: "النجف، المنطقة الصناعية",
    category: "الإلكترونيات",
    rating: 4.8,
    totalOrders: 28,
    totalValue: 320000000,
    lastOrder: new Date(2024, 10, 28),
    status: "active",
    paymentTerms: "45 يوم",
    avgDeliveryTime: "10 أيام",
  },
];

const SuppliersReportsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");

  const categories = ["الأثاث المكتبي", "المعدات المكتبية", "الإلكترونيات", "منظمات خيرية"];
  const sortOptions = [
    { value: "name", label: "اسم المورد" },
    { value: "orders", label: "عدد الطلبات" },
    { value: "value", label: "القيمة الإجمالية" },
  ];

  const filteredData = useMemo(() => {
    let filtered = suppliersData;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (supplier) =>
          supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          supplier.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          supplier.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((supplier) => supplier.category === categoryFilter);
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((supplier) => supplier.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "orders":
          return b.totalOrders - a.totalOrders;
        case "value":
          return b.totalValue - a.totalValue;
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [searchTerm, categoryFilter, statusFilter, sortBy]);

  const statistics = useMemo(() => {
    const totalSuppliers = filteredData.length;
    const activeSuppliers = filteredData.filter(s => s.status === "active").length;
    const totalOrders = filteredData.reduce((sum, s) => sum + s.totalOrders, 0);
    const totalValue = filteredData.reduce((sum, s) => sum + s.totalValue, 0);

    return { totalSuppliers, activeSuppliers, totalOrders, totalValue };
  }, [filteredData]);

  const exportReport = (format: "pdf" | "excel") => {
    console.log(`Exporting suppliers report as ${format}`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Truck className="h-8 w-8" />
            تقارير الموردين
          </h1>
          <p className="text-muted-foreground mt-1">
            تقارير مفصلة عن الموردين وأداءهم والتعاملات معهم
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الموردين</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalSuppliers}</div>
            <p className="text-xs text-muted-foreground">مورد مسجل</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">موردون نشطون</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {statistics.activeSuppliers}
            </div>
            <p className="text-xs text-muted-foreground">مورد نشط</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الطلبات</CardTitle>
            <Package className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {statistics.totalOrders}
            </div>
            <p className="text-xs text-muted-foreground">طلبية</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">القيمة الإجمالية</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {(statistics.totalValue / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-muted-foreground">دينار عراقي</p>
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
                placeholder="ابحث عن مورد..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
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
                <SelectItem value="active">نشط</SelectItem>
                <SelectItem value="inactive">غير نشط</SelectItem>
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

      {/* Suppliers Table */}
      <Card>
        <CardHeader>
          <CardTitle>تفاصيل الموردين</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">كود المورد</TableHead>
                  <TableHead className="text-right">اسم المورد</TableHead>
                  <TableHead className="text-right">الفئة</TableHead>
                  <TableHead className="text-right">عدد الطلبات</TableHead>
                  <TableHead className="text-right">القيمة الإجمالية</TableHead>
                  <TableHead className="text-right">آخر طلب</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">جهات الاتصال</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {supplier.code}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{supplier.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {supplier.address}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{supplier.category}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{supplier.totalOrders}</TableCell>
                    <TableCell className="font-medium">
                      {supplier.totalValue > 0
                        ? `${(supplier.totalValue / 1000000).toFixed(1)}M`
                        : "تبرع"
                      }
                    </TableCell>
                    <TableCell className="text-sm">
                      {format(supplier.lastOrder, "yyyy-MM-dd", { locale: ar })}
                    </TableCell>
                    <TableCell>
                      <Badge variant={supplier.status === "active" ? "default" : "secondary"}>
                        {supplier.status === "active" ? "نشط" : "غير نشط"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm space-y-1">
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {supplier.phone}
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          <span className="text-xs truncate max-w-[150px]">
                            {supplier.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuppliersReportsPage;