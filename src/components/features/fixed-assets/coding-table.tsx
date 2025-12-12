"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { type FixedAsset } from "@/lib/types/fixed-assets";
import { Barcode, Eye, FileText, QrCode } from "lucide-react";

interface CodingTableProps {
  assets: FixedAsset[];
  onAssignBarcode: (asset: FixedAsset) => void;
  onViewDocuments?: (asset: FixedAsset) => void;
}

export const CodingTable = ({ assets, onAssignBarcode, onViewDocuments }: CodingTableProps) => {
  return (
    <div className="border rounded-lg overflow-x-auto">
      <Table dir="rtl">
        <TableHeader>
          <TableRow>
            <TableHead className="text-right">كود المادة (RQ)</TableHead>
            <TableHead className="text-right">رقم المستند</TableHead>
            <TableHead className="text-right">اسم الموجود</TableHead>
            <TableHead className="text-right">الفئة</TableHead>
            <TableHead className="text-right">الباركود</TableHead>
            <TableHead className="text-right">الموقع</TableHead>
            <TableHead className="text-right">عدد التسجيلات</TableHead>
            <TableHead className="text-right">الحالة</TableHead>
            <TableHead className="text-center">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assets.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                لا توجد نتائج
              </TableCell>
            </TableRow>
          ) : (
            assets.map((asset) => (
              <TableRow
                key={asset.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onAssignBarcode(asset)}
              >
                <TableCell className="font-mono text-sm text-right font-medium">
                  <code className="px-2 py-1 bg-primary/10 rounded text-primary">
                    {asset.assetCode}
                  </code>
                </TableCell>
                <TableCell className="font-mono text-sm text-right">
                  {asset.documentNumber ? (
                    <code className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded text-blue-700 dark:text-blue-300">
                      {asset.documentNumber}
                    </code>
                  ) : (
                    <span className="text-muted-foreground text-sm">غير محدد</span>
                  )}
                </TableCell>
                <TableCell className="font-medium text-right">{asset.name}</TableCell>
                <TableCell className="text-right">{asset.category}</TableCell>
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
                <TableCell className="text-right">
                  <Badge variant="outline" className="font-mono">
                    {asset.registrationCount || 0}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant={asset.barcode ? 'default' : 'secondary'}>
                    {asset.barcode ? 'مرمز' : 'بانتظار الترميز'}
                  </Badge>
                </TableCell>
                <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                  <TooltipProvider>
                    <div className="flex justify-center gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              onAssignBarcode(asset);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>عرض التفاصيل</p>
                        </TooltipContent>
                      </Tooltip>

                      {asset.documentNumber && onViewDocuments && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                onViewDocuments(asset);
                              }}
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>عرض المستندات</p>
                          </TooltipContent>
                        </Tooltip>
                      )}

                      {asset.barcode && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle QR code printing
                              }}
                            >
                              <QrCode className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>طباعة QR Code</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
