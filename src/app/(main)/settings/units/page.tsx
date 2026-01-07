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

// Import hooks and types
import { useMeasurementUnits, type MeasurementUnit, type UnitType, UNIT_TYPE_MAP } from "@/hooks/use-measurement-units";
import { useEffect } from "react";

// Unit types for dropdowns
const UNIT_TYPES = [
  { value: "weight", label: "وزن" },
  { value: "length", label: "طول" },
  { value: "volume", label: "حجم" },
  { value: "area", label: "مساحة" },
  { value: "count", label: "عدد" },
  { value: "time", label: "وقت" },
  { value: "temperature", label: "درجة حرارة" }
];

// Mapping from numeric type to Arabic label
const UNIT_TYPE_LABELS: Record<number, string> = {
  1: "وزن",
  2: "طول",
  3: "حجم",
  4: "مساحة",
  5: "عدد",
  6: "وقت",
  7: "درجة حرارة"
};

// Helper function to get type label
const getTypeLabel = (type: any): string => {
  if (typeof type === 'number') {
    return UNIT_TYPE_LABELS[type] || String(type);
  }
  return UNIT_TYPES.find(t => t.value === type)?.label || String(type);
};

const UnitsPage = () => {
  const { measurementUnits, loading, error, createMeasurementUnit, updateMeasurementUnit, deleteMeasurementUnit } = useMeasurementUnits();
  const [unitsList, setUnitsList] = useState<MeasurementUnit[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentUnit, setCurrentUnit] = useState<MeasurementUnit | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [formData, setFormData] = useState<{
    name: string;
    nameEnglish: string;
    abbreviation: string;
    abbreviationEnglish: string;
    type: UnitType;
    baseUnitId?: number;
    conversionFactor: number;
    description: string;
  }>({
    name: "",
    nameEnglish: "",
    abbreviation: "",
    abbreviationEnglish: "",
    type: "count",
    baseUnitId: undefined,
    conversionFactor: 0,
    description: ""
  });

  // Sync API data with local state
  useEffect(() => {
    if (measurementUnits?.data) {
      // Handle different response formats
      if (Array.isArray(measurementUnits.data)) {
        setUnitsList(measurementUnits.data);
      } else if ('items' in measurementUnits.data) {
        setUnitsList(measurementUnits.data.items);
      } else {
        setUnitsList([measurementUnits.data]);
      }
    }
  }, [measurementUnits]);

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
      baseUnitId: undefined,
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
      baseUnitId: unit.baseUnitId || undefined,
      conversionFactor: Number(unit.conversionFactor) || 0,
      description: unit.description || ""
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذه الوحدة؟")) {
      try {
        await deleteMeasurementUnit(id);
      } catch (error) {
        alert("حدث خطأ أثناء حذف الوحدة");
      }
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert("الرجاء إدخال اسم الوحدة");
      return;
    }

    if (!formData.abbreviation.trim()) {
      alert("الرجاء إدخال اختصار الوحدة");
      return;
    }

    try {
      const unitData = {
        name: formData.name,
        nameEnglish: formData.nameEnglish || undefined,
        abbreviation: formData.abbreviation,
        abbreviationEnglish: formData.abbreviationEnglish || undefined,
        type: formData.type,
        baseUnitId: formData.baseUnitId || undefined,
        conversionFactor: formData.conversionFactor || undefined,
        description: formData.description || undefined,
        isActive: true
      };

      if (currentUnit) {
        // Edit
        await updateMeasurementUnit(currentUnit.id, unitData);
      } else {
        // Add
        await createMeasurementUnit(unitData);
      }

      setIsDialogOpen(false);
      setFormData({
        name: "",
        nameEnglish: "",
        abbreviation: "",
        abbreviationEnglish: "",
        type: "count",
        baseUnitId: undefined,
        conversionFactor: 0,
        description: ""
      });
      setCurrentUnit(null);
    } catch (error) {
      alert("حدث خطأ أثناء حفظ الوحدة");
    }
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
              {loading ? "..." : stats.totalUnits}
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
              {loading ? "..." : stats.activeUnits}
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
              {loading ? "..." : stats.typesCount}
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
                  <TableHead className="text-right">اسم الوحدة</TableHead>
                  <TableHead className="text-right">الاسم بالإنجليزية</TableHead>
                  <TableHead className="text-right">الاختصار</TableHead>
                  <TableHead className="text-right">النوع</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-center">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-muted-foreground h-24"
                    >
                      جاري التحميل...
                    </TableCell>
                  </TableRow>
                ) : filteredUnits.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-muted-foreground h-24"
                    >
                      لا توجد وحدات تطابق معايير البحث
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUnits.map((unit) => (
                    <TableRow key={unit.id}>
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
                        <Badge variant="outline">{getTypeLabel(unit.type)}</Badge>
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
            <div className="space-y-2">
              <Label htmlFor="conversionFactor">معامل التحويل</Label>
              <Input
                id="conversionFactor"
                type="number"
                step="0.01"
                value={formData.conversionFactor}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, conversionFactor: parseFloat(e.target.value) || 0 }))
                }
                placeholder="مثال: 1000 (للتحويل من الوحدة الأساسية)"
              />
            </div>
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
