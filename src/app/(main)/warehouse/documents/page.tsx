"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  FileText,
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  PackagePlus,
  PackageMinus,
  ArrowDownLeft,
  ArrowUpRight,
  Filter,
  Download,
} from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { WarehouseSelector } from "@/components/warehouse/warehouse-selector";
import { useWarehouse } from "@/context/warehouse-context";

// Import shared data and types
import {
  warehouseDocuments,
  documentTypeOptions,
  documentStatusOptions,
  departments,
  type WarehouseDocument,
} from "@/lib/data/warehouse-data";

const WarehouseDocumentsPage = () => {
  const router = useRouter();
  const { selectedWarehouse } = useWarehouse();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<WarehouseDocument | null>(null);

  // Filter documents based on search and filters
  const filteredDocuments = useMemo(() => {
    let filtered = warehouseDocuments;

    // Warehouse filter
    if (selectedWarehouse) {
      filtered = filtered.filter(
        (doc) => doc.warehouseId === selectedWarehouse.id
      );
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (doc) =>
          doc.docNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.departmentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.supplierName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.recipientName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((doc) => doc.type === typeFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((doc) => doc.status === statusFilter);
    }

    // Department filter
    if (departmentFilter !== "all") {
      filtered = filtered.filter(
        (doc) => doc.departmentName === departmentFilter
      );
    }

    return filtered.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [
    selectedWarehouse,
    searchTerm,
    typeFilter,
    statusFilter,
    departmentFilter,
  ]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalDocuments = filteredDocuments.length;
    const entryDocuments = filteredDocuments.filter(
      (d) => d.type === "entry"
    ).length;
    const issuanceDocuments = filteredDocuments.filter(
      (d) => d.type === "issuance"
    ).length;
    const totalValue = filteredDocuments.reduce(
      (sum, doc) => sum + doc.totalValue,
      0
    );

    return { totalDocuments, entryDocuments, issuanceDocuments, totalValue };
  }, [filteredDocuments]);

  const clearFilters = () => {
    setSearchTerm("");
    setTypeFilter("all");
    setStatusFilter("all");
    setDepartmentFilter("all");
  };

  const handleDeleteDocument = (doc: WarehouseDocument) => {
    setDocumentToDelete(doc);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    // Here you would typically call an API to delete the document
    console.log("Deleting document:", documentToDelete?.id);
    setDeleteDialogOpen(false);
    setDocumentToDelete(null);
  };

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

  const uniqueDepartments = [
    ...new Set(warehouseDocuments.map((d) => d.departmentName)),
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <FileText className="h-8 w-8" />
          إدارة مستندات المخازن
        </h2>
        <p className="text-muted-foreground mt-1">
          عرض وإدارة جميع مستندات الإدخال والإصدار
        </p>
      </div>

      {/* Warehouse Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">اختيار المخزن</CardTitle>
        </CardHeader>
        <CardContent>
          {!selectedWarehouse ? (
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  الرجاء اختيار المخزن لعرض المستندات
                </AlertDescription>
              </Alert>
              <WarehouseSelector />
            </div>
          ) : (
            <div className="space-y-4">
              <WarehouseSelector />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Content */}
      {selectedWarehouse && (
        <>
          {/* Statistics Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  إجمالي المستندات
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalDocuments}</div>
                <p className="text-xs text-muted-foreground">مستند</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  مستندات الإدخال
                </CardTitle>
                <ArrowDownLeft className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {stats.entryDocuments}
                </div>
                <p className="text-xs text-muted-foreground">مستند إدخال</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  مستندات الإصدار
                </CardTitle>
                <ArrowUpRight className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {stats.issuanceDocuments}
                </div>
                <p className="text-xs text-muted-foreground">مستند إصدار</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  القيمة الإجمالية
                </CardTitle>
                <Download className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.totalValue.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">دينار عراقي</p>
              </CardContent>
            </Card>
          </div>
          {/* Filters */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>البحث والتصفية</CardTitle>
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  <Filter className="h-4 w-4 ml-2" />
                  مسح الفلاتر
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                    {documentTypeOptions.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentStatusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={departmentFilter}
                  onValueChange={setDepartmentFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="القسم" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الأقسام</SelectItem>
                    {uniqueDepartments.map((dept) => (
                      <SelectItem key={dept} value={dept!}>
                        {dept}
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
              <CardTitle>المستندات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <Table dir="rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">رقم المستند</TableHead>
                      <TableHead className="text-right">النوع</TableHead>
                      <TableHead className="text-right">التاريخ</TableHead>
                      <TableHead className="text-right">القسم</TableHead>
                      <TableHead className="text-right">
                        المورد/المستلم
                      </TableHead>
                      <TableHead className="text-right">عدد المواد</TableHead>
                      <TableHead className="text-right">القيمة</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={9}
                          className="text-center py-8 text-muted-foreground"
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
                            {format(new Date(doc.date), "dd/MM/yyyy", {
                              locale: ar,
                            })}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="text-sm">
                              <div className="font-medium">
                                {doc.departmentName}
                              </div>
                              {doc.divisionName && (
                                <div className="text-muted-foreground text-xs">
                                  {doc.divisionName}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right text-sm">
                            {doc.type === "entry"
                              ? doc.supplierName
                              : doc.recipientName}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge variant="outline">{doc.itemCount}</Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {doc.totalValue.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            {getStatusBadge(doc.status)}
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
                                <DropdownMenuItem>
                                  <Eye className="ml-2 h-4 w-4" />
                                  عرض التفاصيل
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    if (doc.type === "entry") {
                                      router.push("/warehouse/entry");
                                    } else {
                                      router.push("/warehouse/issuance");
                                    }
                                  }}
                                >
                                  <Edit className="ml-2 h-4 w-4" />
                                  تعديل
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Download className="ml-2 h-4 w-4" />
                                  تحميل PDF
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => handleDeleteDocument(doc)}
                                >
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
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من حذف المستند{" "}
              <span className="font-bold">{documentToDelete?.docNumber}</span>؟
              هذا الإجراء لا يمكن التراجع عنه.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WarehouseDocumentsPage;
