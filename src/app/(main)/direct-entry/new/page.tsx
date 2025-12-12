"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { WarehouseSelector } from "@/components/warehouse/warehouse-selector";
import { useNotificationStore } from "@/context/notification-store";
import { useWarehouse } from "@/context/warehouse-context";
import { saveDocument, useItems, useSuppliers } from "@/hooks/use-inventory";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { AlertCircle, CalendarIcon, Loader2, PlusCircle, Save, Search, Trash2, Zap } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useImmer } from "use-immer";

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
  price?: number;
  vendorName?: string;
  vendorId?: number;
  invoiceNumber?: string;
  warrantyPeriod?: number;
  warrantyUnit?: "day" | "month" | "year";
  expiryDate?: Date;
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
        price: 0,
        vendorName: "",
        vendorId: undefined,
        invoiceNumber: "",
        warrantyPeriod: 1,
        warrantyUnit: "year",
        expiryDate: undefined,
      });
    });
  };

  const handleItemChange = <K extends keyof DirectEntryItem>(
    index: number,
    field: K,
    value: DirectEntryItem[K]
  ) => {
    updateItemsList((draft) => {
      const item = draft[index];
      if (item) {
        item[field] = value;
        if (field === "itemName") {
          // Try to find if item exists in DB items
          const selectedItem = items.find((i) => i.name === value);
          if (selectedItem) {
            item.unit = selectedItem.unit;
            item.itemId = selectedItem.id;
            item.itemCode = selectedItem.code;
            if (selectedItem.price) {
              item.price = selectedItem.price;
            }
          }
        }
      }
    });
  };

  const handleRemoveItem = (index: number) => {
    updateItemsList((draft) => {
      draft.splice(index, 1);
    });
  };

  const calculateTotal = () => {
    return itemsList
      .reduce((acc, item) => acc + item.quantity * (item.price || 0), 0)
      .toFixed(2);
  };

  const handleSave = async () => {
    try {
      if (!selectedWarehouse) {
        toast.error("الرجاء اختيار المخزن");
        return;
      }
      if (!entryType) {
        toast.error("الرجاء اختيار نوع الإدخال");
        return;
      }
      if (itemsList.length === 0) {
        toast.error("الرجاء إضافة مواد للقائمة");
        return;
      }

      setIsSaving(true);

      // Save Document
      await saveDocument(
        {
          docNumber,
          type: "entry",
          date: date || new Date(),
          warehouseId: selectedWarehouse.id,
          departmentId: department ? Number(department) : undefined,
          divisionId: division ? Number(division) : undefined,
          unitId: unit ? Number(unit) : undefined,
          entryType,
          notes: generalNotes,
          itemCount: itemsList.length,
          totalValue: Number(calculateTotal()),
          status: "approved",
        },
        itemsList
      );

      toast.success("تم حفظ مستند الإدخال بنجاح");

      // Reset Form
      setDocNumber((prev) => String(Number(prev) + 1));
      updateItemsList(() => []);
      setGeneralNotes("");
      setSearchValue("");
    } catch (error) {
      console.error("Error saving document:", error);
      toast.error("حدث خطأ أثناء حفظ المستند");
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
                    <TableHead className="text-right">كود المادة</TableHead>
                    <TableHead className="text-right">اسم المادة</TableHead>
                    <TableHead className="text-right">الوحدة</TableHead>
                    <TableHead className="text-right">الكمية</TableHead>
                    <TableHead className="text-right">سعر المفرد</TableHead>
                    <TableHead className="text-right">اسم المورد</TableHead>
                    <TableHead className="text-right">رقم الفاتورة</TableHead>
                    <TableHead className="text-right">تاريخ الانتهاء</TableHead>
                    <TableHead className="text-right">الضمان</TableHead>
                    <TableHead className="text-right">إجراء</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itemsList.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={10}
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
                        <TableCell className="text-right w-32">
                          <Input
                            value={item.itemCode || ""}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "itemCode",
                                e.target.value
                              )
                            }
                            placeholder="أدخل كود المادة"
                            className="text-right"
                          />
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
                                                draft[index].price =
                                                  itemData.price || 0;
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
                          <Input
                            value={item.unit || ""}
                            onChange={(e) =>
                              handleItemChange(index, "unit", e.target.value)
                            }
                            placeholder="الوحدة"
                            className="w-20 text-right"
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "quantity",
                                Number(e.target.value)
                              )
                            }
                            className="w-24 text-right"
                            min="1"
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <Input
                            type="number"
                            value={item.price}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "price",
                                Number(e.target.value)
                              )
                            }
                            placeholder="السعر"
                            className="w-24 text-right"
                            min="0"
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <Input
                            value={item.vendorName || ""}
                            onChange={(e) =>
                              handleItemChange(index, "vendorName", e.target.value)
                            }
                            placeholder="اسم المورد"
                            className="w-32 text-right"
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <Input
                            value={item.invoiceNumber || ""}
                            onChange={(e) =>
                              handleItemChange(index, "invoiceNumber", e.target.value)
                            }
                            placeholder="رقم الفاتورة"
                            className="w-32 text-right"
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className="w-full justify-start text-right font-normal"
                              >
                                <CalendarIcon className="ml-2 h-4 w-4" />
                                {item.expiryDate ? (
                                  format(item.expiryDate, "PPP", { locale: ar })
                                ) : (
                                  <span>اختر تاريخ الانتهاء</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={item.expiryDate}
                                onSelect={(date) =>
                                  handleItemChange(index, "expiryDate", date)
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2">
                            <Input
                              type="number"
                              value={item.warrantyPeriod || 1}
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "warrantyPeriod",
                                  Number(e.target.value)
                                )
                              }
                              placeholder="المدة"
                              className="w-20 text-right"
                              min="1"
                            />
                            <Select
                              value={item.warrantyUnit || "year"}
                              onValueChange={(value) =>
                                handleItemChange(index, "warrantyUnit", value as "day" | "month" | "year")
                              }
                            >
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="day">يوم</SelectItem>
                                <SelectItem value="month">شهر</SelectItem>
                                <SelectItem value="year">سنة</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
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
                <span className="text-muted-foreground">|</span>
                <span className="text-lg font-bold">الإجمالي:</span>
                <span className="text-2xl font-bold text-primary">
                  {calculateTotal()} د.ع
                </span>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button
              disabled={
                itemsList.length === 0 || !department || !selectedWarehouse || isSaving
              }
              onClick={handleSave}
            >
              {isSaving ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <Save className="ml-2 h-4 w-4" />
                  حفظ الإدخال المباشر
                </>
              )}
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

                <div className="font-bold">{focusedItem.price?.toLocaleString() || '-'} د.ع</div>
              </div>
            </div>

            <div className="space-y-1 border-t pt-2">
              <div className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                <CalendarIconLucide className="h-3 w-3" /> آخر إدخال
              </div>

              <div className="text-sm">{(focusedItem as any).lastEntryDate || '-'}</div>
            </div>


            {(focusedItem as any).specs && (
              <div className="space-y-1 border-t pt-2">
                <div className="text-xs text-muted-foreground mb-1">المواصفات</div>
                <div className="text-sm bg-muted/50 p-2 rounded text-muted-foreground">

                  {(focusedItem as any).specs}
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
