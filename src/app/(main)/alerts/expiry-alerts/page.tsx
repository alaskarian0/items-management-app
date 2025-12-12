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
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertCircle,
  AlertTriangle,
  CalendarClock,
  CalendarX,
  CalendarCheck,
  Search,
  Filter,
  Package,
  Trash2,
  X,
  Download,
  Clock,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { WarehouseSelector } from "@/components/warehouse/warehouse-selector";
import { useWarehouse } from "@/context/warehouse-context";
import { format, differenceInDays } from "date-fns";
import { ar } from "date-fns/locale";

// Expiry alert priority levels
type ExpiryPriority = "expired" | "critical" | "warning" | "normal";

interface ExpiryAlert {
  id: number;
  itemCode: string;
  itemName: string;
  documentNumber: string;
  quantity: number;
  unit: string;
  category: string;
  supplier: string;
  supplierContact: string;
  entryDate: string;
  expiryDate: string;
  daysRemaining: number;
  priority: ExpiryPriority;
  location: string;
  notes?: string;
}

// Mock data for expiry alerts
const expiryAlerts: ExpiryAlert[] = [
  {
    id: 1,
    itemCode: "MED-ANT-001",
    itemName: "مضاد حيوي - أموكسيسيلين 500mg",
    batchNumber: "BATCH-2023-AMX-001",
    quantity: 50,
    unit: "علبة",
    category: "أدوية",
    supplier: "شركة الأدوية الوطنية",
    supplierContact: "07701234567",
    entryDate: "2023-06-15",
    expiryDate: "2024-12-01",
    daysRemaining: -11,
    priority: "expired",
    location: "مخزن الأدوية - رف A1",
    notes: "منتهي الصلاحية - يحتاج إتلاف فوري",
  },
  {
    id: 2,
    itemCode: "FD-MLK-001",
    itemName: "حليب مجفف - علبة 900g",
    batchNumber: "BATCH-2024-MLK-015",
    quantity: 120,
    unit: "علبة",
    category: "مواد غذائية",
    supplier: "شركة المواد الغذائية المتحدة",
    supplierContact: "07709876543",
    entryDate: "2024-10-01",
    expiryDate: "2025-01-18",
    daysRemaining: 6,
    priority: "critical",
    location: "مخزن المواد الغذائية - رف B3",
    notes: "يحتاج توزيع عاجل",
  },
  {
    id: 3,
    itemCode: "CHEM-CLN-001",
    itemName: "مادة تنظيف - كلور مركز",
    batchNumber: "BATCH-2024-CLR-008",
    quantity: 85,
    unit: "عبوة",
    category: "مواد كيميائية",
    supplier: "مؤسسة العراق للتجارة العامة",
    supplierContact: "07703333333",
    entryDate: "2024-08-20",
    expiryDate: "2025-02-20",
    daysRemaining: 39,
    priority: "warning",
    location: "مخزن المواد الكيميائية - رف C2",
  },
  {
    id: 4,
    itemCode: "MED-PAN-001",
    itemName: "مسكن ألم - باراسيتامول 500mg",
    batchNumber: "BATCH-2024-PAN-023",
    quantity: 200,
    unit: "علبة",
    category: "أدوية",
    supplier: "شركة الأدوية الوطنية",
    supplierContact: "07701234567",
    entryDate: "2024-05-10",
    expiryDate: "2026-05-10",
    daysRemaining: 150,
    priority: "normal",
    location: "مخزن الأدوية - رف A3",
  },
  {
    id: 5,
    itemCode: "FD-RSE-001",
    itemName: "أرز أبيض - كيس 50kg",
    batchNumber: "BATCH-2024-RSE-042",
    quantity: 75,
    unit: "كيس",
    category: "مواد غذائية",
    supplier: "شركة المواد الغذائية المتحدة",
    supplierContact: "07709876543",
    entryDate: "2024-11-01",
    expiryDate: "2025-11-01",
    daysRemaining: 324,
    priority: "normal",
    location: "مخزن المواد الغذائية - رف A1",
  },
  {
    id: 6,
    itemCode: "MED-VIT-001",
    itemName: "فيتامين C - 1000mg",
    batchNumber: "BATCH-2023-VIT-019",
    quantity: 30,
    unit: "علبة",
    category: "أدوية",
    supplier: "شركة الأدوية الوطنية",
    supplierContact: "07701234567",
    entryDate: "2023-09-15",
    expiryDate: "2024-12-01",
    daysRemaining: -11,
    priority: "expired",
    location: "مخزن الأدوية - رف B2",
    notes: "منتهي الصلاحية",
  },
  {
    id: 7,
    itemCode: "FD-SGR-001",
    itemName: "سكر أبيض - كيس 50kg",
    batchNumber: "BATCH-2024-SGR-031",
    quantity: 100,
    unit: "كيس",
    category: "مواد غذائية",
    supplier: "شركة المواد الغذائية المتحدة",
    supplierContact: "07709876543",
    entryDate: "2024-07-15",
    expiryDate: "2025-07-15",
    daysRemaining: 215,
    priority: "normal",
    location: "مخزن المواد الغذائية - رف B1",
  },
  {
    id: 8,
    itemCode: "CHEM-DIS-001",
    itemName: "مطهر - ديتول 5 لتر",
    batchNumber: "BATCH-2024-DIS-012",
    quantity: 45,
    unit: "عبوة",
    category: "مواد كيميائية",
    supplier: "مؤسسة العراق للتجارة العامة",
    supplierContact: "07703333333",
    entryDate: "2024-10-20",
    expiryDate: "2025-01-25",
    daysRemaining: 13,
    priority: "warning",
    location: "مخزن المواد الكيميائية - رف D1",
    notes: "استخدام عاجل مطلوب",
  },
  {
    id: 9,
    itemCode: "FD-OIL-001",
    itemName: "زيت نباتي - علبة 5 لتر",
    batchNumber: "BATCH-2024-OIL-025",
    quantity: 60,
    unit: "علبة",
    category: "مواد غذائية",
    supplier: "شركة المواد الغذائية المتحدة",
    supplierContact: "07709876543",
    entryDate: "2024-09-01",
    expiryDate: "2025-09-01",
    daysRemaining: 263,
    priority: "normal",
    location: "مخزن المواد الغذائية - رف C4",
  },
  {
    id: 10,
    itemCode: "MED-INS-001",
    itemName: "أنسولين - قلم حقن",
    batchNumber: "BATCH-2024-INS-007",
    quantity: 25,
    unit: "قلم",
    category: "أدوية",
    supplier: "شركة الأدوية الوطنية",
    supplierContact: "07701234567",
    entryDate: "2024-11-15",
    expiryDate: "2025-01-15",
    daysRemaining: 3,
    priority: "critical",
    location: "مخزن الأدوية - ثلاجة R1",
    notes: "يحتاج تخزين في ثلاجة - توزيع عاجل",
  },
];

const ExpiryAlertsPage = () => {
  const { selectedWarehouse } = useWarehouse();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isDisposeDialogOpen, setIsDisposeDialogOpen] = useState(false);

  // Extract unique categories
  const categories = useMemo(() => {
    return Array.from(new Set(expiryAlerts.map((item) => item.category)));
  }, []);

  // Filter alerts
  const filteredAlerts = useMemo(() => {
    return expiryAlerts.filter((alert) => {
      const matchesPriority =
        selectedPriority === "all" || alert.priority === selectedPriority;
      const matchesCategory =
        selectedCategory === "all" || alert.category === selectedCategory;
      const matchesSearch =
        searchTerm === "" ||
        alert.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.documentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.supplier.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesPriority && matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedPriority, selectedCategory]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalAlerts = filteredAlerts.length;
    const expiredAlerts = filteredAlerts.filter(
      (a) => a.priority === "expired"
    ).length;
    const criticalAlerts = filteredAlerts.filter(
      (a) => a.priority === "critical"
    ).length;
    const warningAlerts = filteredAlerts.filter(
      (a) => a.priority === "warning"
    ).length;
    const totalItems = filteredAlerts.reduce(
      (sum, alert) => sum + alert.quantity,
      0
    );

    return {
      totalAlerts,
      expiredAlerts,
      criticalAlerts,
      warningAlerts,
      totalItems,
    };
  }, [filteredAlerts]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedPriority("all");
    setSelectedCategory("all");
  };

  const getPriorityBadge = (priority: ExpiryPriority) => {
    switch (priority) {
      case "expired":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <CalendarX className="h-3 w-3" />
            منتهي الصلاحية
          </Badge>
        );
      case "critical":
        return (
          <Badge className="bg-orange-600 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            حرج
          </Badge>
        );
      case "warning":
        return (
          <Badge className="bg-yellow-600 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            تحذير
          </Badge>
        );
      case "normal":
        return (
          <Badge className="bg-green-600 flex items-center gap-1">
            <CalendarCheck className="h-3 w-3" />
            طبيعي
          </Badge>
        );
    }
  };

  const getDaysRemainingBadge = (daysRemaining: number) => {
    if (daysRemaining < 0) {
      return (
        <Badge variant="destructive">
          منتهي منذ {Math.abs(daysRemaining)} يوم
        </Badge>
      );
    } else if (daysRemaining <= 7) {
      return <Badge className="bg-red-600">{daysRemaining} يوم متبقي</Badge>;
    } else if (daysRemaining <= 30) {
      return <Badge className="bg-orange-600">{daysRemaining} يوم متبقي</Badge>;
    } else if (daysRemaining <= 90) {
      return <Badge className="bg-yellow-600">{daysRemaining} يوم متبقي</Badge>;
    } else {
      return <Badge variant="outline">{daysRemaining} يوم متبقي</Badge>;
    }
  };

  const handleSelectItem = (itemId: number) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredAlerts.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredAlerts.map((alert) => alert.id));
    }
  };

  const handleDisposeItems = () => {
    setIsDisposeDialogOpen(true);
  };

  const handleExportReport = () => {
    // Export functionality would go here
    console.log("Exporting expiry report...");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <CalendarClock className="h-8 w-8" />
          تنبيهات انتهاء الصلاحية
        </h2>
        <p className="text-muted-foreground mt-1">
          متابعة وإدارة تواريخ انتهاء صلاحية المواد القابلة للانتهاء
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
                  الرجاء اختيار المخزن لعرض تنبيهات انتهاء الصلاحية
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                إجمالي التنبيهات
              </CardTitle>
              <CalendarClock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAlerts}</div>
              <p className="text-xs text-muted-foreground">تنبيه صلاحية نشط</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                منتهي الصلاحية
              </CardTitle>
              <CalendarX className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.expiredAlerts}
              </div>
              <p className="text-xs text-muted-foreground">يحتاج إتلاف فوري</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">حالة حرجة</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {stats.criticalAlerts}
              </div>
              <p className="text-xs text-muted-foreground">أقل من 7 أيام</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">تحذير</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.warningAlerts}
              </div>
              <p className="text-xs text-muted-foreground">أقل من 3 أشهر</p>
            </CardContent>
          </Card>

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
              <p className="text-xs text-muted-foreground">وحدة تحتاج متابعة</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Alerts Content */}
      {selectedWarehouse && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                تفاصيل تنبيهات الصلاحية
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleExportReport}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  تصدير التقرير
                </Button>
                <Button
                  onClick={handleDisposeItems}
                  disabled={selectedItems.length === 0}
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  إتلاف المحدد ({selectedItems.length})
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Filters */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">
                البحث والتصفية
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="ابحث بالاسم أو الكود أو رقم المستند..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                </div>

                {/* Priority Filter */}
                <Select
                  value={selectedPriority}
                  onValueChange={setSelectedPriority}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="فلترة حسب الأولوية..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">كل الأولويات</SelectItem>
                    <SelectItem value="expired">منتهي الصلاحية</SelectItem>
                    <SelectItem value="critical">حرج</SelectItem>
                    <SelectItem value="warning">تحذير</SelectItem>
                    <SelectItem value="normal">طبيعي</SelectItem>
                  </SelectContent>
                </Select>

                {/* Category Filter */}
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="فلترة حسب الفئة..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">كل الفئات</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters Button */}
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  مسح جميع الفلاتر
                </Button>
              </div>
            </div>

            {/* Alerts Table */}
            <div className="space-y-2">
              <Label className="text-base font-semibold">
                جدول تنبيهات الصلاحية
              </Label>
              <div className="border rounded-md">
                <Table dir="rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right w-12">
                        <Checkbox
                          checked={
                            selectedItems.length === filteredAlerts.length &&
                            filteredAlerts.length > 0
                          }
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead className="text-right">الأولوية</TableHead>
                      <TableHead className="text-right">كود المادة</TableHead>
                      <TableHead className="text-right">اسم المادة</TableHead>
                      <TableHead className="text-right">الفئة</TableHead>
                      <TableHead className="text-right">رقم المستند</TableHead>
                      <TableHead className="text-right">الكمية</TableHead>
                      <TableHead className="text-right">تاريخ الإدخال</TableHead>
                      <TableHead className="text-right">تاريخ الانتهاء</TableHead>
                      <TableHead className="text-right">الأيام المتبقية</TableHead>
                      <TableHead className="text-right">الموقع</TableHead>
                      <TableHead className="text-right">المورد</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAlerts.length > 0 ? (
                      filteredAlerts.map((alert) => (
                        <TableRow
                          key={alert.id}
                          className={
                            alert.priority === "expired"
                              ? "bg-red-50 dark:bg-red-950/20"
                              : alert.priority === "critical"
                              ? "bg-orange-50 dark:bg-orange-950/20"
                              : alert.priority === "warning"
                              ? "bg-yellow-50 dark:bg-yellow-950/20"
                              : ""
                          }
                        >
                          <TableCell>
                            <Checkbox
                              checked={selectedItems.includes(alert.id)}
                              onCheckedChange={() => handleSelectItem(alert.id)}
                            />
                          </TableCell>
                          <TableCell>
                            {getPriorityBadge(alert.priority)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-mono">
                              {alert.itemCode}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            {alert.itemName}
                            {alert.notes && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {alert.notes}
                              </p>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{alert.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <span className="font-mono text-xs">
                              {alert.documentNumber}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="font-medium">
                              {alert.quantity} {alert.unit}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm">
                            {format(new Date(alert.entryDate), "yyyy-MM-dd")}
                          </TableCell>
                          <TableCell className="text-sm">
                            {format(new Date(alert.expiryDate), "yyyy-MM-dd")}
                          </TableCell>
                          <TableCell>
                            {getDaysRemainingBadge(alert.daysRemaining)}
                          </TableCell>
                          <TableCell className="text-sm">
                            {alert.location}
                          </TableCell>
                          <TableCell className="text-sm">
                            <div>
                              <div>{alert.supplier}</div>
                              <div className="text-xs text-muted-foreground">
                                {alert.supplierContact}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={12}
                          className="text-center text-muted-foreground h-24"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <CalendarCheck className="h-12 w-12 text-muted-foreground/50" />
                            <p>لا توجد تنبيهات صلاحية تطابق معايير البحث</p>
                          </div>
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

      {/* Dispose Items Dialog */}
      <Dialog open={isDisposeDialogOpen} onOpenChange={setIsDisposeDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>تأكيد إتلاف المواد</DialogTitle>
            <DialogDescription>
              أنت على وشك إتلاف {selectedItems.length} مادة منتهية الصلاحية.
              يرجى مراجعة التفاصيل قبل التأكيد.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  تحذير: عملية الإتلاف لا يمكن التراجع عنها. سيتم توثيق هذه
                  العملية في سجل المخزن.
                </AlertDescription>
              </Alert>
              <div className="border rounded-md p-4 max-h-[300px] overflow-y-auto">
                {expiryAlerts
                  .filter((alert) => selectedItems.includes(alert.id))
                  .map((alert) => (
                    <div
                      key={alert.id}
                      className="flex justify-between items-center py-2 border-b last:border-0"
                    >
                      <div>
                        <p className="font-medium">{alert.itemName}</p>
                        <p className="text-sm text-muted-foreground">
                          {alert.itemCode} - {alert.documentNumber}
                        </p>
                      </div>
                      <div className="text-left">
                        <p className="font-medium">
                          {alert.quantity} {alert.unit}
                        </p>
                        {getDaysRemainingBadge(alert.daysRemaining)}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDisposeDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button
              variant="destructive"
              onClick={() => setIsDisposeDialogOpen(false)}
            >
              تأكيد الإتلاف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExpiryAlertsPage;
