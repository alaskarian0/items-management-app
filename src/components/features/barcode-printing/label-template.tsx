"use client";

import React from 'react';
import { BarcodeGenerator } from './barcode-generator';
import { QRCodeGenerator } from './qr-code-generator';

export interface FixedAsset {
  id: string;
  name: string;
  category: string;
  serialNumber: string;
  barcode?: string;
  location: string;
  status: 'coded' | 'pending';
  purchaseDate: string;
  value: number;
}

export interface LabelTemplateProps {
  asset: FixedAsset;
  template: 'standard' | 'large' | 'small';
  showBarcode: boolean;
  showQRCode: boolean;
  showAssetName: boolean;
  showSerialNumber: boolean;
  showLocation: boolean;
  showCategory: boolean;
  showDate: boolean;
  className?: string;
}

export const LabelTemplate: React.FC<LabelTemplateProps> = ({
  asset,
  template,
  showBarcode,
  showQRCode,
  showAssetName,
  showSerialNumber,
  showLocation,
  showCategory,
  showDate,
  className = ''
}) => {
  const getTemplateStyles = () => {
    switch (template) {
      case 'large':
        return {
          width: '288px', // 3 inches at 96 DPI
          height: '192px', // 2 inches at 96 DPI
          fontSize: '12px',
          barcodeHeight: 60,
          qrSize: 80
        };
      case 'small':
        return {
          width: '144px', // 1.5 inches at 96 DPI
          height: '96px', // 1 inch at 96 DPI
          fontSize: '8px',
          barcodeHeight: 30,
          qrSize: 40
        };
      default: // standard
        return {
          width: '192px', // 2 inches at 96 DPI
          height: '96px', // 1 inch at 96 DPI
          fontSize: '10px',
          barcodeHeight: 40,
          qrSize: 60
        };
    }
  };

  const styles = getTemplateStyles();

  const qrData = JSON.stringify({
    id: asset.id,
    name: asset.name,
    serialNumber: asset.serialNumber,
    barcode: asset.barcode,
    location: asset.location,
    category: asset.category
  });

  return (
    <div
      className={`border border-gray-300 bg-white p-2 print:border-black print:shadow-none ${className}`}
      style={{
        width: styles.width,
        height: styles.height,
        fontSize: styles.fontSize
      }}
      dir="rtl"
    >
      <div className="h-full flex flex-col justify-between">
        {/* Header with asset name */}
        {showAssetName && (
          <div className="font-bold text-center mb-1 truncate" title={asset.name}>
            {asset.name}
          </div>
        )}

        {/* Middle section with codes */}
        <div className="flex justify-center items-center gap-2 flex-1">
          {showBarcode && asset.barcode && (
            <BarcodeGenerator
              value={asset.barcode}
              height={styles.barcodeHeight}
              width={1}
              fontSize={8}
              margin={2}
              className="flex-shrink-0"
            />
          )}
          {showQRCode && (
            <QRCodeGenerator
              value={qrData}
              size={styles.qrSize}
              margin={1}
              className="flex-shrink-0"
            />
          )}
        </div>

        {/* Footer with details */}
        <div className="text-xs space-y-1">
          {showSerialNumber && (
            <div className="flex justify-between">
              <span className="font-semibold">رقم:</span>
              <span className="font-mono text-xs text-right">{asset.serialNumber}</span>
            </div>
          )}
          {showBarcode && asset.barcode && (
            <div className="flex justify-between">
              <span className="font-semibold">باركود:</span>
              <span className="font-mono text-xs text-right">{asset.barcode}</span>
            </div>
          )}
          {showLocation && (
            <div className="flex justify-between">
              <span className="font-semibold">الموقع:</span>
              <span className="truncate text-right">{asset.location}</span>
            </div>
          )}
          {showCategory && (
            <div className="flex justify-between">
              <span className="font-semibold">الفئة:</span>
              <span className="truncate text-right">{asset.category}</span>
            </div>
          )}
          {showDate && (
            <div className="flex justify-between">
              <span className="font-semibold">التاريخ:</span>
              <span className="text-right">{new Date().toLocaleDateString('ar-SA')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};