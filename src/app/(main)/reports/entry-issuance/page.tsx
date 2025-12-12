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
  Building2,
  Calendar,
  Download,
  FileText,
  Filter,
  PackageMinus,
  PackagePlus,
  Search,
  TrendingUp,
  Truck,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type DocumentType = "entry" | "issuance";
type DocumentStatus = "pending" | "approved" | "completed" | "cancelled";

type Document = {
  id: string;
  documentNumber: string;
  type: DocumentType;
  date: string;
  warehouse: string;
  supplier?: string;
  department?: string;
  totalItems: number;
  totalValue: number;
  status: DocumentStatus;
  createdBy: string;
  notes?: string;
};

// Mock data
const mockDocuments: Document[] = [
  {
    id: "1",
    documentNumber: "ENT-2024-001",
    type: "entry",
    date: "2024-03-15",
    warehouse: "المخزن الرئيسي",
    supplier: "شركة المستقبل للتجهيزات",
    totalItems: 45,
    totalValue: 125000000,
    status: "completed",
    createdBy: "أحمد محمد",
  },
  {
    id: "2",
    documentNumber: "ISS-2024-045",
    type: "issuance",
    date: "2024-03-15",
    warehouse: "المخزن الرئيسي",
    department: "قسم الموارد البشرية",
    totalItems: 10,
    totalValue: 8000000,
    status: "completed",
    createdBy: "سارة علي",
  },
  {
    id: "3",
    documentNumber: "ENT-2024-002",
    type: "entry",
    date: "2024-03-14",
    warehouse: "مخزن المواد الاستهلاكية",
    supplier: "مؤسسة النور التجارية",
    totalItems: 500,
    totalValue: 45000000,
    status: "completed",
    createdBy: "أحمد محمد",
  },
  {
    id: "4",
    documentNumber: "ISS-2024-046",
    type: "issuance",
    date: "2024-03-14",
    warehouse: "مخزن المواد الاستهلاكية",
    department: "قسم المحاسبة",
    totalItems: 50,
    totalValue: 15000000,
    status: "completed",
    createdBy: "سارة علي",
  },
  {
    id: "5",
    documentNumber: "ENT-2024-003",
    type: "entry",
    date: "2024-03-13",
    warehouse: "مخزن الأثاث",
    supplier: "شركة الفرات للأثاث",
    totalItems: 5,
    totalValue: 25000000,
    status: "approved",
    createdBy: "خالد حسن",
  },
  {
    id: "6",
    documentNumber: "ISS-2024-047",
    type: "issuance",
    date: "2024-03-12",
    warehouse: "مخزن المواد الثابتة",
    department: "قسم تقنية المعلومات",
    totalItems: 3,
    totalValue: 7500000,
    status: "completed",
    createdBy: "محمد عبدالله",
  },
  {
    id: "7",
    documentNumber: "ENT-2024-004",
    type: "entry",
    date: "2024-03-12",
    warehouse: "المخزن الرئيسي",
    supplier: "شركة البصرة للتجهيزات",
    totalItems: 120,
    totalValue: 85000000,
    status: "pending",
    createdBy: "أحمد محمد",
  },
  {
    id: "8",
    documentNumber: "ISS-2024-048",
    type: "issuance",
    date: "2024-03-11",
    warehouse: "مخزن المواد الاستهلاكية",
    department: "قسم الصيانة",
    totalItems: 25,
    totalValue: 12000000,
    status: "completed",
    createdBy: "سارة علي",
  },
];

// Chart data for monthly summary
const monthlyData = [
  { month: "يناير", entries: 85, issuances: 62 },
  { month: "فبراير", entries: 92, issuances: 68 },
  { month: "مارس", entries: 78, issuances: 71 },
];

const EntryIssuanceReportPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [warehouseFilter, setWarehouseFilter] = useState<string>("all");

  // Calculate statistics
  const stats = useMemo(() => {
    const entries = mockDocuments.filter((d) => d.type === "entry");
    const issuances = mockDocuments.filter((d) => d.type === "issuance");

    const totalEntryValue = entries.reduce((sum, d) => sum + d.totalValue, 0);
    const totalIssuanceValue = issuances.reduce((sum, d) => sum + d.totalValue, 0);
    const totalEntryItems = entries.reduce((sum, d) => sum + d.totalItems, 0);
    const totalIssuanceItems = issuances.reduce((sum, d) => sum + d.totalItems, 0);

    return {
      totalDocuments: mockDocuments.length,
      totalEntries: entries.length,
      totalIssuances: issuances.length,
      totalEntryValue,
      totalIssuanceValue,
      totalEntryItems,
      totalIssuanceItems,
      netValue: totalEntryValue - totalIssuanceValue,
    };
  }, []);

  // Filter documents
  const filteredDocuments = useMemo(() => {
    return mockDocuments.filter((doc) => {
      const matchesSearch =
        searchTerm === "" ||
        doc.documentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doc.supplier && doc.supplier.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (doc.department && doc.department.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesType = typeFilter === "all" || doc.type === typeFilter;
      const matchesStatus = statusFilter === "all" || doc.status === statusFilter;
      const matchesWarehouse =
        warehouseFilter === "all" || doc.warehouse === warehouseFilter;

      return matchesSearch && matchesType && matchesStatus && matchesWarehouse;
    });
  }, [searchTerm, typeFilter, statusFilter, warehouseFilter]);

  const getStatusColor = (status: DocumentStatus) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "approved":
        return "bg-blue-500";
      case "pending":
        return "bg-yellow-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusLabel = (status: DocumentStatus) => {
    switch (status) {
      case "completed":
        return "مكتمل";
      case "approved":
        return "معتمد";
      case "pending":
        return "قيد الانتظار";
      case "cancelled":
        return "ملغى";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          تقرير الإدخال والإصدار
        </h2>
        <p className="text-muted-foreground mt-1">
          تقرير شامل لجميع مستندات الإدخال والإصدار
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المستندات</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDocuments}</div>
            <p className="text-xs text-muted-foreground">مستند</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مستندات الإدخال</CardTitle>
            <PackagePlus className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.totalEntries}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.totalEntryItems} صنف
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مستندات الإصدار</CardTitle>
            <PackageMinus className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.totalIssuances}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.totalIssuanceItems} صنف
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">صافي القيمة</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.netValue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">دينار عراقي</p>
          </CardContent>
        </Card>
      </div>

      {/* Value Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <PackagePlus className="h-5 w-5" />
              إجمالي قيمة الإدخال
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700 dark:text-green-400">
              {stats.totalEntryValue.toLocaleString()} IQD
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              قيمة جميع مستندات الإدخال
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-blue-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
              <PackageMinus className="h-5 w-5" />
              إجمالي قيمة الإصدار
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700 dark:text-blue-400">
              {stats.totalIssuanceValue.toLocaleString()} IQD
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              قيمة جميع مستندات الإصدار
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            الملخص الشهري
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="entries" fill="#22c55e" name="مستندات الإدخال" />
              <Bar dataKey="issuances" fill="#3b82f6" name="مستندات الإصدار" />
            </BarChart>
          </ResponsiveContainer>
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
          <div className="grid gap-4 md:grid-cols-5">
            <div className="relative">
              <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ابحث عن مستند..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-8"
              />
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="نوع المستند" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                <SelectItem value="entry">إدخال</SelectItem>
                <SelectItem value="issuance">إصدار</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="completed">مكتمل</SelectItem>
                <SelectItem value="approved">معتمد</SelectItem>
                <SelectItem value="pending">قيد الانتظار</SelectItem>
                <SelectItem value="cancelled">ملغى</SelectItem>
              </SelectContent>
            </Select>

            <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
              <SelectTrigger>
                <SelectValue placeholder="المخزن" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المخازن</SelectItem>
                <SelectItem value="المخزن الرئيسي">المخزن الرئيسي</SelectItem>
                <SelectItem value="مخزن المواد الثابتة">
                  مخزن المواد الثابتة
                </SelectItem>
                <SelectItem value="مخزن المواد الاستهلاكية">
                  مخزن المواد الاستهلاكية
                </SelectItem>
                <SelectItem value="مخزن الأثاث">مخزن الأثاث</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="w-full">
              <Download className="ml-2 h-4 w-4" />
              تصدير
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              قائمة المستندات ({filteredDocuments.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>رقم المستند</TableHead>
                  <TableHead>النوع</TableHead>
                  <TableHead>التاريخ</TableHead>
                  <TableHead>المخزن</TableHead>
                  <TableHead>المورد/القسم</TableHead>
                  <TableHead>عدد الأصناف</TableHead>
                  <TableHead>القيمة الإجمالية</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>المنشئ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center h-24">
                      لا توجد مستندات تطابق معايير البحث
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {doc.documentNumber}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            doc.type === "entry" ? "bg-green-500" : "bg-blue-500"
                          }
                        >
                          {doc.type === "entry" ? (
                            <>
                              <PackagePlus className="h-3 w-3 ml-1" />
                              إدخال
                            </>
                          ) : (
                            <>
                              <PackageMinus className="h-3 w-3 ml-1" />
                              إصدار
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {doc.date}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{doc.warehouse}</TableCell>
                      <TableCell className="text-sm">
                        <div className="flex items-center gap-2">
                          {doc.supplier && (
                            <>
                              <Truck className="h-4 w-4 text-muted-foreground" />
                              {doc.supplier}
                            </>
                          )}
                          {doc.department && (
                            <>
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              {doc.department}
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-semibold">
                        {doc.totalItems}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {doc.totalValue.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(doc.status)}>
                          {getStatusLabel(doc.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{doc.createdBy}</TableCell>
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

export default EntryIssuanceReportPage;
