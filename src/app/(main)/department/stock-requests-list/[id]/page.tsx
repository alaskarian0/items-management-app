"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowLeft,
  Package,
  Warehouse,
  Calendar,
  FileText,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useItems } from "@/hooks/use-inventory";

// Stock Request Item interface
interface StockRequestItem {
  id: string;
  itemId: number;
  itemCode: string;
  itemName: string;
  unit: string;
  requestedQuantity: number;
  currentStock?: number;
  notes?: string;
}

// Stock Request interface
interface StockRequest {
  id: string;
  requestNumber: string;
  submittedDate: string;
  warehouseName: string;
  warehouseId: string;
  itemsCount: number;
  status: "pending" | "completed" | "rejected";
  submittedBy: string;
  purpose: string;
  items: StockRequestItem[];
}

// Mock data - in real app, this would come from API/database
const MOCK_REQUEST_DETAILS: Record<string, StockRequest> = {
  "1": {
    id: "1",
    requestNumber: "SR-2024-001",
    submittedDate: "2024-01-20",
    warehouseName: "مخزن الأثاث والممتلكات العامة",
    warehouseId: "furniture",
    itemsCount: 3,
    status: "pending",
    submittedBy: "قسم حفظ النظام",
    purpose: "الاستعلام عن توفر المواد المطلوبة لتجهيز مكاتب القسم الجديد",
    items: [
      {
        id: "1",
        itemId: 1,
        itemCode: "FUR-001",
        itemName: "مكتب خشبي",
        unit: "قطعة",
        requestedQuantity: 5,
        currentStock: 12,
        notes: "مطلوب للمكاتب الجديدة",
      },
      {
        id: "2",
        itemId: 2,
        itemCode: "FUR-002",
        itemName: "كرسي دوار",
        unit: "قطعة",
        requestedQuantity: 5,
        currentStock: 8,
        notes: "",
      },
      {
        id: "3",
        itemId: 3,
        itemCode: "FUR-003",
        itemName: "خزانة ملفات",
        unit: "قطعة",
        requestedQuantity: 3,
        currentStock: 2,
        notes: "نقص في المخزون",
      },
    ],
  },
  "2": {
    id: "2",
    requestNumber: "SR-2024-002",
    submittedDate: "2024-01-18",
    warehouseName: "مخزن المواد العامة",
    warehouseId: "general",
    itemsCount: 5,
    status: "completed",
    submittedBy: "قسم حفظ النظام",
    purpose: "احتياجات القسم الشهرية من المواد المكتبية",
    items: [
      {
        id: "1",
        itemId: 4,
        itemCode: "GEN-001",
        itemName: "ورق A4",
        unit: "رزمة",
        requestedQuantity: 10,
        currentStock: 50,
      },
      {
        id: "2",
        itemId: 5,
        itemCode: "GEN-002",
        itemName: "أقلام حبر",
        unit: "علبة",
        requestedQuantity: 5,
        currentStock: 25,
      },
      {
        id: "3",
        itemId: 6,
        itemCode: "GEN-003",
        itemName: "ملفات بلاستيك",
        unit: "علبة",
        requestedQuantity: 8,
        currentStock: 15,
      },
      {
        id: "4",
        itemId: 7,
        itemCode: "GEN-004",
        itemName: "دباسة",
        unit: "قطعة",
        requestedQuantity: 3,
        currentStock: 10,
      },
      {
        id: "5",
        itemId: 8,
        itemCode: "GEN-005",
        itemName: "مقص",
        unit: "قطعة",
        requestedQuantity: 2,
        currentStock: 7,
      },
    ],
  },
  "3": {
    id: "3",
    requestNumber: "SR-2024-003",
    submittedDate: "2024-01-15",
    warehouseName: "مخزن المواد الجافة",
    warehouseId: "dry",
    itemsCount: 2,
    status: "rejected",
    submittedBy: "قسم حفظ النظام",
    purpose: "طلب مواد غذائية للاجتماع الشهري",
    items: [
      {
        id: "1",
        itemId: 9,
        itemCode: "DRY-001",
        itemName: "شاي",
        unit: "كيلو",
        requestedQuantity: 5,
        currentStock: 0,
        notes: "غير متوفر حالياً",
      },
      {
        id: "2",
        itemId: 10,
        itemCode: "DRY-002",
        itemName: "سكر",
        unit: "كيلو",
        requestedQuantity: 3,
        currentStock: 0,
        notes: "غير متوفر حالياً",
      },
    ],
  },
  "4": {
    id: "4",
    requestNumber: "SR-2024-004",
    submittedDate: "2024-01-10",
    warehouseName: "مخزن الوقود والزيوت",
    warehouseId: "fuel",
    itemsCount: 4,
    status: "completed",
    submittedBy: "قسم حفظ النظام",
    purpose: "احتياجات المولدات الكهربائية",
    items: [
      {
        id: "1",
        itemId: 11,
        itemCode: "FUEL-001",
        itemName: "زيت محركات",
        unit: "لتر",
        requestedQuantity: 20,
        currentStock: 100,
      },
      {
        id: "2",
        itemId: 12,
        itemCode: "FUEL-002",
        itemName: "بنزين",
        unit: "لتر",
        requestedQuantity: 50,
        currentStock: 200,
      },
      {
        id: "3",
        itemId: 13,
        itemCode: "FUEL-003",
        itemName: "ديزل",
        unit: "لتر",
        requestedQuantity: 100,
        currentStock: 500,
      },
      {
        id: "4",
        itemId: 14,
        itemCode: "FUEL-004",
        itemName: "فلتر زيت",
        unit: "قطعة",
        requestedQuantity: 5,
        currentStock: 15,
      },
    ],
  },
};

export default function StockRequestDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [request, setRequest] = useState<StockRequest | null>(null);

  useEffect(() => {
    // In real app, fetch from API/database
    if (id && MOCK_REQUEST_DETAILS[id]) {
      setRequest(MOCK_REQUEST_DETAILS[id]);
    }
  }, [id]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20">
            <Clock className="h-4 w-4 ml-1" />
            قيد المراجعة
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-green-500/10 text-green-700 hover:bg-green-500/20">
            <CheckCircle className="h-4 w-4 ml-1" />
            مكتمل
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-500/10 text-red-700 hover:bg-red-500/20">
            <AlertCircle className="h-4 w-4 ml-1" />
            مرفوض
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStockStatus = (currentStock: number, requestedQuantity: number) => {
    if (currentStock === 0) {
      return (
        <Badge variant="destructive">
          <TrendingDown className="h-3 w-3 ml-1" />
          غير متوفر
        </Badge>
      );
    } else if (currentStock < requestedQuantity) {
      return (
        <Badge className="bg-orange-500/10 text-orange-700 hover:bg-orange-500/20">
          <AlertCircle className="h-3 w-3 ml-1" />
          نقص
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-green-500/10 text-green-700 hover:bg-green-500/20">
          <TrendingUp className="h-3 w-3 ml-1" />
          متوفر
        </Badge>
      );
    }
  };

  if (!request) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold">الطلب غير موجود</h3>
          <p className="text-muted-foreground mb-4">
            لم يتم العثور على الطلب المطلوب
          </p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 ml-2" />
            العودة
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-3xl font-bold tracking-tight">
              تفاصيل الطلب {request.requestNumber}
            </h2>
          </div>
          <p className="text-muted-foreground mt-1">
            عرض تفاصيل طلب الاستعلام عن المخزون
          </p>
        </div>
        <div>{getStatusBadge(request.status)}</div>
      </div>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">متوفر بالكامل</p>
                <p className="text-2xl font-bold text-green-600">
                  {
                    request.items.filter(
                      (item) =>
                        item.currentStock !== undefined &&
                        item.currentStock >= item.requestedQuantity
                    ).length
                  }
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">نقص في المخزون</p>
                <p className="text-2xl font-bold text-orange-600">
                  {
                    request.items.filter(
                      (item) =>
                        item.currentStock !== undefined &&
                        item.currentStock > 0 &&
                        item.currentStock < item.requestedQuantity
                    ).length
                  }
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">غير متوفر</p>
                <p className="text-2xl font-bold text-red-600">
                  {
                    request.items.filter(
                      (item) =>
                        item.currentStock !== undefined &&
                        item.currentStock === 0
                    ).length
                  }
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Request Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            معلومات الطلب
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">رقم الطلب</p>
                <p className="font-semibold text-lg">{request.requestNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  تاريخ الإرسال
                </p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">
                    {new Date(request.submittedDate).toLocaleDateString(
                      "ar-IQ",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  الجهة المرسلة
                </p>
                <p className="font-medium">{request.submittedBy}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  المخزن المستهدف
                </p>
                <div className="flex items-center gap-2">
                  <Warehouse className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{request.warehouseName}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">عدد المواد</p>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{request.itemsCount} مادة</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">الحالة</p>
                <div>{getStatusBadge(request.status)}</div>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <div>
            <p className="text-sm text-muted-foreground mb-2">الغرض من الطلب</p>
            <p className="text-base leading-relaxed bg-muted/50 p-4 rounded-md">
              {request.purpose}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Items Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            المواد المطلوبة ورصيدها
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md overflow-x-auto">
            <Table dir="rtl">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">كود المادة</TableHead>
                  <TableHead className="text-right">اسم المادة</TableHead>
                  <TableHead className="text-right">الوحدة</TableHead>
                  <TableHead className="text-right">الكمية المطلوبة</TableHead>
                  <TableHead className="text-right">الرصيد الحالي</TableHead>
                  <TableHead className="text-right">حالة التوفر</TableHead>
                  <TableHead className="text-right">ملاحظات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {request.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-right font-mono">
                      {item.itemCode}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {item.itemName}
                    </TableCell>
                    <TableCell className="text-right">{item.unit}</TableCell>
                    <TableCell className="text-right">
                      <span className="font-semibold">
                        {item.requestedQuantity.toLocaleString("ar-IQ")}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={`font-semibold ${
                          item.currentStock === 0
                            ? "text-red-600"
                            : item.currentStock !== undefined &&
                              item.currentStock < item.requestedQuantity
                            ? "text-orange-600"
                            : "text-green-600"
                        }`}
                      >
                        {item.currentStock !== undefined
                          ? item.currentStock.toLocaleString("ar-IQ")
                          : "N/A"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {item.currentStock !== undefined &&
                        getStockStatus(
                          item.currentStock,
                          item.requestedQuantity
                        )}
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">
                      {item.notes || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
