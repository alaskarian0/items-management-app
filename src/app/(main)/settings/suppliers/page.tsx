"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Textarea } from "@/components/ui/textarea";
import {
  BarChart3,
  Edit,
  Phone,
  PlusCircle,
  Search,
  Trash2,
  Truck,
  TrendingUp
} from "lucide-react";
import { useMemo, useState } from "react";

// Import hooks and types
import { useVendors, type Vendor } from "@/hooks/use-vendors";
import { useVendorCategories } from "@/hooks/use-vendor-categories";
import { useEffect } from "react";

const SuppliersPage = () => {
  const { vendors, loading, error, createVendor, updateVendor, deleteVendor: removeVendor } = useVendors();
  const { categories: categoriesData } = useVendorCategories();
  const [vendorsList, setVendorsList] = useState<Vendor[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentVendor, setCurrentVendor] = useState<Vendor | null>(null);
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
    rating: 5,
    notes: ""
  });

  // Extract categories from API response
  const apiCategories = categoriesData?.data || [];

  // Sync API data with local state
  useEffect(() => {
    if (vendors?.data) {
      // Handle different response formats
      if (Array.isArray(vendors.data)) {
        // Map vendors to include categoryName from the category relation
        const mappedVendors = vendors.data.map((vendor: any) => ({
          ...vendor,
          categoryName: vendor.category?.name || '',
        }));
        setVendorsList(mappedVendors);
      } else if ('items' in vendors.data) {
        const mappedVendors = vendors.data.items.map((vendor: any) => ({
          ...vendor,
          categoryName: vendor.category?.name || '',
        }));
        setVendorsList(mappedVendors);
      } else {
        const vendor = vendors.data as any;
        setVendorsList([{
          ...vendor,
          categoryName: vendor.category?.name || '',
        }]);
      }
    }
  }, [vendors]);

  // Filter vendors
  const filteredVendors = useMemo(() => {
    return vendorsList.filter((vendor) => {
      const matchesSearch =
        vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === "all" || vendor.categoryName === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [vendorsList, searchTerm, filterCategory]);

  const handleAddNew = () => {
    setCurrentVendor(null);
    setFormData({
      name: "",
      description: "",
      contactPerson: "",
      phone: "",
      address: "",
      website: "",
      category: "",
      rating: 5,
      notes: ""
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (vendor: Vendor) => {
    setCurrentVendor(vendor);
    setFormData({
      name: vendor.name,
      description: vendor.description || "",
      contactPerson: vendor.contactPerson || "",
      phone: vendor.phone,
      address: vendor.address || "",
      website: vendor.website || "",
      category: vendor.categoryName || "",
      rating: vendor.rating || 5,
      notes: vendor.notes || ""
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذا المورد؟")) {
      try {
        await removeVendor(id);
      } catch (error) {
        alert("حدث خطأ أثناء حذف المورد");
      }
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert("الرجاء إدخال اسم المورد");
      return;
    }

    if (!formData.contactPerson.trim()) {
      alert("الرجاء إدخال اسم الشخص المسؤول");
      return;
    }

    if (!formData.phone.trim()) {
      alert("الرجاء إدخال رقم الهاتف");
      return;
    }

    if (!formData.address.trim()) {
      alert("الرجاء إدخال العنوان");
      return;
    }

    try {
      // Find categoryId based on category name from API categories
      const category = apiCategories.find((cat: any) => cat.name === formData.category);
      const categoryId = category?.id;

      const vendorData = {
        name: formData.name,
        description: formData.description || undefined,
        contactPerson: formData.contactPerson,
        phone: formData.phone,
        address: formData.address,
        website: formData.website || undefined,
        categoryId,
        rating: formData.rating,
        notes: formData.notes || undefined,
        isActive: true
      };

      if (currentVendor) {
        // Edit
        await updateVendor(currentVendor.id, vendorData);
      } else {
        // Add
        await createVendor(vendorData);
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
        rating: 5,
        notes: ""
      });
      setCurrentVendor(null);
    } catch (error) {
      alert("حدث خطأ أثناء حفظ المورد");
    }
  };

  const activeVendorsCount = vendorsList.filter(v => v.isActive).length;
  const totalVendorsCount = vendorsList.length;
  const inactiveVendorsCount = totalVendorsCount - activeVendorsCount;

  // Calculate category breakdown
  const categoriesBreakdown = useMemo(() => {
    const breakdown: Record<string, number> = {};
    vendorsList.forEach(vendor => {
      const categoryName = vendor.categoryName || "غير مصنف";
      breakdown[categoryName] = (breakdown[categoryName] || 0) + 1;
    });
    return breakdown;
  }, [vendorsList]);

  const topCategory = useMemo(() => {
    const entries = Object.entries(categoriesBreakdown);
    if (entries.length === 0) return null;
    return entries.reduce((max, curr) => curr[1] > max[1] ? curr : max);
  }, [categoriesBreakdown]);

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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              إجمالي الموردين
            </CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : totalVendorsCount}
            </div>
            <p className="text-xs text-muted-foreground">مورد مسجل</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              الموردين النشطون
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {loading ? "..." : activeVendorsCount}
            </div>
            <p className="text-xs text-muted-foreground">مورد نشط</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              الموردين المتوقفون
            </CardTitle>
            <Truck className="h-4 w-4 text-red-600 dark:text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {loading ? "..." : inactiveVendorsCount}
            </div>
            <p className="text-xs text-muted-foreground">مورد متوقف</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              الفئة الأكثر استخداماً
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {topCategory ? topCategory[0] : '-'}
            </div>
            <p className="text-xs text-muted-foreground">
              {topCategory ? `${topCategory[1]} مورد` : 'لا توجد بيانات'}
            </p>
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
                  {apiCategories.map((category: any) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
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
                  <TableHead className="text-right">التقييم</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-center">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      جاري التحميل...
                    </TableCell>
                  </TableRow>
                ) : filteredVendors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      لا توجد موردين مطابقة للبحث
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredVendors.map((vendor) => (
                    <TableRow key={vendor.id}>
                      <TableCell className="font-medium">{vendor.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{vendor.categoryName || "غير مصنف"}</Badge>
                      </TableCell>
                      <TableCell>{vendor.contactPerson || "-"}</TableCell>
                      <TableCell className="font-mono text-sm">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          {vendor.phone}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {"⭐".repeat(vendor.rating || 0)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={vendor.isActive ? "default" : "secondary"}>
                          {vendor.isActive ? "نشط" : "متوقف"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(vendor)}
                            title="تعديل"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(vendor.id)}
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
              {currentVendor ? "تعديل مورد" : "إضافة مورد جديد"}
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
                  {apiCategories.map((category: any) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
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
              {currentVendor ? "حفظ التعديلات" : "إضافة"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SuppliersPage;