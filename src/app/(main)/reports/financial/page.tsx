"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart3,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Filter,
  Download,
  PieChart,
  Wallet,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

type ExpenseCategory = {
  category: string;
  amount: number;
  percentage: number;
  color: string;
};

type MonthlyFinancial = {
  month: string;
  purchases: number;
  issuances: number;
  balance: number;
};

type SupplierExpense = {
  supplier: string;
  totalAmount: number;
  transactionCount: number;
  lastTransaction: string;
};

// Mock data
const expenseCategories: ExpenseCategory[] = [
  {
    category: "أثاث مكتبي",
    amount: 125000000,
    percentage: 35,
    color: "#3b82f6",
  },
  {
    category: "أجهزة حاسوب",
    amount: 95000000,
    percentage: 27,
    color: "#22c55e",
  },
  {
    category: "مواد استهلاكية",
    amount: 68000000,
    percentage: 19,
    color: "#f59e0b",
  },
  {
    category: "معدات كهربائية",
    amount: 42000000,
    percentage: 12,
    color: "#a855f7",
  },
  {
    category: "أخرى",
    amount: 25000000,
    percentage: 7,
    color: "#ef4444",
  },
];

const monthlyData: MonthlyFinancial[] = [
  { month: "يناير", purchases: 285000000, issuances: 142000000, balance: 143000000 },
  { month: "فبراير", purchases: 312000000, issuances: 168000000, balance: 144000000 },
  { month: "مارس", purchases: 355000000, issuances: 195000000, balance: 160000000 },
  { month: "أبريل", purchases: 298000000, issuances: 178000000, balance: 120000000 },
  { month: "مايو", purchases: 325000000, issuances: 185000000, balance: 140000000 },
  { month: "يونيو", purchases: 342000000, issuances: 205000000, balance: 137000000 },
];

const supplierExpenses: SupplierExpense[] = [
  {
    supplier: "شركة المستقبل للتجهيزات",
    totalAmount: 185000000,
    transactionCount: 24,
    lastTransaction: "2024-03-15",
  },
  {
    supplier: "مؤسسة النور التجارية",
    totalAmount: 142000000,
    transactionCount: 18,
    lastTransaction: "2024-03-14",
  },
  {
    supplier: "شركة الفرات للأثاث",
    totalAmount: 98000000,
    transactionCount: 12,
    lastTransaction: "2024-03-13",
  },
  {
    supplier: "شركة البصرة للتجهيزات",
    totalAmount: 76000000,
    transactionCount: 9,
    lastTransaction: "2024-03-12",
  },
  {
    supplier: "مكتب الرافدين التجاري",
    totalAmount: 54000000,
    transactionCount: 7,
    lastTransaction: "2024-03-10",
  },
];

const FinancialReportPage = () => {
  const [periodFilter, setPeriodFilter] = useState<string>("this-month");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Calculate statistics
  const stats = useMemo(() => {
    const totalPurchases = monthlyData.reduce((sum, m) => sum + m.purchases, 0);
    const totalIssuances = monthlyData.reduce((sum, m) => sum + m.issuances, 0);
    const currentBalance = monthlyData[monthlyData.length - 1]?.balance || 0;
    const totalExpenses = expenseCategories.reduce((sum, c) => sum + c.amount, 0);
    const avgMonthlyPurchase = totalPurchases / monthlyData.length;

    return {
      totalPurchases,
      totalIssuances,
      currentBalance,
      totalExpenses,
      avgMonthlyPurchase,
      netValue: totalPurchases - totalIssuances,
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">التقارير المالية</h2>
        <p className="text-muted-foreground mt-1">
          تحليل شامل للوضع المالي والمصروفات والمشتريات
        </p>
      </div>

      {/* Main Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المشتريات</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.totalPurchases.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">دينار عراقي</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">قيمة الإصدارات</CardTitle>
            <Wallet className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.totalIssuances.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">دينار عراقي</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الرصيد الحالي</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.currentBalance.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">دينار عراقي</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">متوسط الشراء الشهري</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {stats.avgMonthlyPurchase.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">دينار عراقي</p>
          </CardContent>
        </Card>
      </div>

      {/* Net Value Card */}
      <Card className="bg-gradient-to-br from-emerald-50 to-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            {stats.netValue >= 0 ? (
              <TrendingUp className="h-6 w-6" />
            ) : (
              <TrendingDown className="h-6 w-6" />
            )}
            صافي القيمة المالية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-green-700">
            {stats.netValue.toLocaleString()} IQD
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            الفرق بين إجمالي المشتريات والإصدارات
          </p>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            التصفية والتخصيص
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Select value={periodFilter} onValueChange={setPeriodFilter}>
              <SelectTrigger>
                <SelectValue placeholder="الفترة الزمنية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this-month">هذا الشهر</SelectItem>
                <SelectItem value="last-month">الشهر الماضي</SelectItem>
                <SelectItem value="this-quarter">هذا الربع</SelectItem>
                <SelectItem value="this-year">هذه السنة</SelectItem>
                <SelectItem value="last-year">السنة الماضية</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="الفئة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الفئات</SelectItem>
                <SelectItem value="furniture">أثاث مكتبي</SelectItem>
                <SelectItem value="computers">أجهزة حاسوب</SelectItem>
                <SelectItem value="consumables">مواد استهلاكية</SelectItem>
                <SelectItem value="electrical">معدات كهربائية</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="w-full">
              <Download className="ml-2 h-4 w-4" />
              تصدير التقرير المالي
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-7">
        {/* Monthly Trend */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              الاتجاه المالي الشهري
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => value.toLocaleString() + " IQD"}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="purchases"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="المشتريات"
                  dot={{ fill: "#3b82f6" }}
                />
                <Line
                  type="monotone"
                  dataKey="issuances"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  name="الإصدارات"
                  dot={{ fill: "#f59e0b" }}
                />
                <Line
                  type="monotone"
                  dataKey="balance"
                  stroke="#22c55e"
                  strokeWidth={2}
                  name="الرصيد"
                  dot={{ fill: "#22c55e" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Expense Categories Pie */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              توزيع المصروفات حسب الفئة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <RechartsPieChart>
                <Pie
                  data={expenseCategories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percentage }) =>
                    `${category} ${percentage}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {expenseCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => value.toLocaleString() + " IQD"}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Expense by Category */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            المصروفات حسب الفئة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {expenseCategories.map((category, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="font-medium">{category.category}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary">{category.percentage}%</Badge>
                    <span className="font-bold">
                      {category.amount.toLocaleString()} IQD
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${category.percentage}%`,
                      backgroundColor: category.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Supplier Expenses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            المصروفات حسب المورد
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>المورد</TableHead>
                  <TableHead>إجمالي المبلغ</TableHead>
                  <TableHead>عدد العمليات</TableHead>
                  <TableHead>آخر عملية</TableHead>
                  <TableHead>النسبة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {supplierExpenses.map((supplier, index) => {
                  const percentage = (
                    (supplier.totalAmount / stats.totalPurchases) *
                    100
                  ).toFixed(1);
                  return (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {supplier.supplier}
                      </TableCell>
                      <TableCell className="font-bold text-blue-600">
                        {supplier.totalAmount.toLocaleString()} IQD
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {supplier.transactionCount} عملية
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {supplier.lastTransaction}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">
                            {percentage}%
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialReportPage;
