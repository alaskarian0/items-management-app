"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  TrendingDown,
  Search,
  FileText,
  Download,
  Filter,
  AlertTriangle,
  Calendar,
  DollarSign,
  Package,
  Edit,
  Trash2,
  Printer,
  Eye,
  MoreHorizontal,
  FileCheck
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Import shared data and types
import {
  assetConsumed,
  fixedAssets,
  getAssetById,
  type AssetConsumed
} from "@/lib/data/fixed-assets-data";

// View model for consumed assets display
type ConsumedAssetView = AssetConsumed & {
  assetName: string;
  assetCode: string;
  category: string;
  remainingValue: number;
};

// Convert asset consumed data to view model
const consumedAssetsView: ConsumedAssetView[] = assetConsumed.map(item => {
  const asset = getAssetById(item.assetId);
  return {
    ...item,
    assetName: asset?.name || 'غير معروف',
    assetCode: asset?.assetCode || 'غير معروف',
    category: asset?.category || 'غير معروف',
    remainingValue: item.estimatedValue // For view purposes
  };
});

const ConsumedPage = () => {
  const [assets, setAssets] = useState<ConsumedAssetView[]>(consumedAssetsView);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'partial' | 'complete'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedAsset, setSelectedAsset] = useState<ConsumedAssetView | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const categories = Array.from(new Set(assets.map(a => a.category)));

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.assetName.includes(searchTerm) ||
                         asset.assetCode.includes(searchTerm) ||
                         asset.consumedBy?.includes(searchTerm) ||
                         asset.consumptionReason.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' ||
                         (filterStatus === 'complete' && asset.consumptionMethod === 'end-of-life') ||
                         (filterStatus === 'partial' && asset.consumptionMethod !== 'end-of-life');
    const matchesCategory = filterCategory === 'all' || asset.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleViewDetails = (asset: ConsumedAssetView) => {
    setSelectedAsset(asset);
    setIsDialogOpen(true);
  };

  const handleEdit = (asset: ConsumedAssetView) => {
    console.log('Edit asset:', asset);
    // TODO: Implement edit functionality
  };

  const handleDelete = (asset: ConsumedAssetView) => {
    if (confirm(`هل أنت متأكد من حذف "${asset.assetName}"؟`)) {
      setAssets(assets.filter(a => a.id !== asset.id));
    }
  };

  const handlePrint = (asset: ConsumedAssetView) => {
    console.log('Print asset:', asset);
    // TODO: Implement print functionality
    window.print();
  };

  const handleExportPDF = (asset: ConsumedAssetView) => {
    console.log('Export PDF for:', asset);
    // TODO: Implement PDF export functionality
  };

  const handleViewHistory = (asset: ConsumedAssetView) => {
    console.log('View history for:', asset);
    // TODO: Implement history view functionality
  };

  const handleCreateReport = (asset: ConsumedAssetView) => {
    console.log('Create report for:', asset);
    // TODO: Implement report creation functionality
  };

  const stats = {
    total: assets.length,
    totalValue: assets.reduce((sum, a) => sum + a.estimatedValue, 0),
    consumedValue: assets.reduce((sum, a) => sum + a.estimatedValue, 0),
    complete: assets.filter(a => a.consumptionMethod === 'end-of-life').length,
    partial: assets.filter(a => a.consumptionMethod !== 'end-of-life').length,
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المستهلكات</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">موجودات مستهلكة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">القيمة المستهلكة</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.consumedValue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">دينار عراقي</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">استهلاك كامل</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.complete}</div>
            <p className="text-xs text-muted-foreground">موجودات منتهية</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">استهلاك جزئي</CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.partial}</div>
            <p className="text-xs text-muted-foreground">موجودات متبقية</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              سجل الموجودات المستهلكة
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline">
                <FileText className="ml-2 h-4 w-4" />
                تقرير الاستهلاك
              </Button>
              <Button variant="outline">
                <Download className="ml-2 h-4 w-4" />
                تصدير
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث عن موجود..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
              <SelectTrigger>
                <Filter className="ml-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="complete">استهلاك كامل</SelectItem>
                <SelectItem value="partial">استهلاك جزئي</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue placeholder="الفئة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الفئات</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="border rounded-lg">
            <Table dir="rtl">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">اسم الموجود</TableHead>
                  <TableHead className="text-right">الرمز</TableHead>
                  <TableHead className="text-right">الفئة</TableHead>
                  <TableHead className="text-right">القيمة الأصلية</TableHead>
                  <TableHead className="text-right">القيمة المستهلكة</TableHead>
                  <TableHead className="text-right">القيمة المتبقية</TableHead>
                  <TableHead className="text-right">تاريخ الاستهلاك</TableHead>
                  <TableHead className="text-right">سبب الاستهلاك</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-center">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                      لا توجد نتائج
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAssets.map((asset) => {
                    const isComplete = asset.consumptionMethod === 'end-of-life';
                    const consumedDate = asset.consumptionDate instanceof Date
                      ? asset.consumptionDate.toLocaleDateString('ar-SA')
                      : new Date(asset.consumptionDate).toLocaleDateString('ar-SA');

                    return (
                      <TableRow key={asset.id}>
                        <TableCell className="font-medium text-right">{asset.assetName}</TableCell>
                        <TableCell className="text-right">
                          <code className="px-2 py-1 bg-muted rounded text-sm">
                            {asset.assetCode}
                          </code>
                        </TableCell>
                        <TableCell className="text-right">{asset.category}</TableCell>
                        <TableCell className="text-right">{asset.estimatedValue.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-col">
                            <span className="font-medium text-red-600">
                              {asset.estimatedValue.toLocaleString()}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {isComplete ? '100%' : 'جزئي'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={isComplete ? 'text-muted-foreground' : 'text-green-600'}>
                            {isComplete ? '0' : asset.estimatedValue.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            {consumedDate}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{asset.consumptionReason}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant={isComplete ? 'destructive' : 'outline'}>
                            {isComplete ? 'استهلاك كامل' : 'استهلاك جزئي'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleViewDetails(asset)}>
                                <Eye className="ml-2 h-4 w-4" />
                                عرض التفاصيل
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEdit(asset)}>
                                <Edit className="ml-2 h-4 w-4" />
                                تعديل
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handlePrint(asset)}>
                                <Printer className="ml-2 h-4 w-4" />
                                طباعة
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleExportPDF(asset)}>
                                <Download className="ml-2 h-4 w-4" />
                                تصدير PDF
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleViewHistory(asset)}>
                                <Calendar className="ml-2 h-4 w-4" />
                                سجل التغييرات
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleCreateReport(asset)}>
                                <FileCheck className="ml-2 h-4 w-4" />
                                إنشاء تقرير
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDelete(asset)}
                                className="text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="ml-2 h-4 w-4" />
                                حذف
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>تفاصيل الموجود المستهلك</DialogTitle>
          </DialogHeader>
          {selectedAsset && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">اسم الموجود</Label>
                  <div className="font-medium">{selectedAsset.assetName}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">رمز الموجود</Label>
                  <code className="px-2 py-1 bg-muted rounded text-sm">
                    {selectedAsset.assetCode}
                  </code>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">الفئة</Label>
                  <div className="font-medium">{selectedAsset.category}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">القيمة التقديرية</Label>
                  <div className="font-medium">{selectedAsset.estimatedValue.toLocaleString()} دينار</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">تاريخ الاستهلاك</Label>
                  <div className="font-medium">
                    {selectedAsset.consumptionDate instanceof Date
                      ? selectedAsset.consumptionDate.toLocaleDateString('ar-SA')
                      : new Date(selectedAsset.consumptionDate).toLocaleDateString('ar-SA')}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">سبب الاستهلاك</Label>
                  <div className="font-medium">{selectedAsset.consumptionReason}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">طريقة الاستهلاك</Label>
                  <div className="font-medium">{selectedAsset.consumptionMethod}</div>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label className="text-muted-foreground">الحالة</Label>
                  <div>
                    <Badge variant={selectedAsset.status === 'approved' ? 'destructive' : 'outline'}>
                      {selectedAsset.status === 'approved' ? 'موافق عليه' : 'قيد الانتظار'}
                    </Badge>
                  </div>
                </div>
              </div>
              {selectedAsset.notes && (
                <div className="space-y-2">
                  <Label className="text-muted-foreground">ملاحظات</Label>
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{selectedAsset.notes}</AlertDescription>
                  </Alert>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)}>إغلاق</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConsumedPage;
