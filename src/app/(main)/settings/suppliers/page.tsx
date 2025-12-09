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
  Truck,
  Search,
  Phone,
  MapPin,
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
  suppliers,
  getSupplierByCode,
  searchSuppliers,
  getActiveSuppliers,
} from "@/lib/data/settings-data";
import {
  type Supplier,
  SUPPLIER_CATEGORIES
} from "@/lib/types/settings";

const SuppliersPage = () => {
  const [suppliersList, setSuppliersList] = useState<Supplier[]>(suppliers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState<Supplier | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    contactPerson: "",
    phone: "",
    address: "",
    website: "",
    category: "",
    taxNumber: "",
    commercialNumber: "",
    bankAccount: "",
    bankName: "",
    notes: ""
  });

  // Filter suppliers
  const filteredSuppliers = useMemo(() => {
    return suppliersList.filter((supplier) => {
      const matchesSearch =
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === "all" || supplier.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [suppliersList, searchTerm, filterCategory]);

  const handleAddNew = () => {
    setCurrentSupplier(null);
    setFormData({
      name: "",
      description: "",
      contactPerson: "",
      phone: "",
      address: "",
      website: "",
      category: "",
      taxNumber: "",
      commercialNumber: "",
      bankAccount: "",
      bankName: "",
      notes: ""
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (supplier: Supplier) => {
    setCurrentSupplier(supplier);
    setFormData({
      name: supplier.name,
      description: supplier.description || "",
      contactPerson: supplier.contactPerson || "",
      phone: supplier.phone,
      address: supplier.address || "",
      website: supplier.website || "",
      category: supplier.category,
      taxNumber: supplier.taxNumber || "",
      commercialNumber: supplier.commercialNumber || "",
      bankAccount: supplier.bankAccount || "",
      bankName: supplier.bankName || "",
      notes: supplier.notes || ""
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذا المورد؟")) {
      setSuppliersList(suppliersList.filter((supplier) => supplier.id !== id));
    }
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert("الرجاء إدخال اسم المورد");
      return;
    }

    if (currentSupplier) {
      // Edit
      setSuppliersList(
        suppliersList.map((supplier) =>
          supplier.id === currentSupplier.id
            ? {
              ...supplier,
              ...formData,
            }
            : supplier
        )
      );
    } else {
      // Add
      const newId =
        suppliersList.length > 0
          ? Math.max(...suppliersList.map((s) => s.id)) + 1
          : 1;
      setSuppliersList([
        ...suppliersList,
        {
          id: newId,
          ...formData,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);
    }
    setIsDialogOpen(false);
    setFormData({
      name: "",
      description: "",
      contactPerson: "",
      phone: "",
      address: "",
      website: "",
      category: "",
      taxNumber: "",
      commercialNumber: "",
      bankAccount: "",
      bankName: "",
      notes: ""
    });
    setCurrentSupplier(null);
  };

  const activeSuppliersCount = getActiveSuppliers().length;
  const totalSuppliersCount = suppliersList.length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Truck className="h-8 w-8 text-blue-600" />
          إدارة الموردين
        </h2>
        <p className="text-muted-foreground mt-1">
          إدارة وتنظيم معلومات الموردين والمتعاقدين
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              إجمالي الموردين
            </CardTitle>
            <Truck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {totalSuppliersCount}
            </div>
            <p className="text-xs text-muted-foreground">مورد مسجل</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              الموردين النشطون
            </CardTitle>
            <Truck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {activeSuppliersCount}
            </div>
            <p className="text-xs text-muted-foreground">مورد نشط</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>قائمة الموردين</CardTitle>
            <Button onClick={handleAddNew}>
              <PlusCircle className="ml-2 h-4 w-4" />
              إضافة مورد جديد
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ابحث عن مورد..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            <div className="w-full sm:w-64">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الفئة..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الفئات</SelectItem>
                  {SUPPLIER_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
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
                  <TableHead className="text-right">اسم المورد</TableHead>
                  <TableHead className="text-right">الفئة</TableHead>
                  <TableHead className="text-right">الشخص المسؤول</TableHead>
                  <TableHead className="text-right">رقم الهاتف</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-center">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      لا توجد موردين مطابقة للبحث
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSuppliers.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell className="font-medium">{supplier.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{supplier.category}</Badge>
                      </TableCell>
                      <TableCell>{supplier.contactPerson || "-"}</TableCell>
                      <TableCell className="font-mono text-sm">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {supplier.phone}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={supplier.isActive ? "default" : "secondary"}>
                          {supplier.isActive ? "نشط" : "متوقف"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(supplier)}
                            title="تعديل"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(supplier.id)}
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
              <Truck className="h-5 w-5 text-blue-600" />
              {currentSupplier ? "تعديل مورد" : "إضافة مورد جديد"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">اسم المورد *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
                placeholder="مثال: شركة النبلاء"
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">الفئة</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData((f) => ({ ...f, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الفئة" />
                </SelectTrigger>
                <SelectContent>
                  {SUPPLIER_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPerson">الشخص المسؤول</Label>
              <Input
                id="contactPerson"
                value={formData.contactPerson}
                onChange={(e) => setFormData((f) => ({ ...f, contactPerson: e.target.value }))}
                placeholder="اسم الشخص المسؤول"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData((f) => ({ ...f, phone: e.target.value }))}
                placeholder="رقم الهاتف"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">العنوان</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData((f) => ({ ...f, address: e.target.value }))}
                placeholder="العنوان"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">الموقع الإلكتروني</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => setFormData((f) => ({ ...f, website: e.target.value }))}
                placeholder="الموقع الإلكتروني"
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="notes">ملاحظات</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData((f) => ({ ...f, notes: e.target.value }))}
                placeholder="ملاحظات إضافية..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleSave}>
              {currentSupplier ? "حفظ التعديلات" : "إضافة"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SuppliersPage;