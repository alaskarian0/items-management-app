"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { useWarehouse } from "@/context/warehouse-context";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import {
  AlertCircle,
  ArrowDownLeft,
  ArrowUpRight,
  CalendarIcon,
  History,
  Search
} from "lucide-react";
import { useMemo, useState } from "react";

// Import shared data and types
import {
  movementTypes
} from "@/lib/data/warehouse-data";
import { useMovements } from "@/hooks/use-inventory";

const ItemMovementPage = () => {
  const { selectedWarehouse } = useWarehouse();
  const itemMovements = useMovements(selectedWarehouse?.id || 0) || [];
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
          movement.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Movement type filter
    if (movementTypeFilter !== "all") {
      filtered = filtered.filter(
        (movement) => movement.movementType === movementTypeFilter
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
        (movement) => movement.division === unitFilter
      );
    }

    // Date filter
    if (dateFilter) {
      filtered = filtered.filter(
        (movement) => new Date(movement.date).toDateString() === dateFilter.toDateString()
      );
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [searchTerm, movementTypeFilter, itemTypeFilter, departmentFilter, divisionFilter, unitFilter, dateFilter]);

  // Extract unique values for filters
  const departments = [...new Set(itemMovements.map((m) => m.department))];
  const divisions = [...new Set(itemMovements.map((m) => m.division))].filter(Boolean);
  const units = [...new Set(itemMovements.map((m) => m.division))].filter(Boolean);
  const itemTypes = [...new Set(itemMovements.map((m) => m.movementType))];

  // Calculate statistics
  const stats = useMemo(() => {
    const totalMovements = filteredMovements.length;
    const entryMovements = filteredMovements.filter(m => m.movementType === "إدخال").length;
    const issuanceMovements = filteredMovements.filter(m => m.movementType === "إصدار").length;

    return { totalMovements, entryMovements, issuanceMovements };
  }, [filteredMovements]);

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
          عرض وتتبع جميع حركات إدخال وإصدار المواد
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

      {/* Main Content */}
      {selectedWarehouse && (
        <>
          {/* Statistics Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  إجمالي الحركات
                </CardTitle>
                <History className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalMovements}</div>
                <p className="text-xs text-muted-foreground">
                  حركة في الفترة المحددة
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  حركات الإدخال
                </CardTitle>
                <ArrowDownLeft className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {stats.entryMovements}
                </div>
                <p className="text-xs text-muted-foreground">
                  مواد أدخلت للمخزن
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  حركات الإصدار
                </CardTitle>
                <ArrowUpRight className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {stats.issuanceMovements}
                </div>
                <p className="text-xs text-muted-foreground">
                  مواد صرفت من المخزن
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>البحث والتصفية</CardTitle>
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  مسح الفلاتر
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="ابحث بالاسم أو الكود أو الرقم المرجعي..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={movementTypeFilter} onValueChange={setMovementTypeFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="نوع الحركة" />
                    </SelectTrigger>
                    <SelectContent>
                      {movementTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="القسم" />
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
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-48 justify-start text-right">
                        <CalendarIcon className="ml-2 h-4 w-4" />
                        {dateFilter ? format(dateFilter, "PPP", { locale: ar }) : "اختر التاريخ"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateFilter}
                        onSelect={setDateFilter}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Movements Table */}
          <Card>
            <CardHeader>
              <CardTitle>سجل الحركات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <Table dir="rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">التاريخ</TableHead>
                      <TableHead className="text-right">رقم المستند</TableHead>
                      <TableHead className="text-right">نوع الحركة</TableHead>
                      <TableHead className="text-right">كود المادة</TableHead>
                      <TableHead className="text-right">اسم المادة</TableHead>
                      <TableHead className="text-right">الكمية</TableHead>
                      <TableHead className="text-right">الرصيد</TableHead>
                      <TableHead className="text-right">القسم/المورد</TableHead>
                      <TableHead className="text-right">ملاحظات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMovements.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                          لا توجد حركات مطابقة للفلاتر المحددة
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredMovements.map((movement) => (
                        <TableRow key={movement.id}>
                          <TableCell className="text-right">
                            {format(new Date(movement.date), "dd/MM/yyyy", { locale: ar })}
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {movement.referenceNumber}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center gap-2">
                              {movement.movementType === "إدخال" ? (
                                <ArrowDownLeft className="h-4 w-4 text-green-600" />
                              ) : (
                                <ArrowUpRight className="h-4 w-4 text-red-600" />
                              )}
                              <span
                                className={`font-medium ${movement.movementType === "إدخال"
                                    ? "text-green-600"
                                    : "text-red-600"
                                  }`}
                              >
                                {movement.movementType}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {movement.itemCode}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {movement.itemName}
                          </TableCell>
                          <TableCell className="text-right">
                            {movement.quantity} {movement.unit || "قطعة"}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {movement.balance}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="text-sm">
                              <div>{movement.supplier || movement.department}</div>
                              {movement.recipient && (
                                <div className="text-muted-foreground">
                                  المستلم: {movement.recipient}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right text-sm max-w-xs truncate">
                            {movement.notes}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
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

export default ItemMovementPage;