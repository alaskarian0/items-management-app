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
  Search,
  ArrowRightLeft,
  PackageOpen,
  Package
} from "lucide-react";
import { useMemo, useState } from "react";

// Import shared data and types
import {
  movementTypes,
  warehouses,
  itemMovements as fallbackMovements
} from "@/lib/data/warehouse-data";
import { useMovements } from "@/hooks/use-inventory";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";

const ItemMovementPage = () => {
  const { selectedWarehouse } = useWarehouse();

  // Fetch movements from database
  const dbMovements = useMovements(selectedWarehouse?.id || 0);

  // Use database movements if available, otherwise fall back to static data
  const itemMovements = dbMovements && dbMovements.length > 0 ? dbMovements : fallbackMovements;
  const [searchTerm, setSearchTerm] = useState("");
  const [movementTypeFilter, setMovementTypeFilter] = useState<string>("all");
  const [itemTypeFilter, setItemTypeFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [divisionFilter, setDivisionFilter] = useState<string>("all");
  const [unitFilter, setUnitFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);

  // Transfer dialog state
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState<any>(null);
  const [transferType, setTransferType] = useState<"partial" | "full">("full");
  const [transferQuantity, setTransferQuantity] = useState<number>(0);
  const [targetWarehouseId, setTargetWarehouseId] = useState<number | undefined>(undefined);
  const [transferNotes, setTransferNotes] = useState("");

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

    // Date range filter
    if (dateFrom) {
      filtered = filtered.filter(
        (movement) => new Date(movement.date) >= dateFrom
      );
    }

    if (dateTo) {
      const endOfDay = new Date(dateTo);
      endOfDay.setHours(23, 59, 59, 999);
      filtered = filtered.filter(
        (movement) => new Date(movement.date) <= endOfDay
      );
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [searchTerm, movementTypeFilter, itemTypeFilter, departmentFilter, divisionFilter, unitFilter, dateFrom, dateTo]);

  // Extract unique values for filters
  const departments = [...new Set(itemMovements.map((m) => m.department))].filter(Boolean) as string[];
  const divisions = [...new Set(itemMovements.map((m) => m.division))].filter(Boolean) as string[];
  const units = [...new Set(itemMovements.map((m) => m.division))].filter(Boolean) as string[];
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
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  const handleTransferItem = (movement: any) => {
    setSelectedMovement(movement);
    setTransferType("full");
    setTransferQuantity(movement.balance);
    setTargetWarehouseId(undefined);
    setTransferNotes("");
    setIsTransferDialogOpen(true);
  };

  const handleConfirmTransfer = () => {
    if (!selectedMovement || !targetWarehouseId) return;

    const quantity = transferType === "full" ? selectedMovement.balance : transferQuantity;

    // Here you would call an API or update state to perform the transfer
    console.log("Transfer:", {
      itemCode: selectedMovement.itemCode,
      itemName: selectedMovement.itemName,
      fromWarehouse: selectedWarehouse?.name,
      toWarehouse: warehouses.find(w => w.id === targetWarehouseId)?.name,
      quantity,
      type: transferType,
      notes: transferNotes
    });

    // Close dialog and reset
    setIsTransferDialogOpen(false);
    setSelectedMovement(null);
    setTransferType("full");
    setTransferQuantity(0);
    setTargetWarehouseId(undefined);
    setTransferNotes("");
  };

  // Get available warehouses for transfer (exclude current warehouse)
  const availableWarehouses = warehouses.filter(w => w.id !== selectedWarehouse?.id);

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
                </div>
              </div>

              {/* Date Range Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">من تاريخ</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
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
                    <PopoverContent className="w-auto p-0" align="start">
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
                  <label className="text-sm font-medium">إلى تاريخ</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
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
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateTo}
                        onSelect={setDateTo}
                        initialFocus
                        disabled={(date) => dateFrom ? date < dateFrom : false}
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
                      <TableHead className="text-center">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMovements.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
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
                          <TableCell className="text-center">
                            {movement.balance > 0 && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleTransferItem(movement)}
                                className="flex items-center gap-1"
                              >
                                <ArrowRightLeft className="h-4 w-4" />
                                نقل
                              </Button>
                            )}
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

      {/* Transfer Dialog */}
      <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowRightLeft className="h-5 w-5" />
              نقل مواد بين المخازن
            </DialogTitle>
          </DialogHeader>
          {selectedMovement && (
            <div className="space-y-4 py-4">
              {/* Item Info Card */}
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-muted-foreground">اسم المادة:</span>
                    <span className="font-medium mr-2">{selectedMovement.itemName}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-muted-foreground">كود المادة:</span>
                    <code className="px-2 py-1 bg-muted rounded text-sm mr-2">
                      {selectedMovement.itemCode}
                    </code>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-muted-foreground">الرصيد المتاح:</span>
                    <Badge variant="secondary" className="mr-2">
                      {selectedMovement.balance} {selectedMovement.unit || "قطعة"}
                    </Badge>
                  </div>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">المخزن الحالي:</span>
                  <span className="font-medium mr-2">{selectedWarehouse?.name}</span>
                </div>
              </div>

              {/* Transfer Type */}
              <div className="space-y-3">
                <Label>نوع النقل</Label>
                <RadioGroup value={transferType} onValueChange={(value: "partial" | "full") => {
                  setTransferType(value);
                  if (value === "full") {
                    setTransferQuantity(selectedMovement.balance);
                  } else {
                    setTransferQuantity(0);
                  }
                }}>
                  <div className="flex items-center space-x-2 space-x-reverse p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="full" id="full" />
                    <Label htmlFor="full" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Package className="h-4 w-4 text-blue-600" />
                      <div>
                        <div className="font-medium">نقل كامل</div>
                        <div className="text-xs text-muted-foreground">
                          نقل كامل الرصيد ({selectedMovement.balance} {selectedMovement.unit || "قطعة"})
                        </div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="partial" id="partial" />
                    <Label htmlFor="partial" className="flex items-center gap-2 cursor-pointer flex-1">
                      <PackageOpen className="h-4 w-4 text-orange-600" />
                      <div>
                        <div className="font-medium">نقل جزئي</div>
                        <div className="text-xs text-muted-foreground">
                          نقل كمية محددة من الرصيد
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Quantity Input for Partial Transfer */}
              {transferType === "partial" && (
                <div className="space-y-2">
                  <Label>الكمية المراد نقلها *</Label>
                  <Input
                    type="number"
                    min={1}
                    max={selectedMovement.balance}
                    value={transferQuantity}
                    onChange={(e) => setTransferQuantity(parseInt(e.target.value) || 0)}
                    placeholder="أدخل الكمية..."
                  />
                  {transferQuantity > selectedMovement.balance && (
                    <p className="text-sm text-red-600">
                      الكمية المدخلة أكبر من الرصيد المتاح
                    </p>
                  )}
                </div>
              )}

              {/* Target Warehouse */}
              <div className="space-y-2">
                <Label>المخزن المستهدف *</Label>
                <Select
                  value={targetWarehouseId?.toString()}
                  onValueChange={(value) => setTargetWarehouseId(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المخزن المستهدف..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableWarehouses.map((warehouse) => (
                      <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                        <div className="flex items-center gap-2">
                          <span>{warehouse.name}</span>
                          <span className="text-xs text-muted-foreground">
                            ({warehouse.code})
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label>ملاحظات</Label>
                <Textarea
                  value={transferNotes}
                  onChange={(e) => setTransferNotes(e.target.value)}
                  placeholder="أدخل أي ملاحظات حول عملية النقل..."
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsTransferDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button
              onClick={handleConfirmTransfer}
              disabled={
                !targetWarehouseId ||
                (transferType === "partial" && (transferQuantity <= 0 || transferQuantity > selectedMovement?.balance))
              }
              className="bg-blue-600 hover:bg-blue-700"
            >
              <ArrowRightLeft className="h-4 w-4 ml-2" />
              تأكيد النقل
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ItemMovementPage;