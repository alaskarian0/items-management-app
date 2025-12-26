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
  AlertCircle,
  CheckCircle,
  Clock,
  List,
  Search,
  Eye,
  FileText,
} from "lucide-react";

// Stock Request interface
interface StockRequest {
  id: string;
  requestNumber: string;
  submittedDate: string;
  warehouseName: string;
  warehouseId: string;
  itemsCount: number;
  status: "pending" | "completed" | "rejected";
  submittedBy: string;
}

// Mock submitted requests
const MOCK_SUBMITTED_REQUESTS: StockRequest[] = [
  {
    id: "1",
    requestNumber: "SR-2024-001",
    submittedDate: "2024-01-20",
    warehouseName: "مخزن الأثاث والممتلكات العامة",
    warehouseId: "furniture",
    itemsCount: 3,
    status: "pending",
    submittedBy: "قسم حفظ النظام",
  },
  {
    id: "2",
    requestNumber: "SR-2024-002",
    submittedDate: "2024-01-18",
    warehouseName: "مخزن المواد العامة",
    warehouseId: "general",
    itemsCount: 5,
    status: "completed",
    submittedBy: "قسم حفظ النظام",
  },
  {
    id: "3",
    requestNumber: "SR-2024-003",
    submittedDate: "2024-01-15",
    warehouseName: "مخزن المواد الجافة",
    warehouseId: "dry",
    itemsCount: 2,
    status: "rejected",
    submittedBy: "قسم حفظ النظام",
  },
  {
    id: "4",
    requestNumber: "SR-2024-004",
    submittedDate: "2024-01-10",
    warehouseName: "مخزن الوقود والزيوت",
    warehouseId: "fuel",
    itemsCount: 4,
    status: "completed",
    submittedBy: "قسم حفظ النظام",
  },
];

export default function StockRequestsListPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<StockRequest[]>(
    MOCK_SUBMITTED_REQUESTS
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20">
            <Clock className="h-3 w-3 ml-1" />
            قيد المراجعة
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-green-500/10 text-green-700 hover:bg-green-500/20">
            <CheckCircle className="h-3 w-3 ml-1" />
            مكتمل
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-500/10 text-red-700 hover:bg-red-500/20">
            <AlertCircle className="h-3 w-3 ml-1" />
            مرفوض
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Filter requests based on search and status
  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.requestNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.warehouseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.submittedBy.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || request.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <List className="h-8 w-8" />
          الطلبات المرسلة
        </h2>
        <p className="text-muted-foreground mt-1">
          عرض وإدارة جميع طلبات الاستعلام عن المخزون المرسلة
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">قيد المراجعة</p>
                <p className="text-2xl font-bold">
                  {requests.filter((r) => r.status === "pending").length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">مكتمل</p>
                <p className="text-2xl font-bold">
                  {requests.filter((r) => r.status === "completed").length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">مرفوض</p>
                <p className="text-2xl font-bold">
                  {requests.filter((r) => r.status === "rejected").length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>البحث والتصفية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="ابحث برقم الطلب، المخزن، أو الجهة المرسلة..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="تصفية حسب الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="pending">قيد المراجعة</SelectItem>
                  <SelectItem value="completed">مكتمل</SelectItem>
                  <SelectItem value="rejected">مرفوض</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة الطلبات ({filteredRequests.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md overflow-x-auto">
            <Table dir="rtl">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">رقم الطلب</TableHead>
                  <TableHead className="text-right">التاريخ</TableHead>
                  <TableHead className="text-right">المخزن</TableHead>
                  <TableHead className="text-right">الجهة المرسلة</TableHead>
                  <TableHead className="text-right">عدد المواد</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-muted-foreground h-24"
                    >
                      {searchTerm || statusFilter !== "all"
                        ? "لا توجد نتائج مطابقة للبحث"
                        : "لا توجد طلبات مرسلة"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="text-right font-medium">
                        {request.requestNumber}
                      </TableCell>
                      <TableCell className="text-right">
                        {new Date(request.submittedDate).toLocaleDateString(
                          "ar-IQ"
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {request.warehouseName}
                      </TableCell>
                      <TableCell className="text-right">
                        {request.submittedBy}
                      </TableCell>
                      <TableCell className="text-right">
                        {request.itemsCount}
                      </TableCell>
                      <TableCell className="text-right">
                        {getStatusBadge(request.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              router.push(
                                `/law-enforcement/stock-requests-list/${request.id}`
                              )
                            }
                          >
                            <Eye className="h-4 w-4 ml-1" />
                            عرض
                          </Button>
                          {request.status === "completed" && (
                            <Button variant="outline" size="sm">
                              <FileText className="h-4 w-4 ml-1" />
                              التقرير
                            </Button>
                          )}
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
    </div>
  );
}
