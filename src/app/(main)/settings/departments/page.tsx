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

// Import shared data and types
import {
  departments,
  divisions,
  units,
  getDepartmentById,
  getDivisionById,
  getUnitById,
  getDivisionsByDepartment,
  getUnitsByDivision,
} from "@/lib/data/settings-data";
import {
  type Department,
  type Division,
  type Unit
} from "@/lib/types/settings";


const DepartmentsPage = () => {
  const [departmentsList, setDepartmentsList] = useState<Department[]>(departments);
  const [divisionsList, setDivisionsList] = useState<Division[]>(divisions);
  const [unitsList, setUnitsList] = useState<Unit[]>(units);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentSearch, setDepartmentSearch] = useState("");
  const [divisionSearch, setDivisionSearch] = useState("");
  const [unitSearch, setUnitSearch] = useState("");

  // Dialog states
  const [isDepartmentDialogOpen, setIsDepartmentDialogOpen] = useState(false);
  const [isDivisionDialogOpen, setIsDivisionDialogOpen] = useState(false);
  const [isUnitDialogOpen, setIsUnitDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [editingDivision, setEditingDivision] = useState<Division | null>(null);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);

  // Form states
  const [departmentForm, setDepartmentForm] = useState({
    name: "",
    description: "",
    headOfDepartment: "",
    employeeCount: 0,
    isActive: true
  });

  const [divisionForm, setDivisionForm] = useState({
    name: "",
    description: "",
    headOfDivision: "",
    employeeCount: 0,
    departmentId: 0,
    departmentName: "",
    isActive: true
  });

  const [unitForm, setUnitForm] = useState({
    name: "",
    description: "",
    unitHead: "",
    employeeCount: 0,
    divisionId: 0,
    departmentId: 0,
    divisionName: "",
    departmentName: "",
    isActive: true
  });

  const stats = {
    departments: departments.length,
    divisions: divisions.length,
    units: units.length,
  };

  // Department handlers
  const handleAddDepartment = () => {
    setEditingDepartment(null);
    setDepartmentForm({
      name: "",
      description: "",
      headOfDepartment: "",
      employeeCount: 0,
      isActive: true
    });
    setIsDepartmentDialogOpen(true);
  };

  const handleEditDepartment = (department: Department) => {
    setEditingDepartment(department);
    setDepartmentForm({
      name: department.name,
      description: department.description || "",
      headOfDepartment: department.headOfDepartment || "",
      employeeCount: department.employeeCount || 0,
      isActive: department.isActive ?? true
    });
    setIsDepartmentDialogOpen(true);
  };

  const handleSaveDepartment = () => {
    if (!departmentForm.name.trim()) {
      alert("الرجاء إدخال اسم القسم");
      return;
    }

    if (editingDepartment) {
      // Edit existing department
      setDepartmentsList(departmentsList.map(dept =>
        dept.id === editingDepartment.id
          ? {
            ...dept,
            ...departmentForm,
            updatedAt: new Date().toISOString()
          }
          : dept
      ));
    } else {
      // Add new department
      const newId = Math.max(...departmentsList.map(d => d.id), 0) + 1;
      const newDepartment: Department = {
        id: newId,
        ...departmentForm,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setDepartmentsList([...departmentsList, newDepartment]);
    }

    setIsDepartmentDialogOpen(false);
    setEditingDepartment(null);
  };

  // Division handlers
  const handleAddDivision = () => {
    setEditingDivision(null);
    setDivisionForm({
      name: "",
      description: "",
      headOfDivision: "",
      employeeCount: 0,
      departmentId: 0,
      departmentName: "",
      isActive: true
    });
    setIsDivisionDialogOpen(true);
  };

  const handleEditDivision = (division: Division) => {
    setEditingDivision(division);
    setDivisionForm({
      name: division.name,
      description: division.description || "",
      headOfDivision: division.headOfDivision || "",
      employeeCount: division.employeeCount || 0,
      departmentId: division.departmentId,
      departmentName: division.departmentName || "",
      isActive: division.isActive ?? true
    });
    setIsDivisionDialogOpen(true);
  };

  const handleSaveDivision = () => {
    if (!divisionForm.name.trim()) {
      alert("الرجاء إدخال اسم الشعبة");
      return;
    }

    if (editingDivision) {
      // Edit existing division
      setDivisionsList(divisionsList.map(div =>
        div.id === editingDivision.id
          ? {
            ...div,
            ...divisionForm,
            updatedAt: new Date().toISOString()
          }
          : div
      ));
    } else {
      // Add new division
      const newId = Math.max(...divisionsList.map(d => d.id), 0) + 1;
      const newDivision: Division = {
        id: newId,
        ...divisionForm,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setDivisionsList([...divisionsList, newDivision]);
    }

    setIsDivisionDialogOpen(false);
    setEditingDivision(null);
  };

  // Unit handlers
  const handleAddUnit = () => {
    setEditingUnit(null);
    setUnitForm({
      name: "",
      description: "",
      unitHead: "",
      employeeCount: 0,
      divisionId: 0,
      departmentId: 0,
      divisionName: "",
      departmentName: "",
      isActive: true
    });
    setIsUnitDialogOpen(true);
  };

  const handleEditUnit = (unit: Unit) => {
    setEditingUnit(unit);
    setUnitForm({
      name: unit.name,
      description: unit.description || "",
      unitHead: unit.unitHead || "",
      employeeCount: unit.employeeCount || 0,
      divisionId: unit.divisionId,
      departmentId: unit.departmentId || 0,
      divisionName: unit.divisionName || "",
      departmentName: unit.departmentName || "",
      isActive: unit.isActive ?? true
    });
    setIsUnitDialogOpen(true);
  };

  const handleSaveUnit = () => {
    if (!unitForm.name.trim()) {
      alert("الرجاء إدخال اسم الوحدة");
      return;
    }

    if (editingUnit) {
      // Edit existing unit
      setUnitsList(unitsList.map(unit =>
        unit.id === editingUnit.id
          ? {
            ...unit,
            ...unitForm,
            updatedAt: new Date().toISOString()
          }
          : unit
      ));
    } else {
      // Add new unit
      const newId = Math.max(...unitsList.map(u => u.id), 0) + 1;
      const newUnit: Unit = {
        id: newId,
        ...unitForm,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setUnitsList([...unitsList, newUnit]);
    }

    setIsUnitDialogOpen(false);
    setEditingUnit(null);
  };

  // Filter functions
  const filteredDepartments = departmentsList.filter(
    (dept) =>
      dept.name.toLowerCase().includes(departmentSearch.toLowerCase()) ||
      dept.headOfDepartment
        ?.toLowerCase()
        .includes(departmentSearch.toLowerCase())
  );

  const filteredDivisions = divisionsList.filter(
    (division) =>
      division.name.toLowerCase().includes(divisionSearch.toLowerCase()) ||
      division.headOfDivision
        ?.toLowerCase()
        .includes(divisionSearch.toLowerCase()) ||
      division.departmentName
        ?.toLowerCase()
        .includes(divisionSearch.toLowerCase())
  );

  const filteredUnits = unitsList.filter(
    (unit) =>
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
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="departments" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger
                value="departments"
                className="flex items-center gap-2"
              >
                <Building2 className="h-4 w-4" />
                الأقسام
              </TabsTrigger>
              <TabsTrigger
                value="divisions"
                className="flex items-center gap-2"
              >
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
                <Button
                  onClick={handleAddDepartment}
                  className="bg-green-600 hover:bg-green-700"
                >
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
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-center">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDepartments.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center py-8 text-muted-foreground"
                        >
                          لا توجد أقسام
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredDepartments.map((department) => (
                        <TableRow
                          key={department.id}
                          className="hover:bg-muted/50"
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-blue-600" />
                              {department.name}
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {department.description}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                department.isActive ? "default" : "secondary"
                              }
                            >
                              {department.isActive ? "نشط" : "غير نشط"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-center gap-1">
                              <Button size="sm" variant="ghost">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEditDepartment(department)}
                              >
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
                <Button
                  onClick={handleAddDivision}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="ml-2 h-4 w-4" />
                  شعبة جديدة
                </Button>
              </div>

              <div className="border rounded-lg overflow-x-auto">
                <Table dir="rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">اسم الشعبة</TableHead>
                      <TableHead className="text-right">
                        القسم التابع له
                      </TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-center">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDivisions.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center py-8 text-muted-foreground"
                        >
                          لا توجد شعب
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredDivisions.map((division) => (
                        <TableRow
                          key={division.id}
                          className="hover:bg-muted/50"
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <GitBranch className="h-4 w-4 text-green-600" />
                              {division.name}
                            </div>
                          </TableCell>
                          <TableCell>{division.departmentName}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                division.isActive ? "default" : "secondary"
                              }
                            >
                              {division.isActive ? "نشط" : "غير نشط"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-center gap-1">
                              <Button size="sm" variant="ghost">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEditDivision(division)}
                              >
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
                <Button
                  onClick={handleAddUnit}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="ml-2 h-4 w-4" />
                  وحدة جديدة
                </Button>
              </div>

              <div className="border rounded-lg overflow-x-auto">
                <Table dir="rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">اسم الوحدة</TableHead>
                      <TableHead className="text-right">
                        الشعبة التابعة لها
                      </TableHead>
                      <TableHead className="text-right">
                        القسم التابع له
                      </TableHead>
                      <TableHead className="text-center">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUnits.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center py-8 text-muted-foreground"
                        >
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
                          <TableCell>
                            <div className="flex justify-center gap-1">
                              <Button size="sm" variant="ghost">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEditUnit(unit)}
                              >
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

      {/* Department Dialog */}
      <Dialog open={isDepartmentDialogOpen} onOpenChange={setIsDepartmentDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {editingDepartment ? "تعديل القسم" : "إضافة قسم جديد"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="deptName">اسم القسم *</Label>
              <Input
                id="deptName"
                value={departmentForm.name}
                onChange={(e) => setDepartmentForm(f => ({ ...f, name: e.target.value }))}
                placeholder="أدخل اسم القسم"
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deptDescription">الوصف</Label>
              <Textarea
                id="deptDescription"
                value={departmentForm.description}
                onChange={(e) => setDepartmentForm(f => ({ ...f, description: e.target.value }))}
                placeholder="وصف القسم ومسؤولياته"
                rows={3}
              />
            </div>
            <div className="flex items-center space-2">
              <input
                type="checkbox"
                id="deptActive"
                checked={departmentForm.isActive}
                onChange={(e) => setDepartmentForm(f => ({ ...f, isActive: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <Label htmlFor="deptActive">قسم نشط</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDepartmentDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleSaveDepartment}>
              {editingDepartment ? "حفظ التعديلات" : "إضافة"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Division Dialog */}
      <Dialog open={isDivisionDialogOpen} onOpenChange={setIsDivisionDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              {editingDivision ? "تعديل الشعبة" : "إضافة شعبة جديدة"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="divName">اسم الشعبة *</Label>
              <Input
                id="divName"
                value={divisionForm.name}
                onChange={(e) => setDivisionForm(f => ({ ...f, name: e.target.value }))}
                placeholder="أدخل اسم الشعبة"
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="divDescription">الوصف</Label>
              <Textarea
                id="divDescription"
                value={divisionForm.description}
                onChange={(e) => setDivisionForm(f => ({ ...f, description: e.target.value }))}
                placeholder="وصف الشعبة ومسؤولياتها"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="divHead">رئيس الشعبة</Label>
              <Input
                id="divHead"
                value={divisionForm.headOfDivision}
                onChange={(e) => setDivisionForm(f => ({ ...f, headOfDivision: e.target.value }))}
                placeholder="اسم رئيس الشعبة"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="divEmployees">عدد الموظفين</Label>
              <Input
                id="divEmployees"
                type="number"
                value={divisionForm.employeeCount}
                onChange={(e) => setDivisionForm(f => ({ ...f, employeeCount: parseInt(e.target.value) || 0 }))}
                placeholder="عدد الموظفين في الشعبة"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="divDepartment">القسم التابع له</Label>
              <select
                id="divDepartment"
                value={divisionForm.departmentId}
                onChange={(e) => {
                  const dept = departmentsList.find(d => d.id === parseInt(e.target.value));
                  setDivisionForm(f => ({
                    ...f,
                    departmentId: parseInt(e.target.value),
                    departmentName: dept?.name || ""
                  }));
                }}
                className="w-full p-2 border rounded-md"
              >
                <option value="">اختر القسم</option>
                {departmentsList.map(dept => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-2">
              <input
                type="checkbox"
                id="divActive"
                checked={divisionForm.isActive}
                onChange={(e) => setDivisionForm(f => ({ ...f, isActive: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <Label htmlFor="divActive">شعبة نشطة</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDivisionDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleSaveDivision}>
              {editingDivision ? "حفظ التعديلات" : "إضافة"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unit Dialog */}
      <Dialog open={isUnitDialogOpen} onOpenChange={setIsUnitDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {editingUnit ? "تعديل الوحدة" : "إضافة وحدة جديدة"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="unitName">اسم الوحدة *</Label>
              <Input
                id="unitName"
                value={unitForm.name}
                onChange={(e) => setUnitForm(f => ({ ...f, name: e.target.value }))}
                placeholder="أدخل اسم الوحدة"
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unitDescription">الوصف</Label>
              <Textarea
                id="unitDescription"
                value={unitForm.description}
                onChange={(e) => setUnitForm(f => ({ ...f, description: e.target.value }))}
                placeholder="وصف الوحدة ومسؤولياتها"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unitHead">رئيس الوحدة</Label>
              <Input
                id="unitHead"
                value={unitForm.unitHead}
                onChange={(e) => setUnitForm(f => ({ ...f, unitHead: e.target.value }))}
                placeholder="اسم رئيس الوحدة"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unitEmployees">عدد الموظفين</Label>
              <Input
                id="unitEmployees"
                type="number"
                value={unitForm.employeeCount}
                onChange={(e) => setUnitForm(f => ({ ...f, employeeCount: parseInt(e.target.value) || 0 }))}
                placeholder="عدد الموظفين في الوحدة"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unitDivision">الشعبة التابعة لها</Label>
              <select
                id="unitDivision"
                value={unitForm.divisionId}
                onChange={(e) => {
                  const div = divisionsList.find(d => d.id === parseInt(e.target.value));
                  const dept = departmentsList.find(d => d.id === div?.departmentId);
                  setUnitForm(f => ({
                    ...f,
                    divisionId: parseInt(e.target.value),
                    divisionName: div?.name || "",
                    departmentId: div?.departmentId || 0,
                    departmentName: dept?.name || ""
                  }));
                }}
                className="w-full p-2 border rounded-md"
              >
                <option value="">اختر الشعبة</option>
                {divisionsList.map(div => (
                  <option key={div.id} value={div.id}>
                    {div.name} - {div.departmentName}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-2">
              <input
                type="checkbox"
                id="unitActive"
                checked={unitForm.isActive}
                onChange={(e) => setUnitForm(f => ({ ...f, isActive: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <Label htmlFor="unitActive">وحدة نشطة</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUnitDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleSaveUnit}>
              {editingUnit ? "حفظ التعديلات" : "إضافة"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DepartmentsPage;
