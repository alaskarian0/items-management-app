"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Archive,
  Search,
  Eye,
  Download,
  FileText,
  Image,
  File,
  Calendar,
  Filter,
  Folder,
  AlertCircle,
  Paperclip,
  Upload,
  MoreVertical,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react";
import { useAuthStore } from "@/store/auth/authStore";
import { toast } from "sonner";

// Extended Warehouse Document interface for archive with attachments
interface ArchivedDocument {
  id: number;
  docNumber: string;
  type: "entry" | "issuance";
  date: string;
  warehouseId: number;
  warehouseName: string;
  departmentId?: number;
  departmentName?: string;
  divisionId?: number;
  divisionName?: string;
  unitId?: number;
  unitName?: string;
  supplierId?: number;
  supplierName?: string;
  recipientName?: string;
  entryType?: "purchases" | "gifts" | "returns";
  itemCount: number;
  totalValue: number;
  notes?: string;
  status: "draft" | "approved" | "cancelled";
  hasAttachments: boolean;
  attachmentCount: number;
  archiveStatus: "archived" | "pending_documents";
  createdAt: string;
  updatedAt: string;
}

// Mock archived documents data - Warehouse documents that need archiving with physical papers
const MOCK_ARCHIVED_DOCUMENTS: ArchivedDocument[] = [
  {
    id: 1,
    docNumber: "إدخ-2024-001",
    type: "entry",
    date: "2024-01-15",
    warehouseId: 1,
    warehouseName: "المخزن الرئيسي",
    departmentId: 1,
    departmentName: "قسم الشؤون الهندسية",
    divisionId: 1,
    divisionName: "شعبة الهندسة المدنية",
    supplierId: 1,
    supplierName: "شركة النبلاء للمواد المكتبي",
    entryType: "purchases",
    itemCount: 5,
    totalValue: 1250000,
    notes: "إدخال كراسي ومكاتب جديدة",
    status: "approved",
    hasAttachments: true,
    attachmentCount: 3,
    archiveStatus: "archived",
    createdAt: "2024-01-15T09:30:00",
    updatedAt: "2024-01-15T10:15:00"
  },
  {
    id: 2,
    docNumber: "صرف-2024-001",
    type: "issuance",
    date: "2024-01-22",
    warehouseId: 1,
    warehouseName: "المخزن الرئيسي",
    departmentId: 1,
    departmentName: "قسم الشؤون الهندسية",
    divisionId: 2,
    divisionName: "شعبة الهندسة الكهربائية",
    unitId: 3,
    unitName: "وحدة الصيانة الكهربائية",
    recipientName: "م. أحمد محمد",
    itemCount: 3,
    totalValue: 520000,
    notes: "توزيع طاولات لغرفة الاجتماعات",
    status: "approved",
    hasAttachments: true,
    attachmentCount: 2,
    archiveStatus: "archived",
    createdAt: "2024-01-22T11:00:00",
    updatedAt: "2024-01-22T11:30:00"
  },
  {
    id: 3,
    docNumber: "إدخ-2024-002",
    type: "entry",
    date: "2024-01-20",
    warehouseId: 2,
    warehouseName: "مخزن المواد الكهربائية",
    departmentId: 3,
    departmentName: "قسم التشغيل والصيانة",
    supplierId: 3,
    supplierName: "شركة الأوائل للأجهزة الكهربائية",
    entryType: "purchases",
    itemCount: 3,
    totalValue: 2250000,
    notes: "توريد مولدات للطوارئ",
    status: "approved",
    hasAttachments: false,
    attachmentCount: 0,
    archiveStatus: "pending_documents",
    createdAt: "2024-01-20T08:00:00",
    updatedAt: "2024-01-20T09:00:00"
  },
  {
    id: 4,
    docNumber: "صرف-2024-002",
    type: "issuance",
    date: "2024-01-23",
    warehouseId: 1,
    warehouseName: "المخزن الرئيسي",
    departmentId: 2,
    departmentName: "قسم الشؤون الإدارية",
    divisionId: 4,
    divisionName: "شعبة الشؤون الإدارية",
    unitId: 6,
    unitName: "وحدة الموارد البشرية",
    recipientName: "السكرتارية",
    itemCount: 15,
    totalValue: 825000,
    notes: "طلب من قسم المحاسبة - حبر طابعة",
    status: "approved",
    hasAttachments: true,
    attachmentCount: 5,
    archiveStatus: "archived",
    createdAt: "2024-01-23T10:00:00",
    updatedAt: "2024-01-23T10:45:00"
  },
  {
    id: 5,
    docNumber: "إدخ-2024-003",
    type: "entry",
    date: "2024-02-01",
    warehouseId: 1,
    warehouseName: "المخزن الرئيسي",
    departmentId: 2,
    departmentName: "قسم الشؤون الإدارية",
    supplierId: 5,
    supplierName: "شركة النور للمعدات المكتبية",
    entryType: "gifts",
    itemCount: 10,
    totalValue: 350000,
    notes: "هدية من الوزارة - مواد مكتبية",
    status: "approved",
    hasAttachments: false,
    attachmentCount: 0,
    archiveStatus: "pending_documents",
    createdAt: "2024-02-01T12:00:00",
    updatedAt: "2024-02-01T13:00:00"
  },
  {
    id: 6,
    docNumber: "صرف-2024-003",
    type: "issuance",
    date: "2024-01-24",
    warehouseId: 3,
    warehouseName: "مخزن الأثاث والمعدات",
    departmentId: 3,
    departmentName: "قسم التشغيل والصيانة",
    divisionId: 7,
    divisionName: "شعبة الصيانة",
    unitId: 8,
    unitName: "وحدة الصيانة العامة",
    recipientName: "علي حسن",
    itemCount: 10,
    totalValue: 85000,
    notes: "للنظافة اليومية",
    status: "approved",
    hasAttachments: true,
    attachmentCount: 1,
    archiveStatus: "archived",
    createdAt: "2024-01-24T14:00:00",
    updatedAt: "2024-01-24T14:30:00"
  },
  {
    id: 7,
    docNumber: "إدخ-2024-004",
    type: "entry",
    date: "2024-02-05",
    warehouseId: 3,
    warehouseName: "مخزن الأثاث والمعدات",
    departmentId: 1,
    departmentName: "قسم الشؤون الهندسية",
    supplierId: 2,
    supplierName: "موردون متحدون للأثاث",
    entryType: "purchases",
    itemCount: 8,
    totalValue: 1800000,
    notes: "شراء أثاث جديد للمكاتب",
    status: "approved",
    hasAttachments: false,
    attachmentCount: 0,
    archiveStatus: "pending_documents",
    createdAt: "2024-02-05T09:00:00",
    updatedAt: "2024-02-05T09:00:00"
  },
  {
    id: 8,
    docNumber: "صرف-2024-004",
    type: "issuance",
    date: "2024-02-06",
    warehouseId: 1,
    warehouseName: "المخزن الرئيسي",
    departmentId: 1,
    departmentName: "قسم الشؤون الهندسية",
    divisionId: 3,
    divisionName: "شعبة الهندسة الميكانيكية",
    unitId: 4,
    unitName: "وحدة الصيانة الميكانيكية",
    recipientName: "م. خالد أحمد",
    itemCount: 4,
    totalValue: 120000,
    notes: "أدوات صيانة",
    status: "approved",
    hasAttachments: true,
    attachmentCount: 2,
    archiveStatus: "archived",
    createdAt: "2024-02-06T11:00:00",
    updatedAt: "2024-02-06T11:00:00"
  },
  {
    id: 9,
    docNumber: "إدخ-2024-005",
    type: "entry",
    date: "2024-02-10",
    warehouseId: 2,
    warehouseName: "مخزن المواد الكهربائية",
    departmentId: 3,
    departmentName: "قسم التشغيل والصيانة",
    supplierId: 3,
    supplierName: "شركة الأوائل للأجهزة الكهربائية",
    entryType: "returns",
    itemCount: 2,
    totalValue: 95000,
    notes: "ارجاع مواد كهربائية معيبة واستبدالها",
    status: "approved",
    hasAttachments: false,
    attachmentCount: 0,
    archiveStatus: "pending_documents",
    createdAt: "2024-02-10T10:00:00",
    updatedAt: "2024-02-10T11:00:00"
  },
  {
    id: 10,
    docNumber: "صرف-2024-005",
    type: "issuance",
    date: "2024-02-12",
    warehouseId: 4,
    warehouseName: "مخزن المواد الميكانيكية",
    departmentId: 3,
    departmentName: "قسم التشغيل والصيانة",
    divisionId: 6,
    divisionName: "شعبة التشغيل",
    unitId: 7,
    unitName: "وحدة التشغيل",
    recipientName: "م. حسين علي",
    itemCount: 6,
    totalValue: 450000,
    notes: "معدات للصيانة الدورية",
    status: "approved",
    hasAttachments: true,
    attachmentCount: 4,
    archiveStatus: "archived",
    createdAt: "2024-02-12T15:00:00",
    updatedAt: "2024-02-12T15:30:00"
  },
];

export default function DocumentsArchivePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [documents, setDocuments] = useState<ArchivedDocument[]>(
    MOCK_ARCHIVED_DOCUMENTS
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [warehouseFilter, setWarehouseFilter] = useState<string>("all");
  const [archiveStatusFilter, setArchiveStatusFilter] = useState<string>("all");

  // Check permissions
  const hasAccess = user?.role === "admin" || user?.warehouse === "general";

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-500/10 text-green-700 hover:bg-green-500/20">
            معتمد
          </Badge>
        );
      case "draft":
        return (
          <Badge className="bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20">
            مسودة
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-500/10 text-red-700 hover:bg-red-500/20">
            ملغي
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    if (type === "entry") {
      return (
        <div className="flex items-center gap-2 text-green-600">
          <ArrowDownLeft className="h-4 w-4" />
          <span className="font-medium">إدخال</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 text-red-600">
        <ArrowUpRight className="h-4 w-4" />
        <span className="font-medium">إصدار</span>
      </div>
    );
  };

  const getArchiveStatusBadge = (archiveStatus: string) => {
    if (archiveStatus === "archived") {
      return (
        <Badge className="bg-blue-500/10 text-blue-700 hover:bg-blue-500/20">
          مؤرشف
        </Badge>
      );
    }
    return (
      <Badge className="bg-orange-500/10 text-orange-700 hover:bg-orange-500/20">
        بانتظار المستندات
      </Badge>
    );
  };

  const getAttachmentStatusBadge = (hasAttachments: boolean, count: number) => {
    if (hasAttachments && count > 0) {
      return (
        <div className="flex items-center gap-1 text-green-600">
          <Paperclip className="h-4 w-4" />
          <span className="font-medium text-sm">{count} ملف</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1 text-gray-400">
        <AlertCircle className="h-4 w-4" />
        <span className="font-medium text-sm">بدون مرفقات</span>
      </div>
    );
  };

  const getEntryTypeBadge = (entryType?: string) => {
    if (!entryType) return <span className="text-sm text-muted-foreground">-</span>;

    const colors: Record<string, string> = {
      purchases: "bg-green-500/10 text-green-700 hover:bg-green-500/20",
      gifts: "bg-blue-500/10 text-blue-700 hover:bg-blue-500/20",
      returns: "bg-purple-500/10 text-purple-700 hover:bg-purple-500/20",
    };

    const labels: Record<string, string> = {
      purchases: "مشتريات",
      gifts: "هدايا وندور",
      returns: "ارجاع مواد",
    };

    return (
      <Badge className={colors[entryType] || "bg-gray-500/10 text-gray-700"}>
        {labels[entryType] || entryType}
      </Badge>
    );
  };

  const handleDownload = (doc: ArchivedDocument) => {
    toast.success(`جاري تحميل: ${doc.docNumber}`);
    // In production, would download from server
  };

  const handleUploadDocuments = (docId: string) => {
    router.push(`/documents/archive/${docId}/upload`);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setTypeFilter("all");
    setStatusFilter("all");
    setWarehouseFilter("all");
    setArchiveStatusFilter("all");
  };

  // Filter documents
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.docNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.warehouseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.departmentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.divisionName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.supplierName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.recipientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.notes?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      typeFilter === "all" || doc.type === typeFilter;

    const matchesStatus =
      statusFilter === "all" || doc.status === statusFilter;

    const matchesWarehouse =
      warehouseFilter === "all" || doc.warehouseName === warehouseFilter;

    const matchesArchiveStatus =
      archiveStatusFilter === "all" || doc.archiveStatus === archiveStatusFilter;

    return matchesSearch && matchesType && matchesStatus && matchesWarehouse && matchesArchiveStatus;
  });

  // Statistics
  const stats = {
    total: filteredDocuments.length,
    withAttachments: filteredDocuments.filter((d) => d.hasAttachments).length,
    withoutAttachments: filteredDocuments.filter((d) => !d.hasAttachments).length,
    totalValue: filteredDocuments.reduce((sum, doc) => sum + doc.totalValue, 0),
    approved: filteredDocuments.filter((d) => d.status === "approved").length,
  };

  const uniqueWarehouses = [
    ...new Set(documents.map((d) => d.warehouseName)),
  ].filter(Boolean);

  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold">غير مصرح</h3>
          <p className="text-muted-foreground mb-4">
            ليس لديك صلاحية الوصول إلى أرشيف المستندات
          </p>
          <Button onClick={() => router.back()}>العودة</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Archive className="h-8 w-8" />
          أرشيف المستندات والفواتير
        </h2>
        <p className="text-muted-foreground mt-1">
          إدارة وعرض جميع المستندات والفواتير المؤرشفة مع إمكانية رفع المرفقات
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المستندات</CardTitle>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">مستند</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مع مرفقات</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.withAttachments}
            </div>
            <p className="text-xs text-muted-foreground">مستند كامل</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">بدون مرفقات</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.withoutAttachments}
            </div>
            <p className="text-xs text-muted-foreground">يحتاج مرفقات</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">القيمة الإجمالية</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalValue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">دينار عراقي</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المعتمدة</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.approved}
            </div>
            <p className="text-xs text-muted-foreground">مستند معتمد</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              البحث والتصفية
            </CardTitle>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              <Filter className="h-4 w-4 ml-2" />
              مسح الفلاتر
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ابحث برقم المستند، القسم، المورد..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
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
                <SelectItem value="approved">معتمد</SelectItem>
                <SelectItem value="draft">مسودة</SelectItem>
                <SelectItem value="cancelled">ملغي</SelectItem>
              </SelectContent>
            </Select>

            <Select value={archiveStatusFilter} onValueChange={setArchiveStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="حالة الأرشفة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="archived">مؤرشف</SelectItem>
                <SelectItem value="pending_documents">بانتظار المستندات</SelectItem>
              </SelectContent>
            </Select>

            <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
              <SelectTrigger>
                <SelectValue placeholder="المخزن" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المخازن</SelectItem>
                {uniqueWarehouses.map((warehouse) => (
                  <SelectItem key={warehouse} value={warehouse!}>
                    {warehouse}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle>المستندات المؤرشفة ({filteredDocuments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table dir="rtl">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">رقم المستند</TableHead>
                  <TableHead className="text-right">النوع</TableHead>
                  <TableHead className="text-right">نوع الإدخال</TableHead>
                  <TableHead className="text-right">التاريخ</TableHead>
                  <TableHead className="text-right">القسم</TableHead>
                  <TableHead className="text-right">المخزن</TableHead>
                  <TableHead className="text-right">المورد/المستلم</TableHead>
                  <TableHead className="text-right">عدد المواد</TableHead>
                  <TableHead className="text-right">القيمة</TableHead>
                  <TableHead className="text-right">حالة المرفقات</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">حالة الأرشفة</TableHead>
                  <TableHead className="text-right">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={13}
                      className="text-center text-muted-foreground h-24"
                    >
                      لا توجد مستندات مطابقة للفلاتر المحددة
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="text-right font-mono font-medium">
                        {doc.docNumber}
                      </TableCell>
                      <TableCell className="text-right">
                        {getTypeBadge(doc.type)}
                      </TableCell>
                      <TableCell className="text-right">
                        {getEntryTypeBadge(doc.entryType)}
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {new Date(doc.date).toLocaleDateString("ar-IQ", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })}
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        <div className="font-medium">
                          {doc.departmentName}
                        </div>
                        {doc.divisionName && (
                          <div className="text-xs text-muted-foreground">
                            {doc.divisionName}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {doc.warehouseName}
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {doc.supplierName || doc.recipientName || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline">{doc.itemCount}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {doc.totalValue > 0
                          ? doc.totalValue.toLocaleString()
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        {getAttachmentStatusBadge(
                          doc.hasAttachments,
                          doc.attachmentCount
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {getStatusBadge(doc.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        {getArchiveStatusBadge(doc.archiveStatus)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(`/documents/archive/${doc.id}`)
                              }
                            >
                              <Eye className="ml-2 h-4 w-4" />
                              عرض التفاصيل
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleUploadDocuments(String(doc.id))}
                            >
                              <Upload className="ml-2 h-4 w-4" />
                              رفع مرفقات
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDownload(doc)}>
                              <Download className="ml-2 h-4 w-4" />
                              تحميل
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="ml-2 h-4 w-4" />
                              حذف
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
}
