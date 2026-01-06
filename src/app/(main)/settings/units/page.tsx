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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PlusCircle,
  Edit,
  Trash2,
  Ruler,
  Search,
  Hash,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Import shared data and types
import {
  measurementUnits,
  getMeasurementUnitsByType
} from "@/lib/data/settings-data";
import { UNIT_TYPES, type MeasurementUnit } from "@/lib/types/settings";

const UnitsPage = () => {
  const [unitsList, setUnitsList] = useState<MeasurementUnit[]>(measurementUnits);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentUnit, setCurrentUnit] = useState<MeasurementUnit | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [formData, setFormData] = useState<{
    name: string;
    nameEnglish: string;
    abbreviation: string;
    abbreviationEnglish: string;
    type: 'weight' | 'length' | 'volume' | 'area' | 'count' | 'time' | 'temperature';
    baseUnit: string;
    conversionFactor: number;
    description: string;
  }>({
    name: "",
    nameEnglish: "",
    abbreviation: "",
    abbreviationEnglish: "",
    type: "count",
    baseUnit: "",
    conversionFactor: 0,
    description: ""
  });

  // Filter units
  const filteredUnits = useMemo(() => {
    return unitsList.filter(
      (unit) => {
        const matchesSearch =
          unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          unit.abbreviation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          unit.nameEnglish?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          unit.abbreviationEnglish?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === "all" || unit.type === filterType;
        return matchesSearch && matchesType;
      }
    );
  }, [unitsList, searchTerm, filterType]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalUnits = unitsList.length;
    const activeUnits = unitsList.filter(u => u.isActive).length;
    const typesCount = new Set(unitsList.map((u) => u.type)).size;
    return { totalUnits, activeUnits, typesCount };
  }, [unitsList]);

  const handleAddNew = () => {
    setCurrentUnit(null);
    setFormData({
      name: "",
      nameEnglish: "",
      abbreviation: "",
      abbreviationEnglish: "",
      type: "count",
      baseUnit: "",
      conversionFactor: 0,
      description: ""
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (unit: MeasurementUnit) => {
    setCurrentUnit(unit);
    setFormData({
      name: unit.name,
      nameEnglish: unit.nameEnglish || "",
      abbreviation: unit.abbreviation,
      abbreviationEnglish: unit.abbreviationEnglish || "",
      type: unit.type,
      baseUnit: unit.baseUnit || "",
      conversionFactor: unit.conversionFactor || 0,
      description: unit.description || ""
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذه الوحدة؟")) {
      setUnitsList(unitsList.filter((u) => u.id !== id));
    }
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert("الرجاء إدخال اسم الوحدة");
      return;
    }

    if (currentUnit) {
      // Edit
      setUnitsList(
        unitsList.map((u) =>
          u.id === currentUnit.id
            ? {
                ...u,
                name: formData.name,
                nameEnglish: formData.nameEnglish,
                abbreviation: formData.abbreviation,
                abbreviationEnglish: formData.abbreviationEnglish,
                type: formData.type,
                baseUnit: formData.baseUnit || undefined,
                conversionFactor: formData.conversionFactor || undefined,
                description: formData.description
              }
            : u
        )
      );
    } else {
      // Add
      const newId =
        unitsList.length > 0
          ? Math.max(...unitsList.map((u) => u.id)) + 1
          : 1;
      const newCode = formData.abbreviation.toUpperCase();
      setUnitsList([
        ...unitsList,
        {
          id: newId,
          code: newCode,
          name: formData.name,
          nameEnglish: formData.nameEnglish,
          abbreviation: formData.abbreviation,
          abbreviationEnglish: formData.abbreviationEnglish,
          type: formData.type,
          baseUnit: formData.baseUnit || undefined,
          conversionFactor: formData.conversionFactor || undefined,
          isActive: true,
          description: formData.description,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);
    }
    setIsDialogOpen(false);
    setFormData({
      name: "",
      nameEnglish: "",
      abbreviation: "",
      abbreviationEnglish: "",
      type: "count",
      baseUnit: "",
      conversionFactor: 0,
      description: ""
    });
    setCurrentUnit(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Ruler className="h-8 w-8 text-orange-600" />
          إدارة وحدات القياس
        </h2>
        <p className="text-muted-foreground mt-1">
          إدارة وحدات القياس المستخدمة في النظام
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              إجمالي الوحدات
            </CardTitle>
            <Ruler className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.totalUnits}
            </div>
            <p className="text-xs text-muted-foreground">وحدة قياس</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الوحدات النشطة</CardTitle>
            <Hash className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.activeUnits}
            </div>
            <p className="text-xs text-muted-foreground">وحدة نشطة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">أنواع الوحدات</CardTitle>
            <Ruler className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.typesCount}
            </div>
            <p className="text-xs text-muted-foreground">نوع مختلف</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>قائمة وحدات القياس</CardTitle>
            <Button onClick={handleAddNew}>
              <PlusCircle className="ml-2 h-4 w-4" />
              إضافة وحدة جديدة
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ابحث عن وحدة قياس..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            <div className="w-full sm:w-64">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر النوع..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأنواع</SelectItem>
                  {UNIT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <div className="border rounded-md">
            <Table dir="rtl">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">الكود</TableHead>
                  <TableHead className="text-right">اسم الوحدة</TableHead>
                  <TableHead className="text-right">الاسم بالإنجليزية</TableHead>
                  <TableHead className="text-right">الاختصار</TableHead>
                  <TableHead className="text-right">النوع</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-center">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUnits.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-muted-foreground h-24"
                    >
                      لا توجد وحدات تطابق معايير البحث
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUnits.map((unit) => (
                    <TableRow key={unit.id}>
                      <TableCell>
                        <Badge variant="outline">{unit.code}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Ruler className="h-4 w-4 text-orange-600" />
                          {unit.name}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {unit.nameEnglish || "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-mono">
                          {unit.abbreviation}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {UNIT_TYPES.find(t => t.value === unit.type)?.label || unit.type}
                      </TableCell>
                      <TableCell>
                        <Badge variant={unit.isActive ? "default" : "secondary"}>
                          {unit.isActive ? "نشط" : "متوقف"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(unit)}
                            title="تعديل"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(unit.id)}
                            title="حذف"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
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
              <Ruler className="h-5 w-5 text-orange-600" />
              {currentUnit ? "تعديل وحدة قياس" : "إضافة وحدة قياس جديدة"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">اسم الوحدة *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="مثال: كيلوغرام"
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nameEnglish">الاسم بالإنجليزية</Label>
              <Input
                id="nameEnglish"
                value={formData.nameEnglish}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, nameEnglish: e.target.value }))
                }
                placeholder="مثال: Kilogram"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="abbreviation">الاختصار بالعربية *</Label>
              <Input
                id="abbreviation"
                value={formData.abbreviation}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, abbreviation: e.target.value }))
                }
                placeholder="مثال: كجم"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="abbreviationEnglish">الاختصار بالإنجليزية</Label>
              <Input
                id="abbreviationEnglish"
                value={formData.abbreviationEnglish}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, abbreviationEnglish: e.target.value }))
                }
                placeholder="مثال: KG"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">النوع</Label>
              <Select value={formData.type} onValueChange={(value: any) => setFormData((f) => ({ ...f, type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر النوع..." />
                </SelectTrigger>
                <SelectContent>
                  {UNIT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {(formData.type === 'count' || formData.type === 'length' || formData.type === 'weight' || formData.type === 'volume') && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="baseUnit">الوحدة الأساسية</Label>
                  <Input
                    id="baseUnit"
                    value={formData.baseUnit}
                    onChange={(e) =>
                      setFormData((f) => ({ ...f, baseUnit: e.target.value }))
                    }
                    placeholder="مثال: غرام للكيلوغرام"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="conversionFactor">معامل التحويل</Label>
                  <Input
                    id="conversionFactor"
                    type="number"
                    value={formData.conversionFactor}
                    onChange={(e) =>
                      setFormData((f) => ({ ...f, conversionFactor: parseFloat(e.target.value) || 0 }))
                    }
                    placeholder="مثال: 1000"
                  />
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="description">الوصف</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="وصف الوحدة..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleSave}>
              {currentUnit ? "حفظ التعديلات" : "إضافة"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UnitsPage;
