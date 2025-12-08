"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Zap, PlusCircle, Trash2, Search } from "lucide-react";
import { useImmer } from "use-immer";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// --- MOCK DATA ---
const departments = [
  { id: 1, name: "قسم الشؤون الهندسية" },
  { id: 2, name: "قسم الشؤون الإدارية" },
  { id: 3, name: "قسم المحاسبة" },
  { id: 4, name: "قسم تقنية المعلومات" },
];

const availableItems = [
  { id: 1, name: "كرسي مكتب", code: "FUR-CHR-001", unit: "قطعة", stock: 50 },
  {
    id: 2,
    name: "طاولة اجتماعات",
    code: "FUR-TBL-001",
    unit: "قطعة",
    stock: 10,
  },
  { id: 3, name: "مكتب خشبي", code: "FUR-DSK-001", unit: "قطعة", stock: 35 },
  { id: 4, name: "خزانة ملفات", code: "FUR-CAB-001", unit: "قطعة", stock: 15 },
  { id: 5, name: "ورق طباعة A4", code: "OFF-PAP-001", unit: "حزمة", stock: 200 },
];

type DirectEntryItem = {
  id: number;
  itemId: number | null;
  itemName: string;
  itemCode: string;
  unit: string;
  quantity: number;
  notes?: string;
};

const QuickEntryPage = () => {
  const [department, setDepartment] = useState<string>();
  const [recipientName, setRecipientName] = useState("");
  const [generalNotes, setGeneralNotes] = useState("");
  const [itemsList, updateItemsList] = useImmer<DirectEntryItem[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleAddItem = (item: typeof availableItems[0]) => {
    updateItemsList((draft) => {
      // Check if item already exists
      const existingIndex = draft.findIndex((i) => i.itemId === item.id);
      if (existingIndex !== -1) {
        // Increment quantity if exists
        draft[existingIndex].quantity += 1;
      } else {
        // Add new item
        draft.push({
          id: Date.now(),
          itemId: item.id,
          itemName: item.name,
          itemCode: item.code,
          unit: item.unit,
          quantity: 1,
        });
      }
    });
    setSearchOpen(false);
    setSearchValue("");
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    updateItemsList((draft) => {
      if (draft[index]) {
        draft[index].quantity = quantity;
      }
    });
  };

  const handleNotesChange = (index: number, notes: string) => {
    updateItemsList((draft) => {
      if (draft[index]) {
        draft[index].notes = notes;
      }
    });
  };

  const handleRemoveItem = (index: number) => {
    updateItemsList((draft) => {
      draft.splice(index, 1);
    });
  };

  const filteredItems = availableItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.code.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Zap className="h-8 w-8 text-yellow-600" />
          إدخال سريع
        </h2>
        <p className="text-muted-foreground mt-1">
          إدخال مباشر للمواد إلى الأقسام بدون المرور بالمخزن
        </p>
      </div>

      {/* Quick Entry Form */}
      <Card>
        <CardHeader>
          <CardTitle>تفاصيل الإدخال المباشر</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Header Form */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>اسم القسم</Label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر القسم..." />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((d) => (
                    <SelectItem key={d.id} value={String(d.id)}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>اسم المستلم</Label>
              <Input
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="اسم الموظف المستلم"
              />
            </div>
            <div className="space-y-2">
              <Label>ملاحظات عامة</Label>
              <Textarea
                value={generalNotes}
                onChange={(e) => setGeneralNotes(e.target.value)}
                placeholder="ملاحظات إضافية..."
                rows={1}
              />
            </div>
          </div>

          {/* Quick Item Search */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">إضافة المواد</Label>
            <Popover open={searchOpen} onOpenChange={setSearchOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-muted-foreground"
                >
                  <Search className="ml-2 h-4 w-4" />
                  ابحث عن مادة للإضافة...
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="p-0"
                align="start"
                style={{ width: "var(--radix-popover-trigger-width)" }}
              >
                <Command>
                  <CommandInput
                    placeholder="ابحث بالاسم أو الكود..."
                    value={searchValue}
                    onValueChange={setSearchValue}
                  />
                  <CommandList>
                    <CommandEmpty>لم يتم العثور على مواد</CommandEmpty>
                    <CommandGroup>
                      {filteredItems.map((item) => (
                        <CommandItem
                          key={item.id}
                          onSelect={() => handleAddItem(item)}
                          className="flex items-center justify-between"
                        >
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {item.code} • {item.unit}
                            </div>
                          </div>
                          <Badge variant="secondary" className="mr-2">
                            متوفر: {item.stock}
                          </Badge>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Items Table */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">
              المواد المضافة ({itemsList.length})
            </Label>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الكود</TableHead>
                    <TableHead>اسم المادة</TableHead>
                    <TableHead>الوحدة</TableHead>
                    <TableHead>الكمية</TableHead>
                    <TableHead>ملاحظات</TableHead>
                    <TableHead>إجراء</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itemsList.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center text-muted-foreground h-24"
                      >
                        لا توجد مواد مضافة. ابحث عن مادة لإضافتها
                      </TableCell>
                    </TableRow>
                  ) : (
                    itemsList.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Badge variant="outline" className="font-mono">
                            {item.itemCode}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {item.itemName}
                        </TableCell>
                        <TableCell>{item.unit}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(index, Number(e.target.value))
                            }
                            className="w-24"
                            min="1"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.notes || ""}
                            onChange={(e) =>
                              handleNotesChange(index, e.target.value)
                            }
                            placeholder="ملاحظات..."
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveItem(index)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Summary */}
          {itemsList.length > 0 && (
            <div className="flex justify-end items-center gap-4 p-4 bg-muted rounded-md">
              <span className="text-lg font-bold">إجمالي الأصناف:</span>
              <span className="text-2xl font-bold text-primary">
                {itemsList.length}
              </span>
              <span className="text-muted-foreground">|</span>
              <span className="text-lg font-bold">إجمالي الكميات:</span>
              <span className="text-2xl font-bold text-primary">
                {itemsList.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline">مسح الكل</Button>
          <Button disabled={itemsList.length === 0 || !department}>
            حفظ الإدخال المباشر
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuickEntryPage;
