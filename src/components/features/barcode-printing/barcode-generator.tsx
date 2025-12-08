"use client";

import React, { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';

interface BarcodeGeneratorProps {
  value: string;
  width?: number;
  height?: number;
  format?: string;
  displayValue?: boolean;
  fontSize?: number;
  margin?: number;
  className?: string;
}

export const BarcodeGenerator: React.FC<BarcodeGeneratorProps> = ({
  value,
  width = 2,
  height = 100,
  format = 'CODE128',
  displayValue = true,
  fontSize = 14,
  margin = 10,
  className = ''
}) => {
  const barcodeRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (barcodeRef.current && value) {
      try {
        JsBarcode(barcodeRef.current, value, {
          format,
          width,
          height,
          displayValue,
          fontSize,
          margin,
          background: '#ffffff',
          lineColor: '#000000',
        });
      } catch (error) {
        console.error('Error generating barcode:', error);
      }
    }
  }, [value, width, height, format, displayValue, fontSize, margin]);

  if (!value) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`} style={{ height }}>
        <span className="text-gray-500 text-sm">No barcode data</span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <svg ref={barcodeRef}></svg>
    </div>
  );
};