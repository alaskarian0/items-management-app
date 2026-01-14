"use client";

import { useState } from "react";
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
  Users,
  FileText,
  Search,
  ChevronDown,
  ChevronRight,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Individual item with unique code
interface IndividualItem {
  id: string;
  uniqueCode: string; // Each item has its own unique code
  assignedTo?: string;
  assignedDivision?: string;
  assignedUnit?: string;
  assignedPosition?: string;
  assignedDate?: string;
  notes?: string;
  status: "pending" | "assigned";
}

// Grouped items by type
interface ItemGroup {
  id: string;
  name: string;
  baseCode: string;
  totalQuantity: number;
  sourceWarehouse: string;
  receivedDate: string;
  itemType: "ثابت" | "استهلاكي"; // Fixed asset or Consumable
  items: IndividualItem[]; // Array of individual items
}

// Mock data - Each chair has its own unique code
const MOCK_ITEM_GROUPS: ItemGroup[] = [
  {
    id: "GROUP001",
    name: "كرسي مكتبي دوار",
    baseCode: "FUR-CHR",
    totalQuantity: 5,
    sourceWarehouse: "مخزن الأثاث والممتلكات العامة",
    receivedDate: "2024-01-15",
    itemType: "ثابت",
    items: [
      { id: "ITM001-1", uniqueCode: "FUR-CHR-2024-001", status: "pending" },
      { id: "ITM001-2", uniqueCode: "FUR-CHR-2024-002", status: "pending" },
      { id: "ITM001-3", uniqueCode: "FUR-CHR-2024-003", status: "assigned", assignedTo: "أحمد محمد", assignedDivision: "شعبة التخطيط", assignedDate: "2024-01-16" },
      { id: "ITM001-4", uniqueCode: "FUR-CHR-2024-004", status: "pending" },
      { id: "ITM001-5", uniqueCode: "FUR-CHR-2024-005", status: "pending" },
    ]
  },
  {
    id: "GROUP002",
    name: "طاولة اجتماعات خشبية",
    baseCode: "FUR-TBL",
    totalQuantity: 3,
    sourceWarehouse: "مخزن الأثاث والممتلكات العامة",
    receivedDate: "2024-01-16",
    itemType: "ثابت",
    items: [
      { id: "ITM002-1", uniqueCode: "FUR-TBL-2024-001", status: "pending" },
      { id: "ITM002-2", uniqueCode: "FUR-TBL-2024-002", status: "pending" },
      { id: "ITM002-3", uniqueCode: "FUR-TBL-2024-003", status: "assigned", assignedTo: "سارة علي", assignedDivision: "شعبة المتابعة" },
    ]
  },
  {
    id: "GROUP003",
    name: "سجاد فارسي",
    baseCode: "CAR-PRS",
    totalQuantity: 4,
    sourceWarehouse: "مخزن السجاد والمفروشات",
    receivedDate: "2024-01-17",
    itemType: "ثابت",
    items: [
      { id: "ITM003-1", uniqueCode: "CAR-PRS-2024-001", status: "pending" },
      { id: "ITM003-2", uniqueCode: "CAR-PRS-2024-002", status: "pending" },
      { id: "ITM003-3", uniqueCode: "CAR-PRS-2024-003", status: "pending" },
      { id: "ITM003-4", uniqueCode: "CAR-PRS-2024-004", status: "assigned", assignedTo: "محمد حسن", assignedDivision: "شعبة الحسابات" },
    ]
  },
];

// Mock divisions/units data
const DIVISIONS = [
  { id: "div1", name: "شعبة التخطيط" },
  { id: "div2", name: "شعبة المتابعة" },
  { id: "div3", name: "شعبة الحسابات" },
  { id: "div4", name: "شعبة الموارد البشرية" },
];

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

export default function ItemAssignmentsPage() {
  const [itemGroups, setItemGroups] = useState<ItemGroup[]>(MOCK_ITEM_GROUPS);
  const [selectedItem, setSelectedItem] = useState<{group: ItemGroup, item: IndividualItem} | null>(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [employeeComboboxOpen, setEmployeeComboboxOpen] = useState(false);

  // Assignment form state
  const [assignmentData, setAssignmentData] = useState({
    employeeId: "",
    notes: "",
  });

  const toggleGroupExpansion = (groupId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  const handleAssignClick = (group: ItemGroup, item: IndividualItem) => {
    setSelectedItem({ group, item });
    setAssignmentData({
      employeeId: "",
      notes: "",
    });
    setEmployeeComboboxOpen(false);
    setAssignDialogOpen(true);
  };

  const handleAssignSubmit = () => {
    if (!selectedItem) return;

    // Validate required fields
    if (!assignmentData.employeeId) {
      toast.error("الرجاء اختيار الموظف");
      return;
    }

    // Get selected employee data
    const selectedEmployee = MOCK_EMPLOYEES.find(emp => emp.id === assignmentData.employeeId);
    if (!selectedEmployee) {
      toast.error("الموظف المحدد غير موجود");
      return;
    }

    // Update individual item status
    setItemGroups(groups =>
      groups.map(group =>
        group.id === selectedItem.group.id
          ? {
              ...group,
              items: group.items.map(item =>
                item.id === selectedItem.item.id
                  ? {
                      ...item,
                      status: "assigned" as const,
                      assignedTo: selectedEmployee.name,
                      assignedDivision: selectedEmployee.divisionName,
                      assignedUnit: selectedEmployee.unit,
                      assignedPosition: selectedEmployee.position,
                      assignedDate: new Date().toISOString().split('T')[0],
                      notes: assignmentData.notes,
                    }
                  : item
              )
            }
          : group
      )
    );

    toast.success(`تم تعيين ${selectedItem.item.uniqueCode} إلى ${selectedEmployee.name} (${selectedEmployee.divisionName}) بنجاح`);
    setAssignDialogOpen(false);
    setSelectedItem(null);
  };

  // Filter groups based on search term and status
  const filteredGroups = itemGroups.map(group => ({
    ...group,
    items: group.items.filter(item => {
      const matchesStatus = filterStatus === "all" || item.status === filterStatus;
      const matchesSearch =
        group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.uniqueCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.assignedTo && item.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesStatus && matchesSearch;
    })
  })).filter(group => group.items.length > 0);

  // Calculate statistics
  const stats = {
    totalItems: itemGroups.reduce((sum, group) => sum + group.items.length, 0),
    pending: itemGroups.reduce((sum, group) =>
      sum + group.items.filter(i => i.status === "pending").length, 0),
    assigned: itemGroups.reduce((sum, group) =>
      sum + group.items.filter(i => i.status === "assigned").length, 0),
  };

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
            <CardTitle className="text-sm font-medium">إجمالي المواد</CardTitle>
            <PackageCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalItems}</div>
            <p className="text-xs text-muted-foreground">
              عدد المواد الفردية المستلمة
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">بانتظار التوزيع</CardTitle>
            <FileText className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">
              مواد تحتاج إلى تعيين
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">تم التوزيع</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.assigned}</div>
            <p className="text-xs text-muted-foreground">
              مواد تم تعيينها للموظفين
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>المواد المستلمة</CardTitle>
          <CardDescription>
            عرض وتعيين المواد المرسلة من المخازن الأخرى - كل مادة لها كود فريد
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label>البحث</Label>
              <div className="relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="ابحث عن المواد أو الكود أو المستلم..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
            <div className="w-[200px]">
              <Label>الحالة</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  <SelectItem value="pending">بانتظار التوزيع</SelectItem>
                  <SelectItem value="assigned">تم التوزيع</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Items Table with Collapsible Rows */}
          <div className="border rounded-md overflow-x-auto">
            <Table dir="rtl">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right w-10"></TableHead>
                  <TableHead className="text-right min-w-[200px]">اسم المادة</TableHead>
                  <TableHead className="text-right min-w-[150px]">الكود الفريد</TableHead>
                  <TableHead className="text-right min-w-[100px]">النوع</TableHead>
                  <TableHead className="text-right min-w-[180px]">المخزن المصدر</TableHead>
                  <TableHead className="text-right min-w-[150px]">المستلم</TableHead>
                  <TableHead className="text-right min-w-[120px]">الحالة</TableHead>
                  <TableHead className="text-right min-w-[100px]">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGroups.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground h-24">
                      لا توجد مواد
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredGroups.map((group) => (
                    <Collapsible
                      key={group.id}
                      open={expandedGroups.has(group.id)}
                      onOpenChange={() => toggleGroupExpansion(group.id)}
                      asChild
                    >
                      <>
                        {/* Group Header Row */}
                        <CollapsibleTrigger asChild>
                          <TableRow className="cursor-pointer hover:bg-muted/50 bg-muted/30">
                            <TableCell className="text-right">
                              {expandedGroups.has(group.id) ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                              {group.name}
                              <div className="text-xs text-muted-foreground">
                                {group.items.filter(i => i.status === "pending").length} بانتظار التوزيع، {group.items.filter(i => i.status === "assigned").length} تم التوزيع
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-mono text-muted-foreground">
                              {group.baseCode}-...
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge variant={group.itemType === "ثابت" ? "default" : "secondary"}>
                                {group.itemType}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">{group.sourceWarehouse}</TableCell>
                            <TableCell className="text-right text-muted-foreground">
                              {group.totalQuantity} مواد فردية
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge variant="outline">
                                {group.items.length} مادة
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right"></TableCell>
                          </TableRow>
                        </CollapsibleTrigger>

                        {/* Individual Items */}
                        <CollapsibleContent asChild>
                          <>
                            {group.items.map((item) => (
                              <TableRow key={item.id} className="bg-background">
                                <TableCell className="text-right"></TableCell>
                                <TableCell className="text-right pr-8 text-muted-foreground">
                                  └ {group.name}
                                </TableCell>
                                <TableCell className="text-right font-mono font-semibold">
                                  {item.uniqueCode}
                                </TableCell>
                                <TableCell className="text-right"></TableCell>
                                <TableCell className="text-right"></TableCell>
                                <TableCell className="text-right">
                                  {item.assignedTo ? (
                                    <div>
                                      <div className="font-medium">{item.assignedTo}</div>
                                      <div className="text-xs text-muted-foreground">
                                        {item.assignedDivision}
                                        {item.assignedUnit && ` - ${item.assignedUnit}`}
                                      </div>
                                    </div>
                                  ) : (
                                    <span className="text-muted-foreground">-</span>
                                  )}
                                </TableCell>
                                <TableCell className="text-right">
                                  <Badge variant={item.status === "pending" ? "outline" : "default"}>
                                    {item.status === "pending" ? "بانتظار التوزيع" : "تم التوزيع"}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    size="sm"
                                    onClick={() => handleAssignClick(group, item)}
                                    disabled={item.status === "assigned"}
                                  >
                                    تعيين
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </>
                        </CollapsibleContent>
                      </>
                    </Collapsible>
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
                  تعيين <span className="font-mono font-semibold">{selectedItem.item.uniqueCode}</span>
                  {" - "}{selectedItem.group.name}
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
                  >
                    {assignmentData.employeeId
                      ? MOCK_EMPLOYEES.find((emp) => emp.id === assignmentData.employeeId)?.name
                      : "ابحث واختر الموظف..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="ابحث عن موظف..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>لا يوجد موظفين مطابقين للبحث</CommandEmpty>
                      <CommandGroup>
                        {MOCK_EMPLOYEES.map((emp) => (
                          <CommandItem
                            key={emp.id}
                            value={`${emp.name} ${emp.position} ${emp.divisionName} ${emp.id}`}
                            onSelect={() => {
                              setAssignmentData({ ...assignmentData, employeeId: emp.id });
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
                                assignmentData.employeeId === emp.id ? "opacity-100" : "opacity-0"
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
            {assignmentData.employeeId && (() => {
              const selectedEmployee = MOCK_EMPLOYEES.find(emp => emp.id === assignmentData.employeeId);
              return selectedEmployee ? (
                <Card className="bg-muted/50">
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label className="text-xs text-muted-foreground">الاسم</Label>
                        <p className="font-medium">{selectedEmployee.name}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">المنصب</Label>
                        <p className="font-medium">{selectedEmployee.position}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">الشعبة</Label>
                        <p className="font-medium">{selectedEmployee.divisionName}</p>
                      </div>
                      {selectedEmployee.unit && (
                        <div>
                          <Label className="text-xs text-muted-foreground">الوحدة</Label>
                          <p className="font-medium">{selectedEmployee.unit}</p>
                        </div>
                      )}
                      {selectedEmployee.phone && (
                        <div>
                          <Label className="text-xs text-muted-foreground">رقم الهاتف</Label>
                          <p className="font-medium font-mono">{selectedEmployee.phone}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : null;
            })()}

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
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleAssignSubmit}>
              تأكيد التعيين
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
