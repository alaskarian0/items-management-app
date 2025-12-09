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
import { Zap, Trash2, Search, CalendarIcon, PlusCircle, Info, AlertTriangle, Package, DollarSign, Calendar as CalendarIconLucide } from "lucide-react";
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
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { WarehouseSelector } from "@/components/warehouse/warehouse-selector";
import { useWarehouse } from "@/context/warehouse-context";
import { useItems, useSuppliers, saveDocument } from "@/hooks/use-inventory";
import { useNotificationStore } from "@/context/notification-store";
import { useRouter } from "next/navigation";

// --- MOCK DATA ---
const departments = [
  { id: 1, name: "قسم الشؤون الهندسية" },
  { id: 2, name: "قسم الشؤون الإدارية" },
  { id: 3, name: "قسم المحاسبة" },
  { id: 4, name: "قسم تقنية المعلومات" },
];

const divisions = [
  { id: 1, name: "شعبة الهندسة المدنية" },
  { id: 2, name: "شعبة الهندسة الكهربائية" },
  { id: 3, name: "شعبة الهندسة الميكانيكية" },
  { id: 4, name: "شعبة الشؤون الإدارية" },
];

const units = [
  { id: 1, name: "وحدة التخطيط", divisionId: 1 },
  { id: 2, name: "وحدة التنفيذ", divisionId: 1 },
  { id: 3, name: "وحدة الصيانة الكهربائية", divisionId: 2 },
  { id: 4, name: "وحدة الصيانة الميكانيكية", divisionId: 3 },
  { id: 5, name: "وحدة الشؤون المالية", divisionId: 4 },
  { id: 6, name: "وحدة الموارد البشرية", divisionId: 4 },
];

// Removed mock items


type DirectEntryItem = {
  id: number;
  itemId: number | null;
  itemName: string;
  itemCode: string;
  unit: string;
  quantity: number;
  invoiceNumber?: string;
  notes?: string;
};

const QuickEntryPage = () => {
  const { selectedWarehouse } = useWarehouse();
  const [department, setDepartment] = useState<string>();
  const [division, setDivision] = useState<string>();
  const [unit, setUnit] = useState<string>();
  const [entryType, setEntryType] = useState<string>("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [docNumber, setDocNumber] = useState("1101");
  const [recipientName, setRecipientName] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [supplierSearchOpen, setSupplierSearchOpen] = useState(false);
  const [supplierSearchValue, setSupplierSearchValue] = useState("");
  const [generalNotes, setGeneralNotes] = useState("");
  const [itemsList, updateItemsList] = useImmer<DirectEntryItem[]>([]);
  const [searchOpen, setSearchOpen] = useState<number | false>(false);
  const [searchValue, setSearchValue] = useState("");
  const [focusedItemIndex, setFocusedItemIndex] = useState<number | null>(null);

  const items = useItems() || [];
  const suppliersList = useSuppliers() || [];
  const { addNotification } = useNotificationStore();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  // Get currently focused item details
  const focusedItem = focusedItemIndex !== null && itemsList[focusedItemIndex]?.itemId
    ? items.find(i => i.id === itemsList[focusedItemIndex].itemId)
    : null;

  // Mock suppliers data for autocomplete
  const [suppliers] = useState([
    { id: 1, name: "شركة النبلاء" },
    { id: 2, name: "موردون متحدون" },
    { id: 3, name: "شركة العراق للتجارة" },
    { id: 4, name: "الموارد الحديثة" },
    { id: 5, name: "شركة بغداد للمستلزمات" },
  ]);

  const handleAddItem = () => {
    updateItemsList((draft) => {
      draft.push({
        id: Date.now(),
        itemId: null,
        itemCode: "",
        itemName: "",
        unit: "",
        quantity: 1,
      });
    });
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    updateItemsList((draft) => {
      if (draft[index]) {
        draft[index].quantity = quantity;
      }
    });
  };

  const handleInvoiceNumberChange = (index: number, invoiceNumber: string) => {
    updateItemsList((draft) => {
      if (draft[index]) {
        draft[index].invoiceNumber = invoiceNumber;
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

  const handleSave = async () => {
    if (!selectedWarehouse || itemsList.length === 0 || !date) return;

    try {
      setIsSaving(true);
      await saveDocument({
        docNumber,
        type: 'entry',
        entryType: entryType || 'purchases',
        date: date,
        warehouseId: selectedWarehouse.id,
        departmentId: department ? Number(department) : undefined,
        divisionId: division ? Number(division) : undefined,
        unitId: unit ? Number(unit) : undefined,
        recipientName,
        itemCount: itemsList.length,
        status: 'approved',
        notes: generalNotes,
      }, itemsList.map(i => ({ ...i, vendorName: supplierName })));

      addNotification("تم الحفظ بنجاح", `تم إنشاء مستند الإدخال رقم ${docNumber}`, "success");

      // Reset Form
      updateItemsList([]);
      setDocNumber((prev) => String(Number(prev) + 1));
      setRecipientName("");

    } catch (error) {
      console.error(error);
      addNotification("خطأ في الحفظ", "حدث خطأ أثناء حفظ المستند", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredItems = (items || []).filter(
    (item) =>
      item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.code.toLowerCase().includes(searchValue.toLowerCase())
  );

  const filteredSuppliers = (suppliersList || []).filter((supplier) =>
    supplier.name.toLowerCase().includes(supplierSearchValue.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Zap className="h-8 w-8 text-yellow-600" />
          الإدخال المباشر
        </h2>
        <p className="text-muted-foreground mt-1">
          إدخال مواد مباشرة إلى الأقسام بدون المرور بالمخزن
        </p>
      </div>
      {/* Warehouse Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">اختيار المخزن</CardTitle>
        </CardHeader>
        <CardContent>
          {!selectedWarehouse ? (
            <div className="space-y-4">
              <div className="text-center text-muted-foreground">
                الرجاء اختيار المخزن للمتابعة في عملية الإدخال
              </div>
              <WarehouseSelector />
            </div>
          ) : (
            <div className="space-y-4">
              <WarehouseSelector />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Document Details Section */}
      {selectedWarehouse && (
        <Card>
          <CardHeader>
            <CardTitle>رأس القائمة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Header Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>القسم</Label>
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
                <Label>الشعبة أو الوحدة</Label>
                <Select
                  value={division}
                  onValueChange={(value) => {
                    setDivision(value);
                    setUnit(""); // Reset unit when division changes
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الشعبة..." />
                  </SelectTrigger>
                  <SelectContent>
                    {divisions.map((d) => (
                      <SelectItem key={d.id} value={String(d.id)}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>الوحدة</Label>
                <Select
                  value={unit}
                  onValueChange={setUnit}
                  disabled={!division}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الوحدة..." />
                  </SelectTrigger>
                  <SelectContent>
                    {units
                      .filter((u) => u.divisionId === Number(division))
                      .map((u) => (
                        <SelectItem key={u.id} value={String(u.id)}>
                          {u.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>نوع الإدخال</Label>
                <Select value={entryType} onValueChange={setEntryType}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع الإدخال..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gifts">هدايا وندور</SelectItem>
                    <SelectItem value="purchases">مشتريات</SelectItem>
                    <SelectItem value="returned">مرتجع</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>رقم المستند</Label>
                <Input
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                  placeholder="رقم المستند"
                />
              </div>
              <div className="space-y-2">
                <Label>التاريخ</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full justify-start text-right font-normal"
                    >
                      <CalendarIcon className="ml-2 h-4 w-4" />
                      {date ? (
                        format(date, "PPP", { locale: ar })
                      ) : (
                        <span>اختر تاريخ</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>اسم المستلم</Label>
                <Input
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="اسم المستلم"
                />
              </div>
              <div className="space-y-2">
                <Label>اسم المورد</Label>
                <Popover
                  open={supplierSearchOpen}
                  onOpenChange={setSupplierSearchOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-right"
                    >
                      {supplierName || "ابحث عن اسم المورد..."}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="p-0"
                    align="start"
                    style={{ width: "var(--radix-popover-trigger-width)" }}
                  >
                    <Command>
                      <CommandInput
                        placeholder="ابحث عن مورد..."
                        value={supplierSearchValue}
                        onValueChange={setSupplierSearchValue}
                      />
                      <CommandList>
                        <CommandEmpty>لم يتم العثور على مورد</CommandEmpty>
                        <CommandGroup>
                          {filteredSuppliers.map((supplier) => (
                            <CommandItem
                              key={supplier.id}
                              onSelect={() => {
                                setSupplierName(supplier.name);
                                setSupplierSearchOpen(false);
                              }}
                            >
                              {supplier.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Materials Entry Section */}
      {selectedWarehouse && (
        <Card>
          <CardHeader>
            <CardTitle>إدخال المواد</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Items Table */}
            <div className="border rounded-md">
              <Table dir="rtl">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-2/5 text-right">
                      كود المادة
                    </TableHead>
                    <TableHead className="text-right">اسم المادة</TableHead>
                    <TableHead className="text-right">الوحدة</TableHead>
                    <TableHead className="text-right">الكمية</TableHead>
                    <TableHead className="text-right">رقم الفاتورة</TableHead>
                    <TableHead className="text-right">ملاحظات</TableHead>
                    <TableHead className="text-right">إجراء</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itemsList.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center text-muted-foreground h-24"
                      >
                        لا توجد مواد مضافة. انقر على &quot;إضافة سطر&quot; للبدء
                      </TableCell>
                    </TableRow>
                  ) : (
                    itemsList.map((item, index) => (
                      <TableRow
                        key={item.id}
                        className={focusedItemIndex === index ? "bg-muted/50" : ""}
                        onClick={() => setFocusedItemIndex(index)}
                      >
                        <TableCell className="text-right">
                          {item.itemId ? (
                            <div className="font-mono text-sm font-medium">
                              {item.itemCode}
                            </div>
                          ) : (
                            <Input
                              value={item.itemCode || ""}
                              onChange={(e) =>
                                updateItemsList((draft) => {
                                  draft[index].itemCode = e.target.value;
                                })
                              }
                              placeholder="أدخل كود المادة"
                              className="text-right"
                            />
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.itemId ? (
                            <div className="font-medium">{item.itemName}</div>
                          ) : (
                            <div className="space-y-2">
                              <Popover
                                open={searchOpen === index}
                                onOpenChange={(open) =>
                                  setSearchOpen(open ? index : false)
                                }
                              >
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className="w-full justify-start text-right text-muted-foreground"
                                  >
                                    <Search className="ml-2 h-4 w-4" />
                                    {item.itemName ||
                                      "ابحث أو أضف مادة جديدة..."}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="p-0"
                                  align="start"
                                  style={{
                                    width: "var(--radix-popover-trigger-width)",
                                  }}
                                >
                                  <Command>
                                    <CommandInput
                                      placeholder="ابحث بالاسم أو الكود..."
                                      value={searchValue}
                                      onValueChange={setSearchValue}
                                    />
                                    <CommandList>
                                      <CommandEmpty>
                                        <div className="p-2">
                                          <p className="text-sm text-muted-foreground mb-2">
                                            لم يتم العثور على مواد
                                          </p>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                              // Create new material with search value
                                              const newCode = searchValue
                                                .toUpperCase()
                                                .replace(/\s/g, "-");
                                              updateItemsList((draft) => {
                                                draft[index].itemName =
                                                  searchValue;
                                                draft[index].itemCode = newCode;
                                                draft[index].unit = "قطعة";
                                              });
                                              setSearchOpen(false);
                                              setSearchValue("");
                                            }}
                                          >
                                            <PlusCircle className="ml-2 h-4 w-4" />
                                            إضافة &quot;{searchValue}&quot; كمادة جديدة
                                          </Button>
                                        </div>
                                      </CommandEmpty>
                                      <CommandGroup>
                                        {filteredItems.map((itemData) => (
                                          <CommandItem
                                            key={itemData.id}
                                            onSelect={() => {
                                              updateItemsList((draft) => {
                                                draft[index].itemId =
                                                  itemData.id;
                                                draft[index].itemName =
                                                  itemData.name;
                                                draft[index].itemCode =
                                                  itemData.code;
                                                draft[index].unit =
                                                  itemData.unit;
                                              });
                                              setSearchOpen(false);
                                              setSearchValue("");
                                            }}
                                            className="flex items-center justify-between"
                                          >
                                            <div>
                                              <div className="font-medium">
                                                {itemData.name}
                                              </div>
                                              <div className="text-xs text-muted-foreground">
                                                {itemData.code} •{" "}
                                                {itemData.unit}
                                              </div>
                                            </div>
                                            <div className="text-xs text-muted-foreground ml-4">
                                              المتوفر: {itemData.stock}
                                            </div>
                                          </CommandItem>
                                        ))}
                                      </CommandGroup>
                                    </CommandList>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.itemId ? (
                            <span className="font-mono text-sm">
                              {item.unit}
                            </span>
                          ) : (
                            <Input
                              value={item.unit || ""}
                              onChange={(e) =>
                                updateItemsList((draft) => {
                                  draft[index].unit = e.target.value;
                                })
                              }
                              placeholder="الوحدة"
                              className="w-20 text-right"
                            />
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(
                                index,
                                Number(e.target.value)
                              )
                            }
                            className="w-24 text-right"
                            min="0"
                            step="0.01"
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <Input
                            value={item.invoiceNumber || ""}
                            onChange={(e) =>
                              handleInvoiceNumberChange(index, e.target.value)
                            }
                            placeholder="رقم الفاتورة..."
                            className="w-32 text-right"
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <Input
                            value={item.notes || ""}
                            onChange={(e) =>
                              handleNotesChange(index, e.target.value)
                            }
                            placeholder="ملاحظات..."
                            className="w-32 text-right"
                          />
                        </TableCell>
                        <TableCell className="text-right">
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
              <div className="p-2 flex justify-start">
                <Button variant="outline" size="sm" onClick={handleAddItem}>
                  <PlusCircle className="ml-2 h-4 w-4" /> إضافة سطر
                </Button>
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
            <Button variant="outline">مستند جديد</Button>
            <Button
              disabled={
                itemsList.length === 0 || !department || !selectedWarehouse || isSaving
              }
              onClick={handleSave}
            >
              {isSaving ? "جاري الحفظ..." : "حفظ الإدخال المباشر"}
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Material Info Panel (Floating/Fixed) */}
      {focusedItem && (
        <Card className="fixed left-6 top-24 w-80 shadow-lg border-l-4 border-l-primary hidden xl:block animate-in slide-in-from-right-4">
          <CardHeader className="pb-2 bg-muted/30">
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              معلومات المادة
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">اسم المادة</div>
              <div className="font-bold">{focusedItem.name}</div>
              <div className="text-xs font-mono bg-muted px-2 py-1 rounded w-fit mt-1">
                {focusedItem.code}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Package className="h-3 w-3" /> الرصيد الحالي
                </div>
                <div className="font-bold text-lg">{focusedItem.stock} {focusedItem.unit}</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <DollarSign className="h-3 w-3" /> آخر سعر
                </div>
                {/* @ts-ignore - mock data extension */}
                <div className="font-bold">{focusedItem.price?.toLocaleString() || '-'} د.ع</div>
              </div>
            </div>

            <div className="space-y-1 border-t pt-2">
              <div className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                <CalendarIconLucide className="h-3 w-3" /> آخر إدخال
              </div>
              {/* @ts-ignore - mock data extension */}
              <div className="text-sm">{focusedItem.lastEntryDate || '-'}</div>
            </div>

            {/* @ts-ignore - mock data extension */}
            {focusedItem.specs && (
              <div className="space-y-1 border-t pt-2">
                <div className="text-xs text-muted-foreground mb-1">المواصفات</div>
                <div className="text-sm bg-muted/50 p-2 rounded text-muted-foreground">
                  {/* @ts-ignore */}
                  {focusedItem.specs}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuickEntryPage;
