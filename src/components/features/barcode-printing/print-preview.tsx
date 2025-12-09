"use client";

import React from 'react';
import { FixedAsset, LabelTemplate } from './label-template';

export type { FixedAsset };

export interface PrintPreviewProps {
  assets: FixedAsset[];
  template: 'standard' | 'large' | 'small';
  layout: {
    rows: number;
    columns: number;
  };
  showBarcode: boolean;
  showQRCode: boolean;
  showAssetName: boolean;
  showSerialNumber: boolean;
  showLocation: boolean;
  showCategory: boolean;
  showDate: boolean;
  className?: string;
}

export const PrintPreview: React.FC<PrintPreviewProps> = ({
  assets,
  template,
  layout,
  showBarcode,
  showQRCode,
  showAssetName,
  showSerialNumber,
  showLocation,
  showCategory,
  showDate,
  className = ''
}) => {
  const getTemplateDimensions = () => {
    switch (template) {
      case 'large':
        return { width: '288px', height: '192px' };
      case 'small':
        return { width: '144px', height: '96px' };
      default: // standard
        return { width: '192px', height: '96px' };
    }
  };

  const dimensions = getTemplateDimensions();
  
  // Create a grid with empty cells for layout
  const totalCells = layout.rows * layout.columns;
  const cells = Array(totalCells).fill(null);
  
  // Fill cells with assets
  assets.forEach((asset, index) => {
    if (index < totalCells) {
      cells[index] = asset;
    }
  });

  return (
    <div className={`print-preview ${className}`}>
      {/* Print-specific styles */}
      <style jsx>{`
        @media print {
          .print-preview {
            margin: 0;
            padding: 0;
          }
          .print-grid {
            page-break-inside: avoid;
          }
          .label-cell {
            page-break-inside: avoid;
            break-inside: avoid;
          }
        }
      `}</style>
      
      <div
        className="print-grid bg-white p-4"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${layout.columns}, ${dimensions.width})`,
          gridTemplateRows: `repeat(${layout.rows}, ${dimensions.height})`,
          gap: '8px',
          justifyContent: 'center',
          direction: 'rtl',
          width: 'fit-content',
          margin: '0 auto'
        }}
        dir="rtl"
      >
        {cells.map((asset, index) => (
          <div 
            key={index} 
            className="label-cell"
            style={{
              width: dimensions.width,
              height: dimensions.height
            }}
          >
            {asset ? (
              <LabelTemplate
                asset={asset}
                template={template}
                showBarcode={showBarcode}
                showQRCode={showQRCode}
                showAssetName={showAssetName}
                showSerialNumber={showSerialNumber}
                showLocation={showLocation}
                showCategory={showCategory}
                showDate={showDate}
              />
            ) : (
              <div 
                className="border border-dashed border-gray-300 bg-gray-50"
                style={{
                  width: dimensions.width,
                  height: dimensions.height
                }}
              />
            )}
          </div>
        ))}
      </div>
      
      {/* Print footer */}
      <div className="print-footer text-center text-xs text-gray-500 mt-4 print:hidden">
        <p>تم الإنشاء: {new Date().toLocaleDateString('ar-SA')} {new Date().toLocaleTimeString('ar-SA')}</p>
        <p>عدد الموجودات: {assets.length}</p>
      </div>
    </div>
  );
};