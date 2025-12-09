"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Users,
  Search,
  FileText,
  Download,
  Filter,
  UserCircle,
  Package,
  AlertCircle,
  Calendar,
  CheckCircle2,
  ArrowRightLeft,
  Building2,
  UserPlus,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";

type CustodyRecord = {
  id: string;
  assetName: string;
  assetCode: string;
  employeeName: string;
  employeeId: string;
  department: string;
  assignDate: string;
  returnDate?: string;
  status: "active" | "returned";
  condition: "excellent" | "good" | "fair" | "poor";
  notes?: string;
};

// Mock data for departments and employees
const departments = [
  "قسم تقنية المعلومات",
  "قسم المحاسبة",
  "قسم الإعلام",
  "قسم التدريب",
  "قسم الشؤون الإدارية",
  "قسم الموارد البشرية",
  "قسم الهندسة",
  "قسم المبيعات",
];

const employees = [
  { id: "EMP-001", name: "أحمد محمد علي", department: "قسم تقنية المعلومات" },
  { id: "EMP-002", name: "فاطمة حسن", department: "قسم المحاسبة" },
  { id: "EMP-003", name: "محمد خالد", department: "قسم الإعلام" },
  { id: "EMP-004", name: "سارة أحمد", department: "قسم التدريب" },
  { id: "EMP-005", name: "علي حسين", department: "قسم الشؤون الإدارية" },
  { id: "EMP-006", name: "نورا أحمد", department: "قسم الموارد البشرية" },
  { id: "EMP-007", name: "خالد إبراهيم", department: "قسم الهندسة" },
  { id: "EMP-008", name: "مريم سعيد", department: "قسم المبيعات" },
];

const mockCustodyRecords: CustodyRecord[] = [
  {
    id: "1",
    assetName: "جهاز حاسوب محمول Dell",
    assetCode: "BC-001-2024",
    employeeName: "أحمد محمد علي",
    employeeId: "EMP-001",
    department: "قسم تقنية المعلومات",
    assignDate: "2024-01-15",
    status: "active",
    condition: "excellent",
    notes: "تم التسليم بحالة ممتازة",
  },
  {
    id: "2",
    assetName: "طابعة ليزر HP",
    assetCode: "BC-002-2024",
    employeeName: "فاطمة حسن",
    employeeId: "EMP-002",
    department: "قسم المحاسبة",
    assignDate: "2024-02-10",
    status: "active",
    condition: "good",
  },
  {
    id: "3",
    assetName: "كاميرا رقمية Canon",
    assetCode: "BC-003-2024",
    employeeName: "محمد خالد",
    employeeId: "EMP-003",
    department: "قسم الإعلام",
    assignDate: "2024-01-20",
    returnDate: "2024-03-15",
    status: "returned",
    condition: "good",
    notes: "تم الإرجاع بنفس الحالة",
  },
  {
    id: "4",
    assetName: "جهاز عرض Projector",
    assetCode: "BC-004-2024",
    employeeName: "سارة أحمد",
    employeeId: "EMP-004",
    department: "قسم التدريب",
    assignDate: "2024-03-01",
    status: "active",
    condition: "excellent",
  },
];

const CustodyPage = () => {
  const [records, setRecords] = useState<CustodyRecord[]>(mockCustodyRecords);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "returned"
  >("all");
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  const [selectedRecord, setSelectedRecord] = useState<CustodyRecord | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false);
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [returnNotes, setReturnNotes] = useState("");
  const [transferNotes, setTransferNotes] = useState("");
  const [transferDepartment, setTransferDepartment] = useState<
    string | undefined
  >(undefined);
  const [transferEmployee, setTransferEmployee] = useState<string | undefined>(
    undefined
  );

  const recordDepartments = Array.from(
    new Set(records.map((r) => r.department))
  );
  const filteredEmployees = transferDepartment
    ? employees.filter((emp) => emp.department === transferDepartment)
    : employees;

  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.assetName.includes(searchTerm) ||
      record.employeeName.includes(searchTerm) ||
      record.assetCode.includes(searchTerm) ||
      record.employeeId.includes(searchTerm);
    const matchesStatus =
      filterStatus === "all" || record.status === filterStatus;
    const matchesDepartment =
      filterDepartment === "all" || record.department === filterDepartment;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const handleViewDetails = (record: CustodyRecord) => {
    setSelectedRecord(record);
    setIsDialogOpen(true);
  };

  const handleReturnAsset = (record: CustodyRecord) => {
    setSelectedRecord(record);
    setReturnNotes("");
    setIsReturnDialogOpen(true);
  };

  const handleTransferAsset = (record: CustodyRecord) => {
    setSelectedRecord(record);
    setTransferDepartment(undefined);
    setTransferEmployee(undefined);
    setTransferNotes("");
    setIsTransferDialogOpen(true);
  };

  const handleConfirmReturn = () => {
    if (selectedRecord) {
      setRecords(
        records.map((record) =>
          record.id === selectedRecord.id
            ? {
                ...record,
                status: "returned" as const,
                returnDate: new Date().toISOString().split("T")[0],
                notes: returnNotes || record.notes,
              }
            : record
        )
      );
      setIsReturnDialogOpen(false);
      setSelectedRecord(null);
      setReturnNotes("");
    }
  };

  const handleConfirmTransfer = () => {
    if (selectedRecord && transferDepartment && transferEmployee) {
      const selectedEmployee = employees.find(
        (emp) => emp.id === transferEmployee
      );
      if (selectedEmployee) {
        setRecords(
          records.map((record) =>
            record.id === selectedRecord.id
              ? {
                  ...record,
                  employeeName: selectedEmployee.name,
                  employeeId: selectedEmployee.id,
                  department: selectedEmployee.department,
                  assignDate: new Date().toISOString().split("T")[0],
                  notes: transferNotes
                    ? `${
                        record.notes ? record.notes + " | " : ""
                      }تم التحويل إلى ${
                        selectedEmployee.name
                      }: ${transferNotes}`
                    : (record.notes || "") +
                      ` تم التحويل إلى ${selectedEmployee.name}`,
                }
              : record
          )
        );
      }
      setIsTransferDialogOpen(false);
      setSelectedRecord(null);
      setTransferDepartment(undefined);
      setTransferEmployee(undefined);
      setTransferNotes("");
    }
  };

  const stats = {
    total: records.length,
    active: records.filter((r) => r.status === "active").length,
    returned: records.filter((r) => r.status === "returned").length,
    employees: new Set(
      records.filter((r) => r.status === "active").map((r) => r.employeeId)
    ).size,
  };

  const getConditionBadge = (condition: string) => {
    const variants: Record<
      string,
      {
        variant: "default" | "secondary" | "destructive" | "outline";
        label: string;
      }
    > = {
      excellent: { variant: "default", label: "ممتاز" },
      good: { variant: "secondary", label: "جيد" },
      fair: { variant: "outline", label: "مقبول" },
      poor: { variant: "destructive", label: "سيء" },
    };
    return variants[condition] || variants.good;
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              إجمالي السجلات
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">جميع سجلات الذمة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">قيد الذمة</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.active}
            </div>
            <p className="text-xs text-muted-foreground">موجودات نشطة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">مرتجعة</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.returned}
            </div>
            <p className="text-xs text-muted-foreground">تم الإرجاع</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">الموظفين</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {stats.employees}
            </div>
            <p className="text-xs text-muted-foreground">لديهم موجودات</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              سجلات ذمة الموجودات الثابتة
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline">
                <FileText className="ml-2 h-4 w-4" />
                تقرير الذمة
              </Button>
              <Button variant="outline">
                <Download className="ml-2 h-4 w-4" />
                تصدير
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث (موجود، موظف، رمز)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            <Select
              value={filterStatus}
              onValueChange={(value: "all" | "active" | "returned") =>
                setFilterStatus(value)
              }
            >
              <SelectTrigger>
                <Filter className="ml-2 h-4 w-4" />
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="active">قيد الذمة</SelectItem>
                <SelectItem value="returned">مرتجعة</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filterDepartment}
              onValueChange={setFilterDepartment}
            >
              <SelectTrigger>
                <SelectValue placeholder="القسم" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأقسام</SelectItem>
                {recordDepartments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="border rounded-lg">
            <Table dir="rtl">
              {" "}
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">اسم الموجود</TableHead>
                  <TableHead className="text-right">رمز الموجود</TableHead>
                  <TableHead className="text-right">اسم الموظف</TableHead>
                  <TableHead className="text-right">القسم</TableHead>
                  <TableHead className="text-right">تاريخ التسليم</TableHead>
                  <TableHead className="text-right">تاريخ الإرجاع</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">الوضع</TableHead>
                  <TableHead className="text-center">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center py-8 text-muted-foreground"
                    >
                      لا توجد نتائج
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRecords.map((record) => {
                    const conditionBadge = getConditionBadge(record.condition);
                    return (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">
                          {record.assetName}
                        </TableCell>
                        <TableCell>
                          <code className="px-2 py-1 bg-muted rounded text-sm">
                            {record.assetCode}
                          </code>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <UserCircle className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium">
                                {record.employeeName}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {record.employeeId}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{record.department}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            {record.assignDate}
                          </div>
                        </TableCell>
                        <TableCell>
                          {record.returnDate ? (
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              {record.returnDate}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              -
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={conditionBadge.variant}>
                            {conditionBadge.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              record.status === "active"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {record.status === "active" ? "قيد الذمة" : "مرتجع"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewDetails(record)}
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                            {record.status === "active" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleTransferAsset(record)}
                                  className="flex items-center gap-1"
                                >
                                  <ArrowRightLeft className="h-4 w-4" />
                                  تحويل
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleReturnAsset(record)}
                                >
                                  إرجاع
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>تفاصيل سجل الذمة</DialogTitle>
          </DialogHeader>
          {selectedRecord && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">اسم الموجود</Label>
                  <div className="font-medium">{selectedRecord.assetName}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">رمز الموجود</Label>
                  <code className="px-2 py-1 bg-muted rounded text-sm">
                    {selectedRecord.assetCode}
                  </code>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">اسم الموظف</Label>
                  <div className="font-medium">
                    {selectedRecord.employeeName}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">الرقم الوظيفي</Label>
                  <div className="font-medium">{selectedRecord.employeeId}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">القسم</Label>
                  <div className="font-medium">{selectedRecord.department}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">تاريخ التسليم</Label>
                  <div className="font-medium">{selectedRecord.assignDate}</div>
                </div>
                {selectedRecord.returnDate && (
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">
                      تاريخ الإرجاع
                    </Label>
                    <div className="font-medium">
                      {selectedRecord.returnDate}
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <Label className="text-muted-foreground">الحالة</Label>
                  <div>
                    <Badge
                      variant={
                        getConditionBadge(selectedRecord.condition).variant
                      }
                    >
                      {getConditionBadge(selectedRecord.condition).label}
                    </Badge>
                  </div>
                </div>
              </div>
              {selectedRecord.notes && (
                <div className="space-y-2">
                  <Label className="text-muted-foreground">ملاحظات</Label>
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{selectedRecord.notes}</AlertDescription>
                  </Alert>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)}>إغلاق</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Return Asset Dialog */}
      <Dialog open={isReturnDialogOpen} onOpenChange={setIsReturnDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إرجاع موجود</DialogTitle>
          </DialogHeader>
          {selectedRecord && (
            <div className="space-y-4 py-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  سيتم تسجيل إرجاع الموجود{" "}
                  <strong>{selectedRecord.assetName}</strong> من الموظف{" "}
                  <strong>{selectedRecord.employeeName}</strong>
                </AlertDescription>
              </Alert>
              <div className="space-y-2">
                <Label>ملاحظات الإرجاع</Label>
                <Textarea
                  value={returnNotes}
                  onChange={(e) => setReturnNotes(e.target.value)}
                  placeholder="أدخل أي ملاحظات حول حالة الموجود عند الإرجاع..."
                  rows={4}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsReturnDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button onClick={handleConfirmReturn}>تأكيد الإرجاع</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transfer Asset Dialog */}
      <Dialog
        open={isTransferDialogOpen}
        onOpenChange={setIsTransferDialogOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowRightLeft className="h-5 w-5" />
              تحويل الذمة
            </DialogTitle>
          </DialogHeader>
          {selectedRecord && (
            <div className="space-y-4 py-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  سيتم تحويل ذمة الموجود{" "}
                  <strong>{selectedRecord.assetName}</strong> من الموظف{" "}
                  <strong>{selectedRecord.employeeName}</strong>
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  القسم الجديد
                </Label>
                <Select
                  value={transferDepartment}
                  onValueChange={setTransferDepartment}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر القسم الجديد..." />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  الموظف الجديد
                </Label>
                <Select
                  value={transferEmployee}
                  onValueChange={setTransferEmployee}
                  disabled={!transferDepartment}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الموظف الجديد..." />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredEmployees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>ملاحظات التحويل</Label>
                <Textarea
                  value={transferNotes}
                  onChange={(e) => setTransferNotes(e.target.value)}
                  placeholder="أدخل سبب التحويل أو أي ملاحظات إضافية..."
                  rows={3}
                />
              </div>

              {/* Current Assignment Info */}
              <div className="border-t pt-4">
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>
                    الموظف الحالي:{" "}
                    <span className="font-medium text-foreground">
                      {selectedRecord.employeeName}
                    </span>
                  </div>
                  <div>
                    القسم الحالي:{" "}
                    <span className="font-medium text-foreground">
                      {selectedRecord.department}
                    </span>
                  </div>
                  <div>
                    تاريخ التسليم:{" "}
                    <span className="font-medium text-foreground">
                      {selectedRecord.assignDate}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsTransferDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button
              onClick={handleConfirmTransfer}
              disabled={!transferDepartment || !transferEmployee}
            >
              تأكيد التحويل
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustodyPage;
