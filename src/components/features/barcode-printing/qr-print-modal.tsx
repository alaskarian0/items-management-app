"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Eye, Printer, QrCode, Settings } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { type FixedAsset } from './label-template';
import { QRPrintPreview } from './qr-print-preview';

export interface QRPrintModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assets: FixedAsset[];
  selectedAssets: string[];
  onSelectedAssetsChange: (selectedAssets: string[]) => void;
}

export interface QRDataFields {
  id: boolean;
  name: boolean;
  serialNumber: boolean;
  barcode: boolean;
  location: boolean;
  category: boolean;
  purchaseDate: boolean;
  value: boolean;
}

export const QRPrintModal: React.FC<QRPrintModalProps> = ({
  open,
  onOpenChange,
  assets,
  selectedAssets,
  onSelectedAssetsChange
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  // Template settings
  const [template, setTemplate] = useState<'standard' | 'large' | 'small'>('standard');
  const [layout, setLayout] = useState({ rows: 8, columns: 3 });

  // QR Data Fields Selection
  const [qrDataFields, setQRDataFields] = useState<QRDataFields>({
    id: true,
    name: true,
    serialNumber: true,
    barcode: true,
    location: true,
    category: false,
    purchaseDate: false,
    value: false
  });

  // Label Display Fields
  const [showAssetName, setShowAssetName] = useState(true);
  const [showSerialNumber, setShowSerialNumber] = useState(true);
  const [showLocation, setShowLocation] = useState(true);
  const [showCategory, setShowCategory] = useState(false);
  const [showDate, setShowDate] = useState(true);

  // Preview mode
  const [showPreview, setShowPreview] = useState(false);

  // Filter assets that have barcodes
  const codedAssets = assets.filter(asset => asset.barcode && asset.status === 'coded');

  // Get selected assets for printing
  const assetsToPrint = selectedAssets.length > 0
    ? codedAssets.filter(asset => selectedAssets.includes(asset.id))
    : codedAssets;

  const handleAssetToggle = (assetId: string) => {
    onSelectedAssetsChange(
      selectedAssets.includes(assetId)
        ? selectedAssets.filter(id => id !== assetId)
        : [...selectedAssets, assetId]
    );
  };

  const handleSelectAll = () => {
    if (selectedAssets.length === codedAssets.length) {
      onSelectedAssetsChange([]);
    } else {
      onSelectedAssetsChange(codedAssets.map(asset => asset.id));
    }
  };

  const handleQRFieldToggle = (field: keyof QRDataFields) => {
    setQRDataFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: 'QR Code Labels',
    onBeforePrint: () => {
      return new Promise((resolve) => {
        setShowPreview(true);
        setTimeout(() => {
          resolve();
        }, 100);
      });
    },
  });

  const getLayoutPresets = () => {
    switch (template) {
      case 'large':
        return [
          { label: '2x3', rows: 2, columns: 3 },
          { label: '3x2', rows: 3, columns: 2 },
        ];
      case 'small':
        return [
          { label: '6x10', rows: 6, columns: 10 },
          { label: '8x8', rows: 8, columns: 8 },
        ];
      default: // standard
        return [
          { label: '3x8', rows: 3, columns: 8 },
          { label: '4x6', rows: 4, columns: 6 },
          { label: '5x5', rows: 5, columns: 5 },
        ];
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            طباعة QR Code
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Configuration */}
          <div className="space-y-4">
            {/* Asset Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  اختيار الموجودات
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox
                    id="select-all"
                    checked={selectedAssets.length === codedAssets.length && codedAssets.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                  <Label htmlFor="select-all" className="text-sm">
                    تحديد الكل ({codedAssets.length})
                  </Label>
                </div>
                <div className="max-h-40 overflow-y-auto space-y-2 border rounded p-2">
                  {codedAssets.map((asset) => (
                    <div key={asset.id} className="flex items-center space-x-2 space-x-reverse">
                      <Checkbox
                        id={`asset-${asset.id}`}
                        checked={selectedAssets.includes(asset.id)}
                        onCheckedChange={() => handleAssetToggle(asset.id)}
                      />
                      <Label
                        htmlFor={`asset-${asset.id}`}
                        className="text-sm truncate cursor-pointer"
                        title={asset.name}
                      >
                        {asset.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Template Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">إعدادات القالب</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs mb-1 block">حجم القالب</Label>
                  <Select value={template} onValueChange={(value: any) => setTemplate(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">صغير (1.5&quot; x 1&quot;)</SelectItem>
                      <SelectItem value="standard">قياسي (2&quot; x 1&quot;)</SelectItem>
                      <SelectItem value="large">كبير (3&quot; x 2&quot;)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs mb-1 block">التخطيط</Label>
                  <Select
                    value={`${layout.rows}x${layout.columns}`}
                    onValueChange={(value) => {
                      const [rows, columns] = value.split('x').map(Number);
                      setLayout({ rows, columns });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {getLayoutPresets().map((preset) => (
                        <SelectItem key={`${preset.rows}x${preset.columns}`} value={`${preset.rows}x${preset.columns}`}>
                          {preset.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* QR Data Fields Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">البيانات المضمنة في QR Code</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox
                    id="qr-id"
                    checked={qrDataFields.id}
                    onCheckedChange={() => handleQRFieldToggle('id')}
                  />
                  <Label htmlFor="qr-id" className="text-sm">المعرف (ID)</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox
                    id="qr-name"
                    checked={qrDataFields.name}
                    onCheckedChange={() => handleQRFieldToggle('name')}
                  />
                  <Label htmlFor="qr-name" className="text-sm">اسم الموجود</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox
                    id="qr-serial"
                    checked={qrDataFields.serialNumber}
                    onCheckedChange={() => handleQRFieldToggle('serialNumber')}
                  />
                  <Label htmlFor="qr-serial" className="text-sm">الرقم التسلسلي</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox
                    id="qr-barcode"
                    checked={qrDataFields.barcode}
                    onCheckedChange={() => handleQRFieldToggle('barcode')}
                  />
                  <Label htmlFor="qr-barcode" className="text-sm">الباركود</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox
                    id="qr-location"
                    checked={qrDataFields.location}
                    onCheckedChange={() => handleQRFieldToggle('location')}
                  />
                  <Label htmlFor="qr-location" className="text-sm">الموقع</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox
                    id="qr-category"
                    checked={qrDataFields.category}
                    onCheckedChange={() => handleQRFieldToggle('category')}
                  />
                  <Label htmlFor="qr-category" className="text-sm">الفئة</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox
                    id="qr-date"
                    checked={qrDataFields.purchaseDate}
                    onCheckedChange={() => handleQRFieldToggle('purchaseDate')}
                  />
                  <Label htmlFor="qr-date" className="text-sm">تاريخ الشراء</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox
                    id="qr-value"
                    checked={qrDataFields.value}
                    onCheckedChange={() => handleQRFieldToggle('value')}
                  />
                  <Label htmlFor="qr-value" className="text-sm">القيمة</Label>
                </div>
              </CardContent>
            </Card>

            {/* Label Display Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">إعدادات عرض الملصق</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox
                    id="show-name"
                    checked={showAssetName}
                    onCheckedChange={(checked) => setShowAssetName(checked as boolean)}
                  />
                  <Label htmlFor="show-name" className="text-sm">اسم الموجود</Label>
                </div>

                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox
                    id="show-serial"
                    checked={showSerialNumber}
                    onCheckedChange={(checked) => setShowSerialNumber(checked as boolean)}
                  />
                  <Label htmlFor="show-serial" className="text-sm">الرقم التسلسلي</Label>
                </div>

                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox
                    id="show-location"
                    checked={showLocation}
                    onCheckedChange={(checked) => setShowLocation(checked as boolean)}
                  />
                  <Label htmlFor="show-location" className="text-sm">الموقع</Label>
                </div>

                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox
                    id="show-category"
                    checked={showCategory}
                    onCheckedChange={(checked) => setShowCategory(checked as boolean)}
                  />
                  <Label htmlFor="show-category" className="text-sm">الفئة</Label>
                </div>

                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox
                    id="show-date"
                    checked={showDate}
                    onCheckedChange={(checked) => setShowDate(checked as boolean)}
                  />
                  <Label htmlFor="show-date" className="text-sm">التاريخ</Label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  المعاينة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4 bg-gray-50 max-h-[600px] overflow-y-auto">
                  {assetsToPrint.length > 0 ? (
                    <div ref={printRef}>
                      <QRPrintPreview
                        assets={assetsToPrint}
                        template={template}
                        layout={layout}
                        qrDataFields={qrDataFields}
                        showAssetName={showAssetName}
                        showSerialNumber={showSerialNumber}
                        showLocation={showLocation}
                        showCategory={showCategory}
                        showDate={showDate}
                      />
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <QrCode className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>يرجى تحديد موجود واحد على الأقل للطباعة</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
          <Button
            onClick={handlePrint}
            disabled={assetsToPrint.length === 0}
            className="flex items-center gap-2"
          >
            <Printer className="h-4 w-4" />
            طباعة ({assetsToPrint.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
