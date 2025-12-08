"use client";

import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PlusCircle,
  Edit,
  Trash2,
  Building2,
  Search,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Department = {
  id: number;
  name: string;
  description?: string;
  headOfDepartment?: string;
  employeeCount?: number;
};

const mockDepartments: Department[] = [
  {
    id: 1,
    name: "قسم الشؤون الهندسية",
    description: "مسؤول عن جميع الأعمال الهندسية والمشاريع",
    headOfDepartment: "م. أحمد محمد",
    employeeCount: 25,
  },
  {
    id: 2,
    name: "قسم الشؤون الإدارية",
    description: "إدارة العمليات الإدارية اليومية",
    headOfDepartment: "علي حسن",
    employeeCount: 15,
  },
  {
    id: 3,
    name: "قسم المحاسبة",
    description: "إدارة الحسابات والمعاملات المالية",
    headOfDepartment: "فاطمة علي",
    employeeCount: 12,
  },
  {
    id: 4,
    name: "قسم تقنية المعلومات",
    description: "صيانة وتطوير الأنظمة التقنية",
    headOfDepartment: "محمد عبد الله",
    employeeCount: 8,
  },
  {
    id: 5,
    name: "قسم الموارد البشرية",
    description: "إدارة شؤون الموظفين والتوظيف",
    headOfDepartment: "سارة أحمد",
    employeeCount: 6,
  },
];

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState<Department | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    headOfDepartment: "",
    employeeCount: "",
  });

  // Filter departments
  const filteredDepartments = useMemo(() => {
    return departments.filter(
      (dept) =>
        dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.headOfDepartment?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [departments, searchTerm]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalDepartments = departments.length;
    const totalEmployees = departments.reduce(
      (sum, dept) => sum + (dept.employeeCount || 0),
      0
    );
    return { totalDepartments, totalEmployees };
  }, [departments]);

  const handleAddNew = () => {
    setCurrentDepartment(null);
    setFormData({ name: "", description: "", headOfDepartment: "", employeeCount: "" });
    setIsDialogOpen(true);
  };

  const handleEdit = (department: Department) => {
    setCurrentDepartment(department);
    setFormData({
      name: department.name,
      description: department.description || "",
      headOfDepartment: department.headOfDepartment || "",
      employeeCount: department.employeeCount?.toString() || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذا القسم؟")) {
      setDepartments(departments.filter((dept) => dept.id !== id));
    }
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert("الرجاء إدخال اسم القسم");
      return;
    }

    if (currentDepartment) {
      // Edit
      setDepartments(
        departments.map((dept) =>
          dept.id === currentDepartment.id
            ? {
                ...dept,
                name: formData.name,
                description: formData.description,
                headOfDepartment: formData.headOfDepartment,
                employeeCount: formData.employeeCount
                  ? parseInt(formData.employeeCount)
                  : undefined,
              }
            : dept
        )
      );
    } else {
      // Add
      const newId =
        departments.length > 0
          ? Math.max(...departments.map((d) => d.id)) + 1
          : 1;
      setDepartments([
        ...departments,
        {
          id: newId,
          name: formData.name,
          description: formData.description,
          headOfDepartment: formData.headOfDepartment,
          employeeCount: formData.employeeCount
            ? parseInt(formData.employeeCount)
            : undefined,
        },
      ]);
    }
    setIsDialogOpen(false);
    setFormData({ name: "", description: "", headOfDepartment: "", employeeCount: "" });
    setCurrentDepartment(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Building2 className="h-8 w-8 text-blue-600" />
          إدارة الأقسام
        </h2>
        <p className="text-muted-foreground mt-1">
          إدارة وتنظيم أقسام المؤسسة ومسؤوليها
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              إجمالي الأقسام
            </CardTitle>
            <Building2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.totalDepartments}
            </div>
            <p className="text-xs text-muted-foreground">قسم مسجل</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              إجمالي الموظفين
            </CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.totalEmployees}
            </div>
            <p className="text-xs text-muted-foreground">موظف في جميع الأقسام</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">متوسط الموظفين</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {stats.totalDepartments > 0
                ? Math.round(stats.totalEmployees / stats.totalDepartments)
                : 0}
            </div>
            <p className="text-xs text-muted-foreground">موظف لكل قسم</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>قائمة الأقسام</CardTitle>
            <Button onClick={handleAddNew}>
              <PlusCircle className="ml-2 h-4 w-4" />
              إضافة قسم جديد
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="ابحث عن قسم أو مسؤول..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>

          {/* Table */}
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الرقم</TableHead>
                  <TableHead>اسم القسم</TableHead>
                  <TableHead>الوصف</TableHead>
                  <TableHead>رئيس القسم</TableHead>
                  <TableHead>عدد الموظفين</TableHead>
                  <TableHead className="text-left">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDepartments.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-muted-foreground h-24"
                    >
                      لا توجد أقسام تطابق معايير البحث
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDepartments.map((department) => (
                    <TableRow key={department.id}>
                      <TableCell>
                        <Badge variant="outline">{department.id}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-blue-600" />
                          {department.name}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                        {department.description || "-"}
                      </TableCell>
                      <TableCell>{department.headOfDepartment || "-"}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="gap-1">
                          <Users className="h-3 w-3" />
                          {department.employeeCount || 0}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-left">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(department)}
                            title="تعديل"
                          >
                            <Edit className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(department.id)}
                            title="حذف"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
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

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              {currentDepartment ? "تعديل قسم" : "إضافة قسم جديد"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">اسم القسم *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="مثال: قسم الشؤون الهندسية"
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">الوصف</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="وصف مختصر لمهام القسم..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="head">رئيس القسم</Label>
              <Input
                id="head"
                value={formData.headOfDepartment}
                onChange={(e) =>
                  setFormData((f) => ({
                    ...f,
                    headOfDepartment: e.target.value,
                  }))
                }
                placeholder="اسم رئيس القسم"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="count">عدد الموظفين</Label>
              <Input
                id="count"
                type="number"
                min="0"
                value={formData.employeeCount}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, employeeCount: e.target.value }))
                }
                placeholder="0"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleSave}>
              {currentDepartment ? "حفظ التعديلات" : "إضافة"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DepartmentsPage;
