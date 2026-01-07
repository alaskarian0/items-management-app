"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useWarehouse } from "@/context/warehouse-context";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Loader2, Search, Warehouse as WarehouseIcon } from "lucide-react";
import { useState } from "react";

interface WarehouseSelectorProps {
  label?: string;
  showIcon?: boolean;
  className?: string;
}

export function WarehouseSelector({
  label = "المخزن",
  showIcon = true,
  className = ""
}: WarehouseSelectorProps) {
  const { selectedWarehouse, setSelectedWarehouse, allWarehouses, loading, error } = useWarehouse();
  const [open, setOpen] = useState(false);

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <Label className="flex items-center gap-2">
          {showIcon && <WarehouseIcon className="h-4 w-4 text-muted-foreground" />}
          <span>{label}</span>
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                <span className="text-muted-foreground">جاري التحميل...</span>
              </>
            ) : error ? (
              <span className="text-destructive">خطأ في تحميل المخازن</span>
            ) : selectedWarehouse ? (
              <span className="truncate">{selectedWarehouse.name}</span>
            ) : (
              <span className="text-muted-foreground">اختر المخزن...</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0"
          align="start"
          style={{ width: 'var(--radix-popover-trigger-width)' }}
        >
          <Command>
            <div className="flex items-center border-b px-3">
              <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              <CommandInput
                placeholder="ابحث عن مخزن..."
                className="h-9"
              />
            </div>
            <CommandList>
              <CommandEmpty>لم يتم العثور على مخازن</CommandEmpty>
              <CommandGroup>
                {allWarehouses.map((warehouse) => (
                  <CommandItem
                    key={warehouse.id}
                    value={warehouse.name}
                    onSelect={() => {
                      setSelectedWarehouse(
                        warehouse.id === selectedWarehouse?.id ? null : warehouse
                      );
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "ml-2 h-4 w-4",
                        selectedWarehouse?.id === warehouse.id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {warehouse.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
