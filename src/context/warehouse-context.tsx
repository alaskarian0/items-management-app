"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

// --- TYPE DEFINITIONS ---
import { db } from "@/lib/db";
import { useLiveQuery } from "dexie-react-hooks";
import { Warehouse } from "@/lib/types/warehouse";

// --- TYPE DEFINITIONS ---
// Export Warehouse for consumers of this context
export type { Warehouse };

type WarehouseContextType = {
  selectedWarehouse: Warehouse | null;
  setSelectedWarehouse: (warehouse: Warehouse | null) => void;
  warehouses: Warehouse[];
  allWarehouses: Warehouse[]; // Flattened list for easy selection
};

// --- CONTEXT ---
const WarehouseContext = createContext<WarehouseContextType | undefined>(undefined);

// --- MOCK DATA (replace with API call later) ---
// --- HELPER: Flatten warehouse tree ---
const flattenWarehouses = (warehouses: Warehouse[]): Warehouse[] => {
  const result: Warehouse[] = [];

  const flatten = (wh: Warehouse) => {
    result.push(wh);
    if (wh.children) wh.children.forEach(child => flatten(child));
  };

  warehouses.forEach(wh => flatten(wh));
  return result;
};

// --- HELPER: Flatten warehouse tree ---


// --- PROVIDER COMPONENT ---
export function WarehouseProvider({ children }: { children: React.ReactNode }) {
  const [selectedWarehouse, setSelectedWarehouseState] = useState<Warehouse | null>(null);

  // Use LiveQuery to allow reactivity
  const warehouses = useLiveQuery(() => db.warehouses.toArray()) || [];
  const allWarehouses = flattenWarehouses(warehouses);

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
        allWarehouses
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
