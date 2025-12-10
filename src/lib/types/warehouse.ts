// Warehouse Types
// Shared types for warehouse management system

export interface Department {
  id: number;
  name: string;
}

export interface Division {
  id: number;
  name: string;
  departmentId: number;
}

export interface Unit {
  id: number;
  name: string;
  divisionId: number;
}

export interface BasicSupplier {
  id: number;
  name: string;
}

export interface Customer {
  id: number;
  name: string;
}

export interface Warehouse {
  id: number;
  name: string;
  code: string;
  address?: string;
  isActive: boolean;
  children?: Warehouse[];
  level?: number;
  itemCount?: number;
}

export interface Item {
  id: number;
  name: string;
  code: string;
  unit: string;
  stock?: number;
  price?: number;
  category?: string;
  description?: string;
  minStock?: number;
}

export interface DocumentItem {
  id: number;
  itemId: number | null;
  itemCode: string;
  itemName: string;
  unit: string;
  quantity: number;
  price?: number;
  stock?: number;
  warranty?: string;
  notes?: string;
  vendorName?: string;
  vendorId?: number;
  supplierName?: string;
  supplierId?: number;
}

export interface StockItem extends Item {
  stock: number;
  minStock: number;
  maxStock: number;
  category: string;
  location?: string;
  lastUpdated: string;
}

export interface ItemMovement {
  id: number;
  itemCode: string;
  itemName: string;
  movementType: "إدخال" | "إصدار";
  quantity: number;
  balance: number;
  referenceNumber: string;
  date: string;
  department?: string;
  recipient?: string;
  supplier?: string;
  notes?: string;
}

export interface WarehouseStore extends Warehouse {
  manager?: string;
  totalItems: number;
  totalValue: number;
  lastInventory?: string;
}

// Entry document specific types
export interface EntryDocument {
  id?: number;
  docNumber: string;
  date: Date;
  warehouseId: number;
  departmentId?: number;
  divisionId?: number;
  unitId?: number;
  supplierId?: number;
  entryType: "purchases" | "gifts" | "returns";
  notes?: string;
  items: DocumentItem[];
  total?: number;
}

// Issuance document specific types
export interface IssuanceDocument {
  id?: number;
  docNumber: string;
  date: Date;
  warehouseId: number;
  departmentId?: number;
  divisionId?: number;
  unitId?: number;
  recipientName: string;
  notes?: string;
  items: DocumentItem[];
}

// Filter and search types
export interface StockFilter {
  category?: string;
  search?: string;
  stockStatus?: "in-stock" | "low-stock" | "out-of-stock";
}

export interface MovementFilter {
  dateRange?: {
    from: Date;
    to: Date;
  };
  movementType?: "all" | "إدخال" | "إصدار";
  itemCode?: string;
  department?: string;
}

// Statistics types
export interface WarehouseStats {
  totalItems: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  movementsToday: number;
  entriesToday: number;
  issuancesToday: number;
}

// Warehouse Document (combined entry/issuance records)
export interface WarehouseDocument {
  id: number;
  docNumber: string;
  type: "entry" | "issuance";
  date: string;
  warehouseId: number;
  warehouseName: string;
  departmentId?: number;
  departmentName?: string;
  divisionId?: number;
  divisionName?: string;
  unitId?: number;
  unitName?: string;
  supplierId?: number;
  supplierName?: string;
  recipientName?: string;
  entryType?: "purchases" | "gifts" | "returns";
  itemCount: number;
  totalValue: number;
  notes?: string;
  status: "draft" | "approved" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

// Form types
export type EntryFormData = Omit<EntryDocument, 'id' | 'items'> & {
  items: DocumentItem[];
};

export type IssuanceFormData = Omit<IssuanceDocument, 'id' | 'items'> & {
  items: DocumentItem[];
};