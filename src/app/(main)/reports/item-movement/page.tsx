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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
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
  History,
  Search,
  Download,
  Filter,
  CalendarIcon,
  ArrowDownLeft,
  ArrowUpRight,
  FileText,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Package,
} from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import Link from "next/link";
import { WarehouseSelector } from "@/components/warehouse/warehouse-selector";
import { useWarehouse } from "@/context/warehouse-context";

// Mock data for item movement reports
const movementData = [
  {
    id: 1,
    date: new Date(2024, 11, 8),
    documentNumber: "1101",
    movementType: "إدخال",
    itemType: "مشتريات",
    itemName: "كرسي مكتب",
    itemCode: "FUR-CHR-001",
    quantity: 50,
    unit: "قطعة",
    referenceNumber: "PO-2024-001",
    department: "قسم الشؤون الهندسية",
    supplier: "شركة النبلاء",
    balance: 50,
  },
  {
    id: 2,
    date: new Date(2024, 11, 7),
    documentNumber: "2305",
    movementType: "إصدار",
    itemType: "صرف للقسم",
    itemName: "طاولة اجتماعات",
    itemCode: "FUR-TBL-001",
    quantity: 5,
    unit: "قطعة",
    referenceNumber: "REQ-2024-015",
    department: "قسم الشؤون الإدارية",
    recipient: "أحمد محمد",
    balance: 5,
  },
  {
    id: 3,
    date: new Date(2024, 11, 6),
    documentNumber: "1102",
    movementType: "إدخال",
    itemType: "هدايا وندور",
    itemName: "سجاد صحراوي 2*3 م",
    itemCode: "CRP-IND-001",
    quantity: 120,
    unit: "قطعة",
    referenceNumber: "DON-2024-003",
    department: "قسم الشؤون الهندسية",
    supplier: "منظمة الهلال الأحمر",
    balance: 120,
  },
  {
    id: 4,
    date: new Date(2024, 11, 5),
    documentNumber: "2306",
    movementType: "إصدار",
    itemType: "صرف للقسم",
    itemName: "كرسي مكتب",
    itemCode: "FUR-CHR-001",
    quantity: 10,
    unit: "قطعة",
    referenceNumber: "REQ-2024-016",
    department: "قسم الشؤون الهندسية",
    recipient: "علي حسين",
    balance: 40,
  },
];

const ItemMovementReportsPage = () => {
  const { selectedWarehouse } = useWarehouse();
  const [searchTerm, setSearchTerm] = useState("");
  const [movementTypeFilter, setMovementTypeFilter] = useState<string>("all");
  const [itemTypeFilter, setItemTypeFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();

  const movementTypes = ["إدخال", "إصدار"];
  const itemTypes = ["مشتريات", "صرف للقسم", "هدايا وندور", "ارجاع مواد"];
  const departments = ["قسم الشؤون الهندسية", "قسم الشؤون الإدارية", "قسم المشتريات"];

  const filteredData = useMemo(() => {
    let filtered = movementData;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (movement) =>
          movement.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          movement.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          movement.documentNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply movement type filter
    if (movementTypeFilter !== "all") {
      filtered = filtered.filter((movement) => movement.movementType === movementTypeFilter);
    }

    // Apply item type filter
    if (itemTypeFilter !== "all") {
      filtered = filtered.filter((movement) => movement.itemType === itemTypeFilter);
    }

    // Apply department filter
    if (departmentFilter !== "all") {
      filtered = filtered.filter((movement) => movement.department === departmentFilter);
    }

    // Apply date filters
    if (dateFrom) {
      filtered = filtered.filter((movement) => movement.date >= dateFrom);
    }
    if (dateTo) {
      filtered = filtered.filter((movement) => movement.date <= dateTo);
    }

    return filtered.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [searchTerm, movementTypeFilter, itemTypeFilter, departmentFilter, dateFrom, dateTo]);

  const statistics = useMemo(() => {
    const totalMovements = filteredData.length;
    const entries = filteredData.filter(m => m.movementType === "إدخال").length;
    const issuances = filteredData.filter(m => m.movementType === "إصدار").length;
    const totalQuantity = filteredData.reduce((acc, m) => {
      const quantity = m.movementType === "إدخال" ? m.quantity : -m.quantity;
      return acc + quantity;
    }, 0);

    return { totalMovements, entries, issuances, totalQuantity };
  }, [filteredData]);

  const exportReport = (format: "pdf" | "excel") => {
    console.log(`Exporting item movement report as ${format}`);
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
            <History className="h-8 w-8" />
            تقارير حركة المواد
          </h1>
          <p className="text-muted-foreground mt-1">
            تقارير تحليلية عن حركة المواد بين الأقسام والمخازن
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
                <CardTitle className="text-sm font-medium">إجمالي الحركات</CardTitle>
                <History className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics.totalMovements}</div>
                <p className="text-xs text-muted-foreground">عملية</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">عمليات الإدخال</CardTitle>
                <ArrowDownLeft className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {statistics.entries}
                </div>
                <p className="text-xs text-muted-foreground">إدخال</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">عمليات الإصدار</CardTitle>
                <ArrowUpRight className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {statistics.issuances}
                </div>
                <p className="text-xs text-muted-foreground">إصدار</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">صافي الكمية</CardTitle>
                <Package className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {statistics.totalQuantity}
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
                الفلاتر والبحث
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="ابحث عن مادة أو مستند..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                </div>

                <Select value={movementTypeFilter} onValueChange={setMovementTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="نوع الحركة..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">الكل</SelectItem>
                    {movementTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={itemTypeFilter} onValueChange={setItemTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="نوع العملية..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">الكل</SelectItem>
                    {itemTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="القسم..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">الكل</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label>من تاريخ</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="w-full justify-start text-right font-normal"
                      >
                        <CalendarIcon className="ml-2 h-4 w-4" />
                        {dateFrom ? (
                          format(dateFrom, "PPP", { locale: ar })
                        ) : (
                          <span>اختر تاريخ البداية</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateFrom}
                        onSelect={setDateFrom}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>إلى تاريخ</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="w-full justify-start text-right font-normal"
                      >
                        <CalendarIcon className="ml-2 h-4 w-4" />
                        {dateTo ? (
                          format(dateTo, "PPP", { locale: ar })
                        ) : (
                          <span>اختر تاريخ النهاية</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateTo}
                        onSelect={setDateTo}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
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

          {/* Movement Table */}
          <Card>
            <CardHeader>
              <CardTitle>تفاصيل حركة المواد</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">التاريخ</TableHead>
                      <TableHead className="text-right">رقم المستند</TableHead>
                      <TableHead className="text-right">نوع الحركة</TableHead>
                      <TableHead className="text-right">نوع العملية</TableHead>
                      <TableHead className="text-right">المادة</TableHead>
                      <TableHead className="text-right">الكمية</TableHead>
                      <TableHead className="text-right">القسم</TableHead>
                      <TableHead className="text-right">المرجع</TableHead>
                      <TableHead className="text-right">الرصيد</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((movement) => (
                      <TableRow key={movement.id}>
                        <TableCell>
                          {format(movement.date, "yyyy-MM-dd", { locale: ar })}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            {movement.documentNumber}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={movement.movementType === "إدخال" ? "default" : "secondary"}
                            className="flex items-center gap-1 w-fit"
                          >
                            {movement.movementType === "إدخال" ? (
                              <ArrowDownLeft className="h-3 w-3" />
                            ) : (
                              <ArrowUpRight className="h-3 w-3" />
                            )}
                            {movement.movementType}
                          </Badge>
                        </TableCell>
                        <TableCell>{movement.itemType}</TableCell>
                        <TableCell className="font-medium">{movement.itemName}</TableCell>
                        <TableCell>
                          <span
                            className={
                              movement.movementType === "إدخال"
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {movement.movementType === "إدخال" ? "+" : "-"}
                            {movement.quantity}
                          </span>
                        </TableCell>
                        <TableCell>{movement.department}</TableCell>
                        <TableCell className="font-mono text-sm">
                          {movement.referenceNumber}
                        </TableCell>
                        <TableCell className="font-medium">{movement.balance}</TableCell>
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

export default ItemMovementReportsPage;