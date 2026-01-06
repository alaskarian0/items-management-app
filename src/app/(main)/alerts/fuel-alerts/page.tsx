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
  Bell,
  Search,
  Fuel,
  Droplet,
  TrendingDown,
  Download,
  CheckCircle2,
  Clock,
  Truck,
  Gauge,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { WarehouseSelector } from "@/components/warehouse/warehouse-selector";
import { useWarehouse } from "@/context/warehouse-context";
import { useAuthStore } from "@/store/auth/authStore";
import { Textarea } from "@/components/ui/textarea";

// Alert priority levels
type AlertPriority = "critical" | "high" | "medium" | "low";
type AlertStatus = "pending" | "requested" | "in_progress" | "resolved";
type FuelType = "بنزين" | "ديزل" | "غاز" | "زيوت";

interface FuelAlert {
  id: number;
  fuelType: FuelType;
  tankCode: string;
  tankName: string;
  currentLevel: number; // in liters
  capacity: number; // in liters
  minLevel: number; // minimum level threshold
  criticalLevel: number; // critical level threshold
  unit: string;
  location: string;
  vehicleType?: string; // Type of vehicles using this fuel
  averageDailyConsumption: number; // liters per day
  daysUntilEmpty: number;
  priority: AlertPriority;
  status: AlertStatus;
  lastRefillDate: string;
  lastRefillAmount: number;
  estimatedRefillCost: number;
  supplierName: string;
  supplierContact: string;
  notes?: string;
}

// Mock data for fuel alerts
const fuelAlerts: FuelAlert[] = [
  {
    id: 1,
    fuelType: "ديزل",
    tankCode: "TANK-DSL-001",
    tankName: "خزان الديزل الرئيسي",
    currentLevel: 500,
    capacity: 10000,
    minLevel: 2000,
    criticalLevel: 1000,
    unit: "لتر",
    location: "المخزن الرئيسي - القسم الشمالي",
    vehicleType: "آليات ثقيلة",
    averageDailyConsumption: 250,
    daysUntilEmpty: 2,
    priority: "critical",
    status: "pending",
    lastRefillDate: "2024-12-20",
    lastRefillAmount: 8000,
    estimatedRefillCost: 15000000,
    supplierName: "شركة النفط الوطنية",
    supplierContact: "07701234567",
    notes: "مستوى حرج - يحتاج تعبئة فورية",
  },
  {
    id: 2,
    fuelType: "بنزين",
    tankCode: "TANK-PET-001",
    tankName: "خزان البنزين الأول",
    currentLevel: 1500,
    capacity: 8000,
    minLevel: 2000,
    criticalLevel: 1000,
    unit: "لتر",
    location: "المخزن الرئيسي - القسم الجنوبي",
    vehicleType: "سيارات إدارية",
    averageDailyConsumption: 180,
    daysUntilEmpty: 8,
    priority: "high",
    status: "requested",
    lastRefillDate: "2024-12-25",
    lastRefillAmount: 6000,
    estimatedRefillCost: 12000000,
    supplierName: "شركة النفط الوطنية",
    supplierContact: "07701234567",
  },
  {
    id: 3,
    fuelType: "زيوت",
    tankCode: "TANK-OIL-001",
    tankName: "خزان زيوت المحركات",
    currentLevel: 300,
    capacity: 2000,
    minLevel: 500,
    criticalLevel: 200,
    unit: "لتر",
    location: "المخزن الفرعي - ورشة الصيانة",
    vehicleType: "جميع الآليات",
    averageDailyConsumption: 25,
    daysUntilEmpty: 12,
    priority: "high",
    status: "pending",
    lastRefillDate: "2024-12-15",
    lastRefillAmount: 1500,
    estimatedRefillCost: 8000000,
    supplierName: "شركة الزيوت المتحدة",
    supplierContact: "07709876543",
  },
  {
    id: 4,
    fuelType: "ديزل",
    tankCode: "TANK-DSL-002",
    tankName: "خزان الديزل الاحتياطي",
    currentLevel: 3500,
    capacity: 5000,
    minLevel: 1500,
    criticalLevel: 800,
    unit: "لتر",
    location: "المخزن الفرعي - منطقة المولدات",
    vehicleType: "مولدات كهربائية",
    averageDailyConsumption: 150,
    daysUntilEmpty: 23,
    priority: "medium",
    status: "in_progress",
    lastRefillDate: "2025-01-01",
    lastRefillAmount: 4500,
    estimatedRefillCost: 9000000,
    supplierName: "شركة النفط الوطنية",
    supplierContact: "07701234567",
  },
  {
    id: 5,
    fuelType: "بنزين",
    tankCode: "TANK-PET-002",
    tankName: "خزان البنزين الثاني",
    currentLevel: 900,
    capacity: 6000,
    minLevel: 1800,
    criticalLevel: 900,
    unit: "لتر",
    location: "المخزن الفرعي - موقف السيارات",
    vehicleType: "سيارات النقل الخفيف",
    averageDailyConsumption: 200,
    daysUntilEmpty: 4,
    priority: "critical",
    status: "pending",
    lastRefillDate: "2024-12-22",
    lastRefillAmount: 5000,
    estimatedRefillCost: 10000000,
    supplierName: "شركة النفط الوطنية",
    supplierContact: "07701234567",
    notes: "على وشك النفاد",
  },
  {
    id: 6,
    fuelType: "غاز",
    tankCode: "TANK-GAS-001",
    tankName: "خزان الغاز الرئيسي",
    currentLevel: 800,
    capacity: 3000,
    minLevel: 1000,
    criticalLevel: 500,
    unit: "لتر",
    location: "المخزن الرئيسي - قسم التدفئة",
    averageDailyConsumption: 100,
    daysUntilEmpty: 8,
    priority: "high",
    status: "requested",
    lastRefillDate: "2024-12-28",
    lastRefillAmount: 2500,
    estimatedRefillCost: 6000000,
    supplierName: "شركة الغاز الوطنية",
    supplierContact: "07705556666",
  },
];

const FuelAlertsPage = () => {
  const { selectedWarehouse } = useWarehouse();
  const { user } = useAuthStore();
  const isFuelAdmin = user?.warehouse === "fuel";

  const [alerts, setAlerts] = useState<FuelAlert[]>(fuelAlerts);
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [fuelTypeFilter, setFuelTypeFilter] = useState<string>("all");
  const [selectedAlerts, setSelectedAlerts] = useState<number[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<FuelAlert | null>(null);
  const [actionType, setActionType] = useState<"request" | "resolve" | null>(null);
  const [actionNotes, setActionNotes] = useState("");

  // Filter and search logic
  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const matchesSearch =
        alert.tankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.tankCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.fuelType.includes(searchTerm) ||
        alert.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPriority = priorityFilter === "all" || alert.priority === priorityFilter;
      const matchesStatus = statusFilter === "all" || alert.status === statusFilter;
      const matchesFuelType = fuelTypeFilter === "all" || alert.fuelType === fuelTypeFilter;

      return matchesSearch && matchesPriority && matchesStatus && matchesFuelType;
    });
  }, [alerts, searchTerm, priorityFilter, statusFilter, fuelTypeFilter]);

  // Statistics
  const stats = useMemo(() => {
    const critical = alerts.filter((a) => a.priority === "critical").length;
    const high = alerts.filter((a) => a.priority === "high").length;
    const pending = alerts.filter((a) => a.status === "pending").length;
    const totalCapacity = alerts.reduce((sum, a) => sum + a.capacity, 0);
    const totalCurrent = alerts.reduce((sum, a) => sum + a.currentLevel, 0);
    const avgLevel = totalCapacity > 0 ? (totalCurrent / totalCapacity) * 100 : 0;

    return { critical, high, pending, avgLevel: avgLevel.toFixed(1) };
  }, [alerts]);

  const getPriorityBadge = (priority: AlertPriority) => {
    const variants = {
      critical: { color: "bg-red-600 dark:bg-red-600", icon: AlertTriangle },
      high: { color: "bg-orange-600 dark:bg-orange-600", icon: AlertCircle },
      medium: { color: "bg-yellow-600 dark:bg-yellow-600", icon: Bell },
      low: { color: "bg-blue-600 dark:bg-blue-600", icon: CheckCircle2 },
    };

    const variant = variants[priority];
    const Icon = variant.icon;

    return (
      <Badge className={`${variant.color} text-white flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {priority === "critical" ? "حرج" : priority === "high" ? "عالي" : priority === "medium" ? "متوسط" : "منخفض"}
      </Badge>
    );
  };

  const getStatusBadge = (status: AlertStatus) => {
    const variants = {
      pending: { color: "bg-gray-600 dark:bg-gray-600", text: "معلق" },
      requested: { color: "bg-blue-600 dark:bg-blue-600", text: "تم الطلب" },
      in_progress: { color: "bg-purple-600 dark:bg-purple-600", text: "قيد التنفيذ" },
      resolved: { color: "bg-green-600 dark:bg-green-600", text: "تم الحل" },
    };

    const variant = variants[status];

    return <Badge className={`${variant.color} text-white`}>{variant.text}</Badge>;
  };

  const getLevelPercentage = (current: number, capacity: number) => {
    return ((current / capacity) * 100).toFixed(1);
  };

  const getLevelColor = (current: number, minLevel: number, criticalLevel: number) => {
    if (current <= criticalLevel) return "text-red-600 dark:text-red-500 font-bold";
    if (current <= minLevel) return "text-orange-600 dark:text-orange-500 font-semibold";
    return "text-green-600 dark:text-green-500";
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAlerts(filteredAlerts.map((a) => a.id));
    } else {
      setSelectedAlerts([]);
    }
  };

  const handleSelectAlert = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedAlerts([...selectedAlerts, id]);
    } else {
      setSelectedAlerts(selectedAlerts.filter((alertId) => alertId !== id));
    }
  };

  const handleAction = (alert: FuelAlert, action: "request" | "resolve") => {
    setSelectedAlert(alert);
    setActionType(action);
    setActionDialogOpen(true);
  };

  const executeAction = () => {
    if (!selectedAlert || !actionType) return;

    setAlerts(
      alerts.map((alert) =>
        alert.id === selectedAlert.id
          ? {
              ...alert,
              status: actionType === "request" ? "requested" : "resolved",
              notes: actionNotes || alert.notes,
            }
          : alert
      )
    );

    setActionDialogOpen(false);
    setActionNotes("");
    setSelectedAlert(null);
    setActionType(null);
  };

  const handleBulkAction = (action: "request" | "resolve") => {
    setAlerts(
      alerts.map((alert) =>
        selectedAlerts.includes(alert.id)
          ? { ...alert, status: action === "request" ? "requested" : "resolved" }
          : alert
      )
    );
    setSelectedAlerts([]);
  };

  // Show access denied if not fuel admin
  if (!isFuelAdmin) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            عذراً، هذه الصفحة مخصصة لمسؤولي مخزن الوقود فقط.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Fuel className="h-8 w-8 text-orange-600 dark:text-orange-500" />
          تنبيهات مخزن الوقود
        </h2>
        <p className="text-muted-foreground mt-1">
          متابعة مستويات الوقود والتنبيهات الحرجة
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
                  الرجاء اختيار المخزن لعرض التنبيهات
                </AlertDescription>
              </Alert>
              <WarehouseSelector />
            </div>
          ) : (
            <WarehouseSelector />
          )}
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      {selectedWarehouse && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">تنبيهات حرجة</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600 dark:text-red-500">{stats.critical}</div>
              <p className="text-xs text-muted-foreground">يحتاج تعبئة فورية</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">تنبيهات عالية</CardTitle>
              <Bell className="h-4 w-4 text-orange-600 dark:text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-500">{stats.high}</div>
              <p className="text-xs text-muted-foreground">يحتاج متابعة</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">طلبات معلقة</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">بانتظار التنفيذ</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">متوسط المستوى</CardTitle>
              <Gauge className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-500">{stats.avgLevel}%</div>
              <p className="text-xs text-muted-foreground">من السعة الكلية</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Actions */}
      {selectedWarehouse && (
        <Card>
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <CardTitle>قائمة التنبيهات ({filteredAlerts.length})</CardTitle>
              <div className="flex flex-wrap gap-2">
                {selectedAlerts.length > 0 && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkAction("request")}
                    >
                      <Truck className="h-4 w-4 ml-2" />
                      طلب تعبئة ({selectedAlerts.length})
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkAction("resolve")}
                    >
                      <CheckCircle2 className="h-4 w-4 ml-2" />
                      تحديد كمحلول ({selectedAlerts.length})
                    </Button>
                  </>
                )}
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 ml-2" />
                  تصدير
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search and Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="البحث بالخزان، الكود، الموقع..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>

              <Select value={fuelTypeFilter} onValueChange={setFuelTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="نوع الوقود" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأنواع</SelectItem>
                  <SelectItem value="بنزين">بنزين</SelectItem>
                  <SelectItem value="ديزل">ديزل</SelectItem>
                  <SelectItem value="غاز">غاز</SelectItem>
                  <SelectItem value="زيوت">زيوت</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="الأولوية" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأولويات</SelectItem>
                  <SelectItem value="critical">حرج</SelectItem>
                  <SelectItem value="high">عالي</SelectItem>
                  <SelectItem value="medium">متوسط</SelectItem>
                  <SelectItem value="low">منخفض</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="pending">معلق</SelectItem>
                  <SelectItem value="requested">تم الطلب</SelectItem>
                  <SelectItem value="in_progress">قيد التنفيذ</SelectItem>
                  <SelectItem value="resolved">تم الحل</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Alerts Table */}
            <div className="border rounded-md">
              <Table dir="rtl">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right w-12">
                      <Checkbox
                        checked={
                          filteredAlerts.length > 0 &&
                          selectedAlerts.length === filteredAlerts.length
                        }
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="text-right">نوع الوقود</TableHead>
                    <TableHead className="text-right">الخزان</TableHead>
                    <TableHead className="text-right">الموقع</TableHead>
                    <TableHead className="text-right">المستوى الحالي</TableHead>
                    <TableHead className="text-right">النسبة</TableHead>
                    <TableHead className="text-right">أيام حتى الفراغ</TableHead>
                    <TableHead className="text-right">الأولوية</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAlerts.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={10}
                        className="text-center text-muted-foreground h-24"
                      >
                        لا توجد تنبيهات متاحة
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAlerts.map((alert) => (
                      <TableRow key={alert.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedAlerts.includes(alert.id)}
                            onCheckedChange={(checked) =>
                              handleSelectAlert(alert.id, checked as boolean)
                            }
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-2">
                            <Droplet className="h-4 w-4 text-blue-600 dark:text-blue-500" />
                            <span className="font-medium">{alert.fuelType}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div>
                            <div className="font-medium">{alert.tankName}</div>
                            <div className="text-sm text-muted-foreground">
                              {alert.tankCode}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          {alert.location}
                        </TableCell>
                        <TableCell className="text-right">
                          <div
                            className={getLevelColor(
                              alert.currentLevel,
                              alert.minLevel,
                              alert.criticalLevel
                            )}
                          >
                            {alert.currentLevel.toLocaleString()} {alert.unit}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            من {alert.capacity.toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  alert.currentLevel <= alert.criticalLevel
                                    ? "bg-red-600 dark:bg-red-500"
                                    : alert.currentLevel <= alert.minLevel
                                    ? "bg-orange-600 dark:bg-orange-500"
                                    : "bg-green-600 dark:bg-green-500"
                                }`}
                                style={{
                                  width: `${getLevelPercentage(
                                    alert.currentLevel,
                                    alert.capacity
                                  )}%`,
                                }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">
                              {getLevelPercentage(alert.currentLevel, alert.capacity)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div
                            className={
                              alert.daysUntilEmpty <= 3
                                ? "text-red-600 dark:text-red-500 font-bold"
                                : alert.daysUntilEmpty <= 7
                                ? "text-orange-600 dark:text-orange-500 font-semibold"
                                : "text-green-600 dark:text-green-500"
                            }
                          >
                            {alert.daysUntilEmpty} يوم
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {getPriorityBadge(alert.priority)}
                        </TableCell>
                        <TableCell className="text-right">
                          {getStatusBadge(alert.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-1 justify-end">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedAlert(alert);
                                setDialogOpen(true);
                              }}
                            >
                              <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-500" />
                            </Button>
                            {alert.status === "pending" && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleAction(alert, "request")}
                                title="طلب تعبئة"
                              >
                                <Truck className="h-4 w-4 text-green-600 dark:text-green-500" />
                              </Button>
                            )}
                            {(alert.status === "requested" ||
                              alert.status === "in_progress") && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleAction(alert, "resolve")}
                                title="تحديد كمحلول"
                              >
                                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alert Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl" dir="rtl">
          <DialogHeader>
            <DialogTitle>تفاصيل التنبيه</DialogTitle>
            <DialogDescription>معلومات تفصيلية عن حالة الوقود</DialogDescription>
          </DialogHeader>
          {selectedAlert && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">نوع الوقود</Label>
                  <div className="font-semibold flex items-center gap-2">
                    <Droplet className="h-4 w-4 text-blue-600 dark:text-blue-500" />
                    {selectedAlert.fuelType}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">رمز الخزان</Label>
                  <div className="font-semibold font-mono">{selectedAlert.tankCode}</div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">اسم الخزان</Label>
                <div className="font-semibold">{selectedAlert.tankName}</div>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">الموقع</Label>
                <div className="font-medium">{selectedAlert.location}</div>
              </div>

              {selectedAlert.vehicleType && (
                <div className="space-y-2">
                  <Label className="text-muted-foreground">نوع الآليات</Label>
                  <div className="font-medium">{selectedAlert.vehicleType}</div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">المستوى الحالي</Label>
                  <div
                    className={`font-bold text-lg ${getLevelColor(
                      selectedAlert.currentLevel,
                      selectedAlert.minLevel,
                      selectedAlert.criticalLevel
                    )}`}
                  >
                    {selectedAlert.currentLevel.toLocaleString()} {selectedAlert.unit}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">السعة الكلية</Label>
                  <div className="font-bold text-lg">
                    {selectedAlert.capacity.toLocaleString()} {selectedAlert.unit}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">النسبة المئوية</Label>
                  <div className="font-bold text-lg text-primary">
                    {getLevelPercentage(selectedAlert.currentLevel, selectedAlert.capacity)}%
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">الحد الأدنى</Label>
                  <div className="font-medium text-orange-600 dark:text-orange-500">
                    {selectedAlert.minLevel.toLocaleString()} {selectedAlert.unit}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">المستوى الحرج</Label>
                  <div className="font-medium text-red-600 dark:text-red-500">
                    {selectedAlert.criticalLevel.toLocaleString()} {selectedAlert.unit}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">الاستهلاك اليومي</Label>
                  <div className="font-medium flex items-center gap-1">
                    <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-500" />
                    {selectedAlert.averageDailyConsumption.toLocaleString()} {selectedAlert.unit}/يوم
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">أيام حتى الفراغ</Label>
                  <div
                    className={`font-bold ${
                      selectedAlert.daysUntilEmpty <= 3
                        ? "text-red-600 dark:text-red-500"
                        : selectedAlert.daysUntilEmpty <= 7
                        ? "text-orange-600 dark:text-orange-500"
                        : "text-green-600 dark:text-green-500"
                    }`}
                  >
                    {selectedAlert.daysUntilEmpty} يوم
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">آخر تعبئة</Label>
                  <div className="font-medium">{selectedAlert.lastRefillDate}</div>
                  <div className="text-sm text-muted-foreground">
                    الكمية: {selectedAlert.lastRefillAmount.toLocaleString()} {selectedAlert.unit}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">التكلفة المقدرة للتعبئة</Label>
                  <div className="font-bold text-lg text-primary">
                    {selectedAlert.estimatedRefillCost.toLocaleString()} IQD
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">المورد</Label>
                <div className="font-medium">{selectedAlert.supplierName}</div>
                <div className="text-sm text-muted-foreground">
                  الهاتف: {selectedAlert.supplierContact}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">الأولوية</Label>
                  <div>{getPriorityBadge(selectedAlert.priority)}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">الحالة</Label>
                  <div>{getStatusBadge(selectedAlert.status)}</div>
                </div>
              </div>

              {selectedAlert.notes && (
                <div className="space-y-2">
                  <Label className="text-muted-foreground">ملاحظات</Label>
                  <div className="p-3 bg-muted rounded-md">{selectedAlert.notes}</div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Action Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>
              {actionType === "request" ? "طلب تعبئة وقود" : "تحديد كمحلول"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "request"
                ? "سيتم إرسال طلب تعبئة للمورد"
                : "تأكيد حل التنبيه"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedAlert && (
              <div className="p-4 bg-muted rounded-md space-y-2">
                <div className="font-semibold">{selectedAlert.tankName}</div>
                <div className="text-sm text-muted-foreground">
                  المستوى: {selectedAlert.currentLevel.toLocaleString()} من{" "}
                  {selectedAlert.capacity.toLocaleString()} {selectedAlert.unit}
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label>ملاحظات إضافية</Label>
              <Textarea
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                placeholder="أضف ملاحظاتك هنا..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={executeAction}>
              {actionType === "request" ? "إرسال الطلب" : "تأكيد"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FuelAlertsPage;
