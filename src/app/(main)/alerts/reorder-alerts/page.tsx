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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertCircle,
  AlertTriangle,
  Bell,
  BellRing,
  Search,
  Filter,
  Package,
  ShoppingCart,
  Truck,
  X,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { WarehouseSelector } from "@/components/warehouse/warehouse-selector";
import { useWarehouse } from "@/context/warehouse-context";

// Alert priority levels
type AlertPriority = "critical" | "high" | "medium" | "low";
type AlertStatus = "pending" | "ordered" | "ignored";

interface StockAlert {
  id: number;
  itemCode: string;
  itemName: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  reorderPoint: number;
  reorderQuantity: number;
  unit: string;
  category: string;
  supplier: string;
  supplierContact: string;
  lastOrderDate: string;
  averageDailyUsage: number;
  daysUntilStockout: number;
  priority: AlertPriority;
  status: AlertStatus;
  estimatedCost: number;
  notes?: string;
}

// Mock data for stock alerts
const stockAlerts: StockAlert[] = [
  {
    id: 1,
    itemCode: "FUR-TBL-001",
    itemName: "طاولة اجتماعات",
    currentStock: 10,
    minStock: 15,
    maxStock: 50,
    reorderPoint: 15,
    reorderQuantity: 40,
    unit: "قطعة",
    category: "الأثاث المكتبي",
    supplier: "شركة النبلاء للمواد المكتبي",
    supplierContact: "07701234567",
    lastOrderDate: "2024-09-20",
    averageDailyUsage: 2,
    daysUntilStockout: 5,
    priority: "high",
    status: "pending",
    estimatedCost: 3000000,
    notes: "طلب عاجل - مشروع جديد قريب",
  },
  {
    id: 2,
    itemCode: "FUR-CAB-001",
    itemName: "خزانة ملفات",
    currentStock: 15,
    minStock: 20,
    maxStock: 40,
    reorderPoint: 20,
    reorderQuantity: 25,
    unit: "قطعة",
    category: "الأثاث المكتبي",
    supplier: "مورّد الأثاث الحديث",
    supplierContact: "07709876543",
    lastOrderDate: "2024-07-15",
    averageDailyUsage: 1.5,
    daysUntilStockout: 10,
    priority: "medium",
    status: "pending",
    estimatedCost: 3000000,
  },
  {
    id: 3,
    itemCode: "ELE-DSP-001",
    itemName: "شاشة عرض",
    currentStock: 5,
    minStock: 10,
    maxStock: 25,
    reorderPoint: 10,
    reorderQuantity: 20,
    unit: "قطعة",
    category: "المعدات الكهربائية",
    supplier: "شركة التقنية المتقدمة",
    supplierContact: "07705555555",
    lastOrderDate: "2024-06-20",
    averageDailyUsage: 1,
    daysUntilStockout: 5,
    priority: "critical",
    status: "pending",
    estimatedCost: 9000000,
    notes: "مخزون حرج - يحتاج طلب فوري",
  },
  {
    id: 4,
    itemCode: "STA-INK-001",
    itemName: "حبر طابعة HP LaserJet",
    currentStock: 25,
    minStock: 30,
    maxStock: 100,
    reorderPoint: 30,
    reorderQuantity: 75,
    unit: "خرطوشة",
    category: "المواد المكتبية",
    supplier: "شركة النور للمعدات المكتبية",
    supplierContact: "07702222222",
    lastOrderDate: "2024-10-01",
    averageDailyUsage: 3,
    daysUntilStockout: 8,
    priority: "medium",
    status: "ordered",
    estimatedCost: 4125000,
  },
  {
    id: 5,
    itemCode: "CLN-FLR-001",
    itemName: "منظف أرضيات",
    currentStock: 12,
    minStock: 20,
    maxStock: 60,
    reorderPoint: 20,
    reorderQuantity: 48,
    unit: "عبوة",
    category: "مواد النظافة",
    supplier: "مؤسسة العراق للتجارة العامة",
    supplierContact: "07703333333",
    lastOrderDate: "2024-10-15",
    averageDailyUsage: 2,
    daysUntilStockout: 6,
    priority: "high",
    status: "pending",
    estimatedCost: 408000,
  },
  {
    id: 6,
    itemCode: "ELE-LMP-001",
    itemName: "لمبة LED 100 واط",
    currentStock: 45,
    minStock: 50,
    maxStock: 200,
    reorderPoint: 50,
    reorderQuantity: 155,
    unit: "قطعة",
    category: "المعدات الكهربائية",
    supplier: "شركة الأوائل للأجهزة الكهربائية",
    supplierContact: "07704444444",
    lastOrderDate: "2024-11-01",
    averageDailyUsage: 5,
    daysUntilStockout: 9,
    priority: "low",
    status: "ignored",
    estimatedCost: 2325000,
  },
];

const ReorderAlertsPage = () => {
  const { selectedWarehouse } = useWarehouse();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);

  // Extract unique categories
  const categories = useMemo(() => {
    return Array.from(new Set(stockAlerts.map((item) => item.category)));
  }, []);

  // Filter alerts
  const filteredAlerts = useMemo(() => {
    return stockAlerts.filter((alert) => {
      const matchesPriority =
        selectedPriority === "all" || alert.priority === selectedPriority;
      const matchesStatus =
        selectedStatus === "all" || alert.status === selectedStatus;
      const matchesCategory =
        selectedCategory === "all" || alert.category === selectedCategory;
      const matchesSearch =
        searchTerm === "" ||
        alert.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.supplier.toLowerCase().includes(searchTerm.toLowerCase());

      return (
        matchesPriority && matchesStatus && matchesCategory && matchesSearch
      );
    });
  }, [searchTerm, selectedPriority, selectedStatus, selectedCategory]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalAlerts = filteredAlerts.length;
    const criticalAlerts = filteredAlerts.filter(
      (a) => a.priority === "critical"
    ).length;
    const highAlerts = filteredAlerts.filter(
      (a) => a.priority === "high"
    ).length;
    const pendingAlerts = filteredAlerts.filter(
      (a) => a.status === "pending"
    ).length;
    const totalEstimatedCost = filteredAlerts
      .filter((a) => a.status === "pending")
      .reduce((sum, alert) => sum + alert.estimatedCost, 0);

    return {
      totalAlerts,
      criticalAlerts,
      highAlerts,
      pendingAlerts,
      totalEstimatedCost,
    };
  }, [filteredAlerts]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedPriority("all");
    setSelectedStatus("all");
    setSelectedCategory("all");
  };

  const getPriorityBadge = (priority: AlertPriority) => {
    switch (priority) {
      case "critical":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            حرج
          </Badge>
        );
      case "high":
        return (
          <Badge className="bg-orange-600 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            عالي
          </Badge>
        );
      case "medium":
        return (
          <Badge className="bg-yellow-600 flex items-center gap-1">
            <Bell className="h-3 w-3" />
            متوسط
          </Badge>
        );
      case "low":
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Bell className="h-3 w-3" />
            منخفض
          </Badge>
        );
    }
  };

  const getStatusBadge = (status: AlertStatus) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            قيد الانتظار
          </Badge>
        );
      case "ordered":
        return (
          <Badge className="bg-green-600 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            تم الطلب
          </Badge>
        );
      case "ignored":
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            متجاهل
          </Badge>
        );
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

  const handleBulkOrder = () => {
    setIsOrderDialogOpen(true);
  };

  const handleExportReport = () => {
    // Export functionality would go here
    console.log("Exporting report...");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <BellRing className="h-8 w-8" />
          تنبيهات إعادة الطلب
        </h2>
        <p className="text-muted-foreground mt-1">
          إدارة تنبيهات المخزون المنخفض وإعادة طلب المواد
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
                  الرجاء اختيار المخزن لعرض تنبيهات إعادة الطلب
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
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAlerts}</div>
              <p className="text-xs text-muted-foreground">تنبيه نشط</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                تنبيهات حرجة
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.criticalAlerts}
              </div>
              <p className="text-xs text-muted-foreground">يحتاج إجراء فوري</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                أولوية عالية
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {stats.highAlerts}
              </div>
              <p className="text-xs text-muted-foreground">يحتاج اهتمام قريب</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                قيد الانتظار
              </CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.pendingAlerts}
              </div>
              <p className="text-xs text-muted-foreground">لم يتم طلبه بعد</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                التكلفة المقدرة
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {(stats.totalEstimatedCost / 1000000).toFixed(1)}M
              </div>
              <p className="text-xs text-muted-foreground">دينار عراقي</p>
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
                تفاصيل التنبيهات
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
                  onClick={handleBulkOrder}
                  disabled={selectedItems.length === 0}
                  className="flex items-center gap-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  طلب المحدد ({selectedItems.length})
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="ابحث بالاسم أو الكود أو المورد..."
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
                    <SelectItem value="critical">حرج</SelectItem>
                    <SelectItem value="high">عالي</SelectItem>
                    <SelectItem value="medium">متوسط</SelectItem>
                    <SelectItem value="low">منخفض</SelectItem>
                  </SelectContent>
                </Select>

                {/* Status Filter */}
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="فلترة حسب الحالة..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">كل الحالات</SelectItem>
                    <SelectItem value="pending">قيد الانتظار</SelectItem>
                    <SelectItem value="ordered">تم الطلب</SelectItem>
                    <SelectItem value="ignored">متجاهل</SelectItem>
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
                جدول التنبيهات
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
                      <TableHead className="text-right">المخزون الحالي</TableHead>
                      <TableHead className="text-right">نقطة إعادة الطلب</TableHead>
                      <TableHead className="text-right">كمية الطلب</TableHead>
                      <TableHead className="text-right">المورد</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAlerts.length > 0 ? (
                      filteredAlerts.map((alert) => (
                        <TableRow
                          key={alert.id}
                          className={
                            alert.priority === "critical"
                              ? "bg-red-50 dark:bg-red-950/20"
                              : alert.priority === "high"
                              ? "bg-orange-50 dark:bg-orange-950/20"
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
                            <span
                              className={`font-bold ${
                                alert.currentStock <= alert.minStock
                                  ? "text-red-600"
                                  : "text-green-600"
                              }`}
                            >
                              {alert.currentStock} {alert.unit}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            {alert.reorderPoint} {alert.unit}
                          </TableCell>
                          <TableCell className="text-center font-medium">
                            {alert.reorderQuantity} {alert.unit}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Truck className="h-3 w-3" />
                              <div>
                                <div className="text-sm">{alert.supplier}</div>
                                <div className="text-xs text-muted-foreground">
                                  {alert.supplierContact}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(alert.status)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={10}
                          className="text-center text-muted-foreground h-24"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <Package className="h-12 w-12 text-muted-foreground/50" />
                            <p>لا توجد تنبيهات تطابق معايير البحث</p>
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

      {/* Bulk Order Dialog */}
      <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>تأكيد طلب المواد</DialogTitle>
            <DialogDescription>
              أنت على وشك طلب {selectedItems.length} مادة. يرجى مراجعة التفاصيل
              قبل التأكيد.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div className="border rounded-md p-4 max-h-[300px] overflow-y-auto">
                {stockAlerts
                  .filter((alert) => selectedItems.includes(alert.id))
                  .map((alert) => (
                    <div
                      key={alert.id}
                      className="flex justify-between items-center py-2 border-b last:border-0"
                    >
                      <div>
                        <p className="font-medium">{alert.itemName}</p>
                        <p className="text-sm text-muted-foreground">
                          {alert.itemCode} - {alert.supplier}
                        </p>
                      </div>
                      <div className="text-left">
                        <p className="font-medium">
                          {alert.reorderQuantity} {alert.unit}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {(alert.estimatedCost / 1000).toFixed(0)}K IQD
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="bg-muted p-4 rounded-md">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">إجمالي التكلفة المقدرة:</span>
                  <span className="text-xl font-bold">
                    {(
                      stockAlerts
                        .filter((alert) => selectedItems.includes(alert.id))
                        .reduce((sum, alert) => sum + alert.estimatedCost, 0) /
                      1000000
                    ).toFixed(2)}
                    M دينار عراقي
                  </span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsOrderDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button onClick={() => setIsOrderDialogOpen(false)}>
              تأكيد الطلب
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReorderAlertsPage;
