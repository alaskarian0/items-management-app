// Warehouse Mock Data
// Centralized dummy data for warehouse management system

import type {
  Department,
  Division,
  Unit,
  BasicSupplier,
  Customer,
  Warehouse,
  Item,
  StockItem,
  ItemMovement,
  WarehouseStore,
  WarehouseDocument,
  DocumentItem,
  IssuanceFormData
} from '@/lib/types/warehouse';

export type { DocumentItem, IssuanceFormData };

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
export const suppliers: BasicSupplier[] = [
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
    isActive: true,
    level: 0,
    itemCount: 500,
    children: [
      {
        id: 2,
        name: "مخزن المواد الكهربائية",
        code: "WH-002",
        address: "منطقة المنصور",
        isActive: true,
        level: 1,
        itemCount: 150,
        children: [
          {
            id: 6,
            name: "مخزن الكابلات والأسلاك",
            code: "WH-006",
            address: "الطابق الأول",
            isActive: true,
            level: 2,
            itemCount: 45,
            children: []
          },
          {
            id: 7,
            name: "مخزن المعدات الإلكترونية",
            code: "WH-007",
            address: "الطابق الثاني",
            isActive: true,
            level: 2,
            itemCount: 38,
            children: []
          }
        ]
      },
      {
        id: 3,
        name: "مخزن الأثاث والمعدات",
        code: "WH-003",
        address: "منطقة الكرادة",
        isActive: true,
        level: 1,
        itemCount: 200,
        children: [
          {
            id: 8,
            name: "مخزن المكاتب والكراسي",
            code: "WH-008",
            address: "الجناح الشرقي",
            isActive: true,
            level: 2,
            itemCount: 85,
            children: []
          }
        ]
      }
    ]
  },
  {
    id: 4,
    name: "مخزن المواد الميكانيكية",
    code: "WH-004",
    address: "منطقة الجادرية",
    isActive: true,
    level: 0,
    itemCount: 300,
    children: [
      {
        id: 9,
        name: "مخزن المحركات والمضخات",
        code: "WH-009",
        address: "المبنى A",
        isActive: true,
        level: 1,
        itemCount: 120,
        children: []
      }
    ]
  }
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
  {
    id: 6,
    itemCode: "STA-PAP-001",
    itemName: "ورق A4",
    movementType: "إدخال",
    quantity: 50,
    balance: 150,
    referenceNumber: "ENT-2024-003",
    date: "2024-01-25",
    department: "قسم الشؤون الإدارية",
    supplier: "شركة النبلاء للمواد المكتبي",
    notes: "توريد ورق طباعة"
  },
  {
    id: 7,
    itemCode: "ELE-AC-001",
    itemName: "مكيف هواء 1.5 طن",
    movementType: "إدخال",
    quantity: 5,
    balance: 15,
    referenceNumber: "ENT-2024-004",
    date: "2024-01-28",
    department: "قسم التشغيل والصيانة",
    supplier: "شركة الأوائل للأجهزة الكهربائية",
    notes: "مكيفات للمكاتب الجديدة"
  },
  {
    id: 8,
    itemCode: "TL-SCW-001",
    itemName: "طقم مفكات",
    movementType: "إدخال",
    quantity: 10,
    balance: 12,
    referenceNumber: "ENT-2024-005",
    date: "2024-02-01",
    department: "قسم التشغيل والصيانة",
    supplier: "مؤسسة العراق للتجارة العامة",
    notes: "أدوات صيانة جديدة"
  },
  {
    id: 9,
    itemCode: "FUR-DSK-001",
    itemName: "مكتب عمل",
    movementType: "إدخال",
    quantity: 15,
    balance: 25,
    referenceNumber: "ENT-2024-006",
    date: "2024-02-05",
    department: "قسم الشؤون الإدارية",
    supplier: "موردون متحدون للأثاث",
    notes: "مكاتب للموظفين الجدد"
  },
  {
    id: 10,
    itemCode: "ELE-WIR-001",
    itemName: "أسلاك كهربائية 2.5 ملم",
    movementType: "إدخال",
    quantity: 1000,
    balance: 5000,
    referenceNumber: "ENT-2024-007",
    date: "2024-02-08",
    department: "قسم الشؤون الهندسية",
    supplier: "شركة الأوائل للأجهزة الكهربائية",
    notes: "أسلاك لمشاريع الصيانة"
  },
  {
    id: 11,
    itemCode: "CLN-MOP-001",
    itemName: "ممسحة أرضيات",
    movementType: "إدخال",
    quantity: 12,
    balance: 20,
    referenceNumber: "ENT-2024-008",
    date: "2024-02-10",
    department: "قسم التشغيل والصيانة",
    supplier: "مؤسسة العراق للتجارة العامة",
    notes: "أدوات نظافة"
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
  {
    id: 12,
    itemCode: "FUR-CHR-001",
    itemName: "كرسي مكتب تنفيذي",
    movementType: "إصدار",
    quantity: 8,
    balance: 42,
    referenceNumber: "ISS-2024-004",
    date: "2024-01-26",
    department: "قسم الشؤون الإدارية",
    recipient: "أ. سارة أحمد",
    notes: "كراسي لمكتب المدير"
  },
  {
    id: 13,
    itemCode: "STA-PEN-001",
    itemName: "قلم حبر جاف",
    movementType: "إصدار",
    quantity: 100,
    balance: 400,
    referenceNumber: "ISS-2024-005",
    date: "2024-01-29",
    department: "قسم الشؤون الإدارية",
    recipient: "السكرتارية",
    notes: "أقلام للموظفين"
  },
  {
    id: 14,
    itemCode: "ELE-LMP-001",
    itemName: "لمبة LED 100 واط",
    movementType: "إصدار",
    quantity: 50,
    balance: 150,
    referenceNumber: "ISS-2024-006",
    date: "2024-02-02",
    department: "قسم التشغيل والصيانة",
    recipient: "م. علي حسين",
    notes: "استبدال لمبات المبنى الإداري"
  },
  {
    id: 15,
    itemCode: "STA-PAP-001",
    itemName: "ورق A4",
    movementType: "إصدار",
    quantity: 20,
    balance: 130,
    referenceNumber: "ISS-2024-007",
    date: "2024-02-06",
    department: "قسم الشؤون الهندسية",
    recipient: "م. خالد عباس",
    notes: "ورق للطباعة"
  },
  {
    id: 16,
    itemCode: "TL-HMR-001",
    itemName: "مطرقة يدوية",
    movementType: "إصدار",
    quantity: 5,
    balance: 20,
    referenceNumber: "ISS-2024-008",
    date: "2024-02-09",
    department: "قسم التشغيل والصيانة",
    recipient: "فريق الصيانة",
    notes: "أدوات للصيانة الدورية"
  },
  {
    id: 17,
    itemCode: "CLN-GLV-001",
    itemName: "قفازات نظافة",
    movementType: "إصدار",
    quantity: 30,
    balance: 70,
    referenceNumber: "ISS-2024-009",
    date: "2024-02-11",
    department: "قسم التشغيل والصيانة",
    recipient: "عمال النظافة",
    notes: "قفازات شهرية"
  },
  {
    id: 18,
    itemCode: "STA-NBK-001",
    itemName: "دفتر ملاحظات",
    movementType: "إصدار",
    quantity: 50,
    balance: 250,
    referenceNumber: "ISS-2024-010",
    date: "2024-02-12",
    department: "قسم الشؤون الإدارية",
    recipient: "جميع الأقسام",
    notes: "دفاتر للموظفين"
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

// Warehouse Documents (Combined Entry and Issuance records)
export const warehouseDocuments: WarehouseDocument[] = [
  {
    id: 1,
    docNumber: "إدخ-2024-001",
    type: "entry",
    date: "2024-01-15",
    warehouseId: 1,
    warehouseName: "المخزن الرئيسي",
    departmentId: 1,
    departmentName: "قسم الشؤون الهندسية",
    divisionId: 1,
    divisionName: "شعبة الهندسة المدنية",
    supplierId: 1,
    supplierName: "شركة النبلاء للمواد المكتبي",
    entryType: "purchases",
    itemCount: 5,
    totalValue: 1250000,
    notes: "إدخال كراسي ومكاتب جديدة",
    status: "approved",
    createdAt: "2024-01-15T09:30:00",
    updatedAt: "2024-01-15T10:15:00"
  },
  {
    id: 2,
    docNumber: "صرف-2024-001",
    type: "issuance",
    date: "2024-01-22",
    warehouseId: 1,
    warehouseName: "المخزن الرئيسي",
    departmentId: 1,
    departmentName: "قسم الشؤون الهندسية",
    divisionId: 2,
    divisionName: "شعبة الهندسة الكهربائية",
    unitId: 3,
    unitName: "وحدة الصيانة الكهربائية",
    recipientName: "م. أحمد محمد",
    itemCount: 3,
    totalValue: 520000,
    notes: "توزيع طاولات لغرفة الاجتماعات",
    status: "approved",
    createdAt: "2024-01-22T11:00:00",
    updatedAt: "2024-01-22T11:30:00"
  },
  {
    id: 3,
    docNumber: "إدخ-2024-002",
    type: "entry",
    date: "2024-01-20",
    warehouseId: 2,
    warehouseName: "مخزن المواد الكهربائية",
    departmentId: 3,
    departmentName: "قسم التشغيل والصيانة",
    supplierId: 3,
    supplierName: "شركة الأوائل للأجهزة الكهربائية",
    entryType: "purchases",
    itemCount: 3,
    totalValue: 2250000,
    notes: "توريد مولدات للطوارئ",
    status: "approved",
    createdAt: "2024-01-20T08:00:00",
    updatedAt: "2024-01-20T09:00:00"
  },
  {
    id: 4,
    docNumber: "صرف-2024-002",
    type: "issuance",
    date: "2024-01-23",
    warehouseId: 1,
    warehouseName: "المخزن الرئيسي",
    departmentId: 2,
    departmentName: "قسم الشؤون الإدارية",
    divisionId: 4,
    divisionName: "شعبة الشؤون الإدارية",
    unitId: 6,
    unitName: "وحدة الموارد البشرية",
    recipientName: "السكرتارية",
    itemCount: 15,
    totalValue: 825000,
    notes: "طلب من قسم المحاسبة - حبر طابعة",
    status: "approved",
    createdAt: "2024-01-23T10:00:00",
    updatedAt: "2024-01-23T10:45:00"
  },
  {
    id: 5,
    docNumber: "إدخ-2024-003",
    type: "entry",
    date: "2024-02-01",
    warehouseId: 1,
    warehouseName: "المخزن الرئيسي",
    departmentId: 2,
    departmentName: "قسم الشؤون الإدارية",
    supplierId: 5,
    supplierName: "شركة النور للمعدات المكتبية",
    entryType: "gifts",
    itemCount: 10,
    totalValue: 350000,
    notes: "هدية من الوزارة - مواد مكتبية",
    status: "approved",
    createdAt: "2024-02-01T12:00:00",
    updatedAt: "2024-02-01T13:00:00"
  },
  {
    id: 6,
    docNumber: "صرف-2024-003",
    type: "issuance",
    date: "2024-01-24",
    warehouseId: 3,
    warehouseName: "مخزن الأثاث والمعدات",
    departmentId: 3,
    departmentName: "قسم التشغيل والصيانة",
    divisionId: 7,
    divisionName: "شعبة الصيانة",
    unitId: 8,
    unitName: "وحدة الصيانة العامة",
    recipientName: "علي حسن",
    itemCount: 10,
    totalValue: 85000,
    notes: "للنظافة اليومية",
    status: "approved",
    createdAt: "2024-01-24T14:00:00",
    updatedAt: "2024-01-24T14:30:00"
  },
  {
    id: 7,
    docNumber: "إدخ-2024-004",
    type: "entry",
    date: "2024-02-05",
    warehouseId: 3,
    warehouseName: "مخزن الأثاث والمعدات",
    departmentId: 1,
    departmentName: "قسم الشؤون الهندسية",
    supplierId: 2,
    supplierName: "موردون متحدون للأثاث",
    entryType: "purchases",
    itemCount: 8,
    totalValue: 1800000,
    notes: "شراء أثاث جديد للمكاتب",
    status: "draft",
    createdAt: "2024-02-05T09:00:00",
    updatedAt: "2024-02-05T09:00:00"
  },
  {
    id: 8,
    docNumber: "صرف-2024-004",
    type: "issuance",
    date: "2024-02-06",
    warehouseId: 1,
    warehouseName: "المخزن الرئيسي",
    departmentId: 1,
    departmentName: "قسم الشؤون الهندسية",
    divisionId: 3,
    divisionName: "شعبة الهندسة الميكانيكية",
    unitId: 4,
    unitName: "وحدة الصيانة الميكانيكية",
    recipientName: "م. خالد أحمد",
    itemCount: 4,
    totalValue: 120000,
    notes: "أدوات صيانة",
    status: "draft",
    createdAt: "2024-02-06T11:00:00",
    updatedAt: "2024-02-06T11:00:00"
  },
  {
    id: 9,
    docNumber: "إدخ-2024-005",
    type: "entry",
    date: "2024-02-10",
    warehouseId: 2,
    warehouseName: "مخزن المواد الكهربائية",
    departmentId: 3,
    departmentName: "قسم التشغيل والصيانة",
    supplierId: 3,
    supplierName: "شركة الأوائل للأجهزة الكهربائية",
    entryType: "returns",
    itemCount: 2,
    totalValue: 95000,
    notes: "ارجاع مواد كهربائية معيبة واستبدالها",
    status: "approved",
    createdAt: "2024-02-10T10:00:00",
    updatedAt: "2024-02-10T11:00:00"
  },
  {
    id: 10,
    docNumber: "صرف-2024-005",
    type: "issuance",
    date: "2024-02-12",
    warehouseId: 4,
    warehouseName: "مخزن المواد الميكانيكية",
    departmentId: 3,
    departmentName: "قسم التشغيل والصيانة",
    divisionId: 6,
    divisionName: "شعبة التشغيل",
    unitId: 7,
    unitName: "وحدة التشغيل",
    recipientName: "م. حسين علي",
    itemCount: 6,
    totalValue: 450000,
    notes: "معدات للصيانة الدورية",
    status: "approved",
    createdAt: "2024-02-12T13:00:00",
    updatedAt: "2024-02-12T13:45:00"
  },
  {
    id: 11,
    docNumber: "إدخ-2024-006",
    type: "entry",
    date: "2024-02-15",
    warehouseId: 1,
    warehouseName: "المخزن الرئيسي",
    departmentId: 2,
    departmentName: "قسم الشؤون الإدارية",
    divisionId: 4,
    divisionName: "شعبة الشؤون الإدارية",
    supplierId: 1,
    supplierName: "شركة النبلاء للمواد المكتبي",
    entryType: "purchases",
    itemCount: 20,
    totalValue: 500000,
    notes: "مواد مكتبية متنوعة - أقلام ودفاتر وورق",
    status: "approved",
    createdAt: "2024-02-15T08:00:00",
    updatedAt: "2024-02-15T09:30:00"
  },
  {
    id: 12,
    docNumber: "إدخ-2024-007",
    type: "entry",
    date: "2024-02-18",
    warehouseId: 3,
    warehouseName: "مخزن الأثاث والمعدات",
    departmentId: 1,
    departmentName: "قسم الشؤون الهندسية",
    divisionId: 1,
    divisionName: "شعبة الهندسة المدنية",
    supplierId: 2,
    supplierName: "موردون متحدون للأثاث",
    entryType: "purchases",
    itemCount: 12,
    totalValue: 2100000,
    notes: "أثاث مكتبي فاخر - مكاتب وكراسي تنفيذية",
    status: "approved",
    createdAt: "2024-02-18T10:00:00",
    updatedAt: "2024-02-18T11:00:00"
  },
  {
    id: 13,
    docNumber: "صرف-2024-006",
    type: "issuance",
    date: "2024-02-20",
    warehouseId: 1,
    warehouseName: "المخزن الرئيسي",
    departmentId: 4,
    departmentName: "قسم المالية والمحاسبة",
    divisionId: 5,
    divisionName: "شعبة الشؤون المالية",
    unitId: 5,
    unitName: "وحدة الشؤون المالية",
    recipientName: "أ. فاطمة أحمد",
    itemCount: 8,
    totalValue: 320000,
    notes: "مواد مكتبية لقسم المحاسبة",
    status: "approved",
    createdAt: "2024-02-20T09:00:00",
    updatedAt: "2024-02-20T09:45:00"
  },
  {
    id: 14,
    docNumber: "إدخ-2024-008",
    type: "entry",
    date: "2024-02-22",
    warehouseId: 2,
    warehouseName: "مخزن المواد الكهربائية",
    departmentId: 3,
    departmentName: "قسم التشغيل والصيانة",
    divisionId: 2,
    divisionName: "شعبة الهندسة الكهربائية",
    supplierId: 3,
    supplierName: "شركة الأوائل للأجهزة الكهربائية",
    entryType: "purchases",
    itemCount: 50,
    totalValue: 1750000,
    notes: "كابلات وأسلاك كهربائية متنوعة",
    status: "approved",
    createdAt: "2024-02-22T07:30:00",
    updatedAt: "2024-02-22T08:15:00"
  },
  {
    id: 15,
    docNumber: "صرف-2024-007",
    type: "issuance",
    date: "2024-02-25",
    warehouseId: 2,
    warehouseName: "مخزن المواد الكهربائية",
    departmentId: 3,
    departmentName: "قسم التشغيل والصيانة",
    divisionId: 2,
    divisionName: "شعبة الهندسة الكهربائية",
    unitId: 3,
    unitName: "وحدة الصيانة الكهربائية",
    recipientName: "م. عمر حسن",
    itemCount: 15,
    totalValue: 675000,
    notes: "لوازم صيانة كهربائية عاجلة",
    status: "approved",
    createdAt: "2024-02-25T10:30:00",
    updatedAt: "2024-02-25T11:00:00"
  },
  {
    id: 16,
    docNumber: "إدخ-2024-009",
    type: "entry",
    date: "2024-02-28",
    warehouseId: 1,
    warehouseName: "المخزن الرئيسي",
    departmentId: 3,
    departmentName: "قسم التشغيل والصيانة",
    divisionId: 7,
    divisionName: "شعبة الصيانة",
    supplierId: 4,
    supplierName: "مؤسسة العراق للتجارة العامة",
    entryType: "purchases",
    itemCount: 25,
    totalValue: 425000,
    notes: "مواد نظافة وتعقيم",
    status: "approved",
    createdAt: "2024-02-28T12:00:00",
    updatedAt: "2024-02-28T13:00:00"
  },
  {
    id: 17,
    docNumber: "صرف-2024-008",
    type: "issuance",
    date: "2024-03-01",
    warehouseId: 1,
    warehouseName: "المخزن الرئيسي",
    departmentId: 1,
    departmentName: "قسم الشؤون الهندسية",
    divisionId: 3,
    divisionName: "شعبة الهندسة الميكانيكية",
    unitId: 4,
    unitName: "وحدة الصيانة الميكانيكية",
    recipientName: "م. سعد علي",
    itemCount: 7,
    totalValue: 385000,
    notes: "أدوات وعدد يدوية",
    status: "approved",
    createdAt: "2024-03-01T08:00:00",
    updatedAt: "2024-03-01T08:45:00"
  },
  {
    id: 18,
    docNumber: "إدخ-2024-010",
    type: "entry",
    date: "2024-03-05",
    warehouseId: 3,
    warehouseName: "مخزن الأثاث والمعدات",
    departmentId: 2,
    departmentName: "قسم الشؤون الإدارية",
    supplierId: 5,
    supplierName: "شركة النور للمعدات المكتبية",
    entryType: "gifts",
    itemCount: 30,
    totalValue: 950000,
    notes: "هدية من محافظة بغداد - أجهزة حاسوب",
    status: "approved",
    createdAt: "2024-03-05T14:00:00",
    updatedAt: "2024-03-05T15:30:00"
  },
  {
    id: 19,
    docNumber: "صرف-2024-009",
    type: "issuance",
    date: "2024-03-08",
    warehouseId: 3,
    warehouseName: "مخزن الأثاث والمعدات",
    departmentId: 2,
    departmentName: "قسم الشؤون الإدارية",
    divisionId: 4,
    divisionName: "شعبة الشؤون الإدارية",
    unitId: 6,
    unitName: "وحدة الموارد البشرية",
    recipientName: "أ. زينب محمد",
    itemCount: 10,
    totalValue: 720000,
    notes: "أثاث لمكاتب الموظفين الجدد",
    status: "draft",
    createdAt: "2024-03-08T11:00:00",
    updatedAt: "2024-03-08T11:00:00"
  },
  {
    id: 20,
    docNumber: "إدخ-2024-011",
    type: "entry",
    date: "2024-03-10",
    warehouseId: 4,
    warehouseName: "مخزن المواد الميكانيكية",
    departmentId: 3,
    departmentName: "قسم التشغيل والصيانة",
    divisionId: 3,
    divisionName: "شعبة الهندسة الميكانيكية",
    supplierId: 4,
    supplierName: "مؤسسة العراق للتجارة العامة",
    entryType: "purchases",
    itemCount: 15,
    totalValue: 1350000,
    notes: "قطع غيار ومعدات ميكانيكية",
    status: "draft",
    createdAt: "2024-03-10T09:00:00",
    updatedAt: "2024-03-10T09:00:00"
  },
  {
    id: 21,
    docNumber: "صرف-2024-010",
    type: "issuance",
    date: "2024-03-12",
    warehouseId: 1,
    warehouseName: "المخزن الرئيسي",
    departmentId: 3,
    departmentName: "قسم التشغيل والصيانة",
    divisionId: 7,
    divisionName: "شعبة الصيانة",
    unitId: 8,
    unitName: "وحدة الصيانة العامة",
    recipientName: "حسن عباس",
    itemCount: 20,
    totalValue: 180000,
    notes: "مواد نظافة شهرية",
    status: "approved",
    createdAt: "2024-03-12T10:00:00",
    updatedAt: "2024-03-12T10:30:00"
  },
  {
    id: 22,
    docNumber: "إدخ-2024-012",
    type: "entry",
    date: "2024-03-15",
    warehouseId: 1,
    warehouseName: "المخزن الرئيسي",
    departmentId: 1,
    departmentName: "قسم الشؤون الهندسية",
    divisionId: 2,
    divisionName: "شعبة الهندسة الكهربائية",
    supplierId: 3,
    supplierName: "شركة الأوائل للأجهزة الكهربائية",
    entryType: "returns",
    itemCount: 5,
    totalValue: 275000,
    notes: "استبدال مكيفات معيبة",
    status: "approved",
    createdAt: "2024-03-15T13:00:00",
    updatedAt: "2024-03-15T14:00:00"
  },
  {
    id: 23,
    docNumber: "صرف-2024-011",
    type: "issuance",
    date: "2024-03-18",
    warehouseId: 4,
    warehouseName: "مخزن المواد الميكانيكية",
    departmentId: 3,
    departmentName: "قسم التشغيل والصيانة",
    divisionId: 6,
    divisionName: "شعبة التشغيل",
    unitId: 7,
    unitName: "وحدة التشغيل",
    recipientName: "م. كريم جاسم",
    itemCount: 12,
    totalValue: 890000,
    notes: "معدات صيانة متخصصة",
    status: "approved",
    createdAt: "2024-03-18T08:30:00",
    updatedAt: "2024-03-18T09:15:00"
  },
  {
    id: 24,
    docNumber: "إدخ-2024-013",
    type: "entry",
    date: "2024-03-20",
    warehouseId: 2,
    warehouseName: "مخزن المواد الكهربائية",
    departmentId: 3,
    departmentName: "قسم التشغيل والصيانة",
    supplierId: 3,
    supplierName: "شركة الأوائل للأجهزة الكهربائية",
    entryType: "purchases",
    itemCount: 100,
    totalValue: 3200000,
    notes: "لمبات LED ومصابيح متنوعة",
    status: "approved",
    createdAt: "2024-03-20T10:00:00",
    updatedAt: "2024-03-20T11:30:00"
  },
  {
    id: 25,
    docNumber: "صرف-2024-012",
    type: "issuance",
    date: "2024-03-22",
    warehouseId: 1,
    warehouseName: "المخزن الرئيسي",
    departmentId: 2,
    departmentName: "قسم الشؤون الإدارية",
    divisionId: 4,
    divisionName: "شعبة الشؤون الإدارية",
    unitId: 6,
    unitName: "وحدة الموارد البشرية",
    recipientName: "أ. ليلى حسين",
    itemCount: 25,
    totalValue: 625000,
    notes: "مواد مكتبية للموظفين",
    status: "draft",
    createdAt: "2024-03-22T14:00:00",
    updatedAt: "2024-03-22T14:00:00"
  }
];

// Document status options
export const documentStatusOptions = [
  { value: "all", label: "جميع الحالات" },
  { value: "draft", label: "مسودة" },
  { value: "approved", label: "معتمد" },
  { value: "cancelled", label: "ملغي" }
];

// Document type options
export const documentTypeOptions = [
  { value: "all", label: "جميع الأنواع" },
  { value: "entry", label: "إدخال" },
  { value: "issuance", label: "إصدار" }
];