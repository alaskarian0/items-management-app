// Fixed Assets Mock Data
// Centralized dummy data for fixed assets management system

import type {
  FixedAsset,
  AssetCustody,
  AssetConsumed,
  AssetDonated,
  AssetCategory,
  AssetMovement,
  AssetMaintenance
} from '@/lib/types/fixed-assets';

// Asset Categories
export const assetCategories: AssetCategory[] = [
  {
    id: 1,
    name: "الأجهزة الإلكترونية",
    description: "أجهزة الكمبيوتر والطابعات والمعدات الإلكترونية",
    depreciationRate: 0.2,
    usefulLifeYears: 5,
    isActive: true
  },
  {
    id: 2,
    name: "الأثاث المكتبي",
    description: "المكاتب والكراسي وخزائن الملفات",
    depreciationRate: 0.1,
    usefulLifeYears: 10,
    isActive: true
  },
  {
    id: 3,
    name: "المركبات",
    description: "السيارات والشاحنات والمعدات الثقيلة",
    depreciationRate: 0.15,
    usefulLifeYears: 8,
    isActive: true
  },
  {
    id: 4,
    name: "المباني والمنشآت",
    description: "المباني والمكاتب والمستودعات",
    depreciationRate: 0.05,
    usefulLifeYears: 25,
    isActive: true
  },
  {
    id: 5,
    name: "الأجهزة المكتبية",
    description: "الهواتف والفاكس机和 أجهزة الاتصال",
    depreciationRate: 0.25,
    usefulLifeYears: 4,
    isActive: true
  }
];

// Fixed Assets
export const fixedAssets: FixedAsset[] = [
  // Electronics
  {
    id: 1,
    assetCode: "FA-ELC-001",
    name: "جهاز حاسوب محمول HP",
    description: "حاسوب محمول من نوع HP EliteBook",
    category: "الأجهزة الإلكترونية",
    serialNumber: "SN-HP-2024-001",
    barcode: "BC-ELC-001-2024",
    purchaseDate: new Date("2024-01-15"),
    purchaseValue: 1500000,
    currentValue: 1200000,
    depreciation: 300000,
    location: "قسم تقنية المعلومات",
    department: "قسم الشؤون الهندسية",
    division: "شعبة الهندسة الكهربائية",
    unit: "وحدة أنظمة التحكم",
    responsiblePerson: "م. أحمد محمد",
    condition: "excellent",
    status: "active",
    warranty: new Date("2026-01-15"),
    supplier: "شركة التقنية المتقدمة",
    notes: "جهاز حديث للاستخدام الهندسي",
    images: [],
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z"
  },
  {
    id: 2,
    assetCode: "FA-ELC-002",
    name: "طابعة ليزر Canon",
    description: "طابعة ليزر متعددة الوظائف",
    category: "الأجهزة الإلكترونية",
    serialNumber: "SN-CN-2024-002",
    barcode: "BC-ELC-002-2024",
    purchaseDate: new Date("2024-02-01"),
    purchaseValue: 350000,
    currentValue: 280000,
    depreciation: 70000,
    location: "قسم السكرتارية",
    department: "قسم الشؤون الإدارية",
    division: "شعبة الشؤون الإدارية",
    unit: "وحدة الموارد البشرية",
    responsiblePerson: "فاطمة علي",
    condition: "good",
    status: "active",
    warranty: new Date("2026-02-01"),
    supplier: "شركة الأوائل للأجهزة الكهربائية",
    notes: "طابعة للكتيبات والتقارير",
    images: [],
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2024-02-01T00:00:00Z"
  },
  // Office Furniture
  {
    id: 3,
    assetCode: "FA-FUR-001",
    name: "مكتب تنفيذي خشبي",
    description: "مكتب خشبي فاخر مع درج",
    category: "الأثاث المكتبي",
    serialNumber: "SN-FUR-2024-001",
    barcode: "BC-FUR-001-2024",
    purchaseDate: new Date("2024-01-20"),
    purchaseValue: 450000,
    currentValue: 405000,
    depreciation: 45000,
    location: "غرفة المدير العام",
    department: "قسم الشؤون الإدارية",
    division: "شعبة الشؤون الإدارية",
    responsiblePerson: "علي حسن",
    condition: "excellent",
    status: "active",
    warranty: new Date("2029-01-20"),
    supplier: "شركة النبلاء للأثاث",
    notes: "مكتب مدير عام القسم",
    images: [],
    createdAt: "2024-01-20T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z"
  },
  {
    id: 4,
    assetCode: "FA-FUR-002",
    name: "كرسي مكتب مريح",
    description: "كرسي مكتب متحرك مع دعامة للظهر",
    category: "الأثاث المكتبي",
    barcode: "BC-FUR-002-2024",
    purchaseDate: new Date("2024-03-10"),
    purchaseValue: 85000,
    currentValue: 76500,
    depreciation: 8500,
    location: "قسم المحاسبة",
    department: "قسم الشؤون الإدارية",
    division: "شعبة الشؤون المالية",
    unit: "وحدة الحسابات العامة",
    responsiblePerson: "سارة أحمد",
    condition: "good",
    status: "active",
    warranty: new Date("2029-03-10"),
    supplier: "شركة النبلاء للأثاث",
    notes: "كرسي محاسب",
    images: [],
    createdAt: "2024-03-10T00:00:00Z",
    updatedAt: "2024-03-10T00:00:00Z"
  },
  // Vehicles
  {
    id: 5,
    assetCode: "FA-VEH-001",
    name: "سيارة ملازمات Toyota Camry",
    description: "سيارة ملازمات للإدارات العليا",
    category: "المركبات",
    serialNumber: "VIN-TOY-2024-001",
    barcode: "BC-VEH-001-2024",
    purchaseDate: new Date("2024-04-05"),
    purchaseValue: 28000000,
    currentValue: 23800000,
    depreciation: 4200000,
    location: "الموقف المركزي",
    department: "قسم الشؤون الإدارية",
    division: "شعبة الشؤون الإدارية",
    unit: "وحدة النقل والمواصلات",
    responsiblePerson: "محمد صالح",
    condition: "excellent",
    status: "active",
    warranty: new Date("2032-04-05"),
    supplier: "وكالة Toyota",
    notes: "سيارة مدير عام",
    images: [],
    createdAt: "2024-04-05T00:00:00Z",
    updatedAt: "2024-04-05T00:00:00Z"
  }
];

// Asset Custodies
export const assetCustodies: AssetCustody[] = [
  {
    id: 1,
    assetId: 1,
    custodyNumber: "CUST-2024-001",
    employeeId: 1001,
    employeeName: "م. أحمد محمد",
    department: "قسم الشؤون الهندسية",
    position: "مهندس أنظمة تحكم",
    startDate: new Date("2024-01-20"),
    condition: "ممتازة",
    notes: "موكلة للمهام الهندسية",
    status: "active"
  },
  {
    id: 2,
    assetId: 2,
    custodyNumber: "CUST-2024-002",
    employeeId: 1002,
    employeeName: "فاطمة علي",
    department: "قسم الشؤون الإدارية",
    position: "سكرتيرة",
    startDate: new Date("2024-02-05"),
    condition: "جيدة",
    notes: "موكلة للعمل الإداري",
    status: "active"
  },
  {
    id: 3,
    assetId: 5,
    custodyNumber: "CUST-2024-003",
    employeeId: 1003,
    employeeName: "محمد صالح",
    department: "قسم الشؤون الإدارية",
    position: "سائق",
    startDate: new Date("2024-04-10"),
    condition: "ممتازة",
    notes: "موكلة للنقل الإداري",
    status: "active"
  }
];

// Asset Consumed
export const assetConsumed: AssetConsumed[] = [
  {
    id: 1,
    assetId: 6,
    asset: {} as FixedAsset, // Would be populated with actual asset
    consumptionDate: new Date("2024-11-15"),
    consumptionReason: "عطل فني لا يمكن إصلاحه",
    consumptionMethod: "damage",
    estimatedValue: 120000,
    approvedBy: 1,
    approvedAt: new Date("2024-11-16"),
    notes: "تلف كامل للجهاز",
    status: "approved"
  },
  {
    id: 2,
    assetId: 7,
    asset: {} as FixedAsset,
    consumptionDate: new Date("2024-10-20"),
    consumptionReason: "انتهاء العمر الافتراضي",
    consumptionMethod: "end-of-life",
    estimatedValue: 50000,
    approvedBy: 1,
    approvedAt: new Date("2024-10-21"),
    notes: "جهاز قديم لم يعد يعمل",
    status: "approved"
  }
];

// Asset Donated
export const assetDonated: AssetDonated[] = [
  {
    id: 1,
    assetId: 8,
    asset: {} as FixedAsset,
    donationDate: new Date("2024-09-10"),
    donatedTo: "جمعية الخيرية المحلية",
    donationType: "organization",
    donationReason: "تصدق للمجتمع المحلي",
    fairMarketValue: 75000,
    approvedBy: 1,
    approvedAt: new Date("2024-09-11"),
    receiptNumber: "DON-2024-001",
    notes: "أجهزة ما زالت صالحة للاستخدام",
    status: "completed"
  },
  {
    id: 2,
    assetId: 9,
    asset: {} as FixedAsset,
    donationDate: new Date("2024-08-15"),
    donatedTo: "مدرسة الأمل الابتدائية",
    donationType: "government",
    donationReason: "دعم القطاع التعليمي",
    fairMarketValue: 120000,
    approvedBy: 1,
    approvedAt: new Date("2024-08-16"),
    receiptNumber: "DON-2024-002",
    notes: "أثاث مكتبي للمدرسة",
    status: "completed"
  }
];

// Asset Movements
export const assetMovements: AssetMovement[] = [
  {
    id: 1,
    assetId: 1,
    movementType: 'custody-assignment',
    fromPerson: 'قسم تقنية المعلومات',
    toPerson: 'م. أحمد محمد',
    movementDate: new Date("2024-01-20"),
    reason: "تسليم الجهاز للمهندس المسؤول",
    approvedBy: 1,
    notes: "تم التسليم بعد التسجيل"
  },
  {
    id: 2,
    assetId: 2,
    movementType: 'transfer',
    fromLocation: 'قسم تقنية المعلومات',
    toLocation: 'قسم السكرتارية',
    movementDate: new Date("2024-02-01"),
    reason: "نقل الطابعة للسكرتارية",
    approvedBy: 1,
    notes: "نقل داخلي حسب الحاجة"
  }
];

// Asset Maintenance Records
export const assetMaintenance: AssetMaintenance[] = [
  {
    id: 1,
    assetId: 1,
    maintenanceType: 'preventive',
    description: "صيانة دورية للجهاز",
    startDate: new Date("2024-06-15"),
    endDate: new Date("2024-06-15"),
    cost: 25000,
    vendor: "شركة التقنية المتقدمة",
    performedBy: "فني الصيانة",
    status: 'completed',
    notes: "صيانة دورية ربع سنوية"
  }
];

// Utility Functions
export const getAssetByCode = (code: string): FixedAsset | undefined => {
  return fixedAssets.find(asset => asset.assetCode === code);
};

export const getAssetById = (id: number): FixedAsset | undefined => {
  return fixedAssets.find(asset => asset.id === id);
};

export const getAssetsByCategory = (category: string): FixedAsset[] => {
  return fixedAssets.filter(asset => asset.category === category);
};

export const getAssetsByDepartment = (department: string): FixedAsset[] => {
  return fixedAssets.filter(asset => asset.department === department);
};

export const getActiveAssets = (): FixedAsset[] => {
  return fixedAssets.filter(asset => asset.status === 'active');
};

export const searchAssets = (query: string): FixedAsset[] => {
  const lowercaseQuery = query.toLowerCase();
  return fixedAssets.filter(
    (asset) =>
      asset.name.toLowerCase().includes(lowercaseQuery) ||
      asset.assetCode.toLowerCase().includes(lowercaseQuery) ||
      asset.serialNumber?.toLowerCase().includes(lowercaseQuery) ||
      asset.barcode?.toLowerCase().includes(lowercaseQuery) ||
      asset.description?.toLowerCase().includes(lowercaseQuery)
  );
};

export const getAssetCustody = (assetId: number): AssetCustody | undefined => {
  return assetCustodies.find(custody => custody.assetId === assetId && custody.status === 'active');
};

export const getCustodiesByEmployee = (employeeName: string): AssetCustody[] => {
  return assetCustodies.filter(custody => custody.employeeName === employeeName && custody.status === 'active');
};

// Statistics
export const getAssetStats = () => {
  const totalAssets = fixedAssets.length;
  const totalValue = fixedAssets.reduce((sum, asset) => sum + asset.purchaseValue, 0);
  const depreciatedValue = fixedAssets.reduce((sum, asset) => sum + (asset.depreciation || 0), 0);
  const activeAssets = fixedAssets.filter(asset => asset.status === 'active').length;
  const assetsWithBarcode = fixedAssets.filter(asset => asset.barcode).length;
  const assetsWithWarranty = fixedAssets.filter(asset => asset.warranty && asset.warranty > new Date()).length;

  return {
    totalAssets,
    totalValue,
    depreciatedValue,
    activeAssets,
    assetsWithBarcode,
    assetsWithWarranty
  };
};