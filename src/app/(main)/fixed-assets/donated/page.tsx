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
  Gift,
  Search,
  FileText,
  Download,
  Filter,
  Building2,
  Calendar,
  DollarSign,
  Package,
  Heart
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

type DonatedAsset = {
  id: string;
  assetName: string;
  assetCode: string;
  category: string;
  value: number;
  donationDate: string;
  recipientOrganization: string;
  recipientContact: string;
  donationReason: string;
  approvedBy: string;
  documentNumber: string;
  status: 'pending' | 'approved' | 'delivered';
  condition: 'excellent' | 'good' | 'fair';
  notes?: string;
};

const mockDonatedAssets: DonatedAsset[] = [
  {
    id: '1',
    assetName: 'أجهزة حاسوب مكتبية (5 وحدات)',
    assetCode: 'BC-201-2024',
    category: 'أجهزة إلكترونية',
    value: 5000000,
    donationDate: '2024-01-20',
    recipientOrganization: 'مدرسة الأمل الابتدائية',
    recipientContact: 'أحمد حسن - 07701234567',
    donationReason: 'دعم التعليم الإلكتروني',
    approvedBy: 'مدير عام الدائرة',
    documentNumber: 'DON-2024-001',
    status: 'delivered',
    condition: 'good',
    notes: 'تم التسليم بحالة جيدة'
  },
  {
    id: '2',
    assetName: 'مكاتب دراسية خشبية (10 وحدات)',
    assetCode: 'BC-202-2024',
    category: 'أثاث',
    value: 3000000,
    donationDate: '2024-02-15',
    recipientOrganization: 'دار الأيتام الخيرية',
    recipientContact: 'فاطمة محمد - 07709876543',
    donationReason: 'دعم الأعمال الخيرية',
    approvedBy: 'نائب المدير العام',
    documentNumber: 'DON-2024-002',
    status: 'approved',
    condition: 'excellent',
  },
  {
    id: '3',
    assetName: 'طابعات ليزر (3 وحدات)',
    assetCode: 'BC-203-2024',
    category: 'أجهزة إلكترونية',
    value: 1500000,
    donationDate: '2024-03-10',
    recipientOrganization: 'جمعية النور للمكفوفين',
    recipientContact: 'محمد علي - 07705551234',
    donationReason: 'دعم ذوي الاحتياجات الخاصة',
    approvedBy: 'مدير عام الدائرة',
    documentNumber: 'DON-2024-003',
    status: 'delivered',
    condition: 'good',
    notes: 'تم تجديد الطابعات قبل التسليم'
  },
  {
    id: '4',
    assetName: 'كراسي مكتبية (20 وحدة)',
    assetCode: 'BC-204-2024',
    category: 'أثاث',
    value: 2000000,
    donationDate: '2024-04-05',
    recipientOrganization: 'مركز الشباب الثقافي',
    recipientContact: 'سارة أحمد - 07702223344',
    donationReason: 'دعم الأنشطة الثقافية',
    approvedBy: 'مدير الشؤون الإدارية',
    documentNumber: 'DON-2024-004',
    status: 'pending',
    condition: 'fair',
  },
];

const DonatedPage = () => {
  const [assets, setAssets] = useState<DonatedAsset[]>(mockDonatedAssets);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'delivered'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedAsset, setSelectedAsset] = useState<DonatedAsset | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const categories = Array.from(new Set(assets.map(a => a.category)));

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.assetName.includes(searchTerm) ||
                         asset.assetCode.includes(searchTerm) ||
                         asset.recipientOrganization.includes(searchTerm) ||
                         asset.documentNumber.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || asset.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || asset.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleViewDetails = (asset: DonatedAsset) => {
    setSelectedAsset(asset);
    setIsDialogOpen(true);
  };

  const stats = {
    total: assets.length,
    totalValue: assets.reduce((sum, a) => sum + a.value, 0),
    delivered: assets.filter(a => a.status === 'delivered').length,
    approved: assets.filter(a => a.status === 'approved').length,
    pending: assets.filter(a => a.status === 'pending').length,
    organizations: new Set(assets.map(a => a.recipientOrganization)).size,
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      pending: { variant: 'outline', label: 'قيد الانتظار' },
      approved: { variant: 'secondary', label: 'موافق عليه' },
      delivered: { variant: 'default', label: 'تم التسليم' },
    };
    return variants[status] || variants.pending;
  };

  const getConditionBadge = (condition: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "outline", label: string }> = {
      excellent: { variant: 'default', label: 'ممتاز' },
      good: { variant: 'secondary', label: 'جيد' },
      fair: { variant: 'outline', label: 'مقبول' },
    };
    return variants[condition] || variants.good;
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المنح</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">موجودات ممنوحة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">القيمة الإجمالية</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.totalValue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">دينار عراقي</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">تم التسليم</CardTitle>
            <Gift className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.delivered}</div>
            <p className="text-xs text-muted-foreground">منحة مسلمة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">الجهات المستفيدة</CardTitle>
            <Heart className="h-4 w-4 text-pink-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-600">{stats.organizations}</div>
            <p className="text-xs text-muted-foreground">منظمة/جهة</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              سجل الموجودات الممنوحة
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline">
                <FileText className="ml-2 h-4 w-4" />
                تقرير المنح
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
                placeholder="البحث (موجود، جهة، رقم وثيقة)..."
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
                <SelectItem value="pending">قيد الانتظار</SelectItem>
                <SelectItem value="approved">موافق عليه</SelectItem>
                <SelectItem value="delivered">تم التسليم</SelectItem>
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
                  <TableHead>الجهة المستلمة</TableHead>
                  <TableHead>رقم الوثيقة</TableHead>
                  <TableHead>القيمة (دينار)</TableHead>
                  <TableHead>تاريخ المنح</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>الوضع</TableHead>
                  <TableHead className="text-center">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      لا توجد نتائج
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAssets.map((asset) => {
                    const statusBadge = getStatusBadge(asset.status);
                    const conditionBadge = getConditionBadge(asset.condition);

                    return (
                      <TableRow key={asset.id}>
                        <TableCell className="font-medium">{asset.assetName}</TableCell>
                        <TableCell>
                          <code className="px-2 py-1 bg-muted rounded text-sm">
                            {asset.assetCode}
                          </code>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium">{asset.recipientOrganization}</div>
                              <div className="text-xs text-muted-foreground">{asset.recipientContact}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs">{asset.documentNumber}</code>
                        </TableCell>
                        <TableCell className="font-medium">{asset.value.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            {asset.donationDate}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={conditionBadge.variant}>
                            {conditionBadge.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusBadge.variant}>
                            {statusBadge.label}
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
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              تفاصيل المنحة
            </DialogTitle>
          </DialogHeader>
          {selectedAsset && (
            <div className="space-y-6 py-4">
              {/* Asset Information */}
              <div>
                <h3 className="font-semibold mb-3 text-sm text-muted-foreground">معلومات الموجود</h3>
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
                    <Label className="text-muted-foreground">القيمة</Label>
                    <div className="font-medium text-green-600">
                      {selectedAsset.value.toLocaleString()} دينار
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">الحالة</Label>
                    <div>
                      <Badge variant={getConditionBadge(selectedAsset.condition).variant}>
                        {getConditionBadge(selectedAsset.condition).label}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recipient Information */}
              <div>
                <h3 className="font-semibold mb-3 text-sm text-muted-foreground">معلومات الجهة المستلمة</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">اسم الجهة</Label>
                    <div className="font-medium">{selectedAsset.recipientOrganization}</div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">جهة الاتصال</Label>
                    <div className="font-medium">{selectedAsset.recipientContact}</div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">سبب المنح</Label>
                    <div className="font-medium">{selectedAsset.donationReason}</div>
                  </div>
                </div>
              </div>

              {/* Donation Details */}
              <div>
                <h3 className="font-semibold mb-3 text-sm text-muted-foreground">تفاصيل المنح</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">رقم الوثيقة</Label>
                    <code className="px-2 py-1 bg-muted rounded text-sm">
                      {selectedAsset.documentNumber}
                    </code>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">تاريخ المنح</Label>
                    <div className="font-medium">{selectedAsset.donationDate}</div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">الموافقة من قبل</Label>
                    <div className="font-medium">{selectedAsset.approvedBy}</div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">حالة المنحة</Label>
                    <div>
                      <Badge variant={getStatusBadge(selectedAsset.status).variant}>
                        {getStatusBadge(selectedAsset.status).label}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {selectedAsset.notes && (
                <div className="space-y-2">
                  <Label className="text-muted-foreground">ملاحظات</Label>
                  <Alert>
                    <Gift className="h-4 w-4" />
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

export default DonatedPage;
