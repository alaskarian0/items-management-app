"use client";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Boxes, Building2, Truck, FileWarning } from "lucide-react";

const chartData = [
  { name: "مخزن الأثاث", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "مخزن السجاد", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "المواد العامة", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "المواد الإنشائية", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "المواد الغذائية", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "الوقود والزيوت", total: Math.floor(Math.random() * 5000) + 1000 },
];

const movementData = [
  { day: "قبل 7 أيام", "مواد داخلة": 30, "مواد خارجة": 15 },
  { day: "قبل 6 أيام", "مواد داخلة": 45, "مواد خارجة": 25 },
  { day: "قبل 5 أيام", "مواد داخلة": 20, "مواد خارجة": 40 },
  { day: "قبل 4 أيام", "مواد داخلة": 50, "مواد خارجة": 30 },
  { day: "قبل 3 أيام", "مواد داخلة": 35, "مواد خارجة": 22 },
  { day: "قبل يومين", "مواد داخلة": 60, "مواد خارجة": 45 },
  { day: "الأمس", "مواد داخلة": 40, "مواد خارجة": 55 },
];

const StatCard = ({
  title,
  value,
  icon: Icon,
  description,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  description: string;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

export default function DashboardPage() {
  return (
    <div className="flex-col md:flex">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            لوحة التحكم الرئيسية
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="مجموع المواد"
            value="12,504"
            icon={Boxes}
            description="إجمالي عدد المواد في كل المخازن"
          />
          <StatCard
            title="عدد الأقسام"
            value="18"
            icon={Building2}
            description="الأقسام المسجلة في النظام"
          />
          <StatCard
            title="عدد الموردين"
            value="42"
            icon={Truck}
            description="الموردون المسجلون في النظام"
          />
          <StatCard
            title="طلبات معلقة"
            value="3"
            icon={FileWarning}
            description="طلبات إصدار مواد تنتظر الموافقة"
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>نظرة عامة على المخازن</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData}>
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Bar
                    dataKey="total"
                    fill="currentColor"
                    radius={[4, 4, 0, 0]}
                    className="fill-primary"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>حركة المواد (آخر 7 أيام)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={movementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" stroke="#888888" fontSize={12} />
                  <YAxis stroke="#888888" fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="مواد داخلة" stroke="#22c55e" />
                  <Line type="monotone" dataKey="مواد خارجة" stroke="#ef4444" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
