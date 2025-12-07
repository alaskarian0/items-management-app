"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

// --- TYPE DEFINITIONS ---
export type Warehouse = {
  id: string;
  name: string;
  children: Warehouse[];
};

type WarehouseContextType = {
  selectedWarehouse: Warehouse | null;
  setSelectedWarehouse: (warehouse: Warehouse | null) => void;
  warehouses: Warehouse[];
  allWarehouses: Warehouse[]; // Flattened list for easy selection
};

// --- CONTEXT ---
const WarehouseContext = createContext<WarehouseContextType | undefined>(undefined);

// --- MOCK DATA (replace with API call later) ---
const initialWarehouseData: Warehouse[] = [
  {
    id: 'store-1',
    name: 'المخزن الرئيسي',
    children: [
      {
        id: 'group-1-1',
        name: 'مخزن شعبة المواد الثابتة',
        children: [
          { id: 'sub-1-1-1', name: 'مخزن الأثاث والممتلكات العامة', children: [] },
          { id: 'sub-1-1-2', name: 'مخزن السجاد والمفروشات', children: [] },
        ],
      },
      {
        id: 'group-1-2',
        name: 'مخزن شعبة المواد الاستهلاكية',
        children: [
          { id: 'sub-1-2-1', name: 'مخزن المواد العامة', children: [] },
        ],
      },
    ],
  },
];

// --- HELPER: Flatten warehouse tree ---
const flattenWarehouses = (warehouses: Warehouse[]): Warehouse[] => {
  const result: Warehouse[] = [];

  const flatten = (wh: Warehouse, level = 0) => {
    result.push(wh);
    wh.children.forEach(child => flatten(child, level + 1));
  };

  warehouses.forEach(wh => flatten(wh));
  return result;
};

// --- PROVIDER COMPONENT ---
export function WarehouseProvider({ children }: { children: React.ReactNode }) {
  const [selectedWarehouse, setSelectedWarehouseState] = useState<Warehouse | null>(null);
  const warehouses = initialWarehouseData;
  const allWarehouses = flattenWarehouses(warehouses);

  // Load from localStorage on mount
  useEffect(() => {
    const savedWarehouseId = localStorage.getItem('selectedWarehouseId');
    if (savedWarehouseId) {
      const warehouse = allWarehouses.find(wh => wh.id === savedWarehouseId);
      if (warehouse) {
        setSelectedWarehouseState(warehouse);
      }
    }
  }, []);

  // Save to localStorage when changed
  const setSelectedWarehouse = (warehouse: Warehouse | null) => {
    setSelectedWarehouseState(warehouse);
    if (warehouse) {
      localStorage.setItem('selectedWarehouseId', warehouse.id);
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
