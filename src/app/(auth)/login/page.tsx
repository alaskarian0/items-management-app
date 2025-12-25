"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuthStore } from "@/store/auth/authStore";
import { useAuth } from "@/hooks/useAuth";
import { loginSchema, type LoginFormData } from "@/store/auth/authValidation";
import type { User, ChangePasswordData } from "@/store/auth/authTypes";
import { Loader2, Lock, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

type LoginResponse = {
  access_token: string;
  user: User & { isTempPass?: boolean };
  data?: LoginResponse;
};

// Fake warehouse users for development/testing
type WarehouseUser = {
  id: string;
  name: string;
  userName: string;
  password: string;
};

const WAREHOUSE_USERS: WarehouseUser[] = [
  {
    id: "furniture",
    name: "مخزن الأثاث والممتلكات العامة",
    userName: "furniture_admin",
    password: "furniture123"
  },
  {
    id: "carpet",
    name: "مخزن السجاد والمفروشات",
    userName: "carpet_admin",
    password: "carpet123"
  },
  {
    id: "general",
    name: "مخزن المواد العامة",
    userName: "general_admin",
    password: "general123"
  },
  {
    id: "construction",
    name: "مخزن المواد الإنشائية",
    userName: "construction_admin",
    password: "construction123"
  },
  {
    id: "dry",
    name: "مخزن المواد الجافة",
    userName: "dry_admin",
    password: "dry123"
  },
  {
    id: "frozen",
    name: "مخزن المواد المجمّدة",
    userName: "frozen_admin",
    password: "frozen123"
  },
  {
    id: "fuel",
    name: "مخزن الوقود والزيوت",
    userName: "fuel_admin",
    password: "fuel123"
  },
  {
    id: "consumable",
    name: "مخزن المواد المستهلكة",
    userName: "consumable_admin",
    password: "consumable123"
  },
  {
    id: "law_enforcement",
    name: "مخزن قسم حفظ النظام",
    userName: "law_enforcement_admin",
    password: "law123"
  }
];

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("");
  const [formData, setFormData] = useState<LoginFormData>({
    userName: "",
    password: ""
  });
  const [changePasswordData, setChangePasswordData] = useState<ChangePasswordData>({
    currentPassword: "",
    newPassword: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string>("");

  const { login, changePassword, loading } = useAuth();

  const handleInputChange = (field: keyof LoginFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handlePasswordChange = (field: keyof ChangePasswordData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setChangePasswordData(prev => ({
      ...prev,
      [field]: e.target.value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleWarehouseSelect = (warehouseId: string) => {
    setSelectedWarehouse(warehouseId);

    // Find the selected warehouse user
    const warehouseUser = WAREHOUSE_USERS.find(w => w.id === warehouseId);

    if (warehouseUser) {
      // Auto-fill username and password
      setFormData({
        userName: warehouseUser.userName,
        password: warehouseUser.password
      });

      // Clear any existing errors
      setErrors({});
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if warehouse is selected
    if (!selectedWarehouse) {
      toast.error("يرجى اختيار المخزن أولاً");
      return;
    }

    // Find the selected warehouse user
    const warehouseUser = WAREHOUSE_USERS.find(w => w.id === selectedWarehouse);

    if (!warehouseUser) {
      toast.error("خطأ في اختيار المخزن");
      return;
    }

    // Create dummy user object
    const dummyUser: User = {
      id: parseInt(selectedWarehouse.split('_')[0]) || 1,
      userName: warehouseUser.userName,
      fullName: `مسؤول ${warehouseUser.name}`,
      role: 'warehouse_manager',
      warehouse: selectedWarehouse, // Set warehouse type
      isTempPass: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Create dummy access token
    const dummyToken = `dummy_token_${selectedWarehouse}_${Date.now()}`;

    // Set auth and redirect to home
    setAuth(dummyUser, dummyToken);
    toast.success(`مرحباً ${dummyUser.fullName}`);
    router.push("/");
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!changePasswordData.newPassword.trim()) {
      setErrors({
        newPassword: "كلمة المرور الجديدة مطلوبة"
      });
      return;
    }

    if (changePasswordData.newPassword.length < 6) {
      setErrors({
        newPassword: "كلمة المرور يجب أن تكون 6 أحرف على الأقل"
      });
      return;
    }

    // First set auth temporarily for the changePassword API call
    if (loggedInUser && accessToken) {
      setAuth(loggedInUser, accessToken);
    }

    try {
      await changePassword({
        data: changePasswordData,
        onSuccess: () => {
          // Password changed successfully, now login with new auth state
          toast.success("تم تغيير كلمة المرور بنجاح!");
          if (loggedInUser && accessToken) {
            setAuth(loggedInUser, accessToken);
            router.push("/");
          }
        },
        onError: (error: unknown) => {
          console.error("Change password error:", error);
          toast.error("فشل في تغيير كلمة المرور. يرجى المحاولة مرة أخرى.");
        }
      });
    } catch (error) {
      console.error("Change password error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      
      <Card className="w-full max-w-md">
        {!showChangePassword ? (
          // Login Form
          <>
          
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold">
                تسجيل الدخول
              </CardTitle>
              <CardDescription>
                أدخل بياناتك للوصول إلى نظام العلاوات والترفيعات
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">

                <div className="space-y-2">
                  <Label htmlFor="warehouse">اختر المخزن</Label>
                  <Select value={selectedWarehouse} onValueChange={handleWarehouseSelect}>
                    <SelectTrigger id="warehouse">
                      <SelectValue placeholder="اختر المخزن للدخول" />
                    </SelectTrigger>
                    <SelectContent>
                      {WAREHOUSE_USERS.map((warehouse) => (
                        <SelectItem key={warehouse.id} value={warehouse.id}>
                          {warehouse.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="userName">اسم المستخدم</Label>
                  <Input
                    id="userName"
                    type="text"
                    value={formData.userName}
                    onChange={handleInputChange("userName")}
                    placeholder="أدخل اسم المستخدم"
                    className={errors.userName ? "border-red-500" : ""}
                    readOnly
                  />
                  {errors.userName && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {errors.userName}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">كلمة المرور</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange("password")}
                    placeholder="أدخل كلمة المرور"
                    className={errors.password ? "border-red-500" : ""}
                    readOnly
                  />
                  {errors.password && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {errors.password}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading.login}
                >
                  {loading.login && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  تسجيل الدخول
                </Button>
              </form>
            </CardContent>
          </>
        ) : (
          // Change Password Form
          <>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/20">
                <Lock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <CardTitle className="text-2xl font-bold">
                تغيير كلمة المرور المؤقتة
              </CardTitle>
              <CardDescription>
                مرحباً {loggedInUser?.fullName}، يجب تغيير كلمة المرور المؤقتة قبل المتابعة
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
                <div className="flex items-center">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mr-2" />
                  <p className="text-sm text-yellow-800 dark:text-yellow-400">
                    كلمة المرور الحالية مؤقتة ويجب تغييرها لأسباب أمنية
                  </p>
                </div>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4">

                <div className="space-y-2">
                  <Label htmlFor="currentPassword">كلمة المرور الحالية</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={changePasswordData.currentPassword}
                    readOnly
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    كلمة المرور المؤقتة التي استخدمتها لتسجيل الدخول
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={changePasswordData.newPassword}
                    onChange={handlePasswordChange("newPassword")}
                    placeholder="أدخل كلمة المرور الجديدة"
                    className={errors.newPassword ? "border-red-500" : ""}
                  />
                  {errors.newPassword && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {errors.newPassword}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    يجب أن تكون كلمة المرور 6 أحرف على الأقل
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading.changePassword}
                >
                  {loading.changePassword && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  تغيير كلمة المرور والمتابعة
                </Button>
              </form>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}