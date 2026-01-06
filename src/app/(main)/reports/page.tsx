"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BarChart2, Boxes, Building, Building2, FileText, History, Truck } from "lucide-react";
import Link from 'next/link';
import React from 'react';

type ReportCardProps = {
  title: string;
  description: string;
  icon: React.ElementType;
  link: string;
};

const ReportCard = ({ title, description, icon: Icon, link }: ReportCardProps) => (
  <Link href={link} className="block hover:shadow-lg transition-shadow rounded-lg">
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold">{title}</CardTitle>
        <Icon className="h-6 w-6 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="flex items-center pt-4 font-semibold text-primary">
          <span>فتح التقرير</span>
          <ArrowLeft className="mr-2 h-4 w-4" />
        </div>
      </CardContent>
    </Card>
  </Link>
);

const ReportsPage = () => {
  const reports = [
    {
      title: "تقارير الإدخال والإصدار",
      description: "تقارير تفصيلية عن عمليات الإدخال والإصدار اليومية والشهرية.",
      icon: FileText,
      link: "/reports/entry-issuance",
    },
    {
      title: "تقارير الرصيد المخزني",
      description: "تقارير شاملة عن الأرصدة الحالية والمستويات الحرجة للمواد.",
      icon: Boxes,
      link: "/reports/stock-balance",
    },
    {
      title: "تقارير حركة المواد",
      description: "تقارير تحليلية عن حركة المواد بين الأقسام والمخازن.",
      icon: History,
      link: "/reports/item-movement",
    },
    {
      title: "تقارير الموردين",
      description: "تقارير مفصلة عن المواد الموردة من موردين محددين.",
      icon: Truck,
      link: "/reports/suppliers",
    },
    {
      title: "رصيد الأقسام",
      description: "عرض المواد التي تم إصدارها إلى الأقسام المختلفة.",
      icon: Building2,
      link: "/reports/department-balance",
    },
    {
      title: "التقارير المالية",
      description: "تقارير مالية شاملة عن قيمة المخزون والتكاليف.",
      icon: BarChart2,
      link: "/reports/financial",
    },
  ];

  return (
    <div>
        <h1 className="text-3xl font-bold tracking-tight mb-6">مركز التقارير</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reports.map((report) => (
                <ReportCard key={report.title} {...report} />
            ))}
        </div>
    </div>
  );
};

export default ReportsPage;