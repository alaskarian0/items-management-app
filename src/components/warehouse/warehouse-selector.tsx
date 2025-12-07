"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Warehouse as WarehouseIcon } from "lucide-react";
import { useWarehouse } from "@/context/warehouse-context";
import { Label } from "@/components/ui/label";

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
  const { selectedWarehouse, setSelectedWarehouse, allWarehouses } = useWarehouse();

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <Label className="flex items-center gap-2">
          {showIcon && <WarehouseIcon className="h-4 w-4 text-muted-foreground" />}
          <span>{label}</span>
        </Label>
      )}
      <Select
        value={selectedWarehouse?.id || ""}
        onValueChange={(id) => {
          const warehouse = allWarehouses.find(wh => wh.id === id);
          setSelectedWarehouse(warehouse || null);
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="اختر المخزن..." />
        </SelectTrigger>
        <SelectContent>
          {allWarehouses.map(wh => (
            <SelectItem key={wh.id} value={wh.id}>
              {wh.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
