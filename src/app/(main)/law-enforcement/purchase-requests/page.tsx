"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  User,
  Calendar,
  Check,
  ChevronsUpDown,
  PlusCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

// Employee interface
interface Employee {
  id: string;
  name: string;
  position: string;
  divisionId: string;
  divisionName: string;
  unit?: string;
  phone?: string;
}

// Mock employees data
const MOCK_EMPLOYEES: Employee[] = [
  {
    id: "EMP001",
    name: "أحمد محمد علي",
    position: "مدير التخطيط",
    divisionId: "div1",
    divisionName: "شعبة التخطيط",
    unit: "وحدة التخطيط الاستراتيجي",
    phone: "07701234567",
  },
  {
    id: "EMP002",
    name: "سارة علي حسن",
    position: "مسؤولة المتابعة",
    divisionId: "div2",
    divisionName: "شعبة المتابعة",
    phone: "07709876543",
  },
  {
    id: "EMP003",
    name: "محمد حسن جاسم",
    position: "محاسب",
    divisionId: "div3",
    divisionName: "شعبة الحسابات",
    unit: "وحدة المحاسبة المالية",
    phone: "07705551234",
  },
  {
    id: "EMP004",
    name: "فاطمة أحمد",
    position: "موظفة موارد بشرية",
    divisionId: "div4",
    divisionName: "شعبة الموارد البشرية",
    phone: "07708889999",
  },
];

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
  const [submittedRequests, setSubmittedRequests] = useState(
    MOCK_SUBMITTED_REQUESTS
  );
  const [employeeComboboxOpen, setEmployeeComboboxOpen] = useState(false);

  // Form state
  const [employeeId, setEmployeeId] = useState("");
  const [requiredDate, setRequiredDate] = useState("");
  const [priority, setPriority] = useState<"عادي" | "عاجل" | "ضروري" | "">("");
  const [justification, setJustification] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<PurchaseRequestItem[]>([]);

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        itemName: "",
        itemType: "",
        quantity: 1,
        unit: "",
        estimatedPrice: 0,
        notes: "",
      },
    ]);
  };

  const handleItemChange = <K extends keyof PurchaseRequestItem>(
    index: number,
    field: K,
    value: PurchaseRequestItem[K]
  ) => {
    setItems((prevItems) => {
      const newItems = [...prevItems];
      newItems[index] = { ...newItems[index], [field]: value };
      return newItems;
    });
  };

  const handleRemoveItem = (index: number) => {
    setItems((prevItems) => prevItems.filter((_, i) => i !== index));
    toast.success("تم حذف المادة");
  };

  const handleSubmitRequest = () => {
    // Validation
    if (!employeeId || !requiredDate || !priority) {
      toast.error("الرجاء إدخال جميع البيانات المطلوبة");
      return;
    }

    if (items.length === 0) {
      toast.error("الرجاء إضافة مادة واحدة على الأقل");
      return;
    }

    // Validate items
    const invalidItems = items.filter(
      (item) => !item.itemName || !item.itemType || item.quantity <= 0
    );
    if (invalidItems.length > 0) {
      toast.error("الرجاء إكمال بيانات جميع المواد");
      return;
    }

    if (!justification) {
      toast.error("الرجاء إدخال مبررات الطلب");
      return;
    }

    // Calculate total cost
    const totalCost = items.reduce(
      (sum, item) => sum + item.estimatedPrice * item.quantity,
      0
    );

    // Create new request
    const newRequest = {
      id: Date.now().toString(),
      orderNumber: `PR-2024-${String(submittedRequests.length + 1).padStart(
        3,
        "0"
      )}`,
      submittedDate: new Date().toISOString().split("T")[0],
      itemsCount: items.length,
      status: "pending" as const,
      totalCost,
    };

    setSubmittedRequests([newRequest, ...submittedRequests]);

    // Reset form
    setEmployeeId("");
    setRequiredDate("");
    setPriority("");
    setJustification("");
    setNotes("");
    setItems([]);

    toast.success("تم إرسال طلب الشراء بنجاح");
  };

  const calculateTotal = () => {
    return items.reduce(
      (sum, item) => sum + item.estimatedPrice * item.quantity,
      0
    );
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

  const selectedEmployee = MOCK_EMPLOYEES.find((emp) => emp.id === employeeId);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <ShoppingCart className="h-8 w-8" />
          إنشاء طلب شراء جديد
        </h2>
        <p className="text-muted-foreground mt-1">
          قم بتعبئة جميع البيانات المطلوبة لإنشاء طلب شراء جديد
        </p>
      </div>

      {/* Create Request Form */}
      <div className="space-y-6">
        {/* Employee Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              معلومات الموظف
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Employee Search and Selection (Combobox) */}
            <div className="space-y-2">
              <Label>
                الموظف <span className="text-red-500">*</span>
              </Label>
              <Popover
                open={employeeComboboxOpen}
                onOpenChange={setEmployeeComboboxOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={employeeComboboxOpen}
                    className="w-full justify-between"
                  >
                    {employeeId
                      ? MOCK_EMPLOYEES.find((emp) => emp.id === employeeId)
                          ?.name
                      : "ابحث واختر الموظف..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput
                      placeholder="ابحث عن موظف..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>لا يوجد موظفين مطابقين للبحث</CommandEmpty>
                      <CommandGroup>
                        {MOCK_EMPLOYEES.map((emp) => (
                          <CommandItem
                            key={emp.id}
                            value={`${emp.name} ${emp.position} ${emp.divisionName} ${emp.id}`}
                            onSelect={() => {
                              setEmployeeId(emp.id);
                              setEmployeeComboboxOpen(false);
                            }}
                          >
                            <div className="flex flex-col items-start flex-1">
                              <span className="font-medium">{emp.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {emp.position} - {emp.divisionName}
                              </span>
                            </div>
                            <Check
                              className={cn(
                                "ml-2 h-4 w-4",
                                employeeId === emp.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Display selected employee details */}
            {selectedEmployee && (
              <Card className="bg-muted/50">
                <CardContent className="pt-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        الاسم
                      </Label>
                      <p className="font-medium">{selectedEmployee.name}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        المنصب
                      </Label>
                      <p className="font-medium">{selectedEmployee.position}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        الشعبة
                      </Label>
                      <p className="font-medium">
                        {selectedEmployee.divisionName}
                      </p>
                    </div>
                    {selectedEmployee.unit && (
                      <div>
                        <Label className="text-xs text-muted-foreground">
                          الوحدة
                        </Label>
                        <p className="font-medium">{selectedEmployee.unit}</p>
                      </div>
                    )}
                    {selectedEmployee.phone && (
                      <div>
                        <Label className="text-xs text-muted-foreground">
                          رقم الهاتف
                        </Label>
                        <p className="font-medium font-mono">
                          {selectedEmployee.phone}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Request Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              تفاصيل الطلب
            </CardTitle>
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
                <Select
                  value={priority}
                  onValueChange={(value: any) => setPriority(value)}
                >
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

        {/* Items Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              المواد المطلوبة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border rounded-md overflow-x-auto">
              <Table dir="rtl">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right min-w-[200px]">
                      اسم المادة
                    </TableHead>
                    <TableHead className="text-right min-w-[120px]">
                      النوع
                    </TableHead>
                    <TableHead className="text-right min-w-[100px]">
                      الكمية
                    </TableHead>
                    <TableHead className="text-right min-w-[100px]">
                      الوحدة
                    </TableHead>
                    <TableHead className="text-right min-w-[120px]">
                      السعر المقدر
                    </TableHead>
                    <TableHead className="text-right min-w-[120px]">
                      الإجمالي
                    </TableHead>
                    <TableHead className="text-right min-w-[150px]">
                      ملاحظات
                    </TableHead>
                    <TableHead className="text-right min-w-[80px]">
                      إجراء
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center text-muted-foreground h-24"
                      >
                        لا توجد مواد مضافة. انقر على &quot;إضافة سطر&quot; للبدء
                      </TableCell>
                    </TableRow>
                  ) : (
                    items.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell className="text-right min-w-[200px]">
                          <Input
                            value={item.itemName}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "itemName",
                                e.target.value
                              )
                            }
                            placeholder="أدخل اسم المادة"
                            className="text-right"
                          />
                        </TableCell>
                        <TableCell className="text-right min-w-[120px]">
                          <Select
                            value={item.itemType}
                            onValueChange={(value: any) =>
                              handleItemChange(index, "itemType", value)
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
                        </TableCell>
                        <TableCell className="text-right min-w-[100px]">
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "quantity",
                                Number(e.target.value)
                              )
                            }
                            placeholder="الكمية"
                            className="w-full text-right"
                            min="1"
                          />
                        </TableCell>
                        <TableCell className="text-right min-w-[100px]">
                          <Input
                            value={item.unit}
                            onChange={(e) =>
                              handleItemChange(index, "unit", e.target.value)
                            }
                            placeholder="الوحدة"
                            className="w-full text-right"
                          />
                        </TableCell>
                        <TableCell className="text-right min-w-[120px]">
                          <Input
                            type="number"
                            value={item.estimatedPrice}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "estimatedPrice",
                                Number(e.target.value)
                              )
                            }
                            placeholder="السعر"
                            className="w-full text-right"
                            min="0"
                            step="0.01"
                          />
                        </TableCell>
                        <TableCell className="text-right min-w-[120px]">
                          <div className="font-semibold text-primary">
                            {(
                              item.quantity * item.estimatedPrice
                            ).toLocaleString()}{" "}
                            IQD
                          </div>
                        </TableCell>
                        <TableCell className="text-right min-w-[150px]">
                          <Input
                            value={item.notes}
                            onChange={(e) =>
                              handleItemChange(index, "notes", e.target.value)
                            }
                            placeholder="ملاحظات..."
                            className="w-full text-right"
                          />
                        </TableCell>
                        <TableCell className="text-right min-w-[80px]">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveItem(index)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              <div className="p-2 flex justify-start">
                <Button variant="outline" size="sm" onClick={handleAddItem}>
                  <PlusCircle className="ml-2 h-4 w-4" /> إضافة سطر
                </Button>
              </div>
            </div>

            {/* Total */}
            {items.length > 0 && (
              <div className="space-y-3 p-4 bg-muted rounded-md">
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-lg font-bold">التكلفة الإجمالية:</span>
                  <span className="text-2xl font-bold text-primary">
                    {calculateTotal().toLocaleString()} IQD
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-3">
          <Button onClick={handleSubmitRequest} size="lg">
            <Send className="h-4 w-4 ml-2" />
            إرسال الطلب
          </Button>
        </div>
      </div>
    </div>
  );
}
