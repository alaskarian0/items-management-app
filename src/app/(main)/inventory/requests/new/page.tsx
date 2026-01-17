"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
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
import { toast } from "sonner";
import {
  Trash2,
  Send,
  Package,
  PlusCircle,
  Search,
  ClipboardList,
  Loader2,
} from "lucide-react";
import { useWarehouses } from "@/hooks/use-warehouses";
import { useItemMasters } from "@/hooks/use-item-masters";
import { useStockQuery } from "@/hooks/use-stock-query";

// Stock Request Item interface
interface StockRequestItem {
  id: string;
  itemMasterId: number | null;
  itemCode: string;
  itemName: string;
  unit: string;
  requestedQuantity: number;
  notes: string;
}

export default function InventoryStockRequestsPage() {
  // Fetch warehouses and items from API
  const { warehouses, loading: warehousesLoading } = useWarehouses();
  const { itemMasters, loading: itemsLoading } = useItemMasters();
  const { createRequest, loading: submitting } = useStockQuery();

  // Extract items array from API response
  const allItems = useMemo(() => {
    if (!itemMasters) return [];
    const response = itemMasters as any;
    if (Array.isArray(response)) return response;
    if (response?.data && Array.isArray(response.data)) return response.data;
    return [];
  }, [itemMasters]);

  // Extract warehouses array from API response
  const warehouseList = useMemo(() => {
    if (!warehouses) return [];
    const response = warehouses as any;
    if (Array.isArray(response)) return response;
    if (response?.data && Array.isArray(response.data)) return response.data;
    return [];
  }, [warehouses]);

  // Form state
  const [warehouseId, setWarehouseId] = useState("");
  const [requestDate, setRequestDate] = useState(new Date().toISOString().split("T")[0]);
  const [purpose, setPurpose] = useState("");
  const [items, setItems] = useState<StockRequestItem[]>([]);
  const [searchOpen, setSearchOpen] = useState<number | false>(false);
  const [searchValue, setSearchValue] = useState("");

  // Filter items based on search
  const filteredItems = searchValue
    ? allItems.filter(
        (i: any) =>
          i.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
          i.code?.toLowerCase().includes(searchValue.toLowerCase())
      )
    : allItems.slice(0, 50);

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        itemMasterId: null,
        itemCode: "",
        itemName: "",
        unit: "",
        requestedQuantity: 1,
        notes: "",
      },
    ]);
  };

  const handleItemChange = <K extends keyof StockRequestItem>(
    index: number,
    field: K,
    value: StockRequestItem[K]
  ) => {
    setItems((prevItems) => {
      const newItems = [...prevItems];
      newItems[index] = { ...newItems[index], [field]: value };
      return newItems;
    });
  };

  const handleRemoveItem = (index: number) => {
    setItems((prevItems) => prevItems.filter((_, i) => i !== index));
    toast.success("تم حذف المادة");
  };

  const handleSubmitRequest = async () => {
    // Validation
    if (!warehouseId) {
      toast.error("الرجاء اختيار المخزن");
      return;
    }

    if (items.length === 0) {
      toast.error("الرجاء إضافة مادة واحدة على الأقل");
      return;
    }

    // Validate items
    const invalidItems = items.filter((item) => !item.itemMasterId);
    if (invalidItems.length > 0) {
      toast.error("الرجاء اختيار جميع المواد من القائمة");
      return;
    }

    if (!purpose) {
      toast.error("الرجاء إدخال الغرض من الطلب");
      return;
    }

    try {
      // Create request via API
      await createRequest({
        warehouseId: parseInt(warehouseId),
        requestDate: requestDate,
        purpose: purpose,
        items: items.map((item) => ({
          itemMasterId: item.itemMasterId!,
          requestedQuantity: item.requestedQuantity,
          notes: item.notes || undefined,
        })),
      });

      // Reset form
      setWarehouseId("");
      setRequestDate(new Date().toISOString().split("T")[0]);
      setPurpose("");
      setItems([]);

      toast.success("تم إرسال طلب الاستعلام عن المخزون بنجاح");
    } catch (error) {
      console.error("Error submitting request:", error);
      toast.error("حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.");
    }
  };

  const selectedWarehouse = warehouseList.find((w: any) => w.id?.toString() === warehouseId);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <ClipboardList className="h-8 w-8" />
          طلب استعلام عن المخزون
        </h2>
        <p className="text-muted-foreground mt-1">
          قم بتعبئة البيانات للاستعلام عن رصيد المواد في المخزن
        </p>
      </div>

      {/* Create Request Form */}
      <div className="space-y-6">
        {/* Warehouse Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              اختيار المخزن
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Warehouse Selection */}
            <div className="space-y-2">
              <Label>
                المخزن <span className="text-red-500">*</span>
              </Label>
              <Select value={warehouseId} onValueChange={setWarehouseId} disabled={warehousesLoading}>
                <SelectTrigger>
                  <SelectValue placeholder={warehousesLoading ? "جاري التحميل..." : "اختر المخزن المطلوب الاستعلام عنه..."} />
                </SelectTrigger>
                <SelectContent>
                  {warehouseList.map((warehouse: any) => (
                    <SelectItem key={warehouse.id} value={warehouse.id?.toString()}>
                      {warehouse.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Display selected warehouse */}
            {selectedWarehouse && (
              <Card className="bg-muted/50">
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">المخزن المحدد</Label>
                    <p className="font-medium text-lg">{selectedWarehouse.name}</p>
                    {selectedWarehouse.code && (
                      <p className="text-sm text-muted-foreground">الكود: {selectedWarehouse.code}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Request Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              تفاصيل الطلب
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="requestDate">
                  تاريخ الطلب <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="requestDate"
                  type="date"
                  value={requestDate}
                  onChange={(e) => setRequestDate(e.target.value)}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="purpose">
                  الغرض من الطلب <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="purpose"
                  placeholder="أدخل الغرض من الاستعلام عن المخزون..."
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Items Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              المواد المطلوب الاستعلام عنها
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border rounded-md overflow-x-auto">
              <Table dir="rtl">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right min-w-[120px]">كود المادة</TableHead>
                    <TableHead className="text-right min-w-[200px]">اسم المادة</TableHead>
                    <TableHead className="text-right min-w-[100px]">الوحدة</TableHead>
                    <TableHead className="text-right min-w-[100px]">الكمية المطلوبة</TableHead>
                    <TableHead className="text-right min-w-[150px]">ملاحظات</TableHead>
                    <TableHead className="text-right min-w-[80px]">إجراء</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center text-muted-foreground h-24"
                      >
                        لا توجد مواد مضافة. انقر على &quot;إضافة سطر&quot; للبدء
                      </TableCell>
                    </TableRow>
                  ) : (
                    items.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell className="text-right min-w-[120px]">
                          <Input
                            value={item.itemCode || ""}
                            onChange={(e) =>
                              handleItemChange(index, "itemCode", e.target.value)
                            }
                            placeholder="كود المادة"
                            className="text-right"
                            disabled={!!item.itemMasterId}
                          />
                        </TableCell>
                        <TableCell className="text-right min-w-[200px]">
                          {item.itemMasterId ? (
                            <div className="font-medium">{item.itemName}</div>
                          ) : (
                            <Popover
                              open={searchOpen === index}
                              onOpenChange={(open) => setSearchOpen(open ? index : false)}
                            >
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start text-right text-muted-foreground"
                                  disabled={itemsLoading}
                                >
                                  <Search className="ml-2 h-4 w-4" />
                                  {itemsLoading ? "جاري التحميل..." : item.itemName || "ابحث عن مادة..."}
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
                                        <p className="text-sm text-muted-foreground">
                                          لم يتم العثور على مواد
                                        </p>
                                      </div>
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {filteredItems.map((itemData: any) => (
                                        <CommandItem
                                          key={itemData.id}
                                          onSelect={() => {
                                            // Check if item already exists in the list
                                            const existingItemIndex = items.findIndex(
                                              (item, idx) =>
                                                idx !== index &&
                                                item.itemCode === itemData.code
                                            );

                                            if (existingItemIndex !== -1) {
                                              toast.error(
                                                `المادة "${itemData.name}" موجودة بالفعل في السطر ${existingItemIndex + 1}`
                                              );
                                              setSearchOpen(false);
                                              setSearchValue("");
                                              return;
                                            }

                                            setItems((prevItems) => {
                                              const newItems = [...prevItems];
                                              newItems[index] = {
                                                ...newItems[index],
                                                itemMasterId: itemData.id,
                                                itemName: itemData.name,
                                                itemCode: itemData.code,
                                                unit: itemData.unit?.name || itemData.unit?.abbreviation || "قطعة",
                                              };
                                              return newItems;
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
                                              {itemData.code} {itemData.unit?.abbreviation && `• ${itemData.unit.abbreviation}`}
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
                        <TableCell className="text-right min-w-[100px]">
                          <Input
                            value={item.unit || ""}
                            onChange={(e) =>
                              handleItemChange(index, "unit", e.target.value)
                            }
                            placeholder="الوحدة"
                            className="w-full text-right"
                            disabled={!!item.itemMasterId}
                          />
                        </TableCell>
                        <TableCell className="text-right min-w-[100px]">
                          <Input
                            type="number"
                            value={item.requestedQuantity}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "requestedQuantity",
                                Number(e.target.value)
                              )
                            }
                            placeholder="الكمية"
                            className="w-full text-right"
                            min="1"
                          />
                        </TableCell>
                        <TableCell className="text-right min-w-[150px]">
                          <Input
                            value={item.notes}
                            onChange={(e) =>
                              handleItemChange(index, "notes", e.target.value)
                            }
                            placeholder="ملاحظات..."
                            className="w-full text-right"
                          />
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
          </CardContent>
          <CardFooter className="flex justify-end gap-3">
            <Button onClick={handleSubmitRequest} size="lg" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 ml-2" />
                  إرسال الطلب
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
