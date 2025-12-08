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
  Package
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

type ConsumedAsset = {
  id: string;
  assetName: string;
  assetCode: string;
  category: string;
  originalValue: number;
  consumedDate: string;
  consumedBy: string;
  department: string;
  reason: string;
  status: 'partial' | 'complete';
  remainingValue: number;
  notes?: string;
};

const mockConsumedAssets: ConsumedAsset[] = [
  {
    id: '1',
    assetName: 'حبر طابعة HP Laser',
    assetCode: 'BC-101-2024',
    category: 'مستهلكات مكتبية',
    originalValue: 150000,
    consumedDate: '2024-03-15',
    consumedBy: 'أحمد محمد',
    department: 'قسم المحاسبة',
    reason: 'انتهاء الحبر',
    status: 'complete',
    remainingValue: 0,
    notes: 'تم الاستهلاك الكامل'
  },
  {
    id: '2',
    assetName: 'ورق طباعة A4',
    assetCode: 'BC-102-2024',
    category: 'مستهلكات مكتبية',
    originalValue: 50000,
    consumedDate: '2024-04-01',
    consumedBy: 'فاطمة حسن',
    department: 'قسم السكرتارية',
    reason: 'استهلاك عادي',
    status: 'partial',
    remainingValue: 20000,
    notes: 'تم استهلاك 60%'
  },
  {
    id: '3',
    assetName: 'بطارية UPS',
    assetCode: 'BC-103-2024',
    category: 'قطع غيار إلكترونية',
    originalValue: 300000,
    consumedDate: '2024-05-10',
    consumedBy: 'خالد عمر',
    department: 'قسم تقنية المعلومات',
    reason: 'انتهاء العمر الافتراضي',
    status: 'complete',
    remainingValue: 0,
  },
  {
    id: '4',
    assetName: 'مواد تنظيف',
    assetCode: 'BC-104-2024',
    category: 'مستهلكات عامة',
    originalValue: 75000,
    consumedDate: '2024-06-01',
    consumedBy: 'سارة أحمد',
    department: 'قسم الخدمات',
    reason: 'استهلاك عادي',
    status: 'partial',
    remainingValue: 25000,
    notes: 'متبقي كمية قليلة'
  },
];

const ConsumedPage = () => {
  const [assets, setAssets] = useState<ConsumedAsset[]>(mockConsumedAssets);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'partial' | 'complete'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedAsset, setSelectedAsset] = useState<ConsumedAsset | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const categories = Array.from(new Set(assets.map(a => a.category)));

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.assetName.includes(searchTerm) ||
                         asset.assetCode.includes(searchTerm) ||
                         asset.consumedBy.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || asset.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || asset.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleViewDetails = (asset: ConsumedAsset) => {
    setSelectedAsset(asset);
    setIsDialogOpen(true);
  };

  const stats = {
    total: assets.length,
    totalValue: assets.reduce((sum, a) => sum + a.originalValue, 0),
    consumedValue: assets.reduce((sum, a) => sum + (a.originalValue - a.remainingValue), 0),
    complete: assets.filter(a => a.status === 'complete').length,
    partial: assets.filter(a => a.status === 'partial').length,
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>اسم الموجود</TableHead>
                  <TableHead>الرمز</TableHead>
                  <TableHead>الفئة</TableHead>
                  <TableHead>القيمة الأصلية</TableHead>
                  <TableHead>القيمة المستهلكة</TableHead>
                  <TableHead>القيمة المتبقية</TableHead>
                  <TableHead>تاريخ الاستهلاك</TableHead>
                  <TableHead>القسم</TableHead>
                  <TableHead>الحالة</TableHead>
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
                    const consumedValue = asset.originalValue - asset.remainingValue;
                    const consumedPercentage = (consumedValue / asset.originalValue * 100).toFixed(0);

                    return (
                      <TableRow key={asset.id}>
                        <TableCell className="font-medium">{asset.assetName}</TableCell>
                        <TableCell>
                          <code className="px-2 py-1 bg-muted rounded text-sm">
                            {asset.assetCode}
                          </code>
                        </TableCell>
                        <TableCell>{asset.category}</TableCell>
                        <TableCell>{asset.originalValue.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-red-600">
                              {consumedValue.toLocaleString()}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {consumedPercentage}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={asset.remainingValue > 0 ? 'text-green-600' : 'text-muted-foreground'}>
                            {asset.remainingValue.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            {asset.consumedDate}
                          </div>
                        </TableCell>
                        <TableCell>{asset.department}</TableCell>
                        <TableCell>
                          <Badge variant={asset.status === 'complete' ? 'destructive' : 'outline'}>
                            {asset.status === 'complete' ? 'استهلاك كامل' : 'استهلاك جزئي'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewDetails(asset)}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
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
                  <Label className="text-muted-foreground">القيمة الأصلية</Label>
                  <div className="font-medium">{selectedAsset.originalValue.toLocaleString()} دينار</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">القيمة المستهلكة</Label>
                  <div className="font-medium text-red-600">
                    {(selectedAsset.originalValue - selectedAsset.remainingValue).toLocaleString()} دينار
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">القيمة المتبقية</Label>
                  <div className="font-medium text-green-600">
                    {selectedAsset.remainingValue.toLocaleString()} دينار
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">تاريخ الاستهلاك</Label>
                  <div className="font-medium">{selectedAsset.consumedDate}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">المستهلك من قبل</Label>
                  <div className="font-medium">{selectedAsset.consumedBy}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">القسم</Label>
                  <div className="font-medium">{selectedAsset.department}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">السبب</Label>
                  <div className="font-medium">{selectedAsset.reason}</div>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label className="text-muted-foreground">الحالة</Label>
                  <div>
                    <Badge variant={selectedAsset.status === 'complete' ? 'destructive' : 'outline'}>
                      {selectedAsset.status === 'complete' ? 'استهلاك كامل' : 'استهلاك جزئي'}
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
