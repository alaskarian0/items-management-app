// Settings Types
// Types for system settings management

import type { BaseEntity } from './common';

export interface Supplier extends BaseEntity {
  code: string;
  name: string;
  description?: string;
  contactPerson: string;
  phone: string;
  email?: string;
  address?: string;
  website?: string;
  taxNumber?: string;
  commercialNumber?: string;
  bankAccount?: string;
  bankName?: string;
  category: string;
  rating: number;
  isActive: boolean;
  notes?: string;
}

export interface MeasurementUnit extends BaseEntity {
  code: string;
  name: string;
  nameEnglish?: string;
  abbreviation: string;
  abbreviationEnglish?: string;
  type: 'weight' | 'length' | 'volume' | 'area' | 'count' | 'time' | 'temperature';
  baseUnit?: string;
  conversionFactor?: number;
  isActive: boolean;
  description?: string;
}

export interface SystemUser extends BaseEntity {
  username: string;
  email: string;
  fullName: string;
  nationalId?: string;
  phone: string;
  department: string;
  division?: string;
  unit?: string;
  position: string;
  role: string;
  avatar?: string;
  isActive: boolean;
  lastLogin?: Date;
  warehouse?: string;
  permissions: string[];
  twoFactorEnabled: boolean;
  passwordChangeRequired: boolean;
  notes?: string;
}

export interface UserRole extends BaseEntity {
  name: string;
  description: string;
  permissions: string[];
  isSystem: boolean;
  isActive: boolean;
  userCount?: number;
}

export interface Permission extends BaseEntity {
  name: string;
  displayName: string;
  module: string;
  description: string;
  group: string;
  isSystem: boolean;
}

export interface SystemSetting extends BaseEntity {
  key: string;
  value: string | number | boolean;
  defaultValue?: string | number | boolean;
  displayName: string;
  description: string;
  category: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'json' | 'array';
  isRequired: boolean;
  isPublic: boolean;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    options?: string[];
  };
}

// Report Configuration
export interface ReportConfig extends BaseEntity {
  code: string;
  name: string;
  description: string;
  module: string;
  type: 'standard' | 'custom' | 'scheduled';
  category: string;
  frequency?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'on-demand';
  parameters: ReportParameter[];
  columns: ReportColumn[];
  filters: ReportFilter[];
  sorting: ReportSorting[];
  exportFormats: ('pdf' | 'excel' | 'csv' | 'json')[];
  isActive: boolean;
  canBeScheduled: boolean;
}

export interface ReportParameter {
  name: string;
  displayName: string;
  type: 'text' | 'number' | 'date' | 'select' | 'multi-select' | 'boolean';
  isRequired: boolean;
  defaultValue?: any;
  options?: Array<{ value: any; label: string }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface ReportColumn {
  key: string;
  title: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  format?: 'text' | 'number' | 'currency' | 'date' | 'boolean';
  sortable?: boolean;
  filterable?: boolean;
  visible?: boolean;
}

export interface ReportFilter {
  field: string;
  title: string;
  type: 'text' | 'select' | 'multi-select' | 'date-range' | 'number-range';
  options?: Array<{ value: any; label: string }>;
  defaultValue?: any;
}

export interface ReportSorting {
  field: string;
  title: string;
  direction: 'asc' | 'desc';
  isDefault?: boolean;
}

// Audit and Activity Logs
export interface ActivityLog extends BaseEntity {
  userId: number;
  username: string;
  action: string;
  module: string;
  description: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface DataBackup extends BaseEntity {
  fileName: string;
  fileSize: number;
  backupType: 'manual' | 'scheduled' | 'automatic';
  modules: string[];
  backupDate: Date;
  compressionRatio?: number;
  location: string;
  isEncrypted: boolean;
  checksum?: string;
  status: 'in-progress' | 'completed' | 'failed';
  error?: string;
}

// Notification Templates
export interface NotificationTemplate extends BaseEntity {
  name: string;
  title: string;
  content: string;
  type: 'email' | 'sms' | 'push' | 'in-app';
  category: string;
  variables: NotificationVariable[];
  isActive: boolean;
  language: string;
}

export interface NotificationVariable {
  name: string;
  description: string;
  defaultValue?: string;
  isRequired: boolean;
}

// Form Types
export type SupplierFormData = Omit<Supplier, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>;
export type MeasurementUnitFormData = Omit<MeasurementUnit, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>;
export type SystemUserFormData = Omit<SystemUser, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'lastLogin'>;
export type UserRoleFormData = Omit<UserRole, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'userCount'>;
export type SystemSettingFormData = Omit<SystemSetting, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>;

// Filter Types
export interface SupplierFilter {
  search?: string;
  category?: string;
  rating?: number;
  isActive?: boolean;
  hasProducts?: boolean;
}

export interface UserFilter {
  search?: string;
  department?: string;
  role?: string;
  isActive?: boolean;
  lastLoginFrom?: Date;
  lastLoginTo?: Date;
}

export interface ActivityLogFilter {
  search?: string;
  module?: string;
  action?: string;
  userId?: number;
  severity?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

// Status Options
export const SUPPLIER_CATEGORIES = [
  'تكنولوجيا المعلومات',
  'الأثاث والمعدات المكتبي',
  'المواد الاستهلاكية',
  'المعدات الكهربائية',
  'الخدمات',
  'المواد الخام',
  'النقل والخدمات اللوجستية',
  'أخرى'
] as const;

export const UNIT_TYPES = [
  { value: 'weight', label: 'وزن' },
  { value: 'length', label: 'طول' },
  { value: 'volume', label: 'حجم' },
  { value: 'area', label: 'مساحة' },
  { value: 'count', label: 'عدد' },
  { value: 'time', label: 'وقت' },
  { value: 'temperature', label: 'درجة حرارة' }
] as const;

// Organizational Structure Types
export interface Unit extends BaseEntity {
  name: string;
  description?: string;
  unitHead?: string;
  employeeCount?: number;
  divisionId: number;
  divisionName?: string;
  departmentId?: number;
  departmentName?: string;
  isActive?: boolean;
}

export interface Division extends BaseEntity {
  name: string;
  description?: string;
  headOfDivision?: string;
  employeeCount?: number;
  departmentId: number;
  departmentName?: string;
  isActive?: boolean;
  units?: Unit[];
}

export interface Department extends BaseEntity {
  name: string;
  description?: string;
  headOfDepartment?: string;
  employeeCount?: number;
  isActive?: boolean;
  divisions?: Division[];
}

export const USER_ROLES = [
  'مدير نظام',
  'مدير قسم',
  'مسؤول مخزن',
  'محاسب',
  'مهندس',
  'موظف إداري',
  'مسؤول شراء',
  'مدقق مالي'
] as const;

export const PERMISSION_GROUPS = [
  'المستخدمين والصلاحيات',
  'إدارة المخازن',
  'الموجودات الثابتة',
  'التقارير',
  'الإعدادات النظام',
  'الصيانة والدعم الفني',
  'التدقيق والسجلات'
] as const;

export const SYSTEM_SETTINGS_CATEGORIES = [
  'عام',
  'المستخدمين والأمان',
  'المخازن',
  'التقارير',
  'الإشعارات',
  'النسخ الاحتياطي',
  'التكامل الخارجي',
  'المظهر والواجهة'
] as const;