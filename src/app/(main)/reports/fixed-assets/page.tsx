"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import {
  Barcode,
  Download,
  Filter,
  Gift,
  Landmark,
  PieChart,
  Search,
  TrendingDown,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

type AssetStatus = "coded" | "in-custody" | "consumed" | "donated";
type AssetCondition = "excellent" | "good" | "fair" | "poor";

type FixedAsset = {
  id: string;
  name: string;
  barcode: string;
  status: AssetStatus;
  category: string;
  acquisitionDate: string;
  value: number;
  condition: AssetCondition;
  location?: string;
  custodyEmployee?: string;
  department?: string;
  consumptionRate?: number;
  recipientOrg?: string;
};

// Mock data
const mockAssets: FixedAsset[] = [
  {
    id: "1",
    name: "حاسوب مكتبي Dell OptiPlex",
    barcode: "FA-2024-001",
    status: "in-custody",
    category: "أجهزة حاسوب",
    acquisitionDate: "2024-01-15",
    value: 2500000,
    condition: "excellent",
    location: "الطابق الثالث - مكتب 301",
    custodyEmployee: "أحمد محمد علي",
    department: "قسم تقنية المعلومات",
  },
  {
    id: "2",
    name: "طابعة HP LaserJet Pro",
    barcode: "FA-2024-002",
    status: "coded",
    category: "أجهزة طباعة",
    acquisitionDate: "2024-02-10",
    value: 1500000,
    condition: "excellent",
    location: "مخزن المواد الثابتة",
  },
  {
    id: "3",
    name: "مكيف هواء سبليت",
    barcode: "FA-2023-045",
    status: "consumed",
    category: "أجهزة تكييف",
    acquisitionDate: "2023-05-20",
    value: 3000000,
    condition: "poor",
    location: "الطابق الأول - قاعة الاجتماعات",
    consumptionRate: 85,
  },
  {
    id: "4",
    name: "مولد كهربائي 50 كيلو واط",
    barcode: "FA-2022-012",
    status: "donated",
    category: "معدات كهربائية",
    acquisitionDate: "2022-03-15",
    value: 15000000,
    condition: "good",
    recipientOrg: "مدرسة النور الابتدائية",
  },
  {
    id: "5",
    name: "كرسي مكتب جلد فاخر",
    barcode: "FA-2024-015",
    status: "in-custody",
    category: "أثاث مكتبي",
    acquisitionDate: "2024-01-20",
    value: 800000,
    condition: "excellent",
    location: "الطابق الرابع - مكتب المدير",
    custodyEmployee: "سارة خالد حسن",
    department: "الإدارة العامة",
  },
  {
    id: "6",
    name: "جهاز عرض LCD",
    barcode: "FA-2023-078",
    status: "coded",
    category: "أجهزة عرض",
    acquisitionDate: "2023-09-05",
    value: 2000000,
    condition: "good",
    location: "مخزن المواد الثابتة",
  },
  {
    id: "7",
    name: "طاولة اجتماعات خشب",
    barcode: "FA-2023-120",
    status: "consumed",
    category: "أثاث مكتبي",
    acquisitionDate: "2023-11-10",
    value: 5000000,
    condition: "fair",
    location: "قاعة الاجتماعات الرئيسية",
    consumptionRate: 45,
  },
  {
    id: "8",
    name: "مكتبة خشبية",
    barcode: "FA-2021-089",
    status: "donated",
    category: "أثاث",
    acquisitionDate: "2021-06-15",
    value: 1200000,
    condition: "fair",
    recipientOrg: "جمعية الخير الإنسانية",
  },
];

const FixedAssetsReportPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Calculate statistics
  const stats = useMemo(() => {
    const coded = mockAssets.filter((a) => a.status === "coded").length;
    const inCustody = mockAssets.filter((a) => a.status === "in-custody").length;
    const consumed = mockAssets.filter((a) => a.status === "consumed").length;
    const donated = mockAssets.filter((a) => a.status === "donated").length;
    const totalValue = mockAssets.reduce((sum, a) => sum + a.value, 0);

    return {
      total: mockAssets.length,
      coded,
      inCustody,
      consumed,
      donated,
      totalValue,
    };
  }, []);

  // Filter assets
  const filteredAssets = useMemo(() => {
    return mockAssets.filter((asset) => {
      const matchesSearch =
        searchTerm === "" ||
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.barcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (asset.custodyEmployee &&
          asset.custodyEmployee.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = statusFilter === "all" || asset.status === statusFilter;

      const matchesCategory =
        categoryFilter === "all" || asset.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [searchTerm, statusFilter, categoryFilter]);

  const getStatusColor = (status: AssetStatus) => {
    switch (status) {
      case "coded":
        return "bg-green-500";
      case "in-custody":
        return "bg-blue-500";
      case "consumed":
        return "bg-red-500";
      case "donated":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusLabel = (status: AssetStatus) => {
    switch (status) {
      case "coded":
        return "مرمز";
      case "in-custody":
        return "قيد الذمة";
      case "consumed":
        return "مستهلك";
      case "donated":
        return "ممنوح";
      default:
        return status;
    }
  };

  const getConditionLabel = (condition: AssetCondition) => {
    switch (condition) {
      case "excellent":
        return "ممتاز";
      case "good":
        return "جيد";
      case "fair":
        return "مقبول";
      case "poor":
        return "سيء";
      default:
        return condition;
    }
  };

  const getConditionColor = (condition: AssetCondition) => {
    switch (condition) {
      case "excellent":
        return "text-green-600";
      case "good":
        return "text-blue-600";
      case "fair":
        return "text-orange-600";
      case "poor":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          تقرير الموجودات الثابتة
        </h2>
        <p className="text-muted-foreground mt-1">
          تقرير شامل لجميع الموجودات الثابتة وحالتها
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الموجودات</CardTitle>
            <Landmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">موجود ثابت</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مرمزة</CardTitle>
            <Barcode className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.coded}</div>
            <p className="text-xs text-muted-foreground">موجود</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">قيد الذمة</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.inCustody}
            </div>
            <p className="text-xs text-muted-foreground">موجود</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مستهلكة</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.consumed}
            </div>
            <p className="text-xs text-muted-foreground">موجود</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ممنوحة</CardTitle>
            <Gift className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {stats.donated}
            </div>
            <p className="text-xs text-muted-foreground">موجود</p>
          </CardContent>
        </Card>
      </div>

      {/* Total Value Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            القيمة الإجمالية للموجودات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-blue-700">
            {stats.totalValue.toLocaleString()} IQD
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            القيمة الإجمالية لجميع الموجودات الثابتة المسجلة
          </p>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            البحث والتصفية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ابحث عن موجود..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-8"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="coded">مرمز</SelectItem>
                <SelectItem value="in-custody">قيد الذمة</SelectItem>
                <SelectItem value="consumed">مستهلك</SelectItem>
                <SelectItem value="donated">ممنوح</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="الفئة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الفئات</SelectItem>
                <SelectItem value="أجهزة حاسوب">أجهزة حاسوب</SelectItem>
                <SelectItem value="أجهزة طباعة">أجهزة طباعة</SelectItem>
                <SelectItem value="أثاث مكتبي">أثاث مكتبي</SelectItem>
                <SelectItem value="أجهزة تكييف">أجهزة تكييف</SelectItem>
                <SelectItem value="معدات كهربائية">معدات كهربائية</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="w-full">
              <Download className="ml-2 h-4 w-4" />
              تصدير التقرير
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Assets Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Landmark className="h-5 w-5" />
              قائمة الموجودات ({filteredAssets.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الباركود</TableHead>
                  <TableHead>اسم الموجود</TableHead>
                  <TableHead>الفئة</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>الوضع</TableHead>
                  <TableHead>القيمة</TableHead>
                  <TableHead>الموقع/المستفيد</TableHead>
                  <TableHead>تاريخ الاقتناء</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center h-24">
                      لا توجد موجودات تطابق معايير البحث
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAssets.map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {asset.barcode}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{asset.name}</TableCell>
                      <TableCell className="text-sm">{asset.category}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(asset.status)}>
                          {getStatusLabel(asset.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={getConditionColor(asset.condition)}>
                          {getConditionLabel(asset.condition)}
                        </span>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {asset.value.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-sm">
                        {asset.custodyEmployee || asset.location || asset.recipientOrg || "-"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {asset.acquisitionDate}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FixedAssetsReportPage;
