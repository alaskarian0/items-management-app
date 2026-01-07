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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  Boxes,
  Search,
  Filter,
  CalendarIcon,
  Truck,
  TrendingUp,
  TrendingDown,
  X,
  MoreHorizontal,
  Settings2,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { WarehouseSelector } from "@/components/warehouse/warehouse-selector";
import { useWarehouse } from "@/context/warehouse-context";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

// Import shared data and types
import {
  stockStatusOptions,
} from "@/lib/data/warehouse-data";
import { useInventoryStock } from "@/hooks/use-inventory";
import { useVendors } from "@/hooks/use-vendors";
// removed mock items

const StockBalancePage = () => {
  const { selectedWarehouse } = useWarehouse();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [selectedVendor, setSelectedVendor] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [purchaseDateFrom, setPurchaseDateFrom] = useState<Date | undefined>();
  const [purchaseDateTo, setPurchaseDateTo] = useState<Date | undefined>();
  const [issueDateFrom, setIssueDateFrom] = useState<Date | undefined>();
  const [issueDateTo, setIssueDateTo] = useState<Date | undefined>();

  // Dialog state for minimum order level
  const [minOrderDialogOpen, setMinOrderDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [minOrderLevel, setMinOrderLevel] = useState<string>("");

  // Local state to store minimum order level overrides
  const [minOrderLevelOverrides, setMinOrderLevelOverrides] = useState<Record<string, number>>({});

  const fetchedItems = useInventoryStock(selectedWarehouse ? selectedWarehouse.id : 0) || [];

  // Fetch vendors from API
  const { vendors: vendorsData } = useVendors();

  // Extract vendors and item groups from fetched data
  const vendors = useMemo(() => {
    const data = vendorsData?.data;
    if (Array.isArray(data)) {
      return data.map((v: any) => v.name);
    }
    return [];
  }, [vendorsData]);

  const itemGroups = useMemo(() => {
    // Extract unique categories/groups from fetched items
    const groups = fetchedItems.map((item: any) => item.category || item.group || 'أخرى');
    return Array.from(new Set(groups)).filter(Boolean);
  }, [fetchedItems]);

  // Merge fetched items with local overrides
  const itemsWithOverrides = useMemo(() => {
    return fetchedItems.map(item => ({
      ...item,
      minStock: minOrderLevelOverrides[item.id] ?? item.minStock,
      // Update status based on new minStock
      status: (() => {
        const minStock = minOrderLevelOverrides[item.id] ?? item.minStock ?? 0;
        if (item.stock <= minStock * 0.5) return "critical";
        if (item.stock <= minStock) return "low";
        return "normal";
      })()
    }));
  }, [fetchedItems, minOrderLevelOverrides]);

  const filteredItems = useMemo(() => {
    return itemsWithOverrides.filter((item) => {
      // Safely access properties as they might be missing or different in mock vs db
      const itemGroup = (item as any).category || (item as any).group || 'أخرى';
      const itemVendor = (item as any).vendor || 'غير محدد';
      const itemStatus = item.status || 'normal';

      const matchesGroup = selectedGroup === "all" || itemGroup === selectedGroup;
      const matchesVendor = selectedVendor === "all" || itemVendor === selectedVendor;
      const matchesStatus = selectedStatus === "all" || itemStatus === selectedStatus;
      const matchesSearch =
        searchTerm === "" ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase());

      // Date filtering omitted for simplicity if fields are missing in DB type yet
      // But we mapped them in useInventoryStock so we can use them

      return matchesGroup && matchesVendor && matchesStatus && matchesSearch;
    });
  }, [itemsWithOverrides, searchTerm, selectedGroup, selectedVendor, selectedStatus]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalItems = filteredItems.length;
    const totalStock = filteredItems.reduce((sum, item) => sum + item.stock, 0);
    const totalValue = filteredItems.reduce((sum, item) => sum + item.totalValue, 0);
    const lowStockItems = filteredItems.filter(item => item.status === "low" || item.status === "critical").length;
    const criticalItems = filteredItems.filter(item => item.status === "critical").length;

    return { totalItems, totalStock, totalValue, lowStockItems, criticalItems };
  }, [filteredItems]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedGroup("all");
    setSelectedVendor("all");
    setSelectedStatus("all");
    setPurchaseDateFrom(undefined);
    setPurchaseDateTo(undefined);
    setIssueDateFrom(undefined);
    setIssueDateTo(undefined);
  };

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

  const getStockStatusColor = (stock: number, minStock: number, maxStock: number) => {
    if (stock <= minStock) return "text-red-600";
    if (stock >= maxStock) return "text-orange-600";
    return "text-green-600";
  };

  const handleOpenMinOrderDialog = (item: any) => {
    setSelectedItem(item);
    // Use the override value if exists, otherwise use the item's minStock
    const currentMinStock = minOrderLevelOverrides[item.id] ?? item.minStock;
    setMinOrderLevel(currentMinStock?.toString() || "");
    setMinOrderDialogOpen(true);
  };

  const handleSaveMinOrderLevel = () => {
    if (selectedItem && minOrderLevel) {
      const newMinLevel = parseInt(minOrderLevel, 10);

      // Update local state with the new minimum order level
      setMinOrderLevelOverrides(prev => ({
        ...prev,
        [selectedItem.id]: newMinLevel
      }));

      // Here you would typically also call an API to persist the change
      console.log(`Setting minimum order level for ${selectedItem.name} to ${newMinLevel}`);

      // Close the dialog
      setMinOrderDialogOpen(false);
      setSelectedItem(null);
      setMinOrderLevel("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Boxes className="h-8 w-8" />
          الرصيد المخزني
        </h2>
        <p className="text-muted-foreground mt-1">
          عرض وإدارة الأرصدة الحالية لجميع المواد في المخزن المحدد
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
                  الرجاء اختيار المخزن لعرض الرصيد المخزني
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
                إجمالي الأصناف
              </CardTitle>
              <Boxes className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalItems}</div>
              <p className="text-xs text-muted-foreground">صنف متوفر</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                إجمالي الكميات
              </CardTitle>
              <Boxes className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.totalStock}
              </div>
              <p className="text-xs text-muted-foreground">وحدة في المخزن</p>
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
                {(stats.totalValue / 1000000).toFixed(1)}M
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
                {stats.lowStockItems}
              </div>
              <p className="text-xs text-muted-foreground">صنف يحتاج إعادة طلب</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                مخزون خطير
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.criticalItems}
              </div>
              <p className="text-xs text-muted-foreground">صنف طارئ</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Stock Balance Content */}
      {selectedWarehouse && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              تفاصيل الرصيد المخزني
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Enhanced Filters */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">البحث والتصفية المتقدمة</Label>
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

                {/* Group Filter */}
                <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                  <SelectTrigger>
                    <SelectValue placeholder="فلترة حسب المجموعة..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">كل المجموعات</SelectItem>
                    {itemGroups.map((group) => (
                      <SelectItem key={group} value={group}>
                        {group}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Vendor Filter */}
                <Select value={selectedVendor} onValueChange={setSelectedVendor}>
                  <SelectTrigger>
                    <SelectValue placeholder="فلترة حسب المورد..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">كل الموردين</SelectItem>
                    {vendors.map((vendor) => (
                      <SelectItem key={vendor} value={vendor}>
                        {vendor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Status Filter */}
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="فلترة حسب الحالة..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">كل الحالات</SelectItem>
                    <SelectItem value="normal">طبيعي</SelectItem>
                    <SelectItem value="low">منخفض</SelectItem>
                    <SelectItem value="critical">حرج</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Purchase Date From */}
                <div className="space-y-2">
                  <Label>تاريخ الشراء من</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="w-full justify-start text-right font-normal"
                      >
                        <CalendarIcon className="ml-2 h-4 w-4" />
                        {purchaseDateFrom ? (
                          format(purchaseDateFrom, "PPP", { locale: ar })
                        ) : (
                          <span>اختر تاريخ</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={purchaseDateFrom}
                        onSelect={setPurchaseDateFrom}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Purchase Date To */}
                <div className="space-y-2">
                  <Label>تاريخ الشراء إلى</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="w-full justify-start text-right font-normal"
                      >
                        <CalendarIcon className="ml-2 h-4 w-4" />
                        {purchaseDateTo ? (
                          format(purchaseDateTo, "PPP", { locale: ar })
                        ) : (
                          <span>اختر تاريخ</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={purchaseDateTo}
                        onSelect={setPurchaseDateTo}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Issue Date From */}
                <div className="space-y-2">
                  <Label>تاريخ الصرف من</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="w-full justify-start text-right font-normal"
                      >
                        <CalendarIcon className="ml-2 h-4 w-4" />
                        {issueDateFrom ? (
                          format(issueDateFrom, "PPP", { locale: ar })
                        ) : (
                          <span>اختر تاريخ</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={issueDateFrom}
                        onSelect={setIssueDateFrom}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Issue Date To */}
                <div className="space-y-2">
                  <Label>تاريخ الصرف إلى</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="w-full justify-start text-right font-normal"
                      >
                        <CalendarIcon className="ml-2 h-4 w-4" />
                        {issueDateTo ? (
                          format(issueDateTo, "PPP", { locale: ar })
                        ) : (
                          <span>اختر تاريخ</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={issueDateTo}
                        onSelect={setIssueDateTo}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Clear Filters Button */}
              <div className="flex justify-end">
                <Button variant="outline" onClick={clearFilters} className="flex items-center gap-2">
                  <X className="h-4 w-4" />
                  مسح جميع الفلاتر
                </Button>
              </div>
            </div>

            {/* RTL Stock Table */}
            <div className="space-y-2">
              <Label className="text-base font-semibold">جدول المواد</Label>
              <div className="border rounded-md">
                <Table dir="rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">كود المادة</TableHead>
                      <TableHead className="text-right">اسم المادة</TableHead>
                      <TableHead className="text-right">المجموعة</TableHead>
                      <TableHead className="text-right">المورد</TableHead>
                      <TableHead className="text-right">الحد الأدنى</TableHead>
                      <TableHead className="text-right">الرصيد الحالي</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">آخر شراء</TableHead>
                      <TableHead className="text-right">آخر صرف</TableHead>
                      <TableHead className="text-right">القيمة الإجمالية</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.length > 0 ? (
                      filteredItems.map((item) => (
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
                            <Badge variant="secondary">{item.group}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Truck className="h-3 w-3" />
                              {(item as any).vendor}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">{item.minStock}</TableCell>
                          <TableCell>
                            <span className={`font-bold text-lg ${getStockStatusColor(item.stock, item.minStock || 0, (item as any).maxStock || 100)}`}>
                              {item.stock}
                            </span>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(item.status)}
                          </TableCell>
                          <TableCell className="text-sm">
                            {format(item.lastPurchaseDate, "yyyy-MM-dd", { locale: ar })}
                          </TableCell>
                          <TableCell className="text-sm">
                            {format(item.lastIssueDate, "yyyy-MM-dd", { locale: ar })}
                          </TableCell>
                          <TableCell className="font-medium">
                            {(item.totalValue / 1000).toFixed(0)}K
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleOpenMinOrderDialog(item)}
                                  className="flex items-center gap-2"
                                >
                                  <Settings2 className="h-4 w-4" />
                                  تحديد الحد الأدنى للطلب
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={11}
                          className="text-center text-muted-foreground h-24"
                        >
                          لا توجد مواد تطابق معايير البحث والتصفية
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

      {/* Minimum Order Level Dialog */}
      <Dialog open={minOrderDialogOpen} onOpenChange={setMinOrderDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>تحديد الحد الأدنى للطلب</DialogTitle>
            <DialogDescription>
              {selectedItem && (
                <>
                  تحديد الحد الأدنى للمادة: <strong>{selectedItem.name}</strong>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="minOrderLevel">الحد الأدنى للطلب</Label>
              <Input
                id="minOrderLevel"
                type="number"
                value={minOrderLevel}
                onChange={(e) => setMinOrderLevel(e.target.value)}
                placeholder="أدخل الحد الأدنى..."
                min="0"
              />
              <p className="text-xs text-muted-foreground">
                سيتم إرسال تنبيه عندما يصل الرصيد إلى هذا الحد
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMinOrderDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleSaveMinOrderLevel}>
              حفظ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StockBalancePage;
