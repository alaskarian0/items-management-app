"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  ArrowLeft,
  FileText,
  Package,
  User,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

// Purchase Order Item interface
interface PurchaseOrderItem {
  id: string;
  itemName: string;
  itemType: "ثابت" | "استهلاكي";
  quantity: number;
  unit: string;
  estimatedPrice?: number;
  notes?: string;
}

// Purchase Order interface
interface PurchaseOrder {
  id: string;
  orderNumber: string;
  employeeId: string;
  employeeName: string;
  employeePosition: string;
  divisionName: string;
  unit?: string;
  submittedDate: string;
  requiredDate: string;
  status: "pending" | "approved" | "rejected" | "completed";
  priority: "عادي" | "عاجل" | "ضروري";
  items: PurchaseOrderItem[];
  totalEstimatedCost: number;
  justification: string;
  notes?: string;
  reviewedBy?: string;
  reviewedDate?: string;
  reviewNotes?: string;
}

// Mock purchase orders data (same as main page)
const MOCK_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: "PO001",
    orderNumber: "PO-2024-001",
    employeeId: "EMP001",
    employeeName: "أحمد محمد علي",
    employeePosition: "مدير التخطيط",
    divisionName: "شعبة التخطيط",
    unit: "وحدة التخطيط الاستراتيجي",
    submittedDate: "2024-01-15",
    requiredDate: "2024-02-01",
    status: "pending",
    priority: "عاجل",
    items: [
      {
        id: "1",
        itemName: "حاسوب محمول Dell Latitude",
        itemType: "ثابت",
        quantity: 1,
        unit: "قطعة",
        estimatedPrice: 1200000,
        notes: "مع ضمان سنتين",
      },
      {
        id: "2",
        itemName: "طابعة HP LaserJet",
        itemType: "ثابت",
        quantity: 1,
        unit: "قطعة",
        estimatedPrice: 450000,
      },
    ],
    totalEstimatedCost: 1650000,
    justification: "احتياج عاجل لتطوير وحدة التخطيط الاستراتيجي وتحسين الأداء",
  },
  {
    id: "PO002",
    orderNumber: "PO-2024-002",
    employeeId: "EMP002",
    employeeName: "سارة علي حسن",
    employeePosition: "مسؤولة المتابعة",
    divisionName: "شعبة المتابعة",
    submittedDate: "2024-01-16",
    requiredDate: "2024-01-25",
    status: "approved",
    priority: "عادي",
    items: [
      {
        id: "3",
        itemName: "أوراق A4",
        itemType: "استهلاكي",
        quantity: 10,
        unit: "حزمة",
        estimatedPrice: 50000,
      },
      {
        id: "4",
        itemName: "أقلام جاف",
        itemType: "استهلاكي",
        quantity: 50,
        unit: "قلم",
        estimatedPrice: 25000,
      },
    ],
    totalEstimatedCost: 75000,
    justification: "لوازم مكتبية للأعمال اليومية",
    reviewedBy: "مدير قسم حفظ النظام",
    reviewedDate: "2024-01-17",
    reviewNotes: "تمت الموافقة على الطلب",
  },
  {
    id: "PO003",
    orderNumber: "PO-2024-003",
    employeeId: "EMP003",
    employeeName: "محمد حسن جاسم",
    employeePosition: "محاسب",
    divisionName: "شعبة الحسابات",
    unit: "وحدة المحاسبة المالية",
    submittedDate: "2024-01-14",
    requiredDate: "2024-01-20",
    status: "completed",
    priority: "ضروري",
    items: [
      {
        id: "5",
        itemName: "آلة حاسبة علمية",
        itemType: "ثابت",
        quantity: 2,
        unit: "قطعة",
        estimatedPrice: 100000,
      },
    ],
    totalEstimatedCost: 100000,
    justification: "ضروري لأعمال المحاسبة المالية",
    reviewedBy: "مدير قسم حفظ النظام",
    reviewedDate: "2024-01-15",
    reviewNotes: "تمت الموافقة والتنفيذ",
  },
];

export default function PurchaseOrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [order, setOrder] = useState<PurchaseOrder | undefined>(
    MOCK_PURCHASE_ORDERS.find((o) => o.id === params.id)
  );
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewAction, setReviewAction] = useState<"approve" | "reject" | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <AlertCircle className="h-16 w-16 text-muted-foreground" />
        <h2 className="text-2xl font-bold">طلب الشراء غير موجود</h2>
        <p className="text-muted-foreground">لم يتم العثور على طلب الشراء المطلوب</p>
        <Button onClick={() => router.push("/purchases/orders")}>
          <ArrowLeft className="h-4 w-4 ml-2" />
          العودة إلى قائمة الطلبات
        </Button>
      </div>
    );
  }

  const handleReview = (action: "approve" | "reject") => {
    setReviewAction(action);
    setReviewNotes("");
    setReviewDialogOpen(true);
  };

  const handleConfirmReview = () => {
    if (!reviewAction) return;

    const newStatus = reviewAction === "approve" ? "approved" : "rejected";

    setOrder({
      ...order,
      status: newStatus,
      reviewedBy: "مدير قسم حفظ النظام",
      reviewedDate: new Date().toISOString().split("T")[0],
      reviewNotes: reviewNotes,
    });

    toast.success(
      `تم ${reviewAction === "approve" ? "الموافقة على" : "رفض"} طلب الشراء ${order.orderNumber}`
    );

    setReviewDialogOpen(false);
    setReviewAction(null);
    setReviewNotes("");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20">
            <Clock className="h-3 w-3 ml-1" />
            قيد الانتظار
          </Badge>
        );
      case "approved":
        return (
          <Badge className="bg-blue-500/10 text-blue-700 hover:bg-blue-500/20">
            <CheckCircle className="h-3 w-3 ml-1" />
            موافق عليه
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-500/10 text-red-700 hover:bg-red-500/20">
            <XCircle className="h-3 w-3 ml-1" />
            مرفوض
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-green-500/10 text-green-700 hover:bg-green-500/20">
            <CheckCircle className="h-3 w-3 ml-1" />
            مكتمل
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "ضروري":
        return <Badge variant="destructive">ضروري</Badge>;
      case "عاجل":
        return <Badge className="bg-orange-500 hover:bg-orange-600">عاجل</Badge>;
      case "عادي":
        return <Badge variant="outline">عادي</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/purchases/orders")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <FileText className="h-8 w-8" />
                تفاصيل طلب الشراء
              </h2>
              <p className="text-muted-foreground mt-1">
                {order.orderNumber}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(order.status)}
          {getPriorityBadge(order.priority)}
        </div>
      </div>

      {/* Order Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">معلومات الطلب</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <Label className="text-muted-foreground">رقم الطلب</Label>
            <p className="font-medium font-mono">{order.orderNumber}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">الحالة</Label>
            <div className="mt-1">{getStatusBadge(order.status)}</div>
          </div>
          <div>
            <Label className="text-muted-foreground">تاريخ التقديم</Label>
            <p className="font-medium">{order.submittedDate}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">التاريخ المطلوب</Label>
            <p className="font-medium">{order.requiredDate}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">الأولوية</Label>
            <div className="mt-1">{getPriorityBadge(order.priority)}</div>
          </div>
          <div>
            <Label className="text-muted-foreground">التكلفة المقدرة</Label>
            <p className="font-medium">
              {order.totalEstimatedCost.toLocaleString()} IQD
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Employee Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4" />
            معلومات الموظف
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <Label className="text-muted-foreground">الاسم</Label>
            <p className="font-medium">{order.employeeName}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">المنصب</Label>
            <p className="font-medium">{order.employeePosition}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">الشعبة</Label>
            <p className="font-medium">{order.divisionName}</p>
          </div>
          {order.unit && (
            <div>
              <Label className="text-muted-foreground">الوحدة</Label>
              <p className="font-medium">{order.unit}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Items */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Package className="h-4 w-4" />
            المواد المطلوبة ({order.items.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md overflow-x-auto">
            <Table dir="rtl">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">اسم المادة</TableHead>
                  <TableHead className="text-right">النوع</TableHead>
                  <TableHead className="text-right">الكمية</TableHead>
                  <TableHead className="text-right">السعر المقدر</TableHead>
                  <TableHead className="text-right">الإجمالي</TableHead>
                  <TableHead className="text-right">ملاحظات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-right font-medium">
                      {item.itemName}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline">{item.itemType}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {item.quantity} {item.unit}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.estimatedPrice
                        ? `${item.estimatedPrice.toLocaleString()} IQD`
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {item.estimatedPrice
                        ? `${(item.quantity * item.estimatedPrice).toLocaleString()} IQD`
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      {item.notes || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Total */}
          <div className="mt-4 flex justify-end">
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">التكلفة الإجمالية:</span>
                <span className="text-xl font-bold">
                  {order.totalEstimatedCost.toLocaleString()} IQD
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Justification */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">مبررات الطلب</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{order.justification}</p>
        </CardContent>
      </Card>

      {/* Additional Notes */}
      {order.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">ملاحظات إضافية</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{order.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Review Info */}
      {order.reviewedBy && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">معلومات المراجعة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <Label className="text-muted-foreground">تمت المراجعة بواسطة</Label>
              <p className="font-medium">{order.reviewedBy}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">تاريخ المراجعة</Label>
              <p className="font-medium">{order.reviewedDate}</p>
            </div>
            {order.reviewNotes && (
              <div>
                <Label className="text-muted-foreground">ملاحظات المراجعة</Label>
                <p className="font-medium">{order.reviewNotes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      {order.status === "pending" && (
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            className="text-red-600 hover:text-red-700"
            onClick={() => handleReview("reject")}
          >
            <XCircle className="h-4 w-4 ml-2" />
            رفض الطلب
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={() => handleReview("approve")}
          >
            <CheckCircle className="h-4 w-4 ml-2" />
            الموافقة على الطلب
          </Button>
        </div>
      )}

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reviewAction === "approve" ? "الموافقة على" : "رفض"} طلب الشراء
            </DialogTitle>
            <DialogDescription>
              طلب رقم: {order.orderNumber}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reviewNotes">ملاحظات المراجعة</Label>
              <Textarea
                id="reviewNotes"
                placeholder="أدخل ملاحظاتك حول القرار..."
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>
              إلغاء
            </Button>
            <Button
              onClick={handleConfirmReview}
              className={
                reviewAction === "approve"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }
            >
              {reviewAction === "approve" ? "تأكيد الموافقة" : "تأكيد الرفض"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
