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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useWarehouse } from "@/context/warehouse-context";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import {
  AlertCircle,
  CalendarIcon,
  Eye,
  PackageMinus,
  PlusCircle,
  Search,
  Trash2,
} from "lucide-react";
import { useState, useMemo } from "react";
import { useImmer } from "use-immer";
import { toast } from "sonner";

// Import shared data and types
import { useNotificationStore } from "@/context/notification-store";
import { useItemMasters } from "@/hooks/use-item-masters";
import { useItemInstances } from "@/hooks/use-item-instances";
import { useEntryDocuments } from "@/hooks/use-entry-documents";
import { useDepartments } from "@/hooks/use-departments";
import { useDivisions } from "@/hooks/use-divisions";
import { useUnits } from "@/hooks/use-units";
import { useVendors } from "@/hooks/use-vendors";
import { DocumentItem } from "@/lib/types/warehouse";

const ItemIssuancePage = () => {
  const { selectedWarehouse } = useWarehouse();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [docNumber, setDocNumber] = useState("2305");
  const [refDocNumber, setRefDocNumber] = useState("");
  const [division, setDivision] = useState<string>();
  const [unit, setUnit] = useState<string>();
  const [department, setDepartment] = useState<string>();
  const [recipientName, setRecipientName] = useState("");
  const [generalNotes, setGeneralNotes] = useState("");
  const [itemsList, updateItemsList] = useImmer<DocumentItem[]>([]);
  const [searchOpen, setSearchOpen] = useState<number | false>(false);
  const [searchValue, setSearchValue] = useState("");
  const [viewItemIndex, setViewItemIndex] = useState<number | null>(null);

  const { data: itemMastersData, loading: loadingItems } = useItemMasters();
  const { data: itemInstancesData, getStatistics } = useItemInstances(
    selectedWarehouse?.id
      ? { warehouseId: selectedWarehouse.id, status: 'available' }
      : undefined
  );
  const { createEntryDocument } = useEntryDocuments();
  const items = itemMastersData?.data || [];
  const { addNotification } = useNotificationStore();
  const [isSaving, setIsSaving] = useState(false);

  // API hooks for dropdowns
  const { departments: departmentsData } = useDepartments();
  const { divisions: divisionsData } = useDivisions();
  const { units: unitsData } = useUnits();
  const { vendors: vendorsData } = useVendors();

  // Extract data from API responses
  const departments = useMemo(() => {
    const data = departmentsData?.data;
    return Array.isArray(data) ? data : [];
  }, [departmentsData]);

  const divisions = useMemo(() => {
    const data = divisionsData?.data;
    return Array.isArray(data) ? data : [];
  }, [divisionsData]);

  const units = useMemo(() => {
    const data = unitsData?.data;
    return Array.isArray(data) ? data : [];
  }, [unitsData]);

  const suppliers = useMemo(() => {
    const data = vendorsData?.data;
    if (Array.isArray(data)) {
      return data.map((v: any) => ({
        id: v.id,
        name: v.name,
        code: v.code || '',
      }));
    }
    return [];
  }, [vendorsData]);

  // Helper to get stock for a specific item (can be optimized)
  // For now, we rely on the item selection to populate initial stock, 
  // but real applications might want a bulk stock query.

  const handleAddItem = () => {
    updateItemsList((draft) => {
      draft.push({
        id: Date.now(),
        itemId: null,
        itemCode: "",
        itemName: "",
        unit: "",
        quantity: 1,
        stock: 0,
        vendorName: "",
        vendorId: undefined,
      });
    });
  };

  const handleItemChange = <K extends keyof DocumentItem>(
    index: number,
    field: K,
    value: DocumentItem[K]
  ) => {
    updateItemsList((draft) => {
      const item = draft[index];
      if (item) {
        // Check for duplicate item codes when manually entering code
        if (field === "itemCode" && value) {
          const duplicateIndex = draft.findIndex(
            (i, idx) => idx !== index && i.itemCode === value
          );
          if (duplicateIndex !== -1) {
            toast.error(`هذا الكود موجود بالفعل في السطر ${duplicateIndex + 1}`);
            return;
          }
        }

        item[field] = value;
        if (field === "itemName") {
          const selectedItem = items.find((i) => i.name === value);
          if (selectedItem && selectedWarehouse) {
            item.unit = selectedItem.unit;
            item.itemId = selectedItem.id;
            item.itemCode = selectedItem.code;

            // Fetch real stock from API (count available instances)
            getStatistics(selectedItem.id, selectedWarehouse.id).then(stats => {
              updateItemsList((draft) => {
                const currentItem = draft[index];
                if (currentItem && currentItem.itemId === selectedItem.id) {
                  currentItem.stock = stats?.availableCount || 0;
                }
              });
            });
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

  const handleSave = async () => {
    if (!selectedWarehouse || itemsList.length === 0 || !date) return;

    // Validate stock availability
    const hasInsufficientStock = itemsList.some(
      (item) => item.quantity > (item.stock ?? 0)
    );
    if (hasInsufficientStock) {
      toast.error("بعض المواد لديها كمية مطلوبة أكبر من الرصيد المتوفر");
      return;
    }

    try {
      setIsSaving(true);

      // 1. Create Issuance Document
      const documentData = {
        documentNumber: docNumber,
        date: date,
        warehouseId: selectedWarehouse.id,
        departmentId: department ? Number(department) : undefined,
        divisionId: division ? Number(division) : undefined,
        unitId: unit ? Number(unit) : undefined,
        documentType: 2, // 2 = Issuance Document
        entryMethod: 1, // 1 = direct
        entryType: 1, // Default entry type
        recipientName: recipientName || '',
        notes: generalNotes || undefined,
      };

      const createdDocument = await createEntryDocument(documentData);

      if (!createdDocument) {
        throw new Error("Failed to create issuance document");
      }

      // 2. For each item, we need to mark instances as issued
      // Note: This is a simplified implementation
      // In a real scenario, you'd need to fetch specific instances and update them
      // For now, we'll just create a notification that items have been issued
      // The actual instance status updates would need to be implemented based on
      // your backend API's specific requirements for batch status updates

      addNotification("تم الحفظ بنجاح", `تم إنشاء مستند الصرف رقم ${docNumber}`, "success");
      toast.success("تم حفظ مستند الإصدار بنجاح");

      // Reset Form
      updateItemsList([]);
      setDocNumber((prev) => String(Number(prev) + 1));
      setRecipientName("");
      setGeneralNotes("");
      setRefDocNumber("");

    } catch (error) {
      console.error(error);
      addNotification("خطأ في الحفظ", "حدث خطأ أثناء حفظ المستند", "error");
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <PackageMinus className="h-8 w-8" />
          إصدار المواد
        </h2>
        <p className="text-muted-foreground mt-1">
          إنشاء مستند إصدار مواد من المخزن إلى الأقسام
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
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  الرجاء اختيار المخزن للمتابعة في عملية الإصدار
                </AlertDescription>
              </Alert>
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
            <CardTitle>تفاصيل مستند الإصدار</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* --- HEADER FORM --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>القسم</Label>
                <Select onValueChange={setDepartment}>
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
                <Label>الشعبة</Label>
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
                <Label>اسم المستلم</Label>
                <Input
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="أدخل اسم المستلم..."
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
                <Label>رقم المستند</Label>
                <Input
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>رقم الطلب</Label>
                <Input
                  value={refDocNumber}
                  onChange={(e) => setRefDocNumber(e.target.value)}
                  placeholder="رقم الطلب..."
                />
              </div>
              <div className="space-y-2 col-span-1 md:col-span-2 lg:col-span-4">
                <Label>البيان أو الملاحظات العامة</Label>
                <Textarea
                  value={generalNotes}
                  onChange={(e) => setGeneralNotes(e.target.value)}
                  placeholder="اكتب ملاحظاتك هنا..."
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Items Section */}
      {selectedWarehouse && (
        <Card>
          <CardHeader>
            <CardTitle>المواد المطلوب إصدارها</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* --- ITEMS TABLE --- */}
            <div className="border rounded-md">
              <Table dir="rtl">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">كود المادة</TableHead>
                    <TableHead className="text-right">اسم المادة</TableHead>
                    <TableHead className="text-right">الوحدة</TableHead>
                    <TableHead className="text-right">الرصيد المتوفر</TableHead>
                    <TableHead className="text-right">
                      الكمية المطلوبة
                    </TableHead>
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
                      <TableRow key={item.id}>
                        <TableCell className="text-right w-32">
                          {item.itemId ? (
                            <div className="font-mono text-sm font-medium">
                              {item.itemCode}
                            </div>
                          ) : (
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

                                              // Check for duplicates before adding
                                              const duplicateIndex = itemsList.findIndex(
                                                (i, idx) => idx !== index && i.itemCode === newCode
                                              );
                                              if (duplicateIndex !== -1) {
                                                toast.error(`هذا الكود موجود بالفعل في السطر ${duplicateIndex + 1}`);
                                                setSearchOpen(false);
                                                setSearchValue("");
                                                return;
                                              }

                                              updateItemsList((draft) => {
                                                draft[index].itemName =
                                                  searchValue;
                                                draft[index].itemCode = newCode;
                                                draft[index].unit = "قطعة";
                                                draft[index].stock = 0;
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
                                              // Check for duplicates before adding
                                              const duplicateIndex = itemsList.findIndex(
                                                (i, idx) => idx !== index && i.itemCode === itemData.code
                                              );
                                              if (duplicateIndex !== -1) {
                                                toast.error(`هذا الكود موجود بالفعل في السطر ${duplicateIndex + 1}`);
                                                setSearchOpen(false);
                                                setSearchValue("");
                                                return;
                                              }

                                              updateItemsList((draft) => {
                                                draft[index].itemId =
                                                  itemData.id;
                                                draft[index].itemName =
                                                  itemData.name;
                                                draft[index].itemCode =
                                                  itemData.code;
                                                draft[index].unit =
                                                  itemData.unit;
                                                draft[index].stock =
                                                  itemData.stock;
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
                                              الرصيد: {itemData.stock}
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
                                handleItemChange(index, "unit", e.target.value)
                              }
                              placeholder="الوحدة"
                              className="w-20 text-right"
                            />
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={`font-medium ${item.quantity > (item.stock ?? 0)
                              ? "text-red-500"
                              : item.itemId && (item.stock ?? 0) > 0
                                ? "text-green-600"
                                : "text-muted-foreground"
                              }`}
                          >
                            {item.stock ?? 0}
                          </span>
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
                            value={item.notes || ""}
                            onChange={(e) =>
                              handleItemChange(index, "notes", e.target.value)
                            }
                            placeholder="ملاحظات..."
                            className="text-right"
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-1 justify-end">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setViewItemIndex(index)}
                              title="عرض التفاصيل"
                            >
                              <Eye className="h-4 w-4 text-blue-500" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveItem(index)}
                              title="حذف"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
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

            {/* --- FOOTER --- */}
            <div className="flex justify-end items-center gap-4 p-4 bg-muted rounded-md">
              <span className="text-lg font-bold">عدد المواد:</span>
              <span className="text-2xl font-bold text-primary">
                {itemsList.length}
              </span>
              <span className="font-semibold">مادة</span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline">مستند جديد</Button>
            <Button
              onClick={handleSave}
              disabled={itemsList.some(item => item.quantity > (item.stock ?? 0)) || isSaving}
              title={itemsList.some(item => item.quantity > (item.stock ?? 0)) ? "لا يمكن الحفظ: الكمية المطلوبة أكبر من الرصيد" : ""}
            >
              {isSaving ? "جاري الحفظ..." : "حفظ المستند"}
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Item Details Dialog */}
      <Dialog open={viewItemIndex !== null} onOpenChange={(open) => !open && setViewItemIndex(null)}>
        <DialogContent className="max-w-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle>تفاصيل المادة</DialogTitle>
            <DialogDescription>
              عرض المعلومات الكاملة للمادة المحددة
            </DialogDescription>
          </DialogHeader>
          {viewItemIndex !== null && itemsList[viewItemIndex] && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">كود المادة</Label>
                  <div className="font-mono font-semibold text-lg">
                    {itemsList[viewItemIndex].itemCode || "غير محدد"}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">اسم المادة</Label>
                  <div className="font-semibold text-lg">
                    {itemsList[viewItemIndex].itemName || "غير محدد"}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">الوحدة</Label>
                  <div className="font-medium">
                    {itemsList[viewItemIndex].unit || "غير محدد"}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">الكمية المطلوبة</Label>
                  <div className="font-medium text-primary">
                    {itemsList[viewItemIndex].quantity}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">الرصيد المتوفر</Label>
                  <div className={`font-medium ${
                    itemsList[viewItemIndex].quantity > (itemsList[viewItemIndex].stock ?? 0)
                      ? "text-red-500"
                      : "text-green-600"
                  }`}>
                    {itemsList[viewItemIndex].stock ?? 0}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {selectedWarehouse && (
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">المخزن</Label>
                    <div className="font-medium">
                      {selectedWarehouse.name} ({selectedWarehouse.code})
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-muted-foreground">اسم المستلم</Label>
                  <div className="font-medium">
                    {recipientName || "غير محدد"}
                  </div>
                </div>
              </div>

              {itemsList[viewItemIndex].vendorName && (
                <div className="space-y-2">
                  <Label className="text-muted-foreground">المورد</Label>
                  <div className="font-medium">
                    {itemsList[viewItemIndex].vendorName}
                  </div>
                </div>
              )}

              {itemsList[viewItemIndex].invoiceNumber && (
                <div className="space-y-2">
                  <Label className="text-muted-foreground">رقم الفاتورة</Label>
                  <div className="font-medium">
                    {itemsList[viewItemIndex].invoiceNumber}
                  </div>
                </div>
              )}

              {itemsList[viewItemIndex].expiryDate && (
                <div className="space-y-2">
                  <Label className="text-muted-foreground">تاريخ الانتهاء</Label>
                  <div className="font-medium">
                    {format(new Date(itemsList[viewItemIndex].expiryDate!), "PPP", { locale: ar })}
                  </div>
                </div>
              )}

              {itemsList[viewItemIndex].warranty && (
                <div className="space-y-2">
                  <Label className="text-muted-foreground">الضمان</Label>
                  <div className="font-medium">
                    {itemsList[viewItemIndex].warranty}
                    {itemsList[viewItemIndex].warrantyPeriod && itemsList[viewItemIndex].warrantyUnit && (
                      <span className="text-muted-foreground mr-2">
                        ({itemsList[viewItemIndex].warrantyPeriod} {
                          itemsList[viewItemIndex].warrantyUnit === "day" ? "يوم" :
                          itemsList[viewItemIndex].warrantyUnit === "month" ? "شهر" :
                          itemsList[viewItemIndex].warrantyUnit === "year" ? "سنة" : ""
                        })
                      </span>
                    )}
                  </div>
                </div>
              )}

              {itemsList[viewItemIndex].notes && (
                <div className="space-y-2">
                  <Label className="text-muted-foreground">الملاحظات</Label>
                  <div className="font-medium p-3 bg-muted rounded-md">
                    {itemsList[viewItemIndex].notes}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t">
                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div>
                    <span className="font-medium">تاريخ الإضافة:</span>{" "}
                    {format(new Date(), "PPP", { locale: ar })}
                  </div>
                  {department && (
                    <div>
                      <span className="font-medium">القسم:</span>{" "}
                      {departments.find(d => d.id === Number(department))?.name || "غير محدد"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ItemIssuancePage;
