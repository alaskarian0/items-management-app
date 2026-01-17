"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  PackageCheck,
  UserCheck,
  FileText,
  Search,
  Check,
  ChevronsUpDown,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAssetCustody, usePendingItems, CUSTODY_STATUS } from "@/hooks/use-asset-custody";
import { useEmployees } from "@/hooks/use-employees";
import { useDivisions } from "@/hooks/use-divisions";

export default function ItemAssignmentsPage() {
  // API hooks
  const { custodies, loading: custodiesLoading, assignItem, refetch: refetchCustodies } = useAssetCustody();
  const { pendingItems, loading: pendingLoading, refetch: refetchPending } = usePendingItems();
  const { employees, loading: employeesLoading } = useEmployees({ isActive: true });
  const { divisions, loading: divisionsLoading } = useDivisions();

  // UI state
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [employeeComboboxOpen, setEmployeeComboboxOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Assignment form state
  const [assignmentData, setAssignmentData] = useState({
    employeeId: "",
    notes: "",
  });

  // Get selected employee
  const selectedEmployee = useMemo(() => {
    if (!assignmentData.employeeId) return null;
    return employees.find((emp) => emp.id.toString() === assignmentData.employeeId);
  }, [assignmentData.employeeId, employees]);

  const handleAssignClick = (item: any) => {
    setSelectedItem(item);
    setAssignmentData({
      employeeId: "",
      notes: "",
    });
    setEmployeeComboboxOpen(false);
    setAssignDialogOpen(true);
  };

  const handleAssignSubmit = async () => {
    if (!selectedItem) return;

    // Validate required fields
    if (!assignmentData.employeeId) {
      toast.error("الرجاء اختيار الموظف");
      return;
    }

    if (!selectedEmployee) {
      toast.error("الموظف المحدد غير موجود");
      return;
    }

    setSubmitting(true);
    try {
      await assignItem({
        itemInstanceId: selectedItem.id,
        employeeId: parseInt(assignmentData.employeeId),
        departmentId: selectedEmployee.departmentId?.toString() || "",
        divisionId: selectedEmployee.divisionId?.toString() || "",
        unitId: selectedEmployee.unitId?.toString() || "",
        startDate: new Date().toISOString().split('T')[0],
        notes: assignmentData.notes || undefined,
      });

      toast.success(`تم تعيين ${selectedItem.itemMaster?.name} إلى ${selectedEmployee.fullName} بنجاح`);
      setAssignDialogOpen(false);
      setSelectedItem(null);
      refetchPending();
      refetchCustodies();
    } catch (error) {
      console.error('Error assigning item:', error);
      toast.error("حدث خطأ أثناء تعيين المادة");
    } finally {
      setSubmitting(false);
    }
  };

  // Filter pending items based on search term
  const filteredPendingItems = useMemo(() => {
    if (!searchTerm) return pendingItems;
    return pendingItems.filter((item) =>
      item.itemMaster?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.itemMaster?.code?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [pendingItems, searchTerm]);

  // Filter custodies based on status
  const filteredCustodies = useMemo(() => {
    if (filterStatus === "all") return custodies;
    const statusNum = filterStatus === "active" ? CUSTODY_STATUS.ACTIVE : CUSTODY_STATUS.RETURNED;
    return custodies.filter((c) => c.status === statusNum);
  }, [custodies, filterStatus]);

  // Calculate statistics
  const stats = {
    totalPending: pendingItems.length,
    totalAssigned: custodies.filter((c) => c.status === CUSTODY_STATUS.ACTIVE).length,
    totalReturned: custodies.filter((c) => c.status === CUSTODY_STATUS.RETURNED).length,
  };

  const isLoading = custodiesLoading || pendingLoading || employeesLoading || divisionsLoading;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <PackageCheck className="h-8 w-8" />
          إدارة توزيع المواد
        </h2>
        <p className="text-muted-foreground mt-1">
          تعيين المواد المستلمة من المخازن العامة إلى الشعب والوحدات والموظفين
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">بانتظار التوزيع</CardTitle>
            <FileText className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPending}</div>
            <p className="text-xs text-muted-foreground">
              مواد متاحة للتعيين
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">تم التوزيع</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAssigned}</div>
            <p className="text-xs text-muted-foreground">
              مواد موزعة حالياً
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">تم الإرجاع</CardTitle>
            <PackageCheck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReturned}</div>
            <p className="text-xs text-muted-foreground">
              مواد تم إرجاعها
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Items Section */}
      <Card>
        <CardHeader>
          <CardTitle>المواد المتاحة للتوزيع</CardTitle>
          <CardDescription>
            المواد التي لم يتم تعيينها بعد ومتاحة للتوزيع على الموظفين
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label>البحث</Label>
              <div className="relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="ابحث عن المواد..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
          </div>

          {/* Pending Items Table */}
          <div className="border rounded-md overflow-x-auto">
            <Table dir="rtl">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right min-w-[150px]">الرقم التسلسلي</TableHead>
                  <TableHead className="text-right min-w-[200px]">اسم المادة</TableHead>
                  <TableHead className="text-right min-w-[100px]">الكود</TableHead>
                  <TableHead className="text-right min-w-[100px]">الفئة</TableHead>
                  <TableHead className="text-right min-w-[150px]">المخزن</TableHead>
                  <TableHead className="text-right min-w-[100px]">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : filteredPendingItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground h-24">
                      لا توجد مواد متاحة للتوزيع
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPendingItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="text-right font-mono">
                        {item.serialNumber}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {item.itemMaster?.name}
                      </TableCell>
                      <TableCell className="text-right font-mono text-muted-foreground">
                        {item.itemMaster?.code}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.itemMaster?.category?.name || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.warehouse?.name || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          onClick={() => handleAssignClick(item)}
                        >
                          تعيين
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Active Custodies Section */}
      <Card>
        <CardHeader>
          <CardTitle>سجل التوزيعات</CardTitle>
          <CardDescription>
            عرض جميع عمليات التوزيع السابقة والحالية
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-end">
            <div className="w-[200px]">
              <Label>الحالة</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  <SelectItem value="active">نشط</SelectItem>
                  <SelectItem value="returned">تم الإرجاع</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Custodies Table */}
          <div className="border rounded-md overflow-x-auto">
            <Table dir="rtl">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right min-w-[120px]">رقم العهدة</TableHead>
                  <TableHead className="text-right min-w-[200px]">اسم المادة</TableHead>
                  <TableHead className="text-right min-w-[150px]">الموظف</TableHead>
                  <TableHead className="text-right min-w-[120px]">الشعبة</TableHead>
                  <TableHead className="text-right min-w-[100px]">تاريخ البدء</TableHead>
                  <TableHead className="text-right min-w-[100px]">الحالة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {custodiesLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : filteredCustodies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground h-24">
                      لا توجد توزيعات
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCustodies.map((custody) => (
                    <TableRow key={custody.id}>
                      <TableCell className="text-right font-mono">
                        {custody.custodyNumber}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {custody.itemInstance?.itemMaster?.name}
                        <div className="text-xs text-muted-foreground">
                          {custody.itemInstance?.serialNumber}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {custody.employee?.fullName}
                      </TableCell>
                      <TableCell className="text-right">
                        {custody.employee?.division?.name || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        {new Date(custody.startDate).toLocaleDateString("ar-IQ")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant={custody.status === CUSTODY_STATUS.ACTIVE ? "default" : "secondary"}>
                          {custody.statusText}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Assignment Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>تعيين مادة</DialogTitle>
            <DialogDescription>
              {selectedItem && (
                <>
                  تعيين <span className="font-mono font-semibold">{selectedItem.serialNumber}</span>
                  {" - "}{selectedItem.itemMaster?.name}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Employee Search and Selection (Combobox) */}
            <div className="space-y-2">
              <Label>الموظف *</Label>
              <Popover open={employeeComboboxOpen} onOpenChange={setEmployeeComboboxOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={employeeComboboxOpen}
                    className="w-full justify-between"
                    disabled={employeesLoading}
                  >
                    {employeesLoading ? (
                      "جاري التحميل..."
                    ) : selectedEmployee ? (
                      selectedEmployee.fullName
                    ) : (
                      "ابحث واختر الموظف..."
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="ابحث عن موظف..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>لا يوجد موظفين مطابقين للبحث</CommandEmpty>
                      <CommandGroup>
                        {employees.map((emp) => (
                          <CommandItem
                            key={emp.id}
                            value={`${emp.fullName} ${emp.employeeId} ${emp.division?.name || ""}`}
                            onSelect={() => {
                              setAssignmentData({ ...assignmentData, employeeId: emp.id.toString() });
                              setEmployeeComboboxOpen(false);
                            }}
                          >
                            <div className="flex flex-col items-start flex-1">
                              <span className="font-medium">{emp.fullName}</span>
                              <span className="text-xs text-muted-foreground">
                                {emp.employeeId} - {emp.division?.name || "غير محدد"}
                              </span>
                            </div>
                            <Check
                              className={cn(
                                "ml-2 h-4 w-4",
                                assignmentData.employeeId === emp.id.toString() ? "opacity-100" : "opacity-0"
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
                      <Label className="text-xs text-muted-foreground">الاسم</Label>
                      <p className="font-medium">{selectedEmployee.fullName}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">رقم الموظف</Label>
                      <p className="font-medium font-mono">{selectedEmployee.employeeId}</p>
                    </div>
                    {selectedEmployee.department && (
                      <div>
                        <Label className="text-xs text-muted-foreground">الدائرة</Label>
                        <p className="font-medium">{selectedEmployee.department.name}</p>
                      </div>
                    )}
                    {selectedEmployee.division && (
                      <div>
                        <Label className="text-xs text-muted-foreground">الشعبة</Label>
                        <p className="font-medium">{selectedEmployee.division.name}</p>
                      </div>
                    )}
                    {selectedEmployee.unit && (
                      <div>
                        <Label className="text-xs text-muted-foreground">الوحدة</Label>
                        <p className="font-medium">{selectedEmployee.unit.name}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes">ملاحظات</Label>
              <Textarea
                id="notes"
                placeholder="أدخل أي ملاحظات إضافية..."
                value={assignmentData.notes}
                onChange={(e) =>
                  setAssignmentData({ ...assignmentData, notes: e.target.value })
                }
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)} disabled={submitting}>
              إلغاء
            </Button>
            <Button onClick={handleAssignSubmit} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                  جاري التعيين...
                </>
              ) : (
                "تأكيد التعيين"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
