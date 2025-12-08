"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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
import {
  AlertCircle,
  History,
  Search,
  Filter,
  CalendarIcon,
  ArrowDownLeft,
  ArrowUpRight,
  FileText,
} from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { WarehouseSelector } from "@/components/warehouse/warehouse-selector";
import { useWarehouse } from "@/context/warehouse-context";

// --- DUMMY DATA ---
const itemMovements = [
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
    division: "شعبة الهندسة المدنية",
    unitName: "وحدة التخطيط",
    supplier: "شركة النبلاء",
    notes: "مشتريات جديدة للمكاتب",
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
    division: "شعبة الشؤون الإدارية",
    unitName: "وحدة الموارد البشرية",
    recipient: "أحمد محمد",
    notes: "صرف للمكاتب الجديدة",
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
    division: "شعبة الهندسة الكهربائية",
    unitName: "وحدة الصيانة الكهربائية",
    supplier: "منظمة الهلال الأحمر",
    notes: "تبرع من منظمة الهلال الأحمر",
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
    division: "شعبة الهندسة المدنية",
    unitName: "وحدة التنفيذ",
    recipient: "علي حسين",
    notes: "صرف للمكاتب القديمة",
    balance: 40,
  },
  {
    id: 5,
    date: new Date(2024, 11, 4),
    documentNumber: "1103",
    movementType: "إدخال",
    itemType: "ارجاع مواد",
    itemName: "طاولة اجتماعات",
    itemCode: "FUR-TBL-001",
    quantity: 3,
    unit: "قطعة",
    referenceNumber: "RET-2024-001",
    department: "قسم الشؤون الإدارية",
    division: "شعبة الشؤون الإدارية",
    unitName: "وحدة الشؤون المالية",
    notes: "ارجاع مواد غير صالحة",
    balance: 8,
  },
  {
    id: 6,
    date: new Date(2024, 11, 3),
    documentNumber: "2307",
    movementType: "إصدار",
    itemType: "صرف للقسم",
    itemName: "سجاد صحراوي 2*3 م",
    itemCode: "CRP-IND-001",
    quantity: 25,
    unit: "قطعة",
    referenceNumber: "REQ-2024-017",
    department: "قسم الشؤون الهندسية",
    division: "شعبة الهندسة الميكانيكية",
    unitName: "وحدة الصيانة الميكانيكية",
    recipient: "محمد صالح",
    notes: "صرف للورش",
    balance: 95,
  },
];

const ItemMovementPage = () => {
  const { selectedWarehouse } = useWarehouse();
  const [searchTerm, setSearchTerm] = useState("");
  const [movementTypeFilter, setMovementTypeFilter] = useState<string>("all");
  const [itemTypeFilter, setItemTypeFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [divisionFilter, setDivisionFilter] = useState<string>("all");
  const [unitFilter, setUnitFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<Date | undefined>();

  // Filter movements based on search and filters
  const filteredMovements = useMemo(() => {
    let filtered = itemMovements;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (movement) =>
          movement.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          movement.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          movement.documentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          movement.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Movement type filter
    if (movementTypeFilter !== "all") {
      filtered = filtered.filter(
        (movement) => movement.movementType === movementTypeFilter
      );
    }

    // Item type filter
    if (itemTypeFilter !== "all") {
      filtered = filtered.filter(
        (movement) => movement.itemType === itemTypeFilter
      );
    }

    // Department filter
    if (departmentFilter !== "all") {
      filtered = filtered.filter(
        (movement) => movement.department === departmentFilter
      );
    }

    // Division filter
    if (divisionFilter !== "all") {
      filtered = filtered.filter(
        (movement) => movement.division === divisionFilter
      );
    }

    // Unit filter
    if (unitFilter !== "all") {
      filtered = filtered.filter(
        (movement) => movement.unitName === unitFilter
      );
    }

    // Date filter
    if (dateFilter) {
      filtered = filtered.filter(
        (movement) =>
          movement.date.toDateString() === dateFilter.toDateString()
      );
    }

    return filtered.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [searchTerm, movementTypeFilter, itemTypeFilter, departmentFilter, divisionFilter, unitFilter, dateFilter]);

  // Get unique values for filters
  const departments = [...new Set(itemMovements.map((m) => m.department))];
  const divisions = [...new Set(itemMovements.map((m) => m.division))];
  const units = [...new Set(itemMovements.map((m) => m.unitName))];
  const itemTypes = [...new Set(itemMovements.map((m) => m.itemType))];

  const clearFilters = () => {
    setSearchTerm("");
    setMovementTypeFilter("all");
    setItemTypeFilter("all");
    setDepartmentFilter("all");
    setDivisionFilter("all");
    setUnitFilter("all");
    setDateFilter(undefined);
  };

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
        <>
          {/* Filters Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                الفلاتر والبحث
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search */}
                <div className="space-y-2">
                  <Label>البحث</Label>
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="ابحث عن مادة أو مستند..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-10"
                    />
                  </div>
                </div>

                {/* Movement Type Filter */}
                <div className="space-y-2">
                  <Label>نوع الحركة</Label>
                  <Select
                    value={movementTypeFilter}
                    onValueChange={setMovementTypeFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نوع الحركة..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">الكل</SelectItem>
                      <SelectItem value="إدخال">إدخال</SelectItem>
                      <SelectItem value="إصدار">إصدار</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Item Type Filter */}
                <div className="space-y-2">
                  <Label>نوع العملية</Label>
                  <Select
                    value={itemTypeFilter}
                    onValueChange={setItemTypeFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نوع العملية..." />
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
                </div>

                {/* Department Filter */}
                <div className="space-y-2">
                  <Label>القسم</Label>
                  <Select
                    value={departmentFilter}
                    onValueChange={setDepartmentFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر القسم..." />
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

                {/* Division Filter */}
                <div className="space-y-2">
                  <Label>الشعبة</Label>
                  <Select
                    value={divisionFilter}
                    onValueChange={setDivisionFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الشعبة..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">الكل</SelectItem>
                      {divisions.map((division) => (
                        <SelectItem key={division} value={division}>
                          {division}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Unit Filter */}
                <div className="space-y-2">
                  <Label>الوحدة</Label>
                  <Select
                    value={unitFilter}
                    onValueChange={setUnitFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الوحدة..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">الكل</SelectItem>
                      {units.map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Filter */}
                <div className="space-y-2">
                  <Label>التاريخ</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="w-full justify-start text-right font-normal"
                      >
                        <CalendarIcon className="ml-2 h-4 w-4" />
                        {dateFilter ? (
                          format(dateFilter, "PPP", { locale: ar })
                        ) : (
                          <span>اختر تاريخ</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateFilter}
                        onSelect={setDateFilter}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <Button variant="outline" onClick={clearFilters} className="w-full">
                مسح الفلاتر
              </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Movements Table */}
          <Card>
            <CardHeader>
              <CardTitle>سجل حركة المواد</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <Table dir="rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">التاريخ</TableHead>
                      <TableHead className="text-right">رقم المستند</TableHead>
                      <TableHead className="text-right">نوع الحركة</TableHead>
                      <TableHead className="text-right">نوع العملية</TableHead>
                      <TableHead className="text-right">المادة</TableHead>
                      <TableHead className="text-right">الكود</TableHead>
                      <TableHead className="text-right">الكمية</TableHead>
                      <TableHead className="text-right">الوحدة</TableHead>
                      <TableHead className="text-right">القسم</TableHead>
                      <TableHead className="text-right">المرجع</TableHead>
                      <TableHead className="text-right">الرصيد</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMovements.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={11}
                          className="text-center text-muted-foreground h-24"
                        >
                          لا توجد حركات مواد مطابقة للفلاتر المحددة
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredMovements.map((movement) => (
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
                            <div
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                movement.movementType === "إدخال"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {movement.movementType === "إدخال" ? (
                                <ArrowDownLeft className="h-3 w-3" />
                              ) : (
                                <ArrowUpRight className="h-3 w-3" />
                              )}
                              {movement.movementType}
                            </div>
                          </TableCell>
                          <TableCell>{movement.itemType}</TableCell>
                          <TableCell className="font-medium">
                            {movement.itemName}
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {movement.itemCode}
                          </TableCell>
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
                          <TableCell>{movement.unit}</TableCell>
                          <TableCell>{movement.department}</TableCell>
                          <TableCell className="font-mono text-sm">
                            {movement.referenceNumber}
                          </TableCell>
                          <TableCell className="font-medium">
                            {movement.balance}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Summary */}
              <div className="mt-4 p-4 bg-muted rounded-md">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-sm text-muted-foreground">إجمالي الحركات</p>
                    <p className="text-2xl font-bold">
                      {filteredMovements.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">عمليات الإدخال</p>
                    <p className="text-2xl font-bold text-green-600">
                      {filteredMovements.filter(m => m.movementType === "إدخال").length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">عمليات الإصدار</p>
                    <p className="text-2xl font-bold text-red-600">
                      {filteredMovements.filter(m => m.movementType === "إصدار").length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">إجمالي الكميات</p>
                    <p className="text-2xl font-bold">
                      {filteredMovements.reduce((acc, m) => {
                        const quantity = m.movementType === "إدخال" ? m.quantity : -m.quantity;
                        return acc + quantity;
                      }, 0)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default ItemMovementPage;
