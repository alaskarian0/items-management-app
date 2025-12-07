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

type Supplier = {
  id: number;
  name: string;
};

const mockSuppliers: Supplier[] = [
    { id: 1, name: "شركة النبلاء للتجارة العامة" },
    { id: 2, name: "مجموعة موارد الشرق" },
    { id: 3, name: "تجهيزات بغداد الحديثة" },
    { id: 4, name: "شركة التوزيع الموثوق" },
];

const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState<Supplier | null>(null);
  const [supplierName, setSupplierName] = useState("");

  const handleAddNew = () => {
    setCurrentSupplier(null);
    setSupplierName("");
    setIsDialogOpen(true);
  };

  const handleEdit = (supplier: Supplier) => {
    setCurrentSupplier(supplier);
    setSupplierName(supplier.name);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setSuppliers(suppliers.filter(sup => sup.id !== id));
  };

  const handleSave = () => {
    if (currentSupplier) {
      // Edit
      setSuppliers(suppliers.map(sup => 
        sup.id === currentSupplier.id ? { ...sup, name: supplierName } : sup
      ));
    } else {
      // Add
      const newId = suppliers.length > 0 ? Math.max(...suppliers.map(d => d.id)) + 1 : 1;
      setSuppliers([...suppliers, { id: newId, name: supplierName }]);
    }
    setIsDialogOpen(false);
    setSupplierName("");
    setCurrentSupplier(null);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>إدارة الموردين</CardTitle>
        <Button onClick={handleAddNew}>
          <PlusCircle className="ml-2 h-4 w-4" />
          إضافة مورد جديد
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الرقم</TableHead>
              <TableHead>اسم المورد</TableHead>
              <TableHead className="text-left">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell>{supplier.id}</TableCell>
                <TableCell className="font-medium">{supplier.name}</TableCell>
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
                      <DropdownMenuItem onClick={() => handleEdit(supplier)}>
                        <Edit className="ml-2 h-4 w-4" />
                        تعديل
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(supplier.id)} className="text-red-600">
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
            <DialogTitle>{currentSupplier ? 'تعديل مورد' : 'إضافة مورد جديد'}</DialogTitle>
            <DialogDescription>
              {currentSupplier ? 'قم بتعديل اسم المورد.' : 'أدخل اسم المورد الجديد هنا.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                الاسم
              </Label>
              <Input
                id="name"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
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

export default SuppliersPage;