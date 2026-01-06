"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  UserPlus,
  Users,
  Trash2,
  Edit,
  Search,
  Building2,
  PackageCheck,
  Eye,
} from "lucide-react";

// Item assigned to employee
interface AssignedItem {
  id: string;
  uniqueCode: string;
  itemName: string;
  itemType: "ثابت" | "استهلاكي";
  sourceWarehouse: string;
  assignedDate: string;
  divisionName: string;
  unit?: string;
  notes?: string;
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
  createdAt: string;
  items: AssignedItem[];
}

// Mock divisions data
const DIVISIONS = [
  { id: "div1", name: "شعبة التخطيط" },
  { id: "div2", name: "شعبة المتابعة" },
  { id: "div3", name: "شعبة الحسابات" },
  { id: "div4", name: "شعبة الموارد البشرية" },
];

// Mock employees data with items
const MOCK_EMPLOYEES: Employee[] = [
  {
    id: "EMP001",
    name: "أحمد محمد علي",
    position: "مدير التخطيط",
    divisionId: "div1",
    divisionName: "شعبة التخطيط",
    unit: "وحدة التخطيط الاستراتيجي",
    phone: "07701234567",
    createdAt: "2024-01-01",
    items: [
      {
        id: "ITM001",
        uniqueCode: "FUR-CHR-2024-003",
        itemName: "كرسي مكتبي دوار",
        itemType: "ثابت",
        sourceWarehouse: "مخزن الأثاث والممتلكات العامة",
        assignedDate: "2024-01-16",
        divisionName: "شعبة التخطيط",
        notes: "كرسي جديد للمكتب الرئيسي",
      },
      {
        id: "ITM002",
        uniqueCode: "FUR-DSK-2024-001",
        itemName: "مكتب خشبي",
        itemType: "ثابت",
        sourceWarehouse: "مخزن الأثاث والممتلكات العامة",
        assignedDate: "2024-01-18",
        divisionName: "شعبة التخطيط",
      },
      {
        id: "ITM003",
        uniqueCode: "IT-LAP-2024-005",
        itemName: "حاسوب محمول Dell",
        itemType: "ثابت",
        sourceWarehouse: "مخزن المواد العامة",
        assignedDate: "2024-01-20",
        divisionName: "شعبة التخطيط",
      },
    ],
  },
  {
    id: "EMP002",
    name: "سارة علي حسن",
    position: "مسؤولة المتابعة",
    divisionId: "div2",
    divisionName: "شعبة المتابعة",
    phone: "07709876543",
    createdAt: "2024-01-05",
    items: [
      {
        id: "ITM004",
        uniqueCode: "FUR-TBL-2024-003",
        itemName: "طاولة اجتماعات خشبية",
        itemType: "ثابت",
        sourceWarehouse: "مخزن الأثاث والممتلكات العامة",
        assignedDate: "2024-01-17",
        divisionName: "شعبة المتابعة",
      },
      {
        id: "ITM005",
        uniqueCode: "IT-PRN-2024-002",
        itemName: "طابعة HP LaserJet",
        itemType: "ثابت",
        sourceWarehouse: "مخزن المواد العامة",
        assignedDate: "2024-01-19",
        divisionName: "شعبة المتابعة",
      },
    ],
  },
  {
    id: "EMP003",
    name: "محمد حسن جاسم",
    position: "محاسب",
    divisionId: "div3",
    divisionName: "شعبة الحسابات",
    unit: "وحدة المحاسبة المالية",
    phone: "07705551234",
    createdAt: "2024-01-10",
    items: [
      {
        id: "ITM006",
        uniqueCode: "CAR-PRS-2024-004",
        itemName: "سجاد فارسي",
        itemType: "ثابت",
        sourceWarehouse: "مخزن السجاد والمفروشات",
        assignedDate: "2024-01-15",
        divisionName: "شعبة الحسابات",
      },
    ],
  },
  {
    id: "EMP004",
    name: "فاطمة أحمد",
    position: "موظفة موارد بشرية",
    divisionId: "div4",
    divisionName: "شعبة الموارد البشرية",
    phone: "07708889999",
    createdAt: "2024-01-12",
    items: [],
  },
];

export default function EmployeesPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDivision, setFilterDivision] = useState<string>("all");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    divisionId: "",
    unit: "",
    phone: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      position: "",
      divisionId: "",
      unit: "",
      phone: "",
    });
    setSelectedEmployee(null);
    setIsEditing(false);
  };

  const handleAddClick = () => {
    resetForm();
    setDialogOpen(true);
  };

  const handleEditClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setFormData({
      name: employee.name,
      position: employee.position,
      divisionId: employee.divisionId,
      unit: employee.unit || "",
      phone: employee.phone || "",
    });
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleDeleteClick = (employee: Employee) => {
    if (confirm(`هل أنت متأكد من حذف الموظف ${employee.name}؟`)) {
      setEmployees(employees.filter((e) => e.id !== employee.id));
      toast.success(`تم حذف الموظف ${employee.name} بنجاح`);
    }
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.name || !formData.position || !formData.divisionId) {
      toast.error("الرجاء ملء جميع الحقول المطلوبة (الاسم، المنصب، الشعبة)");
      return;
    }

    const divisionName = DIVISIONS.find((d) => d.id === formData.divisionId)?.name || "";

    if (isEditing && selectedEmployee) {
      // Update existing employee
      setEmployees(
        employees.map((e) =>
          e.id === selectedEmployee.id
            ? {
                ...e,
                name: formData.name,
                position: formData.position,
                divisionId: formData.divisionId,
                divisionName,
                unit: formData.unit,
                phone: formData.phone,
              }
            : e
        )
      );
      toast.success(`تم تحديث بيانات الموظف ${formData.name} بنجاح`);
    } else {
      // Add new employee
      const newEmployee: Employee = {
        id: `EMP${String(employees.length + 1).padStart(3, "0")}`,
        name: formData.name,
        position: formData.position,
        divisionId: formData.divisionId,
        divisionName,
        unit: formData.unit,
        phone: formData.phone,
        createdAt: new Date().toISOString().split("T")[0],
        items: [],
      };
      setEmployees([...employees, newEmployee]);
      toast.success(`تم إضافة الموظف ${formData.name} بنجاح`);
    }

    setDialogOpen(false);
    resetForm();
  };

  // Filter employees based on search term and division
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDivision =
      filterDivision === "all" || employee.divisionId === filterDivision;
    return matchesSearch && matchesDivision;
  });

  // Navigate to employee details
  const handleViewDetails = (employee: Employee) => {
    router.push(`/law-enforcement/employee-details?id=${employee.id}`);
  };

  // Statistics
  const stats = {
    total: employees.length,
    employeesWithItems: employees.filter((e) => e.items.length > 0).length,
    totalItems: employees.reduce((sum, e) => sum + e.items.length, 0),
    byDivision: DIVISIONS.map((div) => ({
      ...div,
      count: employees.filter((e) => e.divisionId === div.id).length,
    })),
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-8 w-8" />
            إدارة الموظفين
          </h2>
          <p className="text-muted-foreground mt-1">
            إضافة وتعديل وحذف الموظفين وتعيينهم للشعب
          </p>
        </div>
        <Button onClick={handleAddClick}>
          <UserPlus className="h-4 w-4 ml-2" />
          إضافة موظف جديد
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الموظفين</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">موظف مسجل</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">موظفين لديهم مواد</CardTitle>
            <PackageCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.employeesWithItems}</div>
            <p className="text-xs text-muted-foreground">موظف يحملون مواد</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المواد</CardTitle>
            <PackageCheck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalItems}</div>
            <p className="text-xs text-muted-foreground">مادة موزعة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">بدون مواد</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total - stats.employeesWithItems}</div>
            <p className="text-xs text-muted-foreground">موظف بدون مواد</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Table */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة الموظفين</CardTitle>
          <CardDescription>جميع الموظفين المسجلين في النظام</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label>البحث</Label>
              <div className="relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="ابحث عن موظف..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
            <div className="w-[200px]">
              <Label>الشعبة</Label>
              <Select value={filterDivision} onValueChange={setFilterDivision}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الشعب</SelectItem>
                  {DIVISIONS.map((div) => (
                    <SelectItem key={div.id} value={div.id}>
                      {div.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Employees Table */}
          <div className="border rounded-md overflow-x-auto">
            <Table dir="rtl">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right min-w-[120px]">رقم الموظف</TableHead>
                  <TableHead className="text-right min-w-[200px]">الاسم</TableHead>
                  <TableHead className="text-right min-w-[150px]">المنصب</TableHead>
                  <TableHead className="text-right min-w-[150px]">الشعبة</TableHead>
                  <TableHead className="text-right min-w-[100px]">المواد</TableHead>
                  <TableHead className="text-right min-w-[120px]">رقم الهاتف</TableHead>
                  <TableHead className="text-right min-w-[150px]">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground h-24">
                      لا يوجد موظفين
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmployees.map((employee) => (
                    <TableRow
                      key={employee.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleViewDetails(employee)}
                    >
                      <TableCell className="text-right font-mono">{employee.id}</TableCell>
                      <TableCell className="text-right font-medium">{employee.name}</TableCell>
                      <TableCell className="text-right">{employee.position}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline">{employee.divisionName}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant={employee.items.length > 0 ? "default" : "secondary"}>
                          {employee.items.length} مادة
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono">{employee.phone || "-"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewDetails(employee)}
                            title="عرض التفاصيل"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditClick(employee)}
                            title="تعديل"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteClick(employee)}
                            title="حذف"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
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

      {/* Add/Edit Employee Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "تعديل بيانات الموظف" : "إضافة موظف جديد"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? `تعديل بيانات ${selectedEmployee?.name}`
                : "أدخل بيانات الموظف الجديد"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">الاسم الكامل *</Label>
                <Input
                  id="name"
                  placeholder="أدخل الاسم الكامل"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">المنصب *</Label>
                <Input
                  id="position"
                  placeholder="أدخل المنصب"
                  value={formData.position}
                  onChange={(e) =>
                    setFormData({ ...formData, position: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="division">الشعبة *</Label>
                <Select
                  value={formData.divisionId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, divisionId: value })
                  }
                >
                  <SelectTrigger id="division">
                    <SelectValue placeholder="اختر الشعبة" />
                  </SelectTrigger>
                  <SelectContent>
                    {DIVISIONS.map((div) => (
                      <SelectItem key={div.id} value={div.id}>
                        {div.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">الوحدة (اختياري)</Label>
                <Input
                  id="unit"
                  placeholder="أدخل اسم الوحدة"
                  value={formData.unit}
                  onChange={(e) =>
                    setFormData({ ...formData, unit: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input
                id="phone"
                placeholder="07XXXXXXXXX"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleSubmit}>
              {isEditing ? "حفظ التعديلات" : "إضافة الموظف"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
