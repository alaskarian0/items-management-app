"use client";

import { QRPrintModal } from "@/components/features/barcode-printing";
import {
  CodingFilters,
  CodingStats,
  CodingTable
} from "@/components/features/fixed-assets";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  fixedAssets
} from "@/lib/data/fixed-assets-data";
import { type FixedAsset } from "@/lib/types/fixed-assets";
import "@/styles/barcode-print.css";
import {
  Barcode,
  Building2,
  Calendar,
  DollarSign,
  Download,
  FileText,
  Hash,
  MapPin,
  QrCode,
  ShieldCheck,
  Tag,
  User
} from "lucide-react";
import { useState } from 'react';

const CodingPage = () => {
  const [assets, setAssets] = useState<FixedAsset[]>(fixedAssets);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'coded' | 'pending'>('all');
  const [selectedAsset, setSelectedAsset] = useState<FixedAsset | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [selectedAssetsForPrint, setSelectedAssetsForPrint] = useState<string[]>([]);
  const [isDocumentsModalOpen, setIsDocumentsModalOpen] = useState(false);
  const [selectedAssetForDocs, setSelectedAssetForDocs] = useState<FixedAsset | null>(null);

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.includes(searchTerm) ||
      asset.serialNumber?.includes(searchTerm) ||
      asset.barcode?.includes(searchTerm);
    const matchesFilter = filterStatus === 'all' || (asset.barcode ? 'coded' : 'pending') === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleAssignBarcode = (asset: FixedAsset) => {
    setSelectedAsset(asset);
    setBarcodeInput(asset.barcode || '');
    setIsDialogOpen(true);
  };

  const handleSaveBarcode = () => {
    if (selectedAsset && barcodeInput) {
      setAssets(assets.map(asset =>
        asset.id === selectedAsset.id
          ? { ...asset, barcode: barcodeInput, status: 'active' as const }
          : asset
      ));
      setIsDialogOpen(false);
      setSelectedAsset(null);
      setBarcodeInput('');
    }
  };

  const handleGenerateBarcode = () => {
    if (selectedAsset) {
      const serial = selectedAsset.serialNumber || 'SN-000';
      const newBarcode = `BC-${serial.split('-')[2] || 'GEN'}-${new Date().getFullYear()}`;
      setBarcodeInput(newBarcode);
    }
  };

  const handlePrintQRCodes = () => {
    const codedAssets = assets.filter(a => a.barcode);
    if (codedAssets.length === 0) {
      alert('لا توجد موجودات مرمزة لطباعة QR Code');
      return;
    }
    setSelectedAssetsForPrint(codedAssets.map(asset => String(asset.id)));
    setIsPrintModalOpen(true);
  };

  const handleViewDocuments = (asset: FixedAsset) => {
    setSelectedAssetForDocs(asset);
    setIsDocumentsModalOpen(true);
  };

  const stats = {
    total: assets.length,
    coded: assets.filter(a => a.barcode).length,
    pending: assets.filter(a => !a.barcode).length,
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <CodingStats
        total={stats.total}
        coded={stats.coded}
        pending={stats.pending}
      />

      {/* Main Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Barcode className="h-5 w-5" />
              ترميز الموجودات الثابتة
            </CardTitle>
            <div className="flex gap-2">
              <Button onClick={handlePrintQRCodes} variant="outline">
                <QrCode className="ml-2 h-4 w-4" />
                طباعة QR Codes
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
          <CodingFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterStatus={filterStatus}
            onFilterStatusChange={setFilterStatus}
          />

          {/* Table */}
          <CodingTable
            assets={filteredAssets}
            onAssignBarcode={handleAssignBarcode}
            onViewDocuments={handleViewDocuments}
          />
        </CardContent>
      </Card>

      {/* Asset Details and Barcode Assignment Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogOverlay className="bg-black/60" />
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b bg-gradient-to-r from-primary/5 to-blue-500/5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl">تفاصيل الموجود الثابت</DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">معلومات كاملة عن الموجود والتسجيل</p>
              </div>
            </div>
          </DialogHeader>
          {selectedAsset && (
            <div className="p-6">
              {/* Global Identifiers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Tag className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Label className="text-xs text-muted-foreground flex items-center gap-1">
                          رمز المادة
                        </Label>
                        <div className="font-mono text-lg font-bold text-primary mt-1 break-all">
                          {selectedAsset.assetCode}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Label className="text-xs text-muted-foreground flex items-center gap-1">
                          رقم المستند
                        </Label>
                        <div className="font-mono text-lg font-bold text-blue-600 dark:text-blue-400 mt-1 break-all">
                          {selectedAsset.documentNumber || 'غير محدد'}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="registration" className="w-full" dir="rtl">

                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="registration" className="gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    معلومات التسجيل
                  </TabsTrigger>
                  <TabsTrigger value="location" className="gap-2">
                    <MapPin className="h-4 w-4" />
                    الموقع
                  </TabsTrigger>
                  <TabsTrigger value="financial" className="gap-2">
                    <DollarSign className="h-4 w-4" />
                    التفاصيل المالية
                  </TabsTrigger>
                  <TabsTrigger value="barcode" className="gap-2">
                    <Barcode className="h-4 w-4" />
                    الباركود
                  </TabsTrigger>
                </TabsList>

                {/* Registration Information Tab */}
                <TabsContent value="registration" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold text-lg">معلومات التسجيل</h3>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <Tag className="h-4 w-4" />
                            اسم الموجود
                          </Label>
                          <Input value={selectedAsset.name} disabled className="bg-muted font-medium" />
                        </div>
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            الفئة
                          </Label>
                          <Input value={selectedAsset.category} disabled className="bg-muted" />
                        </div>
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <Hash className="h-4 w-4" />
                            الرقم التسلسلي
                          </Label>
                          <Input value={selectedAsset.serialNumber || 'غير محدد'} disabled className="bg-muted" />
                        </div>
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <Hash className="h-4 w-4" />
                            عدد مرات الظهور
                          </Label>
                          <div className="h-10 flex items-center px-3 bg-primary/10 rounded-md border-2 border-primary/20">
                            <span className="font-bold text-lg text-primary">{selectedAsset.registrationCount || 0}</span>
                            <span className="mr-2 text-sm text-muted-foreground">مرة</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Location Details Tab */}
                <TabsContent value="location" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold text-lg">أين تم تسجيل المادة</h3>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                          <Building2 className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                          <div className="flex-1">
                            <Label className="text-xs text-muted-foreground">الموقع الرئيسي</Label>
                            <p className="font-medium text-lg mt-0.5">{selectedAsset.location}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                          <Building2 className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                          <div className="flex-1">
                            <Label className="text-xs text-muted-foreground">القسم</Label>
                            <p className="font-medium text-lg mt-0.5">{selectedAsset.department}</p>
                          </div>
                        </div>
                        {selectedAsset.division && (
                          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                            <Building2 className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                            <div className="flex-1">
                              <Label className="text-xs text-muted-foreground">الشعبة</Label>
                              <p className="font-medium text-lg mt-0.5">{selectedAsset.division}</p>
                            </div>
                          </div>
                        )}
                        {selectedAsset.unit && (
                          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                            <Building2 className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                            <div className="flex-1">
                              <Label className="text-xs text-muted-foreground">الوحدة</Label>
                              <p className="font-medium text-lg mt-0.5">{selectedAsset.unit}</p>
                            </div>
                          </div>
                        )}
                        {selectedAsset.responsiblePerson && (
                          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                            <User className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                            <div className="flex-1">
                              <Label className="text-xs text-muted-foreground">الشخص المسؤول</Label>
                              <p className="font-medium text-lg mt-0.5">{selectedAsset.responsiblePerson}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Financial Details Tab */}
                <TabsContent value="financial" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold text-lg">التفاصيل المالية</h3>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Purchase Value - Full Width */}
                        <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20 rounded-xl border-2 border-green-200 dark:border-green-900 shadow-sm">
                          <div className="h-16 w-16 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center flex-shrink-0">
                            <DollarSign className="h-10 w-10 text-green-600 dark:text-green-400" />
                          </div>
                          <div className="flex-1">
                            <Label className="text-sm text-muted-foreground">قيمة الشراء</Label>
                            <p className="font-bold text-3xl text-green-700 dark:text-green-400 mt-1">
                              {selectedAsset.purchaseValue.toLocaleString('ar-SA')}
                              <span className="text-lg mr-2">دينار</span>
                            </p>
                          </div>
                        </div>

                        {/* Supplier and Purchase Date */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {selectedAsset.supplier && (
                            <div className="space-y-2">
                              <Label className="flex items-center gap-2 text-base">
                                <Building2 className="h-5 w-5" />
                                المورد
                              </Label>
                              <Input value={selectedAsset.supplier} disabled className="bg-muted text-base h-12" />
                            </div>
                          )}
                          <div className="space-y-2">
                            <Label className="flex items-center gap-2 text-base">
                              <Calendar className="h-5 w-5" />
                              تاريخ الشراء
                            </Label>
                            <Input
                              value={new Date(selectedAsset.purchaseDate).toLocaleDateString('ar-SA')}
                              disabled
                              className="bg-muted text-base h-12"
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Barcode Assignment Tab */}
                <TabsContent value="barcode" className="space-y-4 mt-4">
                  <Card className="border-2 border-primary/30">
                    <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-transparent">
                      <div className="flex items-center gap-2">
                        <Barcode className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold text-lg">تعيين الباركود</h3>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <Label className="flex items-center gap-2 text-base">
                            <Barcode className="h-5 w-5" />
                            رمز الباركود
                          </Label>
                          <div className="flex gap-3">
                            <Input
                              value={barcodeInput}
                              onChange={(e) => setBarcodeInput(e.target.value)}
                              placeholder="أدخل الباركود..."
                              className="font-mono text-lg h-12"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleGenerateBarcode}
                              className="flex-shrink-0 h-12 px-6"
                            >
                              <Hash className="h-5 w-5 ml-2" />
                              توليد
                            </Button>
                          </div>
                        </div>
                        {barcodeInput && (
                          <div className="border-2 border-dashed border-primary/30 rounded-lg p-8 bg-gradient-to-br from-primary/5 to-transparent">
                            <div className="text-center space-y-4">
                              <div className="inline-block p-4 bg-background rounded-lg shadow-lg">
                                <Barcode className="h-20 w-20 mx-auto text-primary" />
                              </div>
                              <code className="block text-2xl font-mono font-bold text-primary">{barcodeInput}</code>
                              <p className="text-sm text-muted-foreground">معاينة الباركود</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
          <DialogFooter className="px-6 py-4 border-t bg-muted/30">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="gap-2">
              إغلاق
            </Button>
            <Button onClick={handleSaveBarcode} disabled={!barcodeInput} className="gap-2">
              <ShieldCheck className="h-4 w-4" />
              حفظ الباركود
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* QR Code Print Modal */}
      <QRPrintModal
        open={isPrintModalOpen}
        onOpenChange={setIsPrintModalOpen}
        assets={assets as any}
        selectedAssets={selectedAssetsForPrint}
        onSelectedAssetsChange={setSelectedAssetsForPrint}
      />

      {/* Document Details Modal */}
      <Dialog open={isDocumentsModalOpen} onOpenChange={setIsDocumentsModalOpen}>
        <DialogOverlay className="bg-black/60" />
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              تفاصيل المستندات - {selectedAssetForDocs?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedAssetForDocs && (
            <div className="space-y-6 py-4">
              {/* Material Info */}
              <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">رمز المادة</Label>
                      <div className="font-mono text-lg font-bold text-primary">
                        {selectedAssetForDocs.assetCode}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">اسم المادة</Label>
                      <div className="text-lg font-bold">
                        {selectedAssetForDocs.name}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">عدد مرات التسجيل</Label>
                      <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {selectedAssetForDocs.registrationCount || 0} مرة
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Documents Table */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">المستندات المسجلة</h3>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg overflow-x-auto">
                    <Table dir="rtl">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-right">رقم المستند</TableHead>
                          <TableHead className="text-right">تاريخ التسجيل</TableHead>
                          <TableHead className="text-right">القسم</TableHead>
                          <TableHead className="text-right">الشعبة</TableHead>
                          <TableHead className="text-right">الوحدة</TableHead>
                          <TableHead className="text-right">الموقع</TableHead>
                          <TableHead className="text-right">الحالة</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {/* Mock documents - In real app, this would come from database */}
                        {Array.from({ length: selectedAssetForDocs.registrationCount || 1 }).map((_, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">
                              <code className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded text-blue-700 dark:text-blue-300">
                                {selectedAssetForDocs.documentNumber || `إدخ-2024-${String(index + 1).padStart(3, '0')}`}
                              </code>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                {new Date(selectedAssetForDocs.purchaseDate).toLocaleDateString('ar-SA')}
                              </div>
                            </TableCell>
                            <TableCell>{selectedAssetForDocs.department}</TableCell>
                            <TableCell className="text-muted-foreground">
                              {selectedAssetForDocs.division || '-'}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {selectedAssetForDocs.unit || '-'}
                            </TableCell>
                            <TableCell>{selectedAssetForDocs.location}</TableCell>
                            <TableCell>
                              <Badge variant="default">
                                {selectedAssetForDocs.status === 'active' ? 'نشط' : selectedAssetForDocs.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Summary Info */}
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                    <div className="text-sm text-muted-foreground">
                      <strong>ملاحظة:</strong> تم تسجيل هذه المادة في {selectedAssetForDocs.registrationCount || 1} مستند(ات) مختلفة
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDocumentsModalOpen(false)}>
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CodingPage;
