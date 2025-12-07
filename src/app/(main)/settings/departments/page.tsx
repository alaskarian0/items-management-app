"use client";

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Department = {
  id: number;
  name: string;
};

const mockDepartments: Department[] = [
    { id: 1, name: "قسم الشؤون الهندسية" },
    { id: 2, name: "قسم الشؤون الإدارية" },
    { id: 3, name: "قسم المالية" },
    { id: 4, name: "قسم الإعلام" },
    { id: 5, name: "مكتب الأمين العام" },
];

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState<Department | null>(null);
  const [departmentName, setDepartmentName] = useState("");

  const handleAddNew = () => {
    setCurrentDepartment(null);
    setDepartmentName("");
    setIsDialogOpen(true);
  };

  const handleEdit = (department: Department) => {
    setCurrentDepartment(department);
    setDepartmentName(department.name);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setDepartments(departments.filter(dep => dep.id !== id));
  };

  const handleSave = () => {
    if (currentDepartment) {
      // Edit
      setDepartments(departments.map(dep => 
        dep.id === currentDepartment.id ? { ...dep, name: departmentName } : dep
      ));
    } else {
      // Add
      const newId = departments.length > 0 ? Math.max(...departments.map(d => d.id)) + 1 : 1;
      setDepartments([...departments, { id: newId, name: departmentName }]);
    }
    setIsDialogOpen(false);
    setDepartmentName("");
    setCurrentDepartment(null);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>إدارة الأقسام</CardTitle>
        <Button onClick={handleAddNew}>
          <PlusCircle className="ml-2 h-4 w-4" />
          إضافة قسم جديد
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الرقم</TableHead>
              <TableHead>اسم القسم</TableHead>
              <TableHead className="text-left">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departments.map((department) => (
              <TableRow key={department.id}>
                <TableCell>{department.id}</TableCell>
                <TableCell className="font-medium">{department.name}</TableCell>
                <TableCell className="text-left">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">فتح القائمة</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>إجراءات</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleEdit(department)}>
                        <Edit className="ml-2 h-4 w-4" />
                        تعديل
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(department.id)} className="text-red-600">
                        <Trash2 className="ml-2 h-4 w-4" />
                        حذف
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{currentDepartment ? 'تعديل قسم' : 'إضافة قسم جديد'}</DialogTitle>
            <DialogDescription>
              {currentDepartment ? 'قم بتعديل اسم القسم.' : 'أدخل اسم القسم الجديد هنا.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                الاسم
              </Label>
              <Input
                id="name"
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>إلغاء</Button>
            <Button type="submit" onClick={handleSave}>حفظ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default DepartmentsPage;