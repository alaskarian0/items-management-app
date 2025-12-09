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
  DialogOverlay,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Barcode,
  Search,
  Printer,
  QrCode,
  Download,
  Filter,
  CheckCircle2,
  XCircle
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarcodeQRPrintModal } from "@/components/features/barcode-printing";
import "@/styles/barcode-print.css";

// Import shared data and types
import {
  fixedAssets,
  getAssetByCode,
  searchAssets,
  type FixedAsset,
  type AssetCoding
} from "@/lib/data/fixed-assets-data";

const CodingPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'coded' | 'pending'>('all');
  const [selectedAsset, setSelectedAsset] = useState<FixedAsset | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [selectedAssetsForPrint, setSelectedAssetsForPrint] = useState<string[]>([]);

  const filteredAssets = fixedAssets.filter(asset => {
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
          ? { ...asset, barcode: barcodeInput, status: 'coded' as const }
          : asset
      ));
      setIsDialogOpen(false);
      setSelectedAsset(null);
      setBarcodeInput('');
    }
  };

  const handleGenerateBarcode = () => {
    if (selectedAsset) {
      const newBarcode = `BC-${selectedAsset.serialNumber.split('-')[2]}-${new Date().getFullYear()}`;
      setBarcodeInput(newBarcode);
    }
  };

  const handlePrintBarcodes = () => {
    const codedAssets = fixedAssets.filter(a => a.barcode);
    if (codedAssets.length === 0) {
      alert('لا توجد موجودات مرمزة للطباعة');
      return;
    }
    setSelectedAssetsForPrint(codedAssets.map(asset => String(asset.id)));
    setIsPrintModalOpen(true);
  };

  const handlePrintQRCodes = () => {
    const codedAssets = fixedAssets.filter(a => a.barcode);
    if (codedAssets.length === 0) {
      alert('لا توجد موجودات مرمزة لطباعة QR Code');
      return;
    }
    setSelectedAssetsForPrint(codedAssets.map(asset => String(asset.id)));
    setIsPrintModalOpen(true);
  };

  const stats = {
    total: fixedAssets.length,
    coded: fixedAssets.filter(a => a.barcode).length,
    pending: fixedAssets.filter(a => !a.barcode).length,
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الموجودات</CardTitle>
            <Barcode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">جميع الموجودات الثابتة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">مرمزة</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.coded}</div>
            <p className="text-xs text-muted-foreground">تم تعيين باركود</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">بانتظار الترميز</CardTitle>
            <XCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">لم يتم تعيين باركود</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Barcode className="h-5 w-5" />
              ترميز الموجودات الثابتة
            </CardTitle>
            <div className="flex gap-2">
              <Button onClick={handlePrintBarcodes} variant="outline">
                <Printer className="ml-2 h-4 w-4" />
                طباعة الباركودات
              </Button>
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
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث عن موجود (اسم، رقم تسلسلي، باركود)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            <div className="w-full md:w-48">
              <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                <SelectTrigger>
                  <Filter className="ml-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="coded">مرمزة</SelectItem>
                  <SelectItem value="pending">بانتظار الترميز</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-x-auto">
            <Table dir="rtl">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">اسم الموجود</TableHead>
                  <TableHead className="text-right">الفئة</TableHead>
                  <TableHead className="text-right">الرقم التسلسلي</TableHead>
                  <TableHead className="text-right">الباركود</TableHead>
                  <TableHead className="text-right">الموقع</TableHead>
                  <TableHead className="text-right">القيمة (دينار)</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-center">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      لا توجد نتائج
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAssets.map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell className="font-medium text-right">{asset.name}</TableCell>
                      <TableCell className="text-right">{asset.category}</TableCell>
                      <TableCell className="font-mono text-sm text-right">{asset.serialNumber}</TableCell>
                      <TableCell className="text-right">
                        {asset.barcode ? (
                          <code className="px-2 py-1 bg-muted rounded text-sm">
                            {asset.barcode}
                          </code>
                        ) : (
                          <span className="text-muted-foreground text-sm">غير محدد</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">{asset.location}</TableCell>
                      <TableCell className="text-right">{asset.purchaseValue.toLocaleString('ar-SA')}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={asset.barcode ? 'default' : 'secondary'}>
                          {asset.barcode ? 'مرمز' : 'بانتظار الترميز'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAssignBarcode(asset)}
                          >
                            <Barcode className="h-4 w-4" />
                          </Button>
                          {asset.barcode && (
                            <Button size="sm" variant="outline">
                              <QrCode className="h-4 w-4" />
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

      {/* Barcode Assignment Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogOverlay />
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>تعيين باركود</DialogTitle>
          </DialogHeader>
          {selectedAsset && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>اسم الموجود</Label>
                <Input value={selectedAsset.name} disabled />
              </div>
              <div className="space-y-2">
                <Label>الرقم التسلسلي</Label>
                <Input value={selectedAsset.serialNumber} disabled />
              </div>
              <div className="space-y-2">
                <Label>الباركود</Label>
                <div className="flex gap-2">
                  <Input
                    value={barcodeInput}
                    onChange={(e) => setBarcodeInput(e.target.value)}
                    placeholder="أدخل الباركود..."
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGenerateBarcode}
                  >
                    توليد
                  </Button>
                </div>
              </div>
              {barcodeInput && (
                <div className="border rounded-lg p-4 bg-muted/50 flex items-center justify-center">
                  <div className="text-center">
                    <Barcode className="h-12 w-12 mx-auto mb-2" />
                    <code className="text-lg font-mono">{barcodeInput}</code>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleSaveBarcode} disabled={!barcodeInput}>
              حفظ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Barcode/QR Code Print Modal */}
      <BarcodeQRPrintModal
        open={isPrintModalOpen}
        onOpenChange={setIsPrintModalOpen}
        assets={assets}
        selectedAssets={selectedAssetsForPrint}
        onSelectedAssetsChange={setSelectedAssetsForPrint}
      />
    </div>
  );
};

export default CodingPage;
