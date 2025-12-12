"use client";

import QRCode from 'qrcode';
import React, { useEffect, useState } from 'react';

interface QRCodeGeneratorProps {
  value: string;
  size?: number;
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
  className?: string;
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  value,
  size = 100,
  margin = 4,
  color = {
    dark: '#000000',
    light: '#ffffff'
  },
  className = ''
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const generateQRCode = async () => {
      if (!value) {
        setQrCodeUrl('');
        setError('');
        return;
      }

      try {
        const url = await QRCode.toDataURL(value, {
          width: size,
          margin: margin,
          color: {
            dark: color.dark,
            light: color.light
          },
          errorCorrectionLevel: 'M'
        });
        setQrCodeUrl(url);
        setError('');
      } catch (err) {
        console.error('Error generating QR code:', err);
        setError('Failed to generate QR code');
        setQrCodeUrl('');
      }
    };

    generateQRCode();
  }, [value, size, margin, color]);

  if (!value) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`} style={{ width: size, height: size }}>
        <span className="text-gray-500 text-xs text-center">No QR data</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-red-50 ${className}`} style={{ width: size, height: size }}>
        <span className="text-red-500 text-xs text-center">Error</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img 
        src={qrCodeUrl} 
        alt="QR Code" 
        style={{ width: size, height: size }}
        className="border border-gray-200 bg-white"
      />
    </div>
  );
};