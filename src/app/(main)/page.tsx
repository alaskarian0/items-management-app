"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuthStore } from "@/store/auth/authStore";
import {
  PackageCheck,
  Users,
  FileText,
  ArrowRight,
  Clock,
  CheckCircle,
  Package,
  Building2,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Mock department items data
const departmentItemsStats = {
  totalItems: 47,
  pendingDistribution: 23,
  assigned: 24,
  employees: 12,
  divisions: 4,
};

// Recent assignments data
const recentAssignments = [
  {
    id: 1,
    itemCode: "FUR-CHR-2024-003",
    itemName: "كرسي مكتبي دوار",
    assignedTo: "أحمد محمد",
    division: "شعبة التخطيط",
    date: "2024-01-20",
    status: "assigned" as const,
  },
  {
    id: 2,
    itemCode: "FUR-TBL-2024-001",
    itemName: "طاولة اجتماعات خشبية",
    assignedTo: "سارة علي",
    division: "شعبة المتابعة",
    date: "2024-01-19",
    status: "assigned" as const,
  },
  {
    id: 3,
    itemCode: "CAR-PRS-2024-004",
    itemName: "سجاد فارسي",
    assignedTo: "محمد حسن",
    division: "شعبة الحسابات",
    date: "2024-01-18",
    status: "assigned" as const,
  },
  {
    id: 4,
    itemCode: "FUR-DSK-2024-002",
    itemName: "مكتب خشبي",
    assignedTo: "فاطمة أحمد",
    division: "شعبة الموارد البشرية",
    date: "2024-01-17",
    status: "assigned" as const,
  },
];

// Items by division data
const itemsByDivision = [
  { name: "شعبة التخطيط", items: 12 },
  { name: "شعبة المتابعة", items: 8 },
  { name: "شعبة الحسابات", items: 15 },
  { name: "شعبة الموارد البشرية", items: 12 },
];

// Pending items for quick action
const pendingItems = [
  {
    id: 1,
    code: "FUR-CHR-2024-001",
    name: "كرسي مكتبي دوار",
    warehouse: "مخزن الأثاث",
    receivedDate: "2024-01-15",
  },
  {
    id: 2,
    code: "FUR-CHR-2024-002",
    name: "كرسي مكتبي دوار",
    warehouse: "مخزن الأثاث",
    receivedDate: "2024-01-15",
  },
  {
    id: 3,
    code: "CAR-PRS-2024-001",
    name: "سجاد فارسي",
    warehouse: "مخزن السجاد",
    receivedDate: "2024-01-17",
  },
];

const StatCard = ({
  title,
  value,
  icon: Icon,
  description,
  color = "text-muted-foreground",
  href,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description: string;
  color?: string;
  href?: string;
}) => {
  const CardWrapper = href ? Link : "div";

  return (
    <CardWrapper href={href || ""}>
      <Card className={href ? "cursor-pointer hover:bg-muted/50 transition-colors" : ""}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className={`h-5 w-5 ${color}`} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </CardWrapper>
  );
};

export default function DashboardPage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Building2 className="h-8 w-8" />
              لوحة تحكم إدارة الأقسام
            </h2>
            <p className="text-muted-foreground mt-1">
              إدارة وتوزيع المواد على الشعب والموظفين
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/department/employees">
                <Users className="h-4 w-4 ml-2" />
                إدارة الموظفين
              </Link>
            </Button>
            <Button asChild>
              <Link href="/department/item-assignments">
                <PackageCheck className="h-4 w-4 ml-2" />
                توزيع المواد
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title="إجمالي المواد"
          value={departmentItemsStats.totalItems}
          icon={Package}
          description="مواد القسم المستلمة"
          color="text-blue-600"
          href="/department/item-assignments"
        />
        <StatCard
          title="بانتظار التوزيع"
          value={departmentItemsStats.pendingDistribution}
          icon={Clock}
          description="مواد تحتاج تعيين"
          color="text-yellow-600"
          href="/department/item-assignments"
        />
        <StatCard
          title="تم التوزيع"
          value={departmentItemsStats.assigned}
          icon={CheckCircle}
          description="مواد معينة للموظفين"
          color="text-green-600"
        />
        <StatCard
          title="عدد الموظفين"
          value={departmentItemsStats.employees}
          icon={Users}
          description="موظف نشط"
          color="text-purple-600"
          href="/department/employees"
        />
        <StatCard
          title="عدد الشعب"
          value={departmentItemsStats.divisions}
          icon={Building2}
          description="شعبة نشطة"
          color="text-orange-600"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 md:grid-cols-7">
        {/* Items by Division Chart */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              توزيع المواد حسب الشعب
            </CardTitle>
            <CardDescription>
              عدد المواد المخصصة لكل شعبة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={itemsByDivision} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis type="number" className="text-muted-foreground" stroke="currentColor" fontSize={12} />
                <YAxis
                  type="category"
                  dataKey="name"
                  className="text-muted-foreground"
                  stroke="currentColor"
                  fontSize={12}
                  width={150}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "hsl(var(--popover-foreground))" }}
                />
                <Bar
                  dataKey="items"
                  fill="currentColor"
                  radius={[0, 8, 8, 0]}
                  className="fill-primary"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pending Items - Quick Action */}
        <Card className="col-span-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  مواد بانتظار التوزيع
                </CardTitle>
                <CardDescription>
                  مواد تحتاج إلى تعيين للموظفين
                </CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/department/item-assignments">
                  عرض الكل
                  <ArrowRight className="h-4 w-4 mr-2" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 rounded-lg bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20">
                      <Package className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-xs text-muted-foreground font-mono">
                          {item.code}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {item.warehouse}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button asChild size="sm">
                    <Link href="/department/item-assignments">
                      تعيين
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Assignments */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                آخر عمليات التوزيع
              </CardTitle>
              <CardDescription>
                سجل توزيع المواد على الموظفين
              </CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/department/item-assignments">
                عرض السجل الكامل
                <ArrowRight className="h-4 w-4 mr-2" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">الكود</TableHead>
                  <TableHead className="text-right">اسم المادة</TableHead>
                  <TableHead className="text-right">المستلم</TableHead>
                  <TableHead className="text-right">الشعبة</TableHead>
                  <TableHead className="text-right">التاريخ</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentAssignments.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell className="font-mono text-sm">
                      {assignment.itemCode}
                    </TableCell>
                    <TableCell className="font-medium">
                      {assignment.itemName}
                    </TableCell>
                    <TableCell>{assignment.assignedTo}</TableCell>
                    <TableCell>{assignment.division}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(assignment.date).toLocaleDateString('ar-IQ')}
                    </TableCell>
                    <TableCell>
                      <Badge variant="default" className="gap-1">
                        <CheckCircle className="h-3 w-3" />
                        تم التوزيع
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
          <Link href="/department/item-assignments">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <PackageCheck className="h-5 w-5 text-blue-600" />
                توزيع المواد
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                تعيين المواد المستلمة للموظفين والشعب
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
          <Link href="/department/employees">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                إدارة الموظفين
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                عرض وإدارة بيانات الموظفين والشعب
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
          <Link href="/department/inventory-stock-requests">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-600" />
                طلبات الاستعلام
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                إنشاء طلبات استعلام عن المخزون
              </p>
            </CardContent>
          </Link>
        </Card>
      </div>
    </div>
  );
}
