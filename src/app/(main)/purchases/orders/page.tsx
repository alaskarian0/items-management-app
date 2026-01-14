"use client";

import { useState, useMemo } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  ShoppingCart,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
} from "lucide-react";

// Purchase Order interface
interface PurchaseOrderItem {
  id: string;
  itemName: string;
  itemType: "ثابت" | "استهلاكي";
  quantity: number;
  unit: string;
  estimatedPrice?: number;
  notes?: string;
}

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

// Mock purchase orders data
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

export default function PurchaseOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<PurchaseOrder[]>(MOCK_PURCHASE_ORDERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewAction, setReviewAction] = useState<"approve" | "reject" | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");

  // Filter orders
  const filteredOrders = useMemo(() => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.divisionName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter((order) => order.priority === priorityFilter);
    }

    return filtered.sort(
      (a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime()
    );
  }, [orders, searchTerm, statusFilter, priorityFilter]);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      approved: orders.filter((o) => o.status === "approved").length,
      rejected: orders.filter((o) => o.status === "rejected").length,
      completed: orders.filter((o) => o.status === "completed").length,
    };
  }, [orders]);

  const handleViewDetails = (order: PurchaseOrder) => {
    router.push(`/purchases/orders/${order.id}`);
  };

  const handleReview = (order: PurchaseOrder, action: "approve" | "reject") => {
    setSelectedOrder(order);
    setReviewAction(action);
    setReviewNotes("");
    setReviewDialogOpen(true);
  };

  const handleConfirmReview = () => {
    if (!selectedOrder || !reviewAction) return;

    const newStatus = reviewAction === "approve" ? "approved" : "rejected";

    setOrders(
      orders.map((order) =>
        order.id === selectedOrder.id
          ? {
              ...order,
              status: newStatus,
              reviewedBy: "مدير قسم حفظ النظام",
              reviewedDate: new Date().toISOString().split("T")[0],
              reviewNotes: reviewNotes,
            }
          : order
      )
    );

    toast.success(
      `تم ${reviewAction === "approve" ? "الموافقة على" : "رفض"} طلب الشراء ${selectedOrder.orderNumber}`
    );

    setReviewDialogOpen(false);
    setReviewAction(null);
    setReviewNotes("");
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setPriorityFilter("all");
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
      <div>
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <ShoppingCart className="h-8 w-8" />
          طلبات الشراء
        </h2>
        <p className="text-muted-foreground mt-1">
          إدارة طلبات الشراء المقدمة من الموظفين
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الطلبات</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">طلب شراء</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">قيد الانتظار</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">طلب</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">موافق عليه</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.approved}</div>
            <p className="text-xs text-muted-foreground">طلب</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مكتمل</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">طلب</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مرفوض</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            <p className="text-xs text-muted-foreground">طلب</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>البحث والتصفية</CardTitle>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              <Filter className="h-4 w-4 ml-2" />
              مسح الفلاتر
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ابحث برقم الطلب، اسم الموظف، الشعبة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="حالة الطلب" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="pending">قيد الانتظار</SelectItem>
                <SelectItem value="approved">موافق عليه</SelectItem>
                <SelectItem value="rejected">مرفوض</SelectItem>
                <SelectItem value="completed">مكتمل</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="الأولوية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأولويات</SelectItem>
                <SelectItem value="ضروري">ضروري</SelectItem>
                <SelectItem value="عاجل">عاجل</SelectItem>
                <SelectItem value="عادي">عادي</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة طلبات الشراء</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md overflow-x-auto">
            <Table dir="rtl">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">رقم الطلب</TableHead>
                  <TableHead className="text-right">اسم الموظف</TableHead>
                  <TableHead className="text-right">الشعبة</TableHead>
                  <TableHead className="text-right">تاريخ التقديم</TableHead>
                  <TableHead className="text-right">التاريخ المطلوب</TableHead>
                  <TableHead className="text-right">عدد المواد</TableHead>
                  <TableHead className="text-right">التكلفة المقدرة</TableHead>
                  <TableHead className="text-right">الأولوية</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      className="text-center text-muted-foreground h-24"
                    >
                      لا توجد طلبات مطابقة للفلاتر المحددة
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow
                      key={order.id}
                      className={selectedOrder?.id === order.id ? "bg-muted/50" : ""}
                    >
                      <TableCell className="text-right font-mono font-medium">
                        {order.orderNumber}
                      </TableCell>
                      <TableCell className="text-right">
                        <div>
                          <div className="font-medium">{order.employeeName}</div>
                          <div className="text-xs text-muted-foreground">
                            {order.employeePosition}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div>
                          <div>{order.divisionName}</div>
                          {order.unit && (
                            <div className="text-xs text-muted-foreground">
                              {order.unit}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{order.submittedDate}</TableCell>
                      <TableCell className="text-right">{order.requiredDate}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline">{order.items.length} مادة</Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {order.totalEstimatedCost.toLocaleString()} IQD
                      </TableCell>
                      <TableCell className="text-right">
                        {getPriorityBadge(order.priority)}
                      </TableCell>
                      <TableCell className="text-right">
                        {getStatusBadge(order.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewDetails(order)}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          {order.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-green-600 hover:text-green-700"
                                onClick={() => handleReview(order, "approve")}
                              >
                                <CheckCircle className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleReview(order, "reject")}
                              >
                                <XCircle className="h-3 w-3" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reviewAction === "approve" ? "الموافقة على" : "رفض"} طلب الشراء
            </DialogTitle>
            <DialogDescription>
              {selectedOrder && `طلب رقم: ${selectedOrder.orderNumber}`}
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
