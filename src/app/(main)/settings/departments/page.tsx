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
  Eye,
  GitBranch,
  Download,
  Upload,
  Filter,
  Plus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Unit = {
  id: number;
  name: string;
  description?: string;
  unitHead?: string;
  employeeCount?: number;
  divisionId: number;
  divisionName?: string;
  departmentId?: number;
  departmentName?: string;
  isActive?: boolean;
};

type Division = {
  id: number;
  name: string;
  description?: string;
  headOfDivision?: string;
  employeeCount?: number;
  departmentId: number;
  departmentName?: string;
  isActive?: boolean;
  units?: Unit[];
};

type Department = {
  id: number;
  name: string;
  description?: string;
  headOfDepartment?: string;
  employeeCount?: number;
  isActive?: boolean;
  divisions?: Division[];
};

const mockDepartments: Department[] = [
  {
    id: 1,
    name: "قسم الشؤون الهندسية",
    description: "مسؤول عن جميع الأعمال الهندسية والمشاريع",
    headOfDepartment: "م. أحمد محمد",
    employeeCount: 25,
    isActive: true,
  },
  {
    id: 2,
    name: "قسم الشؤون الإدارية",
    description: "إدارة العمليات الإدارية اليومية",
    headOfDepartment: "علي حسن",
    employeeCount: 15,
    isActive: true,
  },
  {
    id: 3,
    name: "قسم المحاسبة",
    description: "إدارة الحسابات والمعاملات المالية",
    headOfDepartment: "فاطمة علي",
    employeeCount: 12,
    isActive: true,
  },
  {
    id: 4,
    name: "قسم تقنية المعلومات",
    description: "صيانة وتطوير الأنظمة التقنية",
    headOfDepartment: "محمد عبد الله",
    employeeCount: 8,
    isActive: true,
  },
  {
    id: 5,
    name: "قسم الموارد البشرية",
    description: "إدارة شؤون الموظفين والتوظيف",
    headOfDepartment: "سارة أحمد",
    employeeCount: 6,
    isActive: false,
  },
];

const mockDivisions: Division[] = [
  {
    id: 1,
    name: "شعبة الهندسة المدنية",
    description: "المشاريع الإنشائية والمدنية",
    headOfDivision: "م. علي أحمد",
    employeeCount: 10,
    departmentId: 1,
    departmentName: "قسم الشؤون الهندسية",
    isActive: true,
    units: [
      {
        id: 1,
        name: "وحدة التخطيط والتصميم",
        description: "تخطيط وتصميم المشاريع",
        headOfUnit: "خالد محمود",
        employeeCount: 5,
        divisionId: 1,
        departmentId: 1,
        departmentName: "قسم الشؤون الهندسية",
        divisionName: "شعبة الهندسة المدنية",
      },
      {
        id: 2,
        name: "وحدة التنفيذ والإشراف",
        description: "الإشراف على تنفيذ المشاريع",
        headOfUnit: "سالم ياسر",
        employeeCount: 5,
        divisionId: 1,
        departmentId: 1,
        departmentName: "قسم الشؤون الهندسية",
        divisionName: "شعبة الهندسة المدنية",
      },
    ],
  },
  {
    id: 2,
    name: "شعبة الهندسة الكهربائية",
    description: "أنظمة الكهرباء والتحكم",
    headOfDivision: "م. حسن علي",
    employeeCount: 8,
    departmentId: 1,
    departmentName: "قسم الشؤون الهندسية",
    isActive: true,
    units: [
      {
        id: 3,
        name: "وحدة أنظمة الطاقة",
        description: "تصميم أنظمة الطاقة الكهربائية",
        headOfUnit: "رعد فريد",
        employeeCount: 4,
        divisionId: 2,
        departmentId: 1,
        departmentName: "قسم الشؤون الهندسية",
        divisionName: "شعبة الهندسة الكهربائية",
      },
      {
        id: 4,
        name: "وحدة أنظمة التحكم",
        description: "برمجة أنظمة التحكم الصناعي",
        headOfUnit: "مراد حسن",
        employeeCount: 4,
        divisionId: 2,
        departmentId: 1,
        departmentName: "قسم الشؤون الهندسية",
        divisionName: "شعبة الهندسة الكهربائية",
      },
    ],
  },
  {
    id: 3,
    name: "شعبة الشؤون المالية",
    description: "إدارة الحسابات والميزانيات",
    headOfDivision: "فاطمة محمود",
    employeeCount: 8,
    departmentId: 2,
    departmentName: "قسم الشؤون الإدارية",
    isActive: true,
    units: [
      {
        id: 6,
        name: "وحدة الحسابات العامة",
        description: "إدارة الحسابات اليومية",
        headOfUnit: "نور الدين أحمد",
        employeeCount: 4,
        divisionId: 3,
        departmentId: 2,
        departmentName: "قسم الشؤون الإدارية",
        divisionName: "شعبة الشؤون المالية",
      },
    ],
  },
  {
    id: 4,
    name: "شعبة تطوير البرمجيات",
    description: "تطوير البرمجيات والتطبيقات",
    headOfDivision: "عبد الرحمن خالد",
    employeeCount: 7,
    departmentId: 3,
    departmentName: "قسم تقنية المعلومات",
    isActive: false,
    units: [
      {
        id: 9,
        name: "وحدة تطوير الواجهات",
        description: "تطوير واجهات المستخدم",
        headOfUnit: "ياسر حسن",
        employeeCount: 3,
        divisionId: 4,
        departmentId: 3,
        departmentName: "قسم تقنية المعلومات",
        divisionName: "شعبة تطوير البرمجيات",
      },
    ],
  },
];

const mockUnits: Unit[] = [
  {
    id: 1,
    name: "وحدة التخطيط والتصميم",
    description: "تخطيط وتصميم المشاريع",
    unitHead: "خالد محمود",
    employeeCount: 5,
    divisionId: 1,
    departmentId: 1,
    departmentName: "قسم الشؤون الهندسية",
    divisionName: "شعبة الهندسة المدنية",
    isActive: true,
  },
  {
    id: 2,
    name: "وحدة التنفيذ والإشراف",
    description: "الإشراف على تنفيذ المشاريع",
    unitHead: "سالم ياسر",
    employeeCount: 5,
    divisionId: 1,
    departmentId: 1,
    departmentName: "قسم الشؤون الهندسية",
    divisionName: "شعبة الهندسة المدنية",
    isActive: true,
  },
  {
    id: 3,
    name: "وحدة أنظمة الطاقة",
    description: "تصميم أنظمة الطاقة الكهربائية",
    unitHead: "رعد فريد",
    employeeCount: 4,
    divisionId: 2,
    departmentId: 1,
    departmentName: "قسم الشؤون الهندسية",
    divisionName: "شعبة الهندسة الكهربائية",
    isActive: true,
  },
  {
    id: 4,
    name: "وحدة أنظمة التحكم",
    description: "برمجة أنظمة التحكم الصناعي",
    unitHead: "مراد حسن",
    employeeCount: 4,
    divisionId: 2,
    departmentId: 1,
    departmentName: "قسم الشؤون الهندسية",
    divisionName: "شعبة الهندسة الكهربائية",
    isActive: false,
  },
  {
    id: 5,
    name: "وحدة الحسابات العامة",
    description: "إدارة الحسابات اليومية",
    unitHead: "نور الدين أحمد",
    employeeCount: 4,
    divisionId: 3,
    departmentId: 2,
    departmentName: "قسم الشؤون الإدارية",
    divisionName: "شعبة الشؤون المالية",
    isActive: true,
  },
  {
    id: 6,
    name: "وحدة تطوير الواجهات",
    description: "تطوير واجهات المستخدم",
    unitHead: "ياسر حسن",
    employeeCount: 3,
    divisionId: 4,
    departmentId: 3,
    departmentName: "قسم تقنية المعلومات",
    divisionName: "شعبة تطوير البرمجيات",
    isActive: false,
  },
];

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);
  const [divisions, setDivisions] = useState<Division[]>(mockDivisions);
  const [units, setUnits] = useState<Unit[]>(mockUnits);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentSearch, setDepartmentSearch] = useState("");
  const [divisionSearch, setDivisionSearch] = useState("");
  const [unitSearch, setUnitSearch] = useState("");

  const stats = {
    departments: mockDepartments.length,
    divisions: mockDivisions.length,
    units: mockUnits.length,
  };

  const handleAddDepartment = () => {
    // إضافة قسم جديد
  };

  const handleAddDivision = () => {
    // إضافة شعبة جديدة
  };

  const handleAddUnit = () => {
    // إضافة وحدة جديدة
  };

  // Filter functions
  const filteredDepartments = mockDepartments.filter(dept =>
    dept.name.toLowerCase().includes(departmentSearch.toLowerCase()) ||
    dept.headOfDepartment?.toLowerCase().includes(departmentSearch.toLowerCase())
  );

  const filteredDivisions = mockDivisions.filter(division =>
    division.name.toLowerCase().includes(divisionSearch.toLowerCase()) ||
    division.headOfDivision?.toLowerCase().includes(divisionSearch.toLowerCase()) ||
    division.departmentName?.toLowerCase().includes(divisionSearch.toLowerCase())
  );

  const filteredUnits = mockUnits.filter(unit =>
    unit.name.toLowerCase().includes(unitSearch.toLowerCase()) ||
    unit.unitHead?.toLowerCase().includes(unitSearch.toLowerCase()) ||
    unit.divisionName?.toLowerCase().includes(unitSearch.toLowerCase()) ||
    unit.departmentName?.toLowerCase().includes(unitSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">الأقسام</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.departments}</div>
            <p className="text-xs text-muted-foreground">إجمالي الأقسام</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">الشعب</CardTitle>
            <GitBranch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.divisions}</div>
            <p className="text-xs text-muted-foreground">إجمالي الشعب</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">الوحدات</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.units}</div>
            <p className="text-xs text-muted-foreground">إجمالي الوحدات</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              إدارة الهيكل التنظيمي
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline">
                <Upload className="ml-2 h-4 w-4" />
                استيراد
              </Button>
              <Button variant="outline">
                <Download className="ml-2 h-4 w-4" />
                تصدير
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="departments" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="departments" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                الأقسام
              </TabsTrigger>
              <TabsTrigger value="divisions" className="flex items-center gap-2">
                <GitBranch className="h-4 w-4" />
                الشعب
              </TabsTrigger>
              <TabsTrigger value="units" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                الوحدات
              </TabsTrigger>
            </TabsList>

            {/* Departments Tab */}
            <TabsContent value="departments" className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex-1 relative max-w-md">
                  <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="البحث عن قسم..."
                    value={departmentSearch}
                    onChange={(e) => setDepartmentSearch(e.target.value)}
                    className="pr-10"
                  />
                </div>
                <Button onClick={handleAddDepartment} className="bg-green-600 hover:bg-green-700">
                  <Plus className="ml-2 h-4 w-4" />
                  قسم جديد
                </Button>
              </div>

              <div className="border rounded-lg overflow-x-auto">
                <Table dir="rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">اسم القسم</TableHead>
                      <TableHead className="text-right">الوصف</TableHead>
                      <TableHead className="text-right">رئيس القسم</TableHead>
                      <TableHead className="text-right">عدد الموظفين</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-center">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDepartments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          لا توجد أقسام
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredDepartments.map((department) => (
                        <TableRow key={department.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-blue-600" />
                              {department.name}
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {department.description}
                          </TableCell>
                          <TableCell>{department.headOfDepartment}</TableCell>
                          <TableCell>{department.employeeCount}</TableCell>
                          <TableCell>
                            <Badge variant={department.isActive ? 'default' : 'secondary'}>
                              {department.isActive ? 'نشط' : 'غير نشط'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-center gap-1">
                              <Button size="sm" variant="ghost">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Divisions Tab */}
            <TabsContent value="divisions" className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex-1 relative max-w-md">
                  <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="البحث عن شعبة..."
                    value={divisionSearch}
                    onChange={(e) => setDivisionSearch(e.target.value)}
                    className="pr-10"
                  />
                </div>
                <Button onClick={handleAddDivision} className="bg-green-600 hover:bg-green-700">
                  <Plus className="ml-2 h-4 w-4" />
                  شعبة جديدة
                </Button>
              </div>

              <div className="border rounded-lg overflow-x-auto">
                <Table dir="rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">اسم الشعبة</TableHead>
                      <TableHead className="text-right">القسم التابع له</TableHead>
                      <TableHead className="text-right">رئيس الشعبة</TableHead>
                      <TableHead className="text-right">عدد الموظفين</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-center">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDivisions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          لا توجد شعب
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredDivisions.map((division) => (
                        <TableRow key={division.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <GitBranch className="h-4 w-4 text-green-600" />
                              {division.name}
                            </div>
                          </TableCell>
                          <TableCell>{division.departmentName}</TableCell>
                          <TableCell>{division.headOfDivision}</TableCell>
                          <TableCell>{division.employeeCount}</TableCell>
                          <TableCell>
                            <Badge variant={division.isActive ? 'default' : 'secondary'}>
                              {division.isActive ? 'نشط' : 'غير نشط'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-center gap-1">
                              <Button size="sm" variant="ghost">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Units Tab */}
            <TabsContent value="units" className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex-1 relative max-w-md">
                  <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="البحث عن وحدة..."
                    value={unitSearch}
                    onChange={(e) => setUnitSearch(e.target.value)}
                    className="pr-10"
                  />
                </div>
                <Button onClick={handleAddUnit} className="bg-green-600 hover:bg-green-700">
                  <Plus className="ml-2 h-4 w-4" />
                  وحدة جديدة
                </Button>
              </div>

              <div className="border rounded-lg overflow-x-auto">
                <Table dir="rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">اسم الوحدة</TableHead>
                      <TableHead className="text-right">الشعبة التابعة لها</TableHead>
                      <TableHead className="text-right">القسم التابع له</TableHead>
                      <TableHead className="text-right">رئيس الوحدة</TableHead>
                      <TableHead className="text-right">عدد الموظفين</TableHead>
                      <TableHead className="text-center">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUnits.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          لا توجد وحدات
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUnits.map((unit) => (
                        <TableRow key={unit.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-orange-600" />
                              {unit.name}
                            </div>
                          </TableCell>
                          <TableCell>{unit.divisionName}</TableCell>
                          <TableCell>{unit.departmentName}</TableCell>
                          <TableCell>{unit.unitHead}</TableCell>
                          <TableCell>{unit.employeeCount}</TableCell>
                          <TableCell>
                            <div className="flex justify-center gap-1">
                              <Button size="sm" variant="ghost">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DepartmentsPage;
