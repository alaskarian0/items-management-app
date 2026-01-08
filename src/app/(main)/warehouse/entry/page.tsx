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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { WarehouseSelector } from "@/components/warehouse/warehouse-selector";
import { useWarehouse } from "@/context/warehouse-context";
import { useItemMasters } from "@/hooks/use-item-masters";
import { useItemInstances } from "@/hooks/use-item-instances";
import { useEntryDocuments } from "@/hooks/use-entry-documents";
import { useDepartments } from "@/hooks/use-departments";
import { useDivisions } from "@/hooks/use-divisions";
import { useUnits } from "@/hooks/use-units";
import { useVendors } from "@/hooks/use-vendors";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import {
  AlertCircle,
  CalendarIcon,
  Loader2,
  PackagePlus,
  PlusCircle,
  Save,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { useImmer } from "use-immer";

// Import shared data and types
import {
  departments,
  divisions,
  entryTypes,
  suppliers,
  units,
  type DocumentItem
} from "@/lib/data/warehouse-data";
import { type Item } from "@/lib/types/warehouse";

// Entry types constant
const entryTypes = [
  { value: "purchases", label: "مشتريات" },
  { value: "gifts", label: "هدايا" },
  { value: "returns", label: "مرتجعات" },
];

const ItemEntryPage = () => {
  const { selectedWarehouse } = useWarehouse();
  const allItems = useItems() || []; // Load items from DB
  const [entryMode, setEntryMode] = useState<"indirect" | "direct">("indirect");
  const [entryType, setEntryType] = useState<string>();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [docNumber, setDocNumber] = useState("1101");
  const [department, setDepartment] = useState<string>();
  const [division, setDivision] = useState<string>();
  const [unit, setUnit] = useState<string>();
  const [supplier, setSupplier] = useState<string>();
  const [recipientName, setRecipientName] = useState("");
  const [notes, setNotes] = useState("");
  const [itemsList, updateItemsList] = useImmer<DocumentItem[]>([]);
  const [searchOpen, setSearchOpen] = useState<number | false>(false);
  const [searchValue, setSearchValue] = useState("");
  const [vendorSearchOpen, setVendorSearchOpen] = useState<number | false>(false);
  const [vendorSearchValue, setVendorSearchValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Filter items based on search
  const filteredItems = searchValue
    ? allItems.filter(
      (i) =>
        i.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        i.code.toLowerCase().includes(searchValue.toLowerCase())
    )
    : allItems.slice(0, 50); // Limit to 50 when not searching

  // Filter suppliers based on search
  const filteredSuppliers = vendorSearchValue
    ? suppliers.filter(
      (s: any) =>
        s.name.toLowerCase().includes(vendorSearchValue.toLowerCase())
    )
    : suppliers.slice(0, 50); // Limit to 50 when not searching

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

  const handleItemChange = <K extends keyof DocumentItem>(
    index: number,
    field: K,
    value: DocumentItem[K]
  ) => {
    // Check for duplicate item code when manually entering
    if (field === "itemCode" && typeof value === "string" && value.trim()) {
      const existingItemIndex = itemsList.findIndex(
        (item, idx) => idx !== index && item.itemCode === value
      );

      if (existingItemIndex !== -1) {
        toast.error(`الكود "${value}" مستخدم بالفعل في السطر ${existingItemIndex + 1}`);
        return;
      }
    }

    updateItemsList((draft) => {
      const item = draft[index];
      if (item) {
        item[field] = value;
        if (field === "itemName") {
          // Try to find if item exists in DB items
          const selectedItem = allItems.find((i) => i.name === value);
          if (selectedItem) {
            // Check if this item code is already in the list
            const existingItemIndex = itemsList.findIndex(
              (item, idx) => idx !== index && item.itemCode === selectedItem.code
            );

            if (existingItemIndex !== -1) {
              toast.error(`المادة "${selectedItem.name}" موجودة بالفعل في السطر ${existingItemIndex + 1}`);
              return;
            }

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
      .reduce((acc, item) => acc + item.quantity * (item.price || 0), 0);
  };

  const calculateTotalQuantity = () => {
    return itemsList.reduce((acc, item) => acc + item.quantity, 0);
  };

  const handleSave = async () => {
    try {
      // Clear previous validation errors
      setValidationErrors([]);

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

      // 1. Create Entry Document
      const entryTypeMap: { [key: string]: number } = {
        'purchases': 1,
        'gifts': 2,
        'returns': 3,
      };

      // Format date as ISO 8601 datetime string
      const selectedDate = date || new Date();
      const isoDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()).toISOString();

      const documentData = {
        documentNumber: docNumber,
        date: isoDate,
        warehouseId: selectedWarehouse.id,
        departmentId: department ? Number(department) : undefined,
        divisionId: division ? Number(division) : undefined,
        unitId: unit ? Number(unit) : undefined,
        documentType: 1, // 1 = New Entry
        entryMethod: entryMode === 'direct' ? 1 : 2, // 1 = direct, 2 = indirect
        entryType: entryTypeMap[entryType] || 1,
        recipientName: recipientName.trim() || undefined, // Don't send empty string
        notes: notes || undefined,
      };

      const createdDocument = await createEntryDocument(documentData);

      if (!createdDocument) {
        throw new Error("Failed to create entry document");
      }

      // 2. Create ItemInstances for each item (with quantities)
      const itemInstances = [];
      for (const item of itemsList) {
        if (!item.itemId) continue; // Skip items without itemMasterId

        // Create instances based on quantity
        for (let i = 0; i < item.quantity; i++) {
          const serialNumber = `${item.itemCode}-${docNumber}-${Date.now()}-${i + 1}`;

          itemInstances.push({
            serialNumber,
            itemMasterId: item.itemId,
            warehouseId: selectedWarehouse.id,
            departmentId: department ? Number(department) : undefined,
            divisionId: division ? Number(division) : undefined,
            unitId: unit ? Number(unit) : undefined,
            status: 'available', // New items are available
            vendorName: item.vendorName || undefined,
            invoiceNumber: item.invoiceNumber || undefined,
            warrantyExpiry: item.expiryDate || undefined,
            expiryDate: item.expiryDate || undefined,
            notes: item.notes || undefined,
          });
        }
      }

      // Create instances in bulk
      if (itemInstances.length > 0) {
        await createBulkItemInstances({ instances: itemInstances });
      }

      toast.success("تم حفظ مستند الإدخال بنجاح");

      // Reset Form
      setDocNumber((prev) => String(Number(prev) + 1));
      updateItemsList(() => []);
      setNotes("");
      setSearchValue("");
      setRecipientName("");
      setValidationErrors([]);
    } catch (error: any) {
      console.error("Error saving document:", error);

      // Extract validation errors from API response
      if (error?.response?.data?.message) {
        const messages = error.response.data.message;
        if (Array.isArray(messages)) {
          setValidationErrors(messages);
          // Also show first error as toast
          toast.error(messages[0] || "حدث خطأ في التحقق من البيانات");
        } else if (typeof messages === 'string') {
          setValidationErrors([messages]);
          toast.error(messages);
        } else {
          setValidationErrors(["حدث خطأ أثناء حفظ المستند"]);
          toast.error("حدث خطأ أثناء حفظ المستند");
        }
      } else {
        setValidationErrors(["حدث خطأ أثناء حفظ المستند"]);
        toast.error("حدث خطأ أثناء حفظ المستند");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <PackagePlus className="h-8 w-8" />
          إدخال المواد
        </h2>
        <p className="text-muted-foreground mt-1">
          إنشاء مستند إدخال مواد جديدة إلى المخزن
        </p>
      </div>

      {/* Validation Errors Alert */}
      {validationErrors.length > 0 && (
        <Alert variant="destructive" className="relative">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-semibold mb-2">يرجى تصحيح الأخطاء التالية:</div>
            <ul className="list-disc list-inside space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-2 h-6 w-6"
            onClick={() => setValidationErrors([])}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">إغلاق</span>
          </Button>
        </Alert>
      )}

      {/* Warehouse & Entry Mode Selection */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">إعدادات الإدخال</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Warehouse Selector */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">اختيار المخزن</Label>
            {!selectedWarehouse ? (
              <div className="space-y-3">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    الرجاء اختيار المخزن للمتابعة في عملية الإدخال
                  </AlertDescription>
                </Alert>
                <WarehouseSelector />
              </div>
            ) : (
              <WarehouseSelector />
            )}
          </div>

          {/* Entry Mode Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">نوع الإدخال</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Indirect Entry */}
              <div
                className={`cursor-pointer transition-all duration-200 flex items-center gap-3 p-4 rounded-lg border-2 ${
                  entryMode === "indirect"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950 shadow-md"
                    : "border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-blue-950/50"
                }`}
                onClick={() => setEntryMode("indirect")}
              >
                <div
                  className={`p-3 rounded-full ${
                    entryMode === "indirect"
                      ? "bg-blue-500 text-white"
                      : "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                  }`}
                >
                  <Search className="h-6 w-6" />
                </div>
                <div className="flex flex-col flex-1">
                  <span className="font-bold text-base">إدخال غير مباشر</span>
                  <span className="text-sm text-muted-foreground">اختيار من المواد الموجودة</span>
                </div>
                {entryMode === "indirect" && (
                  <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
                )}
              </div>

              {/* Direct Entry */}
              <div
                className={`cursor-pointer transition-all duration-200 flex items-center gap-3 p-4 rounded-lg border-2 ${
                  entryMode === "direct"
                    ? "border-green-500 bg-green-50 dark:bg-green-950 shadow-md"
                    : "border-gray-200 dark:border-gray-700 hover:border-green-300 hover:bg-green-50/50 dark:hover:bg-green-950/50"
                }`}
                onClick={() => setEntryMode("direct")}
              >
                <div
                  className={`p-3 rounded-full ${
                    entryMode === "direct"
                      ? "bg-green-500 text-white"
                      : "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                  }`}
                >
                  <PlusCircle className="h-6 w-6" />
                </div>
                <div className="flex flex-col flex-1">
                  <span className="font-bold text-base">إدخال مباشر</span>
                  <span className="text-sm text-muted-foreground">إنشاء مواد جديدة</span>
                </div>
                {entryMode === "direct" && (
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Details Section */}
      {selectedWarehouse && (
        <Card>
          <CardHeader>
            <CardTitle>تفاصيل مستند الإدخال</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* --- HEADER FORM --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>القسم</Label>
                <Select
                  value={department}
                  onValueChange={(val) => {
                    setDepartment(val);
                    setDivision("");
                    setUnit("");
                  }}
                >
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
                  disabled={!department}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الشعبة..." />
                  </SelectTrigger>
                  <SelectContent>
                    {divisions
                      .filter((d) => d.departmentId === Number(department))
                      .map((d) => (
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
                    {entryTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                      onSelect={(newDate) => {
                        setDate(newDate);
                        if (validationErrors.length > 0) setValidationErrors([]);
                      }}
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
                <Label>اسم المستلم</Label>
                <Input
                  value={recipientName}
                  onChange={(e) => {
                    setRecipientName(e.target.value);
                    if (validationErrors.length > 0) setValidationErrors([]);
                  }}
                  placeholder="أدخل اسم المستلم"
                />
              </div>
              <div className="space-y-2 col-span-1 md:col-span-2 lg:col-span-4">
                <Label>البيان أو الملاحظات العامة</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
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
            <CardTitle>المواد المدخلة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* --- ITEMS TABLE --- */}
            <div className="border rounded-md overflow-x-auto">
              <Table dir="rtl">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right min-w-[120px]">كود المادة</TableHead>
                    <TableHead className="text-right min-w-[200px]">اسم المادة</TableHead>
                    <TableHead className="text-right min-w-[100px]">الوحدة</TableHead>
                    <TableHead className="text-right min-w-[100px]">الكمية</TableHead>
                    <TableHead className="text-right min-w-[120px]">سعر المفرد</TableHead>
                    <TableHead className="text-right min-w-[120px]">المجموع</TableHead>
                    <TableHead className="text-right min-w-[150px]">اسم المورد</TableHead>
                    <TableHead className="text-right min-w-[120px]">رقم الفاتورة</TableHead>
                    <TableHead className="text-right min-w-[180px]">تاريخ الانتهاء</TableHead>
                    <TableHead className="text-right min-w-[180px]">الضمان</TableHead>
                    <TableHead className="text-right min-w-[80px]">إجراء</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itemsList.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={11}
                        className="text-center text-muted-foreground h-24"
                      >
                        لا توجد مواد مضافة. انقر على &quot;إضافة سطر&quot; للبدء
                      </TableCell>
                    </TableRow>
                  ) : (
                    itemsList.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell className="text-right min-w-[120px]">
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
                        <TableCell className="text-right min-w-[200px]">
                          {item.itemId ? (
                            <div className="font-medium">{item.itemName}</div>
                          ) : entryMode === "direct" ? (
                            <Input
                              value={item.itemName || ""}
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "itemName",
                                  e.target.value
                                )
                              }
                              placeholder="أدخل اسم المادة"
                              className="text-right"
                            />
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
                                      "ابحث عن مادة موجودة..."}
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

                                              // Check if item with this code already exists
                                              const existingItemIndex = itemsList.findIndex(
                                                (item, idx) => idx !== index && item.itemCode === newCode
                                              );

                                              if (existingItemIndex !== -1) {
                                                toast.error(`المادة بالكود "${newCode}" موجودة بالفعل في السطر ${existingItemIndex + 1}`);
                                                setSearchOpen(false);
                                                setSearchValue("");
                                                return;
                                              }

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
                                              // Check if item already exists in the list
                                              const existingItemIndex = itemsList.findIndex(
                                                (item, idx) => idx !== index && item.itemCode === itemData.code
                                              );

                                              if (existingItemIndex !== -1) {
                                                toast.error(`المادة "${itemData.name}" موجودة بالفعل في السطر ${existingItemIndex + 1}`);
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
                        <TableCell className="text-right min-w-[100px]">
                          <Input
                            value={item.unit || ""}
                            onChange={(e) =>
                              handleItemChange(index, "unit", e.target.value)
                            }
                            placeholder="الوحدة"
                            className="w-full text-right"
                          />
                        </TableCell>
                        <TableCell className="text-right min-w-[100px]">
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
                            placeholder="الكمية"
                            className="w-full text-right"
                            min="1"
                          />
                        </TableCell>
                        <TableCell className="text-right min-w-[120px]">
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
                            className="w-full text-right"
                            min="0"
                            step="0.01"
                          />
                        </TableCell>
                        <TableCell className="text-right min-w-[120px]">
                          <div className="font-semibold text-primary">
                            {(item.quantity * (item.price || 0)).toLocaleString('ar-IQ', {
                              style: 'currency',
                              currency: 'IQD',
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0
                            })}
                          </div>
                        </TableCell>
                        <TableCell className="text-right min-w-[150px]">
                          {item.vendorId ? (
                            <div className="font-medium">{item.vendorName}</div>
                          ) : (
                            <Popover
                              open={vendorSearchOpen === index}
                              onOpenChange={(open) =>
                                setVendorSearchOpen(open ? index : false)
                              }
                            >
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start text-right text-muted-foreground"
                                >
                                  <Search className="ml-2 h-4 w-4" />
                                  {item.vendorName || "ابحث عن مورد..."}
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
                                    placeholder="ابحث بالاسم..."
                                    value={vendorSearchValue}
                                    onValueChange={setVendorSearchValue}
                                  />
                                  <CommandList>
                                    <CommandEmpty>
                                      <div className="p-2">
                                        <p className="text-sm text-muted-foreground mb-2">
                                          لم يتم العثور على موردين
                                        </p>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => {
                                            updateItemsList((draft) => {
                                              draft[index].vendorName = vendorSearchValue;
                                              draft[index].vendorId = undefined;
                                            });
                                            setVendorSearchOpen(false);
                                            setVendorSearchValue("");
                                          }}
                                        >
                                          <PlusCircle className="ml-2 h-4 w-4" />
                                          إضافة &quot;{vendorSearchValue}&quot; كمورد جديد
                                        </Button>
                                      </div>
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {filteredSuppliers.map((vendor) => (
                                        <CommandItem
                                          key={vendor.id}
                                          onSelect={() => {
                                            updateItemsList((draft) => {
                                              draft[index].vendorId = vendor.id;
                                              draft[index].vendorName = vendor.name;
                                            });
                                            setVendorSearchOpen(false);
                                            setVendorSearchValue("");
                                          }}
                                          className="flex items-center justify-between"
                                        >
                                          <div>
                                            <div className="font-medium">
                                              {vendor.name}
                                            </div>
                                          </div>
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          )}
                        </TableCell>
                        <TableCell className="text-right min-w-[120px]">
                          <Input
                            value={item.invoiceNumber || ""}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "invoiceNumber",
                                e.target.value
                              )
                            }
                            placeholder="رقم الفاتورة"
                            className="w-full text-right"
                          />
                        </TableCell>
                        <TableCell className="text-right min-w-[180px]">
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
                        <TableCell className="text-right min-w-[180px]">
                          <div className="flex gap-2 items-center">
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
                        <TableCell className="text-right min-w-[80px]">
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

            {/* --- FOOTER --- */}
            <div className="space-y-3 p-4 bg-muted rounded-md">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">إجمالي الكميات:</span>
                <span className="text-xl font-bold text-blue-600">
                  {calculateTotalQuantity().toLocaleString('ar-IQ')} قطعة
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-lg font-bold">المجموع النهائي:</span>
                <span className="text-2xl font-bold text-primary">
                  {calculateTotal().toLocaleString('ar-IQ', {
                    style: 'currency',
                    currency: 'IQD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  })}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => {
              setDocNumber((prev) => String(Number(prev) + 1));
              updateItemsList(() => []);
              setNotes("");
            }}>مستند جديد</Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <Save className="ml-2 h-4 w-4" />
                  حفظ المستند
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default ItemEntryPage;
