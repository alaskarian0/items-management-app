"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  PackageCheck,
  Users,
  Search,
  ChevronDown,
  ChevronRight,
  Eye,
  FileText,
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

// Mock data - Employees with their assigned items
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

// Mock divisions data
const DIVISIONS = [
  { id: "div1", name: "شعبة التخطيط" },
  { id: "div2", name: "شعبة المتابعة" },
  { id: "div3", name: "شعبة الحسابات" },
  { id: "div4", name: "شعبة الموارد البشرية" },
];

export default function EmployeeCustodyPage() {
  const router = useRouter();
  const [employees] = useState<EmployeeWithItems[]>(MOCK_EMPLOYEES_WITH_ITEMS);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDivision, setFilterDivision] = useState<string>("all");
  const [expandedEmployees, setExpandedEmployees] = useState<Set<string>>(new Set());

  const toggleEmployeeExpansion = (employeeId: string) => {
    setExpandedEmployees((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(employeeId)) {
        newSet.delete(employeeId);
      } else {
        newSet.add(employeeId);
      }
      return newSet;
    });
  };

  const handleViewDetails = (employee: EmployeeWithItems) => {
    router.push(`/law-enforcement/employee-details?id=${employee.id}`);
  };

  // Filter employees based on search term and division
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.items.some((item) =>
        item.uniqueCode.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesDivision =
      filterDivision === "all" ||
      employee.divisionName === DIVISIONS.find((d) => d.id === filterDivision)?.name;
    return matchesSearch && matchesDivision;
  });

  // Statistics
  const stats = {
    totalEmployees: employees.length,
    employeesWithItems: employees.filter((e) => e.items.length > 0).length,
    totalItems: employees.reduce((sum, e) => sum + e.items.length, 0),
    employeesWithoutItems: employees.filter((e) => e.items.length === 0).length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <FileText className="h-8 w-8" />
          ذمة الموظفين
        </h2>
        <p className="text-muted-foreground mt-1">
          عرض المواد الموزعة على الموظفين والمواد تحت ذمة كل موظف
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الموظفين</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEmployees}</div>
            <p className="text-xs text-muted-foreground">موظف مسجل</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">موظفين لديهم مواد</CardTitle>
            <PackageCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.employeesWithItems}</div>
            <p className="text-xs text-muted-foreground">موظف يحملون مواد</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المواد</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalItems}</div>
            <p className="text-xs text-muted-foreground">مادة موزعة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">بدون مواد</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.employeesWithoutItems}</div>
            <p className="text-xs text-muted-foreground">موظف بدون مواد</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Table */}
      <Card>
        <CardHeader>
          <CardTitle>ذمة الموظفين والمواد</CardTitle>
          <CardDescription>
            عرض تفصيلي لجميع الموظفين والمواد المعينة لهم
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label>البحث</Label>
              <div className="relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="ابحث عن موظف أو كود مادة..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
            <div className="w-[200px]">
              <Label>الشعبة</Label>
              <Select value={filterDivision} onValueChange={setFilterDivision}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الشعب</SelectItem>
                  {DIVISIONS.map((div) => (
                    <SelectItem key={div.id} value={div.id}>
                      {div.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Employees Table with Collapsible Items */}
          <div className="border rounded-md overflow-x-auto">
            <Table dir="rtl">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right w-10"></TableHead>
                  <TableHead className="text-right min-w-[120px]">رقم الموظف</TableHead>
                  <TableHead className="text-right min-w-[200px]">الاسم</TableHead>
                  <TableHead className="text-right min-w-[150px]">المنصب</TableHead>
                  <TableHead className="text-right min-w-[150px]">الشعبة</TableHead>
                  <TableHead className="text-right min-w-[120px]">عدد المواد</TableHead>
                  <TableHead className="text-right min-w-[120px]">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground h-24">
                      لا يوجد موظفين
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmployees.map((employee) => (
                    <Collapsible
                      key={employee.id}
                      open={expandedEmployees.has(employee.id)}
                      onOpenChange={() => toggleEmployeeExpansion(employee.id)}
                      asChild
                    >
                      <>
                        {/* Employee Header Row */}
                        <CollapsibleTrigger asChild>
                          <TableRow className="cursor-pointer hover:bg-muted/50 bg-muted/30">
                            <TableCell className="text-right">
                              {employee.items.length > 0 ? (
                                expandedEmployees.has(employee.id) ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )
                              ) : null}
                            </TableCell>
                            <TableCell className="text-right font-mono">{employee.id}</TableCell>
                            <TableCell className="text-right font-semibold">{employee.name}</TableCell>
                            <TableCell className="text-right">{employee.position}</TableCell>
                            <TableCell className="text-right">
                              <Badge variant="outline">{employee.divisionName}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge
                                variant={employee.items.length > 0 ? "default" : "secondary"}
                              >
                                {employee.items.length} مادة
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewDetails(employee);
                                }}
                              >
                                <Eye className="h-3 w-3 ml-1" />
                                عرض
                              </Button>
                            </TableCell>
                          </TableRow>
                        </CollapsibleTrigger>

                        {/* Employee Items */}
                        {employee.items.length > 0 && (
                          <CollapsibleContent asChild>
                            <>
                              {employee.items.map((item) => (
                                <TableRow key={item.id} className="bg-background">
                                  <TableCell className="text-right"></TableCell>
                                  <TableCell className="text-right font-mono text-sm">
                                    {item.uniqueCode}
                                  </TableCell>
                                  <TableCell className="text-right pr-8 text-muted-foreground">
                                    └ {item.itemName}
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
                                  <TableCell className="text-right text-sm text-muted-foreground">
                                    {item.sourceWarehouse}
                                  </TableCell>
                                  <TableCell className="text-right text-sm text-muted-foreground">
                                    تاريخ التعيين: {item.assignedDate}
                                  </TableCell>
                                  <TableCell className="text-right"></TableCell>
                                </TableRow>
                              ))}
                            </>
                          </CollapsibleContent>
                        )}
                      </>
                    </Collapsible>
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
