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

type Unit = {
  id: number;
  name: string;
};

const mockUnits: Unit[] = [
    { id: 1, name: "قطعة" },
    { id: 2, name: "كيلوغرام" },
    { id: 3, name: "غرام" },
    { id: 4, name: "متر" },
    { id: 5, name: "لتر" },
    { id: 6, name: "كرتون" },
];

const UnitsPage = () => {
  const [units, setUnits] = useState<Unit[]>(mockUnits);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentUnit, setCurrentUnit] = useState<Unit | null>(null);
  const [unitName, setUnitName] = useState("");

  const handleAddNew = () => {
    setCurrentUnit(null);
    setUnitName("");
    setIsDialogOpen(true);
  };

  const handleEdit = (unit: Unit) => {
    setCurrentUnit(unit);
    setUnitName(unit.name);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setUnits(units.filter(u => u.id !== id));
  };

  const handleSave = () => {
    if (currentUnit) {
      // Edit
      setUnits(units.map(u => 
        u.id === currentUnit.id ? { ...u, name: unitName } : u
      ));
    } else {
      // Add
      const newId = units.length > 0 ? Math.max(...units.map(d => d.id)) + 1 : 1;
      setUnits([...units, { id: newId, name: unitName }]);
    }
    setIsDialogOpen(false);
    setUnitName("");
    setCurrentUnit(null);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>إدارة وحدات القياس</CardTitle>
        <Button onClick={handleAddNew}>
          <PlusCircle className="ml-2 h-4 w-4" />
          إضافة وحدة جديدة
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الرقم</TableHead>
              <TableHead>اسم الوحدة</TableHead>
              <TableHead className="text-left">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {units.map((unit) => (
              <TableRow key={unit.id}>
                <TableCell>{unit.id}</TableCell>
                <TableCell className="font-medium">{unit.name}</TableCell>
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
                      <DropdownMenuItem onClick={() => handleEdit(unit)}>
                        <Edit className="ml-2 h-4 w-4" />
                        تعديل
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(unit.id)} className="text-red-600">
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
            <DialogTitle>{currentUnit ? 'تعديل وحدة' : 'إضافة وحدة جديدة'}</DialogTitle>
            <DialogDescription>
              {currentUnit ? 'قم بتعديل اسم الوحدة.' : 'أدخل اسم الوحدة الجديد هنا.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                الاسم
              </Label>
              <Input
                id="name"
                value={unitName}
                onChange={(e) => setUnitName(e.target.value)}
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

export default UnitsPage;