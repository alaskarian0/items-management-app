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

type Unit = {
  id: number;
  name: string;
  abbreviation?: string;
  category?: string;
};

const mockUnits: Unit[] = [
  { id: 1, name: "قطعة", abbreviation: "قطع", category: "عد" },
  { id: 2, name: "كيلوغرام", abbreviation: "كغم", category: "وزن" },
  { id: 3, name: "غرام", abbreviation: "غم", category: "وزن" },
  { id: 4, name: "متر", abbreviation: "م", category: "طول" },
  { id: 5, name: "سنتيمتر", abbreviation: "سم", category: "طول" },
  { id: 6, name: "لتر", abbreviation: "ل", category: "حجم" },
  { id: 7, name: "مليلتر", abbreviation: "مل", category: "حجم" },
  { id: 8, name: "كرتون", abbreviation: "كرتون", category: "حزمة" },
  { id: 9, name: "حزمة", abbreviation: "حزمة", category: "حزمة" },
  { id: 10, name: "علبة", abbreviation: "علبة", category: "حزمة" },
];

const categories = ["عد", "وزن", "طول", "حجم", "حزمة"];

const UnitsPage = () => {
  const [units, setUnits] = useState<Unit[]>(mockUnits);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentUnit, setCurrentUnit] = useState<Unit | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    abbreviation: "",
    category: "",
  });

  // Filter units
  const filteredUnits = useMemo(() => {
    return units.filter(
      (unit) =>
        unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        unit.abbreviation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        unit.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [units, searchTerm]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalUnits = units.length;
    const categoriesCount = new Set(units.map((u) => u.category)).size;
    return { totalUnits, categoriesCount };
  }, [units]);

  const handleAddNew = () => {
    setCurrentUnit(null);
    setFormData({ name: "", abbreviation: "", category: "" });
    setIsDialogOpen(true);
  };

  const handleEdit = (unit: Unit) => {
    setCurrentUnit(unit);
    setFormData({
      name: unit.name,
      abbreviation: unit.abbreviation || "",
      category: unit.category || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذه الوحدة؟")) {
      setUnits(units.filter((u) => u.id !== id));
    }
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert("الرجاء إدخال اسم الوحدة");
      return;
    }

    if (currentUnit) {
      // Edit
      setUnits(
        units.map((u) =>
          u.id === currentUnit.id ? { ...u, ...formData } : u
        )
      );
    } else {
      // Add
      const newId = units.length > 0 ? Math.max(...units.map((d) => d.id)) + 1 : 1;
      setUnits([...units, { id: newId, ...formData }]);
    }
    setIsDialogOpen(false);
    setFormData({ name: "", abbreviation: "", category: "" });
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
            <CardTitle className="text-sm font-medium">التصنيفات</CardTitle>
            <Hash className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.categoriesCount}
            </div>
            <p className="text-xs text-muted-foreground">تصنيف مختلف</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الأكثر شيوعاً</CardTitle>
            <Ruler className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">قطعة</div>
            <p className="text-xs text-muted-foreground">وحدة القياس الأساسية</p>
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
          {/* Search */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="ابحث عن وحدة قياس..."
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
                  <TableHead>اسم الوحدة</TableHead>
                  <TableHead>الاختصار</TableHead>
                  <TableHead>التصنيف</TableHead>
                  <TableHead className="text-left">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUnits.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground h-24"
                    >
                      لا توجد وحدات تطابق معايير البحث
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUnits.map((unit) => (
                    <TableRow key={unit.id}>
                      <TableCell>
                        <Badge variant="outline">{unit.id}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Ruler className="h-4 w-4 text-orange-600" />
                          {unit.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-mono">
                          {unit.abbreviation || "-"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {unit.category ? (
                          <Badge
                            variant="outline"
                            className={
                              unit.category === "وزن"
                                ? "bg-blue-50 text-blue-700"
                                : unit.category === "طول"
                                ? "bg-green-50 text-green-700"
                                : unit.category === "حجم"
                                ? "bg-purple-50 text-purple-700"
                                : unit.category === "حزمة"
                                ? "bg-yellow-50 text-yellow-700"
                                : "bg-gray-50 text-gray-700"
                            }
                          >
                            {unit.category}
                          </Badge>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell className="text-left">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(unit)}
                            title="تعديل"
                          >
                            <Edit className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(unit.id)}
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
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Ruler className="h-5 w-5 text-orange-600" />
              {currentUnit ? "تعديل وحدة" : "إضافة وحدة جديدة"}
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
              <Label htmlFor="abbreviation">الاختصار</Label>
              <Input
                id="abbreviation"
                value={formData.abbreviation}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, abbreviation: e.target.value }))
                }
                placeholder="مثال: كغم"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">التصنيف</Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, category: e.target.value }))
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">اختر التصنيف...</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
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
