"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Building2,
  Calendar,
  DollarSign,
  Download,
  FileText,
  Filter,
  Gift,
  Heart,
  Package,
  Search
} from "lucide-react";
import { useState } from 'react';

// Import shared data and types
import {
  assetDonated,
  getAssetById
} from "@/lib/data/fixed-assets-data";
import { type AssetDonated } from "@/lib/types/fixed-assets";

// View model for donated assets display
type DonatedAssetView = AssetDonated & {
  assetName: string;
  assetCode: string;
  category: string;
  value: number;
  condition?: string;
  documentNumber?: string;
};

// Convert donated assets data to view model
const donatedAssetsView: DonatedAssetView[] = assetDonated.map(donation => {
  const asset = getAssetById(donation.assetId);
  return {
    ...donation,
    assetName: asset?.name || 'غير معروف',
    assetCode: asset?.assetCode || 'غير معروف',
    category: asset?.category || 'غير معروف',
    value: donation.fairMarketValue,
    condition: asset?.condition,
    documentNumber: donation.receiptNumber
  };
});

const DonatedPage = () => {
  const [assets, setAssets] = useState<DonatedAssetView[]>(donatedAssetsView);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'delivered'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedAsset, setSelectedAsset] = useState<DonatedAssetView | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const categories = Array.from(new Set(assets.map(a => a.category)));

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.assetName.includes(searchTerm) ||
      asset.assetCode.includes(searchTerm) ||
      asset.donatedTo.includes(searchTerm) ||
      asset.receiptNumber?.includes(searchTerm) ||
      asset.donationReason.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || asset.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || asset.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleViewDetails = (asset: DonatedAssetView) => {
    setSelectedAsset(asset);
    setIsDialogOpen(true);
  };

  const stats = {
    total: assets.length,
    totalValue: assets.reduce((sum, a) => sum + a.value, 0),
    delivered: assets.filter(a => a.status === 'completed').length,
    approved: assets.filter(a => a.status === 'approved').length,
    pending: assets.filter(a => a.status === 'pending').length,
    organizations: new Set(assets.map(a => a.donatedTo)).size,
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
                  <TableHead>رقم الإيصال</TableHead>
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
                    const conditionBadge = getConditionBadge(asset.condition || 'good');

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
                              <div className="font-medium">{asset.donatedTo}</div>
                              <div className="text-xs text-muted-foreground">{asset.donationType}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs">{asset.receiptNumber || '-'}</code>
                        </TableCell>
                        <TableCell className="font-medium">{asset.fairMarketValue.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span>
                              {asset.donationDate instanceof Date
                                ? asset.donationDate.toLocaleDateString('ar-SA')
                                : new Date(asset.donationDate).toLocaleDateString('ar-SA')}
                            </span>
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
                    <Label className="text-muted-foreground">القيمة التقديرية</Label>
                    <div className="font-medium text-green-600">
                      {selectedAsset.fairMarketValue.toLocaleString()} دينار
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">الحالة</Label>
                    <div>
                      <Badge variant={getConditionBadge(selectedAsset.condition || 'good').variant}>
                        {getConditionBadge(selectedAsset.condition || 'good').label}
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
                    <Label className="text-muted-foreground">الجهة المستلمة</Label>
                    <div className="font-medium">{selectedAsset.donatedTo}</div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">نوع المنح</Label>
                    <div className="font-medium">{selectedAsset.donationType === 'individual' ? 'فردي' : selectedAsset.donationType === 'organization' ? 'منظمة' : 'حكومي'}</div>
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
                    <div className="flex items-center gap-2">
                      <code className="px-2 py-1 bg-muted rounded text-sm">
                        {selectedAsset.documentNumber || '-'}
                      </code>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">تاريخ المنح</Label>
                    <div className="font-medium">
                      {selectedAsset.donationDate instanceof Date
                        ? selectedAsset.donationDate.toLocaleDateString('ar-SA')
                        : new Date(selectedAsset.donationDate).toLocaleDateString('ar-SA')}
                    </div>
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
