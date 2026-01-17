"use client";

import { useState, useMemo } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  UserPlus,
  Users,
  Trash2,
  Edit,
  Search,
  PackageCheck,
  Eye,
  Loader2,
} from "lucide-react";
import { useEmployees, Employee } from "@/hooks/use-employees";
import { useDepartments } from "@/hooks/use-departments";
import { useDivisions } from "@/hooks/use-divisions";

export default function EmployeesPage() {
  const router = useRouter();
  const { employees, loading, error, createEmployee, updateEmployee, deleteEmployee, refetch } = useEmployees();
  const { departments } = useDepartments();
  const { divisions } = useDivisions();

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    employeeId: "",
    firstName: "",
    lastName: "",
    departmentId: "",
    divisionId: "",
    notes: "",
  });

  const resetForm = () => {
    setFormData({
      employeeId: "",
      firstName: "",
      lastName: "",
      departmentId: "",
      divisionId: "",
      notes: "",
    });
    setSelectedEmployee(null);
    setIsEditing(false);
  };

  const handleAddClick = () => {
    resetForm();
    // Generate new employee ID
    const year = new Date().getFullYear();
    const nextNum = employees.length + 1;
    setFormData(prev => ({
      ...prev,
      employeeId: `EMP-${year}-${String(nextNum).padStart(3, "0")}`,
    }));
    setDialogOpen(true);
  };

  const handleEditClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setFormData({
      employeeId: employee.employeeId,
      firstName: employee.firstName,
      lastName: employee.lastName,
      departmentId: employee.departmentId?.toString() || "",
      divisionId: employee.divisionId?.toString() || "",
      notes: employee.notes || "",
    });
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleDeleteClick = async (employee: Employee) => {
    if (confirm(`هل أنت متأكد من حذف الموظف ${employee.fullName}؟`)) {
      try {
        await deleteEmployee(employee.id);
        toast.success(`تم حذف الموظف ${employee.fullName} بنجاح`);
      } catch (err) {
        toast.error("فشل في حذف الموظف");
      }
    }
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.firstName || !formData.lastName) {
      toast.error("الرجاء ملء جميع الحقول المطلوبة (الاسم الأول، الاسم الأخير)");
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing && selectedEmployee) {
        // Update existing employee
        await updateEmployee(selectedEmployee.id, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          departmentId: formData.departmentId ? parseInt(formData.departmentId) : undefined,
          divisionId: formData.divisionId ? parseInt(formData.divisionId) : undefined,
          notes: formData.notes,
        });
        toast.success(`تم تحديث بيانات الموظف ${formData.firstName} ${formData.lastName} بنجاح`);
      } else {
        // Add new employee
        await createEmployee({
          employeeId: formData.employeeId,
          firstName: formData.firstName,
          lastName: formData.lastName,
          departmentId: formData.departmentId ? parseInt(formData.departmentId) : undefined,
          divisionId: formData.divisionId ? parseInt(formData.divisionId) : undefined,
          notes: formData.notes,
        });
        toast.success(`تم إضافة الموظف ${formData.firstName} ${formData.lastName} بنجاح`);
      }

      setDialogOpen(false);
      resetForm();
    } catch (err) {
      toast.error(isEditing ? "فشل في تحديث الموظف" : "فشل في إضافة الموظف");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter employees based on search term and department
  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesSearch =
        employee.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.notes?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment =
        filterDepartment === "all" || employee.departmentId?.toString() === filterDepartment;
      return matchesSearch && matchesDepartment;
    });
  }, [employees, searchTerm, filterDepartment]);

  // Navigate to employee details
  const handleViewDetails = (employee: Employee) => {
    router.push(`/employees/details?id=${employee.id}`);
  };

  // Statistics
  const stats = useMemo(() => ({
    total: employees.length,
    active: employees.filter((e) => e.isActive).length,
    byDepartment: departments.map((dept) => ({
      ...dept,
      count: employees.filter((e) => e.departmentId === dept.id).length,
    })),
  }), [employees, departments]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">حدث خطأ في تحميل البيانات</p>
          <Button onClick={() => refetch()} className="mt-4">
            إعادة المحاولة
          </Button>
        </div>
      </div>
    );
  }

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
            إضافة وتعديل وحذف الموظفين وتعيينهم للأقسام
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
            <CardTitle className="text-sm font-medium">الموظفين النشطين</CardTitle>
            <PackageCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground">موظف نشط</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الأقسام</CardTitle>
            <PackageCheck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departments.length}</div>
            <p className="text-xs text-muted-foreground">قسم</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الشعب</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{divisions.length}</div>
            <p className="text-xs text-muted-foreground">شعبة</p>
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
              <Label>القسم</Label>
              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأقسام</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id.toString()}>
                      {dept.name}
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
                  <TableHead className="text-right min-w-[150px]">القسم</TableHead>
                  <TableHead className="text-right min-w-[150px]">الشعبة</TableHead>
                  <TableHead className="text-right min-w-[100px]">الحالة</TableHead>
                  <TableHead className="text-right min-w-[150px]">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground h-24">
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
                      <TableCell className="text-right font-mono">{employee.employeeId}</TableCell>
                      <TableCell className="text-right font-medium">{employee.fullName}</TableCell>
                      <TableCell className="text-right">
                        {employee.department?.name ? (
                          <Badge variant="outline">{employee.department.name}</Badge>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {employee.division?.name ? (
                          <Badge variant="secondary">{employee.division.name}</Badge>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant={employee.isActive ? "default" : "secondary"}>
                          {employee.isActive ? "نشط" : "غير نشط"}
                        </Badge>
                      </TableCell>
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
                ? `تعديل بيانات ${selectedEmployee?.fullName}`
                : "أدخل بيانات الموظف الجديد"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employeeId">رقم الموظف</Label>
                <Input
                  id="employeeId"
                  placeholder="EMP-2024-001"
                  value={formData.employeeId}
                  onChange={(e) =>
                    setFormData({ ...formData, employeeId: e.target.value })
                  }
                  disabled={isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="firstName">الاسم الأول *</Label>
                <Input
                  id="firstName"
                  placeholder="أدخل الاسم الأول"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lastName">الاسم الأخير *</Label>
                <Input
                  id="lastName"
                  placeholder="أدخل الاسم الأخير"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">القسم</Label>
                <Select
                  value={formData.departmentId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, departmentId: value })
                  }
                >
                  <SelectTrigger id="department">
                    <SelectValue placeholder="اختر القسم" />
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="division">الشعبة</Label>
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
                    {divisions.map((div) => (
                      <SelectItem key={div.id} value={div.id.toString()}>
                        {div.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">ملاحظات</Label>
              <Textarea
                id="notes"
                placeholder="أدخل ملاحظات إضافية"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 ml-2 animate-spin" />}
              {isEditing ? "حفظ التعديلات" : "إضافة الموظف"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
