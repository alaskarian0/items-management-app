"use client";

import { useState, useMemo } from "react";
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
  Loader2,
  XCircle,
} from "lucide-react";
import { useStockQuery, STOCK_QUERY_STATUS } from "@/hooks/use-stock-query";

export default function StockRequestsListPage() {
  const router = useRouter();
  const { requests, loading, meta, setFilters } = useStockQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const getStatusBadge = (status: number) => {
    switch (status) {
      case STOCK_QUERY_STATUS.PENDING:
        return (
          <Badge className="bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20">
            <Clock className="h-3 w-3 ml-1" />
            قيد المراجعة
          </Badge>
        );
      case STOCK_QUERY_STATUS.APPROVED:
        return (
          <Badge className="bg-green-500/10 text-green-700 hover:bg-green-500/20">
            <CheckCircle className="h-3 w-3 ml-1" />
            تمت الموافقة
          </Badge>
        );
      case STOCK_QUERY_STATUS.REJECTED:
        return (
          <Badge className="bg-red-500/10 text-red-700 hover:bg-red-500/20">
            <XCircle className="h-3 w-3 ml-1" />
            مرفوض
          </Badge>
        );
      case STOCK_QUERY_STATUS.COMPLETED:
        return (
          <Badge className="bg-blue-500/10 text-blue-700 hover:bg-blue-500/20">
            <CheckCircle className="h-3 w-3 ml-1" />
            مكتمل
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Filter requests based on search and status
  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const matchesSearch =
        request.requestNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.warehouse?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.requesterName?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || request.status.toString() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [requests, searchTerm, statusFilter]);

  // Calculate statistics
  const stats = useMemo(() => ({
    pending: requests.filter((r) => r.status === STOCK_QUERY_STATUS.PENDING).length,
    approved: requests.filter((r) => r.status === STOCK_QUERY_STATUS.APPROVED).length,
    rejected: requests.filter((r) => r.status === STOCK_QUERY_STATUS.REJECTED).length,
  }), [requests]);

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
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">تمت الموافقة</p>
                <p className="text-2xl font-bold">{stats.approved}</p>
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
                <p className="text-2xl font-bold">{stats.rejected}</p>
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
                  <SelectItem value={STOCK_QUERY_STATUS.PENDING.toString()}>قيد المراجعة</SelectItem>
                  <SelectItem value={STOCK_QUERY_STATUS.APPROVED.toString()}>تمت الموافقة</SelectItem>
                  <SelectItem value={STOCK_QUERY_STATUS.REJECTED.toString()}>مرفوض</SelectItem>
                  <SelectItem value={STOCK_QUERY_STATUS.COMPLETED.toString()}>مكتمل</SelectItem>
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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center h-24">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : filteredRequests.length === 0 ? (
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
                        {new Date(request.requestDate).toLocaleDateString("ar-IQ")}
                      </TableCell>
                      <TableCell className="text-right">
                        {request.warehouse?.name || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        {request.requesterName || request.department?.name || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        {request.itemCount}
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
                              router.push(`/inventory/requests/${request.id}`)
                            }
                          >
                            <Eye className="h-4 w-4 ml-1" />
                            عرض
                          </Button>
                          {(request.status === STOCK_QUERY_STATUS.APPROVED || request.status === STOCK_QUERY_STATUS.COMPLETED) && (
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
