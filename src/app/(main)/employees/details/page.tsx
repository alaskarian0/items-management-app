"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  User,
  Phone,
  Building2,
  Briefcase,
  PackageCheck,
  Calendar,
} from "lucide-react";

// Item assigned to employee
interface AssignedItem {
  id: string;
  uniqueCode: string;
  itemName: string;
  itemType: "ثابت" | "استهلاكي";
  sourceWarehouse: string;
  assignedDate: string;
  divisionName: string;
  unit?: string;
  notes?: string;
}

// Employee with their items
interface EmployeeWithItems {
  id: string;
  name: string;
  position: string;
  divisionName: string;
  unit?: string;
  phone?: string;
  items: AssignedItem[];
}

// Mock data - Same as custody page
const MOCK_EMPLOYEES_WITH_ITEMS: EmployeeWithItems[] = [
  {
    id: "EMP001",
    name: "أحمد محمد علي",
    position: "مدير التخطيط",
    divisionName: "شعبة التخطيط",
    unit: "وحدة التخطيط الاستراتيجي",
    phone: "07701234567",
    items: [
      {
        id: "ITM001",
        uniqueCode: "FUR-CHR-2024-003",
        itemName: "كرسي مكتبي دوار",
        itemType: "ثابت",
        sourceWarehouse: "مخزن الأثاث والممتلكات العامة",
        assignedDate: "2024-01-16",
        divisionName: "شعبة التخطيط",
        notes: "كرسي جديد للمكتب الرئيسي",
      },
      {
        id: "ITM002",
        uniqueCode: "FUR-DSK-2024-001",
        itemName: "مكتب خشبي",
        itemType: "ثابت",
        sourceWarehouse: "مخزن الأثاث والممتلكات العامة",
        assignedDate: "2024-01-18",
        divisionName: "شعبة التخطيط",
      },
      {
        id: "ITM003",
        uniqueCode: "IT-LAP-2024-005",
        itemName: "حاسوب محمول Dell",
        itemType: "ثابت",
        sourceWarehouse: "مخزن المواد العامة",
        assignedDate: "2024-01-20",
        divisionName: "شعبة التخطيط",
      },
    ],
  },
  {
    id: "EMP002",
    name: "سارة علي حسن",
    position: "مسؤولة المتابعة",
    divisionName: "شعبة المتابعة",
    phone: "07709876543",
    items: [
      {
        id: "ITM004",
        uniqueCode: "FUR-TBL-2024-003",
        itemName: "طاولة اجتماعات خشبية",
        itemType: "ثابت",
        sourceWarehouse: "مخزن الأثاث والممتلكات العامة",
        assignedDate: "2024-01-17",
        divisionName: "شعبة المتابعة",
      },
      {
        id: "ITM005",
        uniqueCode: "IT-PRN-2024-002",
        itemName: "طابعة HP LaserJet",
        itemType: "ثابت",
        sourceWarehouse: "مخزن المواد العامة",
        assignedDate: "2024-01-19",
        divisionName: "شعبة المتابعة",
      },
    ],
  },
  {
    id: "EMP003",
    name: "محمد حسن جاسم",
    position: "محاسب",
    divisionName: "شعبة الحسابات",
    unit: "وحدة المحاسبة المالية",
    phone: "07705551234",
    items: [
      {
        id: "ITM006",
        uniqueCode: "CAR-PRS-2024-004",
        itemName: "سجاد فارسي",
        itemType: "ثابت",
        sourceWarehouse: "مخزن السجاد والمفروشات",
        assignedDate: "2024-01-15",
        divisionName: "شعبة الحسابات",
      },
    ],
  },
  {
    id: "EMP004",
    name: "فاطمة أحمد",
    position: "موظفة موارد بشرية",
    divisionName: "شعبة الموارد البشرية",
    phone: "07708889999",
    items: [],
  },
];

export default function EmployeeDetailsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const employeeId = searchParams.get("id");

  // Find employee by ID
  const employee = MOCK_EMPLOYEES_WITH_ITEMS.find((e) => e.id === employeeId);

  if (!employee) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <p className="text-lg text-muted-foreground">الموظف غير موجود</p>
              <Button
                onClick={() => router.push("/employees")}
              >
                <ArrowLeft className="h-4 w-4 ml-2" />
                العودة إلى قائمة الموظفين
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header with Back Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <User className="h-8 w-8" />
            تفاصيل الموظف
          </h2>
          <p className="text-muted-foreground mt-1">
            عرض معلومات الموظف والمواد تحت ذمته
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push("/employees")}
        >
          <ArrowLeft className="h-4 w-4 ml-2" />
          العودة
        </Button>
      </div>

      {/* Employee Information Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl">{employee.name}</CardTitle>
              <CardDescription className="text-base">
                {employee.position}
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2">
              <User className="h-4 w-4 ml-2" />
              {employee.id}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Division */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-muted rounded-lg">
                <Building2 className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">الشعبة</Label>
                <p className="font-medium">{employee.divisionName}</p>
              </div>
            </div>

            {/* Unit */}
            {employee.unit && (
              <div className="flex items-start gap-3">
                <div className="p-2 bg-muted rounded-lg">
                  <Briefcase className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">
                    الوحدة
                  </Label>
                  <p className="font-medium">{employee.unit}</p>
                </div>
              </div>
            )}

            {/* Phone */}
            {employee.phone && (
              <div className="flex items-start gap-3">
                <div className="p-2 bg-muted rounded-lg">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">
                    رقم الهاتف
                  </Label>
                  <p className="font-medium font-mono">{employee.phone}</p>
                </div>
              </div>
            )}

            {/* Total Items */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-muted rounded-lg">
                <PackageCheck className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">
                  المواد تحت الذمة
                </Label>
                <p className="font-medium text-lg">
                  {employee.items.length} مادة
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المواد</CardTitle>
            <PackageCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employee.items.length}</div>
            <p className="text-xs text-muted-foreground">مادة تحت الذمة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">موجودات ثابتة</CardTitle>
            <PackageCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {employee.items.filter((i) => i.itemType === "ثابت").length}
            </div>
            <p className="text-xs text-muted-foreground">مادة ثابتة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              مواد استهلاكية
            </CardTitle>
            <PackageCheck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {employee.items.filter((i) => i.itemType === "استهلاكي").length}
            </div>
            <p className="text-xs text-muted-foreground">مادة استهلاكية</p>
          </CardContent>
        </Card>
      </div>

      {/* Items Under Custody */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PackageCheck className="h-5 w-5" />
            المواد المعينة ({employee.items.length})
          </CardTitle>
          <CardDescription>
            قائمة بجميع المواد الموزعة على هذا الموظف
          </CardDescription>
        </CardHeader>
        <CardContent>
          {employee.items.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <PackageCheck className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="text-lg font-medium text-muted-foreground">
                لا توجد مواد معينة لهذا الموظف
              </p>
              <p className="text-sm text-muted-foreground">
                لم يتم توزيع أي مواد على {employee.name} حتى الآن
              </p>
            </div>
          ) : (
            <div className="border rounded-md overflow-x-auto">
              <Table dir="rtl">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right min-w-[150px]">
                      الكود الفريد
                    </TableHead>
                    <TableHead className="text-right min-w-[200px]">
                      اسم المادة
                    </TableHead>
                    <TableHead className="text-right min-w-[100px]">
                      النوع
                    </TableHead>
                    <TableHead className="text-right min-w-[180px]">
                      المخزن المصدر
                    </TableHead>
                    <TableHead className="text-right min-w-[120px]">
                      تاريخ التعيين
                    </TableHead>
                    <TableHead className="text-right min-w-[200px]">
                      ملاحظات
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employee.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="text-right font-mono font-semibold">
                        {item.uniqueCode}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {item.itemName}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant={
                            item.itemType === "ثابت" ? "default" : "secondary"
                          }
                        >
                          {item.itemType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {item.sourceWarehouse}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {item.assignedDate}
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">
                        {item.notes || "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
