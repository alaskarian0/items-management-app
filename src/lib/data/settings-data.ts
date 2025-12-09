// Settings Mock Data
// Centralized dummy data for system settings

import type {
  Supplier,
  MeasurementUnit,
  SystemUser,
  UserRole,
  Permission,
  SystemSetting,
  ReportConfig,
  ActivityLog,
  NotificationTemplate,
  Department,
  Division,
  Unit
} from '@/lib/types/settings';

// Suppliers
export const suppliers: Supplier[] = [
  {
    id: 1,
    code: "SUP-001",
    name: "شركة النبلاء للمواد المكتبي",
    description: "متخصصة في توريد الأثاث والمعدات المكتبي عالية الجودة",
    contactPerson: "علي حسن",
    phone: "+9647701234567",
    email: "info@alnobala.iq",
    address: "بغداد، شارع فلسطين، بناء رقم 15",
    website: "www.alnobala.iq",
    taxNumber: "1001234567",
    commercialNumber: "123456",
    bankAccount: "1234567890",
    bankName: "الرافدين",
    category: "الأثاث والمعدات المكتبي",
    rating: 5,
    isActive: true,
    notes: "مورد موثوق ويقدم جودة عالية",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 2,
    code: "SUP-002",
    name: "موردون متحدون للأجهزة الكهربائية",
    description: "توريد وبيع الأجهزة الكهربائية والإلكترونيات",
    contactPerson: "محمد أحمد",
    phone: "+9647702345678",
    email: "sales@unitedsuppliers.iq",
    address: "بغداد، المنصور، مجمع الموردين",
    website: "www.unitedsuppliers.iq",
    taxNumber: "1001234568",
    commercialNumber: "123457",
    bankAccount: "0987654321",
    bankName: "بنك بغداد",
    category: "تكنولوجيا المعلومات",
    rating: 4,
    isActive: true,
    notes: "يقدم أسعار تنافسية",
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z"
  },
  {
    id: 3,
    code: "SUP-003",
    name: "شركة التقنية المتقدمة",
    description: "متخصصة في حلول تكنولوجيا المعلومات والشبكات",
    contactPerson: "خالد محمود",
    phone: "+9647703456789",
    email: "info@advancedtech.iq",
    address: "أربيل، المنطقة الصناعية",
    website: "www.advancedtech.iq",
    taxNumber: "1001234569",
    commercialNumber: "123458",
    bankAccount: "1357924680",
    bankName: "الرافدين",
    category: "تكنولوجيا المعلومات",
    rating: 5,
    isActive: true,
    notes: "شريك استراتيجي للمشاريع التقنية",
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2024-02-01T00:00:00Z"
  },
  {
    id: 4,
    code: "SUP-004",
    name: "منظمة الهلال الأحمر العراقية",
    description: "منظمة إنسانية توفر المساعدات والمواد",
    contactPerson: "سارة أحمد",
    phone: "+9647704567890",
    email: "donations@redcrescent.iq",
    address: "بغداد، المنصور",
    website: "www.redcrescent.iq",
    category: "الخدمات",
    rating: 5,
    isActive: true,
    notes: "منظمة خيرية تقدم تبرعات للمؤسسات",
    createdAt: "2024-02-10T00:00:00Z",
    updatedAt: "2024-02-10T00:00:00Z"
  },
  {
    id: 5,
    code: "SUP-005",
    name: "مؤسسة العراق للتجارة العامة",
    description: "مؤسسة تجارية كبرى تختلف أنواع المواد",
    contactPerson: "عبد الله محمد",
    phone: "+9647705678901",
    email: "sales@iraqtrade.iq",
    address: "بغداد، ساحة النخيل",
    website: "www.iraqtrade.iq",
    taxNumber: "1001234570",
    commercialNumber: "123459",
    bankAccount: "2468135790",
    bankName: "بنك بغداد",
    category: "المواد الخام",
    rating: 3,
    isActive: false,
    notes: "متوقف مؤقتاً عن التعامل",
    createdAt: "2024-01-20T00:00:00Z",
    updatedAt: "2024-03-01T00:00:00Z"
  }
];

// Measurement Units
export const measurementUnits: MeasurementUnit[] = [
  {
    id: 1,
    code: "PCS",
    name: "قطعة",
    nameEnglish: "Piece",
    abbreviation: "قطعة",
    abbreviationEnglish: "PCS",
    type: "count",
    isActive: true,
    description: "وحدة عد للمواد المنفردة",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 2,
    code: "BOX",
    name: "صندوق",
    nameEnglish: "Box",
    abbreviation: "صندوق",
    abbreviationEnglish: "BOX",
    type: "count",
    baseUnit: "PCS",
    conversionFactor: 12,
    isActive: true,
    description: "صندوق يحتوي على 12 قطعة",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 3,
    code: "KG",
    name: "كيلوغرام",
    nameEnglish: "Kilogram",
    abbreviation: "كجم",
    abbreviationEnglish: "KG",
    type: "weight",
    baseUnit: "G",
    conversionFactor: 1000,
    isActive: true,
    description: "وحدة قياس للوزن",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 4,
    code: "M",
    name: "متر",
    nameEnglish: "Meter",
    abbreviation: "م",
    abbreviationEnglish: "M",
    type: "length",
    baseUnit: "CM",
    conversionFactor: 100,
    isActive: true,
    description: "وحدة قياس للطول",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 5,
    code: "M2",
    name: "متر مربع",
    nameEnglish: "Square Meter",
    abbreviation: "م²",
    abbreviationEnglish: "M2",
    type: "area",
    baseUnit: "M",
    conversionFactor: 1,
    isActive: true,
    description: "وحدة قياس للمساحة",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 6,
    code: "L",
    name: "لتر",
    nameEnglish: "Liter",
    abbreviation: "لتر",
    abbreviationEnglish: "L",
    type: "volume",
    baseUnit: "ML",
    conversionFactor: 1000,
    isActive: true,
    description: "وحدة قياس للسوائل",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 7,
    code: "HOUR",
    name: "ساعة",
    nameEnglish: "Hour",
    abbreviation: "ساعة",
    abbreviationEnglish: "HR",
    type: "time",
    baseUnit: "MIN",
    conversionFactor: 60,
    isActive: true,
    description: "وحدة قياس للوقت",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  }
];

// User Roles
export const userRoles: UserRole[] = [
  {
    id: 1,
    name: "مدير نظام",
    description: "صلاحيات كاملة على النظام",
    permissions: [
      "users.create", "users.read", "users.update", "users.delete",
      "suppliers.create", "suppliers.read", "suppliers.update", "suppliers.delete",
      "warehouses.create", "warehouses.read", "warehouses.update", "warehouses.delete",
      "reports.create", "reports.read", "reports.update", "reports.delete",
      "settings.create", "settings.read", "settings.update", "settings.delete"
    ],
    isSystem: true,
    isActive: true,
    userCount: 2,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 2,
    name: "مدير قسم",
    description: "صلاحيات إدارة القسم",
    permissions: [
      "suppliers.create", "suppliers.read", "suppliers.update",
      "warehouses.read", "warehouses.update",
      "reports.read", "reports.create"
    ],
    isSystem: false,
    isActive: true,
    userCount: 5,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 3,
    name: "مسؤول مخزن",
    description: "صلاحيات إدارة المخازن",
    permissions: [
      "warehouses.read", "warehouses.update",
      "items.create", "items.read", "items.update",
      "entry.create", "entry.read",
      "issuance.create", "issuance.read",
      "reports.read"
    ],
    isSystem: false,
    isActive: true,
    userCount: 8,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 4,
    name: "محاسب",
    description: "صلاحيات المحاسبة والتقارير المالية",
    permissions: [
      "reports.read", "reports.create",
      "financial.read", "financial.create"
    ],
    isSystem: false,
    isActive: true,
    userCount: 4,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  }
];

// System Users
export const systemUsers: SystemUser[] = [
  {
    id: 1,
    username: "admin",
    email: "admin@inventory.com",
    fullName: "مدير النظام",
    phone: "+9647701111111",
    department: "قسم تقنية المعلومات",
    division: "شعبة تطوير الأنظمة",
    unit: "وحدة إدارة النظام",
    position: "مدير نظام",
    role: "مدير نظام",
    avatar: "/avatars/admin.png",
    isActive: true,
    lastLogin: new Date("2024-12-08T09:00:00Z"),
    warehouse: "المخزن الرئيسي",
    permissions: userRoles[0].permissions,
    twoFactorEnabled: true,
    passwordChangeRequired: false,
    notes: "حساب المدير الرئيسي للنظام",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-12-08T09:00:00Z"
  },
  {
    id: 2,
    username: "warehouse_manager",
    email: "wm@inventory.com",
    fullName: "علي حسن",
    nationalId: "198001010001",
    phone: "+9647702222222",
    department: "قسم الشؤون الهندسية",
    division: "شعبة الهندسة المدنية",
    unit: "وحدة إدارة المشاريع",
    position: "مسؤول مخزن رئيسي",
    role: "مسؤول مخزن",
    avatar: "/avatars/warehouse-manager.png",
    isActive: true,
    lastLogin: new Date("2024-12-07T14:30:00Z"),
    warehouse: "المخزن الرئيسي",
    permissions: userRoles[2].permissions,
    twoFactorEnabled: false,
    passwordChangeRequired: false,
    notes: "مسؤول عن إدارة المخزن الرئيسي",
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-12-07T14:30:00Z"
  },
  {
    id: 3,
    username: "accountant",
    email: "accountant@inventory.com",
    fullName: "فاطمة علي",
    nationalId: "199002020002",
    phone: "+9647703333333",
    department: "قسم الشؤون الإدارية",
    division: "شعبة الشؤون المالية",
    position: "محاسب رئيسي",
    role: "محاسب",
    avatar: "/avatars/accountant.png",
    isActive: true,
    lastLogin: new Date("2024-12-06T11:15:00Z"),
    permissions: userRoles[3].permissions,
    twoFactorEnabled: false,
    passwordChangeRequired: false,
    notes: "مسؤولة عن الحسابات والتقارير المالية",
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2024-12-06T11:15:00Z"
  }
];

// System Settings
export const systemSettings: SystemSetting[] = [
  {
    id: 1,
    key: "company.name",
    value: "شركة إدارة المخزون",
    defaultValue: "Inventory Management Company",
    displayName: "اسم الشركة",
    description: "اسم الشركة الذي يظهر في التقارير والفواتير",
    category: "عام",
    type: "string",
    isRequired: true,
    isPublic: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 2,
    key: "company.logo",
    value: "/logo.png",
    displayName: "شعار الشركة",
    description: "شعار الشركة الذي يظهر في التقارير",
    category: "عام",
    type: "string",
    isRequired: false,
    isPublic: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 3,
    key: "warehouse.default_warehouse",
    value: 1,
    defaultValue: 1,
    displayName: "المخزن الافتراضي",
    description: "المخزن الافتراضي للعمليات",
    category: "المخازن",
    type: "number",
    isRequired: true,
    isPublic: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 4,
    key: "security.password_min_length",
    value: 8,
    defaultValue: 8,
    displayName: "الحد الأدنى لكلمة المرور",
    description: "الحد الأدنى لعدد أحرف كلمة المرور",
    category: "المستخدمين والأمان",
    type: "number",
    isRequired: true,
    isPublic: false,
    validation: { min: 6, max: 20 },
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 5,
    key: "notifications.email_enabled",
    value: true,
    defaultValue: true,
    displayName: "تفعيل إشعارات البريد الإلكتروني",
    description: "تفعيل إرسال الإشعارات عبر البريد الإلكتروني",
    category: "الإشعارات",
    type: "boolean",
    isRequired: false,
    isPublic: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  }
];

// Activity Logs
export const activityLogs: ActivityLog[] = [
  {
    id: 1,
    userId: 1,
    username: "admin",
    action: "تسجيل الدخول",
    module: "المصادقة",
    description: "تم تسجيل الدخول إلى النظام بنجاح",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    severity: "low",
    createdAt: "2024-12-08T09:00:00Z",
    updatedAt: "2024-12-08T09:00:00Z"
  },
  {
    id: 2,
    userId: 2,
    username: "warehouse_manager",
    action: "إضافة مادة",
    module: "المخازن",
    description: "تم إضافة مادة جديدة: جهاز حاسوب محمول",
    metadata: { itemCode: "LAP-001", itemName: "جهاز حاسوب محمول" },
    ipAddress: "192.168.1.101",
    severity: "medium",
    createdAt: "2024-12-07T10:30:00Z",
    updatedAt: "2024-12-07T10:30:00Z"
  }
];

// Notification Templates
export const notificationTemplates: NotificationTemplate[] = [
  {
    id: 1,
    name: "welcome_email",
    title: "مرحباً بك في نظام إدارة المخزون",
    content: "مرحباً {fullName}،\n\nنشكرك على الانضمام إلى نظام إدارة المخزون. بيانات تسجيل الدخول الخاصة بك:\nاسم المستخدم: {username}\nالبريد الإلكتروني: {email}\n\nلتسجيل الدخول لأول مرة، يرجى استخدام كلمة المرور المؤقتة: {tempPassword}.\n\nمع تحيات،\nفريق إدارة النظام",
    type: "email",
    category: "المستخدمون",
    variables: [
      { name: "fullName", description: "الاسم الكامل للمستخدم", isRequired: true },
      { name: "username", description: "اسم المستخدم", isRequired: true },
      { name: "email", description: "البريد الإلكتروني", isRequired: true },
      { name: "tempPassword", description: "كلمة المرور المؤقتة", isRequired: true }
    ],
    isActive: true,
    language: "ar",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 2,
    name: "low_stock_alert",
    title: "تنبيه انخفاض المخزون",
    content: "انخفاض مخزون للمادة: {itemName}\n\nالكود: {itemCode}\nالمخزون الحالي: {currentStock}\nالحد الأدنى: {minStock}\n\nيرجى إعادة تعبئة المخزون قريباً.",
    type: "in-app",
    category: "المخازن",
    variables: [
      { name: "itemName", description: "اسم المادة", isRequired: true },
      { name: "itemCode", description: "كود المادة", isRequired: true },
      { name: "currentStock", description: "المخزون الحالي", isRequired: true },
      { name: "minStock", description: "الحد الأدنى", isRequired: true }
    ],
    isActive: true,
    language: "ar",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  }
];

// Utility Functions
export const getSupplierByCode = (code: string): Supplier | undefined => {
  return suppliers.find(supplier => supplier.code === code);
};

export const searchSuppliers = (query: string): Supplier[] => {
  const lowercaseQuery = query.toLowerCase();
  return suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(lowercaseQuery) ||
    supplier.code.toLowerCase().includes(lowercaseQuery) ||
    supplier.contactPerson.toLowerCase().includes(lowercaseQuery) ||
    supplier.email?.toLowerCase().includes(lowercaseQuery)
  );
};

export const getActiveSuppliers = (): Supplier[] => {
  return suppliers.filter(supplier => supplier.isActive);
};

export const getMeasurementUnitsByType = (type: string): MeasurementUnit[] => {
  return measurementUnits.filter(unit => unit.type === type && unit.isActive);
};

export const getUserByUsername = (username: string): SystemUser | undefined => {
  return systemUsers.find(user => user.username === username);
};

export const getActiveUsers = (): SystemUser[] => {
  return systemUsers.filter(user => user.isActive);
};

export const getUsersByRole = (role: string): SystemUser[] => {
  return systemUsers.filter(user => user.role === role && user.isActive);
};

export const getSettingByKey = (key: string): SystemSetting | undefined => {
  return systemSettings.find(setting => setting.key === key);
};

export const getSettingsByCategory = (category: string): SystemSetting[] => {
  return systemSettings.filter(setting => setting.category === category);
};

// Supplier categories for form dropdowns
export const SUPPLIER_CATEGORIES = [
  "الأثاث والمعدات المكتبي",
  "تكنولوجيا المعلومات",
  "الخدمات",
  "المواد الخام"
];

// Departments
export const departments: Department[] = [
  {
    id: 1,
    name: "قسم الشؤون الهندسية",
    description: "مسؤول عن جميع الأعمال الهندسية والمشاريع",
    headOfDepartment: "م. أحمد محمد",
    employeeCount: 25,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 2,
    name: "قسم الشؤون الإدارية",
    description: "إدارة العمليات الإدارية اليومية",
    headOfDepartment: "علي حسن",
    employeeCount: 15,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 3,
    name: "قسم المحاسبة",
    description: "إدارة الحسابات والمعاملات المالية",
    headOfDepartment: "فاطمة علي",
    employeeCount: 12,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 4,
    name: "قسم تقنية المعلومات",
    description: "صيانة وتطوير الأنظمة التقنية",
    headOfDepartment: "محمد عبد الله",
    employeeCount: 8,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 5,
    name: "قسم الموارد البشرية",
    description: "إدارة شؤون الموظفين والتوظيف",
    headOfDepartment: "سارة أحمد",
    employeeCount: 6,
    isActive: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  }
];

// Divisions
export const divisions: Division[] = [
  {
    id: 1,
    name: "شعبة الهندسة المدنية",
    description: "المشاريع الإنشائية والمدنية",
    headOfDivision: "م. علي أحمد",
    employeeCount: 10,
    departmentId: 1,
    departmentName: "قسم الشؤون الهندسية",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 2,
    name: "شعبة الهندسة الكهربائية",
    description: "أنظمة الكهرباء والتحكم",
    headOfDivision: "م. حسن علي",
    employeeCount: 8,
    departmentId: 1,
    departmentName: "قسم الشؤون الهندسية",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 3,
    name: "شعبة الشؤون المالية",
    description: "إدارة الحسابات والميزانيات",
    headOfDivision: "فاطمة محمود",
    employeeCount: 8,
    departmentId: 2,
    departmentName: "قسم الشؤون الإدارية",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 4,
    name: "شعبة تطوير البرمجيات",
    description: "تطوير البرمجيات والتطبيقات",
    headOfDivision: "عبد الرحمن خالد",
    employeeCount: 7,
    departmentId: 3,
    departmentName: "قسم تقنية المعلومات",
    isActive: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  }
];

// Units
export const units: Unit[] = [
  {
    id: 1,
    name: "وحدة التخطيط والتصميم",
    description: "تخطيط وتصميم المشاريع",
    unitHead: "خالد محمود",
    employeeCount: 5,
    divisionId: 1,
    departmentId: 1,
    departmentName: "قسم الشؤون الهندسية",
    divisionName: "شعبة الهندسة المدنية",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 2,
    name: "وحدة التنفيذ والإشراف",
    description: "الإشراف على تنفيذ المشاريع",
    unitHead: "سالم ياسر",
    employeeCount: 5,
    divisionId: 1,
    departmentId: 1,
    departmentName: "قسم الشؤون الهندسية",
    divisionName: "شعبة الهندسة المدنية",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 3,
    name: "وحدة أنظمة الطاقة",
    description: "تصميم أنظمة الطاقة الكهربائية",
    unitHead: "رعد فريد",
    employeeCount: 4,
    divisionId: 2,
    departmentId: 1,
    departmentName: "قسم الشؤون الهندسية",
    divisionName: "شعبة الهندسة الكهربائية",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 4,
    name: "وحدة أنظمة التحكم",
    description: "برمجة أنظمة التحكم الصناعي",
    unitHead: "مراد حسن",
    employeeCount: 4,
    divisionId: 2,
    departmentId: 1,
    departmentName: "قسم الشؤون الهندسية",
    divisionName: "شعبة الهندسة الكهربائية",
    isActive: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 5,
    name: "وحدة الحسابات العامة",
    description: "إدارة الحسابات اليومية",
    unitHead: "نور الدين أحمد",
    employeeCount: 4,
    divisionId: 3,
    departmentId: 2,
    departmentName: "قسم الشؤون الإدارية",
    divisionName: "شعبة الشؤون المالية",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 6,
    name: "وحدة تطوير الواجهات",
    description: "تطوير واجهات المستخدم",
    unitHead: "ياسر حسن",
    employeeCount: 3,
    divisionId: 4,
    departmentId: 3,
    departmentName: "قسم تقنية المعلومات",
    divisionName: "شعبة تطوير البرمجيات",
    isActive: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  }
];

// Helper functions for organizational structure
export const getDepartmentById = (id: number): Department | undefined => {
  return departments.find(dept => dept.id === id);
};

export const getDivisionById = (id: number): Division | undefined => {
  return divisions.find(div => div.id === id);
};

export const getUnitById = (id: number): Unit | undefined => {
  return units.find(unit => unit.id === id);
};

export const getDivisionsByDepartment = (departmentId: number): Division[] => {
  return divisions.filter(div => div.departmentId === departmentId);
};

export const getUnitsByDivision = (divisionId: number): Unit[] => {
  return units.filter(unit => unit.divisionId === divisionId);
};

export const getActiveDepartments = (): Department[] => {
  return departments.filter(dept => dept.isActive);
};

export const getActiveDivisions = (): Division[] => {
  return divisions.filter(div => div.isActive);
};

export const getActiveUnits = (): Unit[] => {
  return units.filter(unit => unit.isActive);
};