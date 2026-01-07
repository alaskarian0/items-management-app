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
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  Search,
  Filter,
  Package,
  Truck,
  X,
  Download,
  Calendar,
  Clock,
  Mail,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { WarehouseSelector } from "@/components/warehouse/warehouse-selector";
import { useWarehouse } from "@/context/warehouse-context";
import { format, differenceInDays } from "date-fns";
import { ar } from "date-fns/locale";

// Warranty alert priority levels
type WarrantyPriority = "expired" | "critical" | "warning" | "normal";

interface WarrantyAlert {
  id: number;
  itemCode: string;
  itemName: string;
  quantity: number;
  unit: string;
  category: string;
  supplier: string;
  supplierContact: string;
  purchaseDate: string;
  warrantyPeriod: number;
  warrantyUnit: "day" | "month" | "year";
  warrantyEndDate: string;
  daysRemaining: number;
  priority: WarrantyPriority;
  serialNumber?: string;
  location?: string;
  notes?: string;
}

// Mock data for warranty alerts
const warrantyAlerts: WarrantyAlert[] = [
  {
    id: 1,
    itemCode: "ELE-DSP-001",
    itemName: "شاشة عرض Samsung 55 بوصة",
    quantity: 5,
    unit: "قطعة",
    category: "المعدات الكهربائية",
    supplier: "شركة التقنية المتقدمة",
    supplierContact: "07705555555",
    purchaseDate: "2023-12-15",
    warrantyPeriod: 1,
    warrantyUnit: "year",
    warrantyEndDate: "2024-12-15",
    daysRemaining: -27,
    priority: "expired",
    serialNumber: "SN-DSP-2023-001",
    location: "قاعة الاجتماعات الرئيسية",
    notes: "انتهت فترة الضمان - يحتاج تجديد",
  },
  {
    id: 2,
    itemCode: "ELE-GEN-001",
    itemName: "مولد كهرباء 5 كيلو واط",
    quantity: 3,
    unit: "قطعة",
    category: "المعدات الكهربائية",
    supplier: "شركة الأوائل للأجهزة الكهربائية",
    supplierContact: "07704444444",
    purchaseDate: "2024-01-20",
    warrantyPeriod: 2,
    warrantyUnit: "year",
    warrantyEndDate: "2026-01-20",
    daysRemaining: 5,
    priority: "critical",
    serialNumber: "SN-GEN-2024-002",
    location: "مخزن المعدات الكهربائية",
    notes: "يحتاج صيانة وقائية قبل انتهاء الضمان",
  },
  {
    id: 3,
    itemCode: "ELE-AC-001",
    itemName: "مكيف هواء 1.5 طن LG",
    quantity: 15,
    unit: "قطعة",
    category: "المعدات الكهربائية",
    supplier: "شركة الأوائل للأجهزة الكهربائية",
    supplierContact: "07704444444",
    purchaseDate: "2024-06-01",
    warrantyPeriod: 18,
    warrantyUnit: "month",
    warrantyEndDate: "2025-12-01",
    daysRemaining: 20,
    priority: "warning",
    serialNumber: "SN-AC-2024-015",
    location: "موزعة على المكاتب",
  },
  {
    id: 4,
    itemCode: "ELE-PRN-001",
    itemName: "طابعة HP LaserJet Pro",
    quantity: 10,
    unit: "قطعة",
    category: "المعدات المكتبية",
    supplier: "شركة النور للمعدات المكتبية",
    supplierContact: "07702222222",
    purchaseDate: "2024-03-15",
    warrantyPeriod: 3,
    warrantyUnit: "year",
    warrantyEndDate: "2027-03-15",
    daysRemaining: 90,
    priority: "normal",
    serialNumber: "SN-PRN-2024-010",
    location: "قسم الشؤون الإدارية",
  },
  {
    id: 5,
    itemCode: "ELE-LAP-001",
    itemName: "لابتوب Dell Latitude",
    quantity: 20,
    unit: "قطعة",
    category: "الأجهزة الإلكترونية",
    supplier: "شركة التقنية المتقدمة",
    supplierContact: "07705555555",
    purchaseDate: "2024-08-01",
    warrantyPeriod: 2,
    warrantyUnit: "year",
    warrantyEndDate: "2026-08-01",
    daysRemaining: 45,
    priority: "warning",
    serialNumber: "SN-LAP-2024-020",
    location: "موزعة على الموظفين",
    notes: "تحتاج فحص دوري",
  },
  {
    id: 6,
    itemCode: "FUR-DSK-001",
    itemName: "مكتب خشبي تنفيذي",
    quantity: 35,
    unit: "قطعة",
    category: "الأثاث المكتبي",
    supplier: "موردون متحدون للأثاث",
    supplierContact: "07709876543",
    purchaseDate: "2023-11-10",
    warrantyPeriod: 1,
    warrantyUnit: "year",
    warrantyEndDate: "2024-11-10",
    daysRemaining: -62,
    priority: "expired",
    location: "مكاتب الموظفين",
  },
  {
    id: 7,
    itemCode: "ELE-UPS-001",
    itemName: "UPS 2000VA APC",
    quantity: 8,
    unit: "قطعة",
    category: "المعدات الكهربائية",
    supplier: "شركة الأوائل للأجهزة الكهربائية",
    supplierContact: "07704444444",
    purchaseDate: "2024-09-20",
    warrantyPeriod: 3,
    warrantyUnit: "year",
    warrantyEndDate: "2027-09-20",
    daysRemaining: 3,
    priority: "critical",
    serialNumber: "SN-UPS-2024-008",
    location: "غرفة الخوادم",
    notes: "مهم جداً - يحتاج تجديد فوري",
  },
];

const WarrantyAlertsPage = () => {
  const { selectedWarehouse } = useWarehouse();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isNotifyDialogOpen, setIsNotifyDialogOpen] = useState(false);

  // Extract unique categories
  const categories = useMemo(() => {
    return Array.from(new Set(warrantyAlerts.map((item) => item.category)));
  }, []);

  // Filter alerts
  const filteredAlerts = useMemo(() => {
    return warrantyAlerts.filter((alert) => {
      const matchesPriority =
        selectedPriority === "all" || alert.priority === selectedPriority;
      const matchesCategory =
        selectedCategory === "all" || alert.category === selectedCategory;
      const matchesSearch =
        searchTerm === "" ||
        alert.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase());

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

  const getPriorityBadge = (priority: WarrantyPriority) => {
    switch (priority) {
      case "expired":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <ShieldX className="h-3 w-3" />
            منتهي
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
            <ShieldCheck className="h-3 w-3" />
            طبيعي
          </Badge>
        );
    }
  };

  const getDaysRemainingBadge = (daysRemaining: number) => {
    if (daysRemaining < 0) {
      return (
        <Badge variant="destructive">منتهي منذ {Math.abs(daysRemaining)} يوم</Badge>
      );
    } else if (daysRemaining <= 7) {
      return <Badge className="bg-red-600">{daysRemaining} يوم متبقي</Badge>;
    } else if (daysRemaining <= 30) {
      return <Badge className="bg-orange-600">{daysRemaining} يوم متبقي</Badge>;
    } else if (daysRemaining <= 60) {
      return <Badge className="bg-yellow-600">{daysRemaining} يوم متبقي</Badge>;
    } else {
      return <Badge variant="outline">{daysRemaining} يوم متبقي</Badge>;
    }
  };

  const getWarrantyPeriodText = (period: number, unit: string) => {
    const unitText = {
      day: period === 1 ? "يوم" : "أيام",
      month: period === 1 ? "شهر" : "شهور",
      year: period === 1 ? "سنة" : "سنوات",
    };
    return `${period} ${unitText[unit as keyof typeof unitText]}`;
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

  const handleNotifySuppliers = () => {
    setIsNotifyDialogOpen(true);
  };

  const handleExportReport = () => {
    // Export functionality would go here
    console.log("Exporting warranty report...");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <ShieldAlert className="h-8 w-8" />
          تنبيهات انتهاء الضمان
        </h2>
        <p className="text-muted-foreground mt-1">
          متابعة وإدارة فترات الضمان للمواد والأجهزة
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
                  الرجاء اختيار المخزن لعرض تنبيهات الضمان
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
              <ShieldAlert className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAlerts}</div>
              <p className="text-xs text-muted-foreground">تنبيه ضمان نشط</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                ضمان منتهي
              </CardTitle>
              <ShieldX className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.expiredAlerts}
              </div>
              <p className="text-xs text-muted-foreground">يحتاج تجديد فوري</p>
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
              <p className="text-xs text-muted-foreground">أقل من شهرين</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                إجمالي القطع
              </CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.totalItems}
              </div>
              <p className="text-xs text-muted-foreground">قطعة تحت الضمان</p>
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
                تفاصيل تنبيهات الضمان
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
                  onClick={handleNotifySuppliers}
                  disabled={selectedItems.length === 0}
                  className="flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  إشعار الموردين ({selectedItems.length})
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
                    <SelectItem value="expired">منتهي</SelectItem>
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
                جدول تنبيهات الضمان
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
                      <TableHead className="text-right">الكمية</TableHead>
                      <TableHead className="text-right">رقم المستند</TableHead>
                      <TableHead className="text-right">تاريخ الشراء</TableHead>
                      <TableHead className="text-right">مدة الضمان</TableHead>
                      <TableHead className="text-right">تاريخ الانتهاء</TableHead>
                      <TableHead className="text-right">الأيام المتبقية</TableHead>
                      <TableHead className="text-right">المورد</TableHead>
                      <TableHead className="text-right">الموقع</TableHead>
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
                          <TableCell className="text-center">
                            {alert.quantity} {alert.unit}
                          </TableCell>
                          <TableCell>
                            <span className="font-mono text-xs">
                              {alert.serialNumber || "-"}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm">
                            {format(new Date(alert.purchaseDate), "yyyy-MM-dd")}
                          </TableCell>
                          <TableCell className="text-sm">
                            {getWarrantyPeriodText(
                              alert.warrantyPeriod,
                              alert.warrantyUnit
                            )}
                          </TableCell>
                          <TableCell className="text-sm">
                            {format(new Date(alert.warrantyEndDate), "yyyy-MM-dd")}
                          </TableCell>
                          <TableCell>
                            {getDaysRemainingBadge(alert.daysRemaining)}
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
                          <TableCell className="text-sm">
                            {alert.location || "-"}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={13}
                          className="text-center text-muted-foreground h-24"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <ShieldCheck className="h-12 w-12 text-muted-foreground/50" />
                            <p>لا توجد تنبيهات ضمان تطابق معايير البحث</p>
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

      {/* Notify Suppliers Dialog */}
      <Dialog open={isNotifyDialogOpen} onOpenChange={setIsNotifyDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>إرسال إشعار للموردين</DialogTitle>
            <DialogDescription>
              أنت على وشك إرسال إشعار إلى {selectedItems.length} مورد بخصوص انتهاء
              فترة الضمان. يرجى مراجعة التفاصيل.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div className="border rounded-md p-4 max-h-[300px] overflow-y-auto">
                {warrantyAlerts
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
                        {getDaysRemainingBadge(alert.daysRemaining)}
                      </div>
                    </div>
                  ))}
              </div>
              <Alert>
                <Mail className="h-4 w-4" />
                <AlertDescription>
                  سيتم إرسال إشعارات عبر البريد الإلكتروني إلى الموردين المعنيين
                  لتجديد الضمان أو الاستفسار عن خيارات الصيانة.
                </AlertDescription>
              </Alert>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsNotifyDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button onClick={() => setIsNotifyDialogOpen(false)}>
              إرسال الإشعارات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WarrantyAlertsPage;
