"use client";

import { useState } from "react";
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
  Plus,
  Trash2,
  Send,
  FileText,
  Package,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  ShoppingCart,
} from "lucide-react";

// Purchase Request Item interface
interface PurchaseRequestItem {
  id: string;
  itemName: string;
  itemType: "ثابت" | "استهلاكي" | "";
  quantity: number;
  unit: string;
  estimatedPrice: number;
  notes: string;
}

// Purchase Request interface
interface PurchaseRequest {
  id: string;
  orderNumber: string;
  employeeName: string;
  employeePosition: string;
  divisionName: string;
  unit: string;
  requiredDate: string;
  priority: "عادي" | "عاجل" | "ضروري" | "";
  items: PurchaseRequestItem[];
  justification: string;
  notes: string;
  status: "draft" | "submitted";
}

// Mock submitted requests for display
const MOCK_SUBMITTED_REQUESTS = [
  {
    id: "1",
    orderNumber: "PR-2024-001",
    submittedDate: "2024-01-20",
    itemsCount: 3,
    status: "pending",
    totalCost: 250000,
  },
  {
    id: "2",
    orderNumber: "PR-2024-002",
    submittedDate: "2024-01-18",
    itemsCount: 5,
    status: "approved",
    totalCost: 450000,
  },
  {
    id: "3",
    orderNumber: "PR-2024-003",
    submittedDate: "2024-01-15",
    itemsCount: 2,
    status: "rejected",
    totalCost: 180000,
  },
];

export default function PurchaseRequestsPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [submittedRequests, setSubmittedRequests] = useState(MOCK_SUBMITTED_REQUESTS);

  // Form state
  const [employeeName, setEmployeeName] = useState("");
  const [employeePosition, setEmployeePosition] = useState("");
  const [divisionName, setDivisionName] = useState("");
  const [unit, setUnit] = useState("");
  const [requiredDate, setRequiredDate] = useState("");
  const [priority, setPriority] = useState<"عادي" | "عاجل" | "ضروري" | "">("");
  const [justification, setJustification] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<PurchaseRequestItem[]>([]);

  // Current item being added
  const [currentItem, setCurrentItem] = useState<PurchaseRequestItem>({
    id: "",
    itemName: "",
    itemType: "",
    quantity: 0,
    unit: "",
    estimatedPrice: 0,
    notes: "",
  });

  const handleAddItem = () => {
    if (!currentItem.itemName || !currentItem.itemType || currentItem.quantity <= 0) {
      toast.error("الرجاء إدخال جميع البيانات المطلوبة للمادة");
      return;
    }

    const newItem = {
      ...currentItem,
      id: Date.now().toString(),
    };

    setItems([...items, newItem]);
    setCurrentItem({
      id: "",
      itemName: "",
      itemType: "",
      quantity: 0,
      unit: "",
      estimatedPrice: 0,
      notes: "",
    });
    toast.success("تمت إضافة المادة بنجاح");
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
    toast.success("تم حذف المادة");
  };

  const handleSubmitRequest = () => {
    // Validation
    if (!employeeName || !employeePosition || !divisionName || !requiredDate || !priority) {
      toast.error("الرجاء إدخال جميع البيانات المطلوبة");
      return;
    }

    if (items.length === 0) {
      toast.error("الرجاء إضافة مادة واحدة على الأقل");
      return;
    }

    if (!justification) {
      toast.error("الرجاء إدخال مبررات الطلب");
      return;
    }

    // Calculate total cost
    const totalCost = items.reduce((sum, item) => sum + item.estimatedPrice * item.quantity, 0);

    // Create new request
    const newRequest = {
      id: Date.now().toString(),
      orderNumber: `PR-2024-${String(submittedRequests.length + 1).padStart(3, "0")}`,
      submittedDate: new Date().toISOString().split("T")[0],
      itemsCount: items.length,
      status: "pending" as const,
      totalCost,
    };

    setSubmittedRequests([newRequest, ...submittedRequests]);

    // Reset form
    setEmployeeName("");
    setEmployeePosition("");
    setDivisionName("");
    setUnit("");
    setRequiredDate("");
    setPriority("");
    setJustification("");
    setNotes("");
    setItems([]);
    setShowCreateDialog(false);

    toast.success("تم إرسال طلب الشراء بنجاح");
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.estimatedPrice * item.quantity, 0);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20">
            <Clock className="h-3 w-3 ml-1" />
            قيد المراجعة
          </Badge>
        );
      case "approved":
        return (
          <Badge className="bg-green-500/10 text-green-700 hover:bg-green-500/20">
            <CheckCircle className="h-3 w-3 ml-1" />
            موافق عليه
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-500/10 text-red-700 hover:bg-red-500/20">
            <AlertCircle className="h-3 w-3 ml-1" />
            مرفوض
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <ShoppingCart className="h-8 w-8" />
            طلبات الشراء
          </h2>
          <p className="text-muted-foreground mt-1">
            إنشاء وإدارة طلبات الشراء الخاصة بك
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} size="lg">
          <Plus className="h-4 w-4 ml-2" />
          طلب شراء جديد
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الطلبات</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{submittedRequests.length}</div>
            <p className="text-xs text-muted-foreground">طلب</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">قيد المراجعة</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {submittedRequests.filter((r) => r.status === "pending").length}
            </div>
            <p className="text-xs text-muted-foreground">طلب</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">موافق عليه</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {submittedRequests.filter((r) => r.status === "approved").length}
            </div>
            <p className="text-xs text-muted-foreground">طلب</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مرفوض</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {submittedRequests.filter((r) => r.status === "rejected").length}
            </div>
            <p className="text-xs text-muted-foreground">طلب</p>
          </CardContent>
        </Card>
      </div>

      {/* Submitted Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>طلباتي السابقة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md overflow-x-auto">
            <Table dir="rtl">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">رقم الطلب</TableHead>
                  <TableHead className="text-right">تاريخ الإرسال</TableHead>
                  <TableHead className="text-right">عدد المواد</TableHead>
                  <TableHead className="text-right">التكلفة المقدرة</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submittedRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground h-24">
                      لم تقم بإرسال أي طلبات بعد
                    </TableCell>
                  </TableRow>
                ) : (
                  submittedRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="text-right font-mono font-medium">
                        {request.orderNumber}
                      </TableCell>
                      <TableCell className="text-right">{request.submittedDate}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline">{request.itemsCount} مادة</Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {request.totalCost.toLocaleString()} IQD
                      </TableCell>
                      <TableCell className="text-right">
                        {getStatusBadge(request.status)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create Request Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              طلب شراء جديد
            </DialogTitle>
            <DialogDescription>
              قم بتعبئة جميع البيانات المطلوبة لإنشاء طلب شراء جديد
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Employee Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">معلومات الموظف</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="employeeName">
                      اسم الموظف <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="employeeName"
                      placeholder="أدخل اسم الموظف الثلاثي"
                      value={employeeName}
                      onChange={(e) => setEmployeeName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employeePosition">
                      المنصب <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="employeePosition"
                      placeholder="أدخل منصب الموظف"
                      value={employeePosition}
                      onChange={(e) => setEmployeePosition(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="divisionName">
                      الشعبة <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="divisionName"
                      placeholder="أدخل اسم الشعبة"
                      value={divisionName}
                      onChange={(e) => setDivisionName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="unit">الوحدة (اختياري)</Label>
                    <Input
                      id="unit"
                      placeholder="أدخل اسم الوحدة"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Request Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">تفاصيل الطلب</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="requiredDate">
                      التاريخ المطلوب <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="requiredDate"
                      type="date"
                      value={requiredDate}
                      onChange={(e) => setRequiredDate(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">
                      الأولوية <span className="text-red-500">*</span>
                    </Label>
                    <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الأولوية" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="عادي">عادي</SelectItem>
                        <SelectItem value="عاجل">عاجل</SelectItem>
                        <SelectItem value="ضروري">ضروري</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="justification">
                      مبررات الطلب <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="justification"
                      placeholder="أدخل مبررات وأسباب طلب الشراء..."
                      value={justification}
                      onChange={(e) => setJustification(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="notes">ملاحظات إضافية (اختياري)</Label>
                    <Textarea
                      id="notes"
                      placeholder="أي ملاحظات إضافية..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Add Items Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  إضافة المواد
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="itemName">اسم المادة</Label>
                    <Input
                      id="itemName"
                      placeholder="أدخل اسم المادة"
                      value={currentItem.itemName}
                      onChange={(e) =>
                        setCurrentItem({ ...currentItem, itemName: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="itemType">نوع المادة</Label>
                    <Select
                      value={currentItem.itemType}
                      onValueChange={(value: any) =>
                        setCurrentItem({ ...currentItem, itemType: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر النوع" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ثابت">ثابت</SelectItem>
                        <SelectItem value="استهلاكي">استهلاكي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity">الكمية</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      placeholder="0"
                      value={currentItem.quantity || ""}
                      onChange={(e) =>
                        setCurrentItem({
                          ...currentItem,
                          quantity: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="unit">وحدة القياس</Label>
                    <Input
                      id="unit"
                      placeholder="قطعة، كرتون، حزمة..."
                      value={currentItem.unit}
                      onChange={(e) =>
                        setCurrentItem({ ...currentItem, unit: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="estimatedPrice">السعر المقدر (للوحدة)</Label>
                    <Input
                      id="estimatedPrice"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={currentItem.estimatedPrice || ""}
                      onChange={(e) =>
                        setCurrentItem({
                          ...currentItem,
                          estimatedPrice: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="itemNotes">ملاحظات</Label>
                    <Input
                      id="itemNotes"
                      placeholder="ملاحظات عن المادة..."
                      value={currentItem.notes}
                      onChange={(e) =>
                        setCurrentItem({ ...currentItem, notes: e.target.value })
                      }
                    />
                  </div>
                </div>

                <Button onClick={handleAddItem} className="w-full" variant="outline">
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة المادة
                </Button>
              </CardContent>
            </Card>

            {/* Items List */}
            {items.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">المواد المضافة ({items.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-md overflow-x-auto">
                    <Table dir="rtl">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-right">اسم المادة</TableHead>
                          <TableHead className="text-right">النوع</TableHead>
                          <TableHead className="text-right">الكمية</TableHead>
                          <TableHead className="text-right">السعر</TableHead>
                          <TableHead className="text-right">الإجمالي</TableHead>
                          <TableHead className="text-right">ملاحظات</TableHead>
                          <TableHead className="text-right">إجراء</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {items.map((item) => (
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
                              {item.estimatedPrice.toLocaleString()} IQD
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {(item.quantity * item.estimatedPrice).toLocaleString()} IQD
                            </TableCell>
                            <TableCell className="text-right text-sm">
                              {item.notes || "-"}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveItem(item.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
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
                        <DollarSign className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">التكلفة الإجمالية:</span>
                        <span className="text-xl font-bold">
                          {calculateTotal().toLocaleString()} IQD
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              إلغاء
            </Button>
            <Button onClick={handleSubmitRequest}>
              <Send className="h-4 w-4 ml-2" />
              إرسال الطلب
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
