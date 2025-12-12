"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
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
import {
  AlertCircle,
  ArrowRightLeft,
  Building2,
  Calendar,
  CheckCircle2,
  Download,
  FileText,
  Filter,
  GitBranch,
  Package,
  Search,
  UserCircle,
  UserPlus,
  Users,
  XCircle,
} from "lucide-react";
import { useState } from "react";

// Import shared data and types
import {
  assetCustodies,
  getAssetById
} from "@/lib/data/fixed-assets-data";
import { departments, divisions, units } from "@/lib/data/settings-data";
import { type AssetCustody } from "@/lib/types/fixed-assets";

// View model for custody records display
type CustodyRecordView = AssetCustody & {
  assetName: string;
  assetCode: string;
  assetCategory?: string;
};

// Convert custody data to view model
const custodyRecordsView: CustodyRecordView[] = assetCustodies.map(custody => {
  const asset = getAssetById(custody.assetId);
  return {
    ...custody,
    assetName: asset?.name || 'غير معروف',
    assetCode: asset?.assetCode || 'غير معروف',
    assetCategory: asset?.category
  };
});

const CustodyPage = () => {
  const [records, setRecords] = useState<CustodyRecordView[]>(custodyRecordsView);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "returned"
  >("all");
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  const [selectedRecord, setSelectedRecord] = useState<CustodyRecordView | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false);
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [isDropDialogOpen, setIsDropDialogOpen] = useState(false);
  const [returnNotes, setReturnNotes] = useState("");
  const [returnReceivedBy, setReturnReceivedBy] = useState("");
  const [transferNotes, setTransferNotes] = useState("");
  const [dropReason, setDropReason] = useState("");
  const [dropNotes, setDropNotes] = useState("");
  const [transferDepartment, setTransferDepartment] = useState<number | undefined>(undefined);
  const [transferDivision, setTransferDivision] = useState<number | undefined>(undefined);
  const [transferUnit, setTransferUnit] = useState<number | undefined>(undefined);
  const [transferEmployee, setTransferEmployee] = useState<string | undefined>(undefined);

  // Mock filtered employees for build fix
  const filteredEmployees: Array<{ id: string, name: string }> = [];

  const recordDepartments = Array.from(
    new Set(records.map((r) => r.department))
  );

  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.assetName.includes(searchTerm) ||
      record.employeeName.includes(searchTerm) ||
      record.assetCode.includes(searchTerm) ||
      record.custodyNumber.includes(searchTerm);
    const matchesStatus =
      filterStatus === "all" || record.status === filterStatus;
    const matchesDepartment =
      filterDepartment === "all" || record.department === filterDepartment;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const handleViewDetails = (record: CustodyRecordView) => {
    setSelectedRecord(record);
    setIsDialogOpen(true);
  };

  const handleReturnAsset = (record: CustodyRecordView) => {
    setSelectedRecord(record);
    setReturnNotes("");
    setReturnReceivedBy("");
    setIsReturnDialogOpen(true);
  };

  const handleTransferAsset = (record: CustodyRecordView) => {
    setSelectedRecord(record);
    setTransferDepartment(undefined);
    setTransferDivision(undefined);
    setTransferUnit(undefined);
    setTransferEmployee(undefined);
    setTransferNotes("");
    setIsTransferDialogOpen(true);
  };

  const handleConfirmReturn = () => {
    if (selectedRecord && returnReceivedBy.trim()) {
      const returnInfo = returnReceivedBy.trim()
        ? `استلم من قبل: ${returnReceivedBy}${returnNotes ? ' | ' + returnNotes : ''}`
        : returnNotes;

      setRecords(
        records.map((record) =>
          record.id === selectedRecord.id
            ? {
              ...record,
              status: "returned" as const,
              endDate: new Date(),
              returnNotes: returnInfo,
              notes: record.notes,
            }
            : record
        )
      );
      setIsReturnDialogOpen(false);
      setSelectedRecord(null);
      setReturnNotes("");
      setReturnReceivedBy("");
    }
  };

  const handleConfirmTransfer = () => {
    if (selectedRecord && transferDepartment && transferEmployee) {
      const dept = departments.find(d => d.id === transferDepartment);
      const div = divisions.find(d => d.id === transferDivision);
      const unit = units.find(u => u.id === transferUnit);

      setRecords(
        records.map((record) =>
          record.id === selectedRecord.id
            ? {
              ...record,
              employeeName: transferEmployee,
              department: dept?.name || record.department,
              division: div?.name,
              unit: unit?.name,
              notes: transferNotes
                ? `${record.notes ? record.notes + " | " : ""}تم التحويل: ${transferNotes}`
                : (record.notes || "تم التحويل"),
            }
            : record
        )
      );
      setIsTransferDialogOpen(false);
      setSelectedRecord(null);
      setTransferDepartment(undefined);
      setTransferDivision(undefined);
      setTransferUnit(undefined);
      setTransferEmployee(undefined);
      setTransferNotes("");
    }
  };

  const handleDropCustody = (record: CustodyRecordView) => {
    setSelectedRecord(record);
    setDropReason("");
    setDropNotes("");
    setIsDropDialogOpen(true);
  };

  const handleConfirmDrop = () => {
    if (selectedRecord && dropReason.trim()) {
      const dropInfo = `إسقاط الذمة - السبب: ${dropReason}${dropNotes ? ' | ' + dropNotes : ''}`;

      setRecords(
        records.map((record) =>
          record.id === selectedRecord.id
            ? {
              ...record,
              status: "returned" as const,
              endDate: new Date(),
              returnNotes: dropInfo,
              notes: record.notes,
            }
            : record
        )
      );
      setIsDropDialogOpen(false);
      setSelectedRecord(null);
      setDropReason("");
      setDropNotes("");
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
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">رمز الموجود</TableHead>
                  <TableHead className="text-right">رقم المستند</TableHead>
                  <TableHead className="text-right">اسم الموجود</TableHead>
                  <TableHead className="text-right">اسم الموظف</TableHead>
                  <TableHead className="text-right">القسم</TableHead>
                  <TableHead className="text-right">الشعبة</TableHead>
                  <TableHead className="text-right">الوحدة</TableHead>
                  <TableHead className="text-right">تاريخ البدء</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">الوضع</TableHead>
                  <TableHead className="text-center">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={11}
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
                        <TableCell>
                          <code className="px-2 py-1 bg-muted rounded text-sm">
                            {record.assetCode}
                          </code>
                        </TableCell>
                        <TableCell>
                          <code className="px-2 py-1 bg-muted rounded text-sm">
                            {record.custodyNumber}
                          </code>
                        </TableCell>
                        <TableCell className="font-medium">
                          {record.assetName}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <UserCircle className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium">
                                {record.employeeName}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {record.position}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{record.department}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {record.division || '-'}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {record.unit || '-'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            {record.startDate.toLocaleDateString("ar-IQ")}
                          </div>
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
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDropCustody(record)}
                                  className="text-red-600 hover:text-red-700 hover:border-red-300"
                                >
                                  <XCircle className="h-4 w-4" />
                                  إسقاط
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
                {selectedRecord.division && (
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">الشعبة</Label>
                    <div className="font-medium">{selectedRecord.division}</div>
                  </div>
                )}
                {selectedRecord.unit && (
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">الوحدة</Label>
                    <div className="font-medium">{selectedRecord.unit}</div>
                  </div>
                )}
                <div className="space-y-2">
                  <Label className="text-muted-foreground">تاريخ التسليم</Label>
                  <div className="font-medium">{selectedRecord.startDate.toLocaleDateString('ar-IQ')}</div>
                </div>
                {selectedRecord.endDate && (
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">
                      تاريخ الإرجاع
                    </Label>
                    <div className="font-medium">
                      {selectedRecord.endDate?.toLocaleDateString('ar-IQ')}
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              إرجاع موجود
            </DialogTitle>
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

              {/* Current Assignment Info */}
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <div className="text-sm">
                  <span className="text-muted-foreground">القسم:</span>
                  <span className="font-medium mr-2">{selectedRecord.department}</span>
                </div>
                {selectedRecord.division && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">الشعبة:</span>
                    <span className="font-medium mr-2">{selectedRecord.division}</span>
                  </div>
                )}
                {selectedRecord.unit && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">الوحدة:</span>
                    <span className="font-medium mr-2">{selectedRecord.unit}</span>
                  </div>
                )}
                <div className="text-sm">
                  <span className="text-muted-foreground">تاريخ التسليم:</span>
                  <span className="font-medium mr-2">
                    {selectedRecord.startDate.toLocaleDateString('ar-IQ')}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <UserCircle className="h-4 w-4" />
                  اسم الموظف المستلم *
                </Label>
                <Input
                  value={returnReceivedBy}
                  onChange={(e) => setReturnReceivedBy(e.target.value)}
                  placeholder="أدخل اسم الموظف الذي استلم الموجود..."
                  autoFocus
                />
              </div>

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
            <Button
              onClick={handleConfirmReturn}
              disabled={!returnReceivedBy.trim()}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle2 className="h-4 w-4 ml-2" />
              تأكيد الإرجاع
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Drop Custody Dialog */}
      <Dialog open={isDropDialogOpen} onOpenChange={setIsDropDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              إسقاط الذمة
            </DialogTitle>
          </DialogHeader>
          {selectedRecord && (
            <div className="space-y-4 py-4">
              <Alert className="border-red-200 bg-red-50 dark:bg-red-950/30">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800 dark:text-red-200">
                  سيتم إسقاط ذمة الموجود{" "}
                  <strong>{selectedRecord.assetName}</strong> من الموظف{" "}
                  <strong>{selectedRecord.employeeName}</strong>
                </AlertDescription>
              </Alert>

              {/* Current Assignment Info */}
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <div className="text-sm">
                  <span className="text-muted-foreground">القسم:</span>
                  <span className="font-medium mr-2">{selectedRecord.department}</span>
                </div>
                {selectedRecord.division && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">الشعبة:</span>
                    <span className="font-medium mr-2">{selectedRecord.division}</span>
                  </div>
                )}
                {selectedRecord.unit && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">الوحدة:</span>
                    <span className="font-medium mr-2">{selectedRecord.unit}</span>
                  </div>
                )}
                <div className="text-sm">
                  <span className="text-muted-foreground">تاريخ التسليم:</span>
                  <span className="font-medium mr-2">
                    {selectedRecord.startDate.toLocaleDateString('ar-IQ')}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  سبب الإسقاط *
                </Label>
                <Select value={dropReason} onValueChange={setDropReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر سبب إسقاط الذمة..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="damage">تلف الموجود</SelectItem>
                    <SelectItem value="theft">سرقة</SelectItem>
                    <SelectItem value="loss">فقدان</SelectItem>
                    <SelectItem value="end-of-life">انتهاء العمر الافتراضي</SelectItem>
                    <SelectItem value="disposal">إتلاف</SelectItem>
                    <SelectItem value="other">أخرى</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>ملاحظات إضافية</Label>
                <Textarea
                  value={dropNotes}
                  onChange={(e) => setDropNotes(e.target.value)}
                  placeholder="أدخل أي ملاحظات أو تفاصيل إضافية حول إسقاط الذمة..."
                  rows={4}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDropDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button
              onClick={handleConfirmDrop}
              disabled={!dropReason.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              <XCircle className="h-4 w-4 ml-2" />
              تأكيد الإسقاط
            </Button>
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
                  القسم الجديد *
                </Label>
                <Select
                  value={transferDepartment?.toString()}
                  onValueChange={(value) => {
                    setTransferDepartment(parseInt(value));
                    setTransferDivision(undefined);
                    setTransferUnit(undefined);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر القسم الجديد..." />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id.toString()}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4" />
                  الشعبة الجديدة
                </Label>
                <Select
                  value={transferDivision?.toString()}
                  onValueChange={(value) => {
                    setTransferDivision(parseInt(value));
                    setTransferUnit(undefined);
                  }}
                  disabled={!transferDepartment}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الشعبة الجديدة..." />
                  </SelectTrigger>
                  <SelectContent>
                    {divisions
                      .filter(div => div.departmentId === transferDepartment)
                      .map((div) => (
                        <SelectItem key={div.id} value={div.id.toString()}>
                          {div.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  الوحدة الجديدة
                </Label>
                <Select
                  value={transferUnit?.toString()}
                  onValueChange={(value) => setTransferUnit(parseInt(value))}
                  disabled={!transferDivision}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الوحدة الجديدة..." />
                  </SelectTrigger>
                  <SelectContent>
                    {units
                      .filter(unit => unit.divisionId === transferDivision)
                      .map((unit) => (
                        <SelectItem key={unit.id} value={unit.id.toString()}>
                          {unit.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  الموظف الجديد *
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
                  {selectedRecord.division && (
                    <div>
                      الشعبة الحالية:{" "}
                      <span className="font-medium text-foreground">
                        {selectedRecord.division}
                      </span>
                    </div>
                  )}
                  {selectedRecord.unit && (
                    <div>
                      الوحدة الحالية:{" "}
                      <span className="font-medium text-foreground">
                        {selectedRecord.unit}
                      </span>
                    </div>
                  )}
                  <div>
                    تاريخ التسليم:{" "}
                    <span className="font-medium text-foreground">
                      {selectedRecord.startDate.toLocaleDateString('ar-IQ')}
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
