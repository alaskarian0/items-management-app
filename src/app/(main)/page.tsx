"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth/authStore";
import {
  AlertCircle,
  Barcode,
  Building2,
  Package,
  PackageMinus,
  PackagePlus,
  TrendingDown,
  TrendingUp,
  Users,
  Warehouse,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Warehouse names mapping
const WAREHOUSE_NAMES: Record<string, string> = {
  furniture: "مخزن الأثاث والممتلكات العامة",
  carpet: "مخزن السجاد والمفروشات",
  general: "مخزن المواد العامة",
  construction: "مخزن المواد الإنشائية",
  dry: "مخزن المواد الجافة",
  frozen: "مخزن المواد المجمّدة",
  fuel: "مخزن الوقود والزيوت",
  consumable: "مخزن المواد المستهلكة",
  law_enforcement: "مخزن قسم حفظ النظام",
};

// Warehouse stock data
const warehouseStockData = [
  { name: "المخزن الرئيسي", items: 4234 },
  { name: "مخزن المواد الثابتة", items: 2341 },
  { name: "مخزن المواد الاستهلاكية", items: 3567 },
  { name: "مخزن الأثاث", items: 1892 },
  { name: "مخزن المفروشات", items: 1123 },
];

// Material movement data (last 7 days)
const movementData = [
  { day: "السبت", incoming: 45, outgoing: 32 },
  { day: "الأحد", incoming: 52, outgoing: 28 },
  { day: "الإثنين", incoming: 38, outgoing: 45 },
  { day: "الثلاثاء", incoming: 65, outgoing: 38 },
  { day: "الأربعاء", incoming: 48, outgoing: 52 },
  { day: "الخميس", incoming: 70, outgoing: 45 },
  { day: "الجمعة", incoming: 35, outgoing: 25 },
];

// Fixed assets distribution
const fixedAssetsData = [
  { name: "مرمزة", value: 856, color: "#22c55e" },
  { name: "قيد الذمة", value: 432, color: "#3b82f6" },
  { name: "مستهلكة", value: 178, color: "#ef4444" },
  { name: "ممنوحة", value: 124, color: "#a855f7" },
];

// Recent activities
const recentActivities = [
  {
    id: 1,
    type: "entry",
    title: "إدخال مواد جديدة",
    description: "45 صنف - مخزن المواد الثابتة",
    time: "منذ ساعتين",
    icon: PackagePlus,
    color: "text-green-600",
  },
  {
    id: 2,
    type: "issuance",
    title: "إصدار مواد",
    description: "قسم الصيانة - 12 صنف",
    time: "منذ 4 ساعات",
    icon: PackageMinus,
    color: "text-blue-600",
  },
  {
    id: 3,
    type: "alert",
    title: "تنبيه: مواد قاربت على النفاد",
    description: "8 أصناف تحتاج إعادة طلب",
    time: "منذ 5 ساعات",
    icon: AlertCircle,
    color: "text-orange-600",
  },
  {
    id: 4,
    type: "custody",
    title: "تسليم موجودات",
    description: "تم تسليم 3 أجهزة حاسوب لقسم IT",
    time: "منذ يوم واحد",
    icon: Users,
    color: "text-purple-600",
  },
];

const StatCard = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
  trendValue,
  color = "text-muted-foreground",
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  description: string;
  trend?: "up" | "down";
  trendValue?: string;
  color?: string;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className={`h-5 w-5 ${color}`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <div className="flex items-center justify-between mt-1">
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && trendValue && (
          <div className={`flex items-center gap-1 text-xs ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            <span>{trendValue}</span>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

export default function DashboardPage() {
  const { user } = useAuthStore();
  const totalItems = warehouseStockData.reduce((sum, w) => sum + w.items, 0);
  const totalFixedAssets = fixedAssetsData.reduce((sum, a) => sum + a.value, 0);

  // Get warehouse name
  const warehouseName = user?.warehouse
    ? WAREHOUSE_NAMES[user.warehouse] || user.warehouse
    : "المخزن الرئيسي";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-bold tracking-tight">لوحة التحكم الرئيسية</h2>
          {user?.warehouse && (
            <Badge variant="outline" className="text-base px-3 py-1">
              <Warehouse className="h-4 w-4 ml-2" />
              {warehouseName}
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground">
          {user?.warehouse === "law_enforcement"
            ? "مرحباً في لوحة التحكم - قسم حفظ النظام"
            : "نظرة شاملة على حالة المخزون والموجودات الثابتة"
          }
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="إجمالي المواد"
          value={totalItems.toLocaleString()}
          icon={Package}
          description="في جميع المخازن"
          trend="up"
          trendValue="+12%"
          color="text-blue-600"
        />
        <StatCard
          title="المخازن النشطة"
          value="5"
          icon={Warehouse}
          description="مخازن قيد التشغيل"
          color="text-green-600"
        />
        <StatCard
          title="الموجودات الثابتة"
          value={totalFixedAssets.toLocaleString()}
          icon={Barcode}
          description="موجودات مسجلة"
          trend="up"
          trendValue="+8%"
          color="text-purple-600"
        />
        <StatCard
          title="الأقسام المستفيدة"
          value="24"
          icon={Building2}
          description="قسم نشط"
          color="text-orange-600"
        />
      </div>

      {/* Main Charts */}
      <div className="grid gap-4 md:grid-cols-7">
        {/* Warehouse Stock Chart */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Warehouse className="h-5 w-5" />
              توزيع المواد على المخازن
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={warehouseStockData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="name"
                  className="text-muted-foreground"
                  stroke="currentColor"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis
                  className="text-muted-foreground"
                  stroke="currentColor"
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(value) => `${value}`}
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
                  radius={[8, 8, 0, 0]}
                  className="fill-primary"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Material Movement Chart */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              حركة المواد (آخر 7 أيام)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={movementData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="day"
                  className="text-muted-foreground"
                  stroke="currentColor"
                  fontSize={12}
                />
                <YAxis
                  className="text-muted-foreground"
                  stroke="currentColor"
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "hsl(var(--popover-foreground))" }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="incoming"
                  stroke="#22c55e"
                  strokeWidth={2}
                  name="مواد داخلة"
                  dot={{ fill: "#22c55e" }}
                />
                <Line
                  type="monotone"
                  dataKey="outgoing"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="مواد خارجة"
                  dot={{ fill: "#ef4444" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid gap-4 md:grid-cols-7">
        {/* Fixed Assets Distribution */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Barcode className="h-5 w-5" />
              توزيع الموجودات الثابتة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={fixedAssetsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {fixedAssetsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "hsl(var(--popover-foreground))" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {fixedAssetsData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.value} موجود
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              النشاطات الأخيرة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className={`p-2 rounded-lg bg-muted ${activity.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {activity.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {activity.description}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {activity.time}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">المواد الداخلة اليوم</CardTitle>
            <PackagePlus className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">127</div>
            <p className="text-xs text-muted-foreground">صنف تم إدخاله</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">المواد الخارجة اليوم</CardTitle>
            <PackageMinus className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">89</div>
            <p className="text-xs text-muted-foreground">صنف تم إصداره</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">المواد القريبة من النفاد</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">8</div>
            <p className="text-xs text-muted-foreground">صنف يحتاج إعادة طلب</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
