"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Warehouse } from "@/lib/types/warehouse";
import { useWarehouses } from "@/hooks/use-warehouses";

// Export Warehouse for consumers of this context
export type { Warehouse };

type WarehouseContextType = {
  selectedWarehouse: Warehouse | null;
  setSelectedWarehouse: (warehouse: Warehouse | null) => void;
  warehouses: Warehouse[];
  allWarehouses: Warehouse[]; // Flattened list for easy selection
  loading: boolean;
  error: any;
};

// --- CONTEXT ---
const WarehouseContext = createContext<WarehouseContextType | undefined>(undefined);

// --- HELPER: Flatten warehouse tree ---
const flattenWarehouses = (warehouses: Warehouse[]): Warehouse[] => {
  const result: Warehouse[] = [];

  const flatten = (wh: Warehouse) => {
    result.push(wh);
    if (wh.children && Array.isArray(wh.children)) {
      wh.children.forEach(child => flatten(child));
    }
  };

  warehouses.forEach(wh => flatten(wh));
  return result;
};

// --- PROVIDER COMPONENT ---
export function WarehouseProvider({ children }: { children: React.ReactNode }) {
  const [selectedWarehouse, setSelectedWarehouseState] = useState<Warehouse | null>(null);

  // Fetch warehouses from API
  const { warehouses: warehousesData, loading, error } = useWarehouses();

  // Extract warehouses data from API response
  const warehouses = useMemo(() => {
    const data = warehousesData?.data;
    return Array.isArray(data) ? data : [];
  }, [warehousesData]);

  const allWarehouses = useMemo(() => flattenWarehouses(warehouses), [warehouses]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedWarehouseId = localStorage.getItem('selectedWarehouseId');
    if (savedWarehouseId && allWarehouses.length > 0) {
      const warehouse = allWarehouses.find(wh => String(wh.id) === savedWarehouseId);
      if (warehouse) {
        setSelectedWarehouseState(warehouse);
      }
    }
  }, [allWarehouses.length]); // Re-run when warehouses load

  // Save to localStorage when changed
  const setSelectedWarehouse = (warehouse: Warehouse | null) => {
    setSelectedWarehouseState(warehouse);
    if (warehouse) {
      localStorage.setItem('selectedWarehouseId', String(warehouse.id));
    } else {
      localStorage.removeItem('selectedWarehouseId');
    }
  };

  return (
    <WarehouseContext.Provider
      value={{
        selectedWarehouse,
        setSelectedWarehouse,
        warehouses,
        allWarehouses,
        loading,
        error
      }}
    >
      {children}
    </WarehouseContext.Provider>
  );
}

// --- CUSTOM HOOK ---
export const useWarehouse = () => {
  const context = useContext(WarehouseContext);
  if (!context) {
    throw new Error("useWarehouse must be used within a WarehouseProvider");
  }
  return context;
};
