"use client";

import React from 'react';
import { type FixedAsset } from './label-template';
import { type QRDataFields } from './qr-print-modal';
import { QRCodeGenerator } from './qr-code-generator';

export interface QRLabelTemplateProps {
  asset: FixedAsset;
  template: 'standard' | 'large' | 'small';
  qrDataFields: QRDataFields;
  showAssetName: boolean;
  showSerialNumber: boolean;
  showLocation: boolean;
  showCategory: boolean;
  showDate: boolean;
  className?: string;
}

export const QRLabelTemplate: React.FC<QRLabelTemplateProps> = ({
  asset,
  template,
  qrDataFields,
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
          qrSize: 120
        };
      case 'small':
        return {
          width: '144px', // 1.5 inches at 96 DPI
          height: '96px', // 1 inch at 96 DPI
          fontSize: '8px',
          qrSize: 50
        };
      default: // standard
        return {
          width: '192px', // 2 inches at 96 DPI
          height: '96px', // 1 inch at 96 DPI
          fontSize: '10px',
          qrSize: 70
        };
    }
  };

  const styles = getTemplateStyles();

  // Build QR data based on selected fields
  const qrData: Record<string, any> = {};
  if (qrDataFields.id) qrData.id = asset.id;
  if (qrDataFields.name) qrData.name = asset.name;
  if (qrDataFields.serialNumber) qrData.serialNumber = asset.serialNumber;
  if (qrDataFields.barcode) qrData.barcode = asset.barcode;
  if (qrDataFields.location) qrData.location = asset.location;
  if (qrDataFields.category) qrData.category = asset.category;
  if (qrDataFields.purchaseDate) qrData.purchaseDate = asset.purchaseDate;
  if (qrDataFields.value) qrData.value = asset.value;

  const qrDataString = JSON.stringify(qrData);

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

        {/* Middle section with QR Code */}
        <div className="flex justify-center items-center flex-1">
          <QRCodeGenerator
            value={qrDataString}
            size={styles.qrSize}
            margin={1}
            className="flex-shrink-0"
          />
        </div>

        {/* Footer with details */}
        <div className="text-xs space-y-1">
          {showSerialNumber && (
            <div className="flex justify-between">
              <span className="font-semibold">رقم:</span>
              <span className="font-mono text-xs text-right">{asset.serialNumber}</span>
            </div>
          )}
          {asset.barcode && (
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
