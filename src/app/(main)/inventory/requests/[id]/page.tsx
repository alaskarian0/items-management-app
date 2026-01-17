"use client";

import { useMemo } from "react";
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
  Loader2,
  XCircle,
} from "lucide-react";
import { useStockQueryRequest, STOCK_QUERY_STATUS } from "@/hooks/use-stock-query";

export default function StockRequestDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const { request, loading, error } = useStockQueryRequest(parseInt(id) || 0);

  const getStatusBadge = (status: number) => {
    switch (status) {
      case STOCK_QUERY_STATUS.PENDING:
        return (
          <Badge className="bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20">
            <Clock className="h-4 w-4 ml-1" />
            قيد المراجعة
          </Badge>
        );
      case STOCK_QUERY_STATUS.APPROVED:
        return (
          <Badge className="bg-green-500/10 text-green-700 hover:bg-green-500/20">
            <CheckCircle className="h-4 w-4 ml-1" />
            تمت الموافقة
          </Badge>
        );
      case STOCK_QUERY_STATUS.REJECTED:
        return (
          <Badge className="bg-red-500/10 text-red-700 hover:bg-red-500/20">
            <XCircle className="h-4 w-4 ml-1" />
            مرفوض
          </Badge>
        );
      case STOCK_QUERY_STATUS.COMPLETED:
        return (
          <Badge className="bg-blue-500/10 text-blue-700 hover:bg-blue-500/20">
            <CheckCircle className="h-4 w-4 ml-1" />
            مكتمل
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStockStatus = (availableStock: number | null | undefined, requestedQuantity: number) => {
    if (availableStock === null || availableStock === undefined) {
      return (
        <Badge variant="outline">
          <Clock className="h-3 w-3 ml-1" />
          قيد الانتظار
        </Badge>
      );
    }
    if (availableStock === 0) {
      return (
        <Badge variant="destructive">
          <TrendingDown className="h-3 w-3 ml-1" />
          غير متوفر
        </Badge>
      );
    } else if (availableStock < requestedQuantity) {
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

  // Calculate statistics
  const stats = useMemo(() => {
    if (!request?.items) return { available: 0, shortage: 0, unavailable: 0 };
    return {
      available: request.items.filter(
        (item) =>
          item.availableStock !== null &&
          item.availableStock !== undefined &&
          item.availableStock >= item.requestedQuantity
      ).length,
      shortage: request.items.filter(
        (item) =>
          item.availableStock !== null &&
          item.availableStock !== undefined &&
          item.availableStock > 0 &&
          item.availableStock < item.requestedQuantity
      ).length,
      unavailable: request.items.filter(
        (item) =>
          item.availableStock !== null &&
          item.availableStock !== undefined &&
          item.availableStock === 0
      ).length,
    };
  }, [request?.items]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !request) {
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

      {/* Summary Cards - Only show if request is approved/completed */}
      {(request.status === STOCK_QUERY_STATUS.APPROVED || request.status === STOCK_QUERY_STATUS.COMPLETED) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">متوفر بالكامل</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.available}
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
                    {stats.shortage}
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
                    {stats.unavailable}
                  </p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

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
                    {new Date(request.requestDate).toLocaleDateString("ar-IQ", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  الجهة المرسلة
                </p>
                <p className="font-medium">{request.requesterName || request.department?.name || "-"}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  المخزن المستهدف
                </p>
                <div className="flex items-center gap-2">
                  <Warehouse className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{request.warehouse?.name || "-"}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">عدد المواد</p>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{request.itemCount} مادة</p>
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
              {request.purpose || "-"}
            </p>
          </div>

          {/* Rejection reason if rejected */}
          {request.status === STOCK_QUERY_STATUS.REJECTED && request.rejectionReason && (
            <>
              <Separator className="my-6" />
              <div>
                <p className="text-sm text-muted-foreground mb-2">سبب الرفض</p>
                <p className="text-base leading-relaxed bg-red-50 text-red-800 p-4 rounded-md border border-red-200">
                  {request.rejectionReason}
                </p>
              </div>
            </>
          )}
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
                  {(request.status === STOCK_QUERY_STATUS.APPROVED || request.status === STOCK_QUERY_STATUS.COMPLETED) && (
                    <>
                      <TableHead className="text-right">الرصيد الحالي</TableHead>
                      <TableHead className="text-right">الكمية الموافق عليها</TableHead>
                      <TableHead className="text-right">حالة التوفر</TableHead>
                    </>
                  )}
                  <TableHead className="text-right">ملاحظات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {request.items?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-right font-mono">
                      {item.itemMaster?.code || "-"}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {item.itemMaster?.name || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.itemMaster?.unit?.abbreviation || item.itemMaster?.unit?.name || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-semibold">
                        {item.requestedQuantity?.toLocaleString("ar-IQ")}
                      </span>
                    </TableCell>
                    {(request.status === STOCK_QUERY_STATUS.APPROVED || request.status === STOCK_QUERY_STATUS.COMPLETED) && (
                      <>
                        <TableCell className="text-right">
                          <span
                            className={`font-semibold ${
                              item.availableStock === 0
                                ? "text-red-600"
                                : item.availableStock !== null &&
                                  item.availableStock !== undefined &&
                                  item.availableStock < item.requestedQuantity
                                ? "text-orange-600"
                                : "text-green-600"
                            }`}
                          >
                            {item.availableStock !== null && item.availableStock !== undefined
                              ? item.availableStock.toLocaleString("ar-IQ")
                              : "-"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="font-semibold text-blue-600">
                            {item.approvedQuantity !== null && item.approvedQuantity !== undefined
                              ? item.approvedQuantity.toLocaleString("ar-IQ")
                              : "-"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          {getStockStatus(item.availableStock, item.requestedQuantity)}
                        </TableCell>
                      </>
                    )}
                    <TableCell className="text-right text-sm text-muted-foreground">
                      {item.notes || item.resultNotes || "-"}
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
