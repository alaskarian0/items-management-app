// Warehouse Mock Data
// Centralized dummy data for warehouse management system

import type {
  Department,
  Division,
  Unit,
  Supplier,
  Customer,
  Warehouse,
  Item,
  StockItem,
  ItemMovement,
  WarehouseStore
} from '@/lib/types/warehouse';

// Departments
export const departments: Department[] = [
  { id: 1, name: "قسم الشؤون الهندسية" },
  { id: 2, name: "قسم الشؤون الإدارية" },
  { id: 3, name: "قسم التشغيل والصيانة" },
  { id: 4, name: "قسم المالية والمحاسبة" },
];

// Divisions
export const divisions: Division[] = [
  { id: 1, name: "شعبة الهندسة المدنية", departmentId: 1 },
  { id: 2, name: "شعبة الهندسة الكهربائية", departmentId: 1 },
  { id: 3, name: "شعبة الهندسة الميكانيكية", departmentId: 1 },
  { id: 4, name: "شعبة الشؤون الإدارية", departmentId: 2 },
  { id: 5, name: "شعبة الشؤون المالية", departmentId: 2 },
  { id: 6, name: "شعبة التشغيل", departmentId: 3 },
  { id: 7, name: "شعبة الصيانة", departmentId: 3 },
];

// Units
export const units: Unit[] = [
  { id: 1, name: "وحدة التخطيط", divisionId: 1 },
  { id: 2, name: "وحدة التنفيذ", divisionId: 1 },
  { id: 3, name: "وحدة الصيانة الكهربائية", divisionId: 2 },
  { id: 4, name: "وحدة الصيانة الميكانيكية", divisionId: 3 },
  { id: 5, name: "وحدة الشؤون المالية", divisionId: 4 },
  { id: 6, name: "وحدة الموارد البشرية", divisionId: 4 },
  { id: 7, name: "وحدة التشغيل", divisionId: 6 },
  { id: 8, name: "وحدة الصيانة العامة", divisionId: 7 },
];

// Suppliers
export const suppliers: Supplier[] = [
  { id: 1, name: "شركة النبلاء للمواد المكتبي" },
  { id: 2, name: "موردون متحدون للأثاث" },
  { id: 3, name: "شركة الأوائل للأجهزة الكهربائية" },
  { id: 4, name: "مؤسسة العراق للتجارة العامة" },
  { id: 5, name: "شركة النور للمعدات المكتبية" },
];

// Customers
export const customers: Customer[] = [
  { id: 1, name: "وزارة الصحة" },
  { id: 2, name: "وزارة التربية" },
  { id: 3, name: "أمانة بغداد" },
  { id: 4, name: "مديرية كهرباء بغداد" },
];

// Warehouses
export const warehouses: Warehouse[] = [
  {
    id: 1,
    name: "المخزن الرئيسي",
    code: "WH-001",
    address: "شارع فلسطين، بغداد",
    isActive: true
  },
  {
    id: 2,
    name: "مخزن المواد الكهربائية",
    code: "WH-002",
    address: "منطقة المنصور",
    isActive: true
  },
  {
    id: 3,
    name: "مخزن الأثاث والمعدات",
    code: "WH-003",
    address: "منطقة الكرادة",
    isActive: false
  },
  {
    id: 4,
    name: "مخزن المواد الاستهلاكية",
    code: "WH-004",
    address: "منطقة الجادرية",
    isActive: true
  },
];

// Items
export const items: Item[] = [
  // Office Furniture
  { id: 1, name: "كرسي مكتب تنفيذي", code: "FUR-CHR-001", unit: "قطعة", stock: 50, price: 85000, category: "الأثاث المكتبي" },
  { id: 2, name: "طاولة اجتماعات", code: "FUR-TBL-001", unit: "قطعة", stock: 10, price: 250000, category: "الأثاث المكتبي" },
  { id: 3, name: "مكتب عمل", code: "FUR-DSK-001", unit: "قطعة", stock: 25, price: 180000, category: "الأثاث المكتبي" },
  { id: 4, name: "خزانة ملفات", code: "FUR-CAB-001", unit: "قطعة", stock: 30, price: 120000, category: "الأثاث المكتبي" },

  // Electrical Equipment
  { id: 5, name: "مولد كهرباء 5 كيلو واط", code: "ELE-GEN-001", unit: "قطعة", stock: 5, price: 750000, category: "المعدات الكهربائية" },
  { id: 6, name: "مكيف هواء 1.5 طن", code: "ELE-AC-001", unit: "قطعة", stock: 15, price: 450000, category: "المعدات الكهربائية" },
  { id: 7, name: "لمبة LED 100 واط", code: "ELE-LMP-001", unit: "قطعة", stock: 200, price: 15000, category: "المعدات الكهربائية" },
  { id: 8, name: "أسلاك كهربائية 2.5 ملم", code: "ELE-WIR-001", unit: "متر", stock: 5000, price: 2500, category: "المعدات الكهربائية" },

  // Stationery and Consumables
  { id: 9, name: "حبر طابعة HP LaserJet", code: "STA-INK-001", unit: "خرطوشة", stock: 80, price: 55000, category: "المواد المكتبية" },
  { id: 10, name: "ورق A4", code: "STA-PAP-001", unit: "ردة", stock: 150, price: 12500, category: "المواد المكتبية" },
  { id: 11, name: "قلم حبر جاف", code: "STA-PEN-001", unit: "قلم", stock: 500, price: 750, category: "المواد المكتبية" },
  { id: 12, name: "دفتر ملاحظات", code: "STA-NBK-001", unit: "دفتر", stock: 300, price: 2500, category: "المواد المكتبية" },

  // Cleaning Supplies
  { id: 13, name: "منظف أرضيات", code: "CLN-FLR-001", unit: "عبوة", stock: 45, price: 8500, category: "مواد النظافة" },
  { id: 14, name: "ممسحة أرضيات", code: "CLN-MOP-001", unit: "قطعة", stock: 20, price: 12000, category: "مواد النظافة" },
  { id: 15, name: "قفازات نظافة", code: "CLN-GLV-001", unit: "زوج", stock: 100, price: 1500, category: "مواد النظافة" },

  // Tools and Equipment
  { id: 16, name: "طقم مفكات", code: "TL-SCW-001", unit: "طقم", stock: 12, price: 25000, category: "الأدوات" },
  { id: 17, name: "مطرقة يدوية", code: "TL-HMR-001", unit: "قطعة", stock: 25, price: 8500, category: "الأدوات" },
  { id: 18, name: "منشار كهربائي", code: "TL-ELC-001", unit: "قطعة", stock: 8, price: 95000, category: "الأدوات" },
];

// Stock Items (with detailed inventory info)
export const stockItems: StockItem[] = items.map((item, index) => ({
  ...item,
  stock: item.stock || 0,
  minStock: Math.floor(Math.random() * 10) + 5,
  maxStock: Math.floor(Math.random() * 50) + 100,
  category: item.category || "أخرى",
  lastUpdated: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
}));

// Item Movements
export const itemMovements: ItemMovement[] = [
  // Entry movements
  {
    id: 1,
    itemCode: "FUR-CHR-001",
    itemName: "كرسي مكتب تنفيذي",
    movementType: "إدخال",
    quantity: 20,
    balance: 50,
    referenceNumber: "ENT-2024-001",
    date: "2024-01-15",
    department: "قسم الشؤون الهندسية",
    supplier: "شركة النبلاء للمواد المكتبي",
    notes: "إدخال كراسي جديدة للمكاتب التنفيذية"
  },
  {
    id: 2,
    itemCode: "ELE-GEN-001",
    itemName: "مولد كهرباء 5 كيلو واط",
    movementType: "إدخال",
    quantity: 3,
    balance: 5,
    referenceNumber: "ENT-2024-002",
    date: "2024-01-20",
    department: "قسم التشغيل والصيانة",
    supplier: "شركة الأوائل للأجهزة الكهربائية",
    notes: "توريد مولدات للطوارئ"
  },
  // Issuance movements
  {
    id: 3,
    itemCode: "FUR-TBL-001",
    itemName: "طاولة اجتماعات",
    movementType: "إصدار",
    quantity: 2,
    balance: 10,
    referenceNumber: "ISS-2024-001",
    date: "2024-01-22",
    department: "قسم الشؤون الهندسية",
    recipient: "م. أحمد محمد",
    notes: "توزيع طاولات لغرفة الاجتماعات الجديدة"
  },
  {
    id: 4,
    itemCode: "STA-INK-001",
    itemName: "حبر طابعة HP LaserJet",
    movementType: "إصدار",
    quantity: 15,
    balance: 80,
    referenceNumber: "ISS-2024-002",
    date: "2024-01-23",
    department: "قسم الشؤون الإدارية",
    recipient: "السكرتارية",
    notes: "طلب من قسم المحاسبة"
  },
  {
    id: 5,
    itemCode: "CLN-FLR-001",
    itemName: "منظف أرضيات",
    movementType: "إصدار",
    quantity: 10,
    balance: 45,
    referenceNumber: "ISS-2024-003",
    date: "2024-01-24",
    department: "قسم التشغيل والصيانة",
    recipient: "علي حسن",
    notes: "للنظافة اليومية"
  },
];

// Warehouse Stores with statistics
export const warehouseStores: WarehouseStore[] = [
  {
    ...warehouses[0],
    manager: "محمد عبدالله",
    totalItems: 250,
    totalValue: 15000000,
    lastInventory: "2024-01-01"
  },
  {
    ...warehouses[1],
    manager: "علي صالح",
    totalItems: 85,
    totalValue: 8500000,
    lastInventory: "2024-01-05"
  },
  {
    ...warehouses[2],
    manager: "حسن محمد",
    totalItems: 120,
    totalValue: 6500000,
    lastInventory: "2023-12-15"
  },
  {
    ...warehouses[3],
    manager: "خالد أحمد",
    totalItems: 180,
    totalValue: 3500000,
    lastInventory: "2024-01-10"
  },
];

// Entry types
export const entryTypes = [
  { value: "purchases", label: "مشتريات" },
  { value: "gifts", label: "هدايا وندور" },
  { value: "returns", label: "ارجاع مواد" },
];

// Movement types
export const movementTypes = [
  { value: "all", label: "جميع الحركات" },
  { value: "إدخال", label: "إدخال" },
  { value: "إصدار", label: "إصدار" },
];

// Stock status options
export const stockStatusOptions = [
  { value: "in-stock", label: "متوفر" },
  { value: "low-stock", label: "مخزون منخفض" },
  { value: "out-of-stock", label: "نفد من المخزون" },
];

// Categories
export const itemCategories = [
  "الأثاث المكتبي",
  "المعدات الكهربائية",
  "المواد المكتبية",
  "مواد النظافة",
  "الأدوات",
  "أخرى"
];

// Utility functions
export const getDepartmentName = (id: number): string => {
  const dept = departments.find(d => d.id === id);
  return dept?.name || '';
};

export const getDivisionName = (id: number): string => {
  const division = divisions.find(d => d.id === id);
  return division?.name || '';
};

export const getUnitName = (id: number): string => {
  const unit = units.find(u => u.id === id);
  return unit?.name || '';
};

export const getSupplierName = (id: number): string => {
  const supplier = suppliers.find(s => s.id === id);
  return supplier?.name || '';
};

export const getWarehouseName = (id: number): string => {
  const warehouse = warehouses.find(w => w.id === id);
  return warehouse?.name || '';
};

export const getDivisionsByDepartment = (departmentId: number): Division[] => {
  return divisions.filter(d => d.departmentId === departmentId);
};

export const getUnitsByDivision = (divisionId: number): Unit[] => {
  return units.filter(u => u.divisionId === divisionId);
};

export const getItemByCode = (code: string): Item | undefined => {
  return items.find(item => item.code === code);
};

export const searchItems = (query: string): Item[] => {
  const lowercaseQuery = query.toLowerCase();
  return items.filter(
    (item) =>
      item.name.toLowerCase().includes(lowercaseQuery) ||
      item.code.toLowerCase().includes(lowercaseQuery) ||
      item.category?.toLowerCase().includes(lowercaseQuery)
  );
};