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
  UserCog,
  Search,
  Mail,
  Shield,
  CheckCircle,
  XCircle,
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
  systemUsers,
  userRoles,
  getUserByUsername,
  getActiveUsers,
  getUsersByRole
} from "@/lib/data/settings-data";
import { USER_ROLES, type SystemUser, type UserRole } from "@/lib/types/settings";

const UsersPage = () => {
  const [usersList, setUsersList] = useState<SystemUser[]>(systemUsers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<SystemUser | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    nationalId: "",
    phone: "",
    department: "",
    division: "",
    unit: "",
    position: "",
    role: "",
    warehouse: "",
    isActive: true,
    twoFactorEnabled: false,
    passwordChangeRequired: false,
    notes: ""
  });

  // Filter users
  const filteredUsers = useMemo(() => {
    return usersList.filter(
      (user) => {
        const matchesSearch =
          user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.role?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === "all" || user.role === filterRole;
        return matchesSearch && matchesRole;
      }
    );
  }, [usersList, searchTerm, filterRole]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalUsers = usersList.length;
    const activeUsers = usersList.filter((u) => u.isActive).length;
    const adminUsers = usersList.filter((u) => u.role === "مدير نظام").length;
    return { totalUsers, activeUsers, adminUsers };
  }, [usersList]);

  const handleAddNew = () => {
    setCurrentUser(null);
    setFormData({
      username: "",
      email: "",
      fullName: "",
      nationalId: "",
      phone: "",
      department: "",
      division: "",
      unit: "",
      position: "",
      role: "",
      warehouse: "",
      isActive: true,
      twoFactorEnabled: false,
      passwordChangeRequired: false,
      notes: ""
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (user: SystemUser) => {
    setCurrentUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      nationalId: user.nationalId || "",
      phone: user.phone,
      department: user.department,
      division: user.division || "",
      unit: user.unit || "",
      position: user.position,
      role: user.role,
      warehouse: user.warehouse || "",
      isActive: user.isActive,
      twoFactorEnabled: user.twoFactorEnabled,
      passwordChangeRequired: user.passwordChangeRequired,
      notes: user.notes || ""
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذا المستخدم؟")) {
      setUsersList(usersList.filter((u) => u.id !== id));
    }
  };

  const handleSave = () => {
    if (!formData.fullName.trim()) {
      alert("الرجاء إدخال الاسم الكامل");
      return;
    }
    if (!formData.username.trim()) {
      alert("الرجاء إدخال اسم المستخدم");
      return;
    }
    if (!formData.email.trim()) {
      alert("الرجاء إدخال البريد الإلكتروني");
      return;
    }

    if (currentUser) {
      // Edit
      setUsersList(
        usersList.map((u) =>
          u.id === currentUser.id
            ? {
                ...u,
                username: formData.username,
                email: formData.email,
                fullName: formData.fullName,
                nationalId: formData.nationalId,
                phone: formData.phone,
                department: formData.department,
                division: formData.division,
                unit: formData.unit,
                position: formData.position,
                role: formData.role,
                warehouse: formData.warehouse,
                isActive: formData.isActive,
                twoFactorEnabled: formData.twoFactorEnabled,
                passwordChangeRequired: formData.passwordChangeRequired,
                notes: formData.notes,
                updatedAt: new Date().toISOString()
              }
            : u
        )
      );
    } else {
      // Add
      const newId =
        usersList.length > 0
          ? Math.max(...usersList.map((u) => u.id)) + 1
          : 1;
      const selectedRole = userRoles.find(r => r.name === formData.role);
      setUsersList([
        ...usersList,
        {
          id: newId,
          username: formData.username,
          email: formData.email,
          fullName: formData.fullName,
          nationalId: formData.nationalId,
          phone: formData.phone,
          department: formData.department,
          division: formData.division,
          unit: formData.unit,
          position: formData.position,
          role: formData.role,
          avatar: "",
          isActive: formData.isActive,
          warehouse: formData.warehouse,
          permissions: selectedRole?.permissions || [],
          twoFactorEnabled: formData.twoFactorEnabled,
          passwordChangeRequired: formData.passwordChangeRequired,
          notes: formData.notes,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
      ]);
    }
    setIsDialogOpen(false);
    setFormData({
      username: "",
      email: "",
      fullName: "",
      nationalId: "",
      phone: "",
      department: "",
      division: "",
      unit: "",
      position: "",
      role: "",
      warehouse: "",
      isActive: true,
      twoFactorEnabled: false,
      passwordChangeRequired: false,
      notes: ""
    });
    setCurrentUser(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <UserCog className="h-8 w-8 text-purple-600" />
          إدارة المستخدمين
        </h2>
        <p className="text-muted-foreground mt-1">
          إدارة حسابات المستخدمين وصلاحياتهم في النظام
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              إجمالي المستخدمين
            </CardTitle>
            <UserCog className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {stats.totalUsers}
            </div>
            <p className="text-xs text-muted-foreground">مستخدم مسجل</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مستخدمين نشطين</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.activeUsers}
            </div>
            <p className="text-xs text-muted-foreground">
              من {stats.totalUsers} مستخدم
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المدراء</CardTitle>
            <Shield className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.adminUsers}
            </div>
            <p className="text-xs text-muted-foreground">مدير نظام</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>قائمة المستخدمين</CardTitle>
            <Button onClick={handleAddNew}>
              <PlusCircle className="ml-2 h-4 w-4" />
              إضافة مستخدم جديد
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ابحث عن مستخدم بالاسم أو البريد أو القسم..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            <div className="w-full sm:w-64">
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الدور..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأدوار</SelectItem>
                  {USER_ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
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
                  <TableHead className="text-right">المعرف</TableHead>
                  <TableHead className="text-right">الاسم الكامل</TableHead>
                  <TableHead className="text-right">اسم المستخدم</TableHead>
                  <TableHead className="text-right">البريد الإلكتروني</TableHead>
                  <TableHead className="text-right">القسم</TableHead>
                  <TableHead className="text-right">الدور</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-center">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center text-muted-foreground h-24"
                    >
                      لا توجد مستخدمين تطابق معايير البحث
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Badge variant="outline">{user.id}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <UserCog className="h-4 w-4 text-purple-600" />
                          {user.fullName}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {user.username}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          {user.email}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {user.department || "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          <Shield className="h-3 w-3 ml-1" />
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.isActive ? (
                          <Badge className="bg-green-100 text-green-700">
                            <CheckCircle className="h-3 w-3 ml-1" />
                            نشط
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                            <XCircle className="h-3 w-3 ml-1" />
                            متوقف
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(user)}
                            title="تعديل"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(user.id)}
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
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCog className="h-5 w-5 text-purple-600" />
              {currentUser ? "تعديل مستخدم" : "إضافة مستخدم جديد"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">الاسم الكامل *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, fullName: e.target.value }))
                  }
                  placeholder="مثال: أحمد محمد علي"
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nationalId">الرقم الوطني</Label>
                <Input
                  id="nationalId"
                  value={formData.nationalId}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, nationalId: e.target.value }))
                  }
                  placeholder="رقم الهوية"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">اسم المستخدم *</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, username: e.target.value }))
                  }
                  placeholder="ahmad.mohammad"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, email: e.target.value }))
                  }
                  placeholder="example@company.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">رقم الهاتف</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, phone: e.target.value }))
                  }
                  placeholder="+9647700000000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">الدور</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) =>
                    setFormData((f) => ({ ...f, role: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الدور..." />
                  </SelectTrigger>
                  <SelectContent>
                    {USER_ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">القسم</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, department: e.target.value }))
                  }
                  placeholder="اسم القسم"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">المنصب</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, position: e.target.value }))
                  }
                  placeholder="المنصب الوظيفي"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="division">الشعبة</Label>
                <Input
                  id="division"
                  value={formData.division}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, division: e.target.value }))
                  }
                  placeholder="اسم الشعبة"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">الوحدة</Label>
                <Input
                  id="unit"
                  value={formData.unit}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, unit: e.target.value }))
                  }
                  placeholder="اسم الوحدة"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="warehouse">المخزن</Label>
                <Input
                  id="warehouse"
                  value={formData.warehouse}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, warehouse: e.target.value }))
                  }
                  placeholder="المخزن المسؤول"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="flex items-center space-x-2 space-x-reverse">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, isActive: e.target.checked }))
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="isActive" className="cursor-pointer">
                  تفعيل المستخدم
                </Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <input
                  type="checkbox"
                  id="twoFactorEnabled"
                  checked={formData.twoFactorEnabled}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, twoFactorEnabled: e.target.checked }))
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="twoFactorEnabled" className="cursor-pointer">
                  المصادقة الثنائية
                </Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <input
                  type="checkbox"
                  id="passwordChangeRequired"
                  checked={formData.passwordChangeRequired}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, passwordChangeRequired: e.target.checked }))
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="passwordChangeRequired" className="cursor-pointer">
                  يتغير كلمة المرور
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleSave}>
              {currentUser ? "حفظ التعديلات" : "إضافة"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersPage;
