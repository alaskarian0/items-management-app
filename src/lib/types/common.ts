// Common Types for Inventory Management System
// Shared types used across multiple modules

// User Management
export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: string;
  department?: string;
  division?: string;
  unit?: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  avatar?: string;
  phone?: string;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  permissions: string[];
  isActive: boolean;
}

export interface Permission {
  id: number;
  name: string;
  module: string;
  description: string;
}

// Authentication
export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthUser {
  id: number;
  username: string;
  fullName: string;
  role: string;
  permissions: string[];
  avatar?: string;
  warehouse?: string;
}

// System Configuration
export interface SystemSetting {
  key: string;
  value: string | number | boolean;
  description: string;
  category: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'json';
  isEditable: boolean;
}

// Base Entity
export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string;
  createdBy?: number;
  updatedBy?: number;
  isActive?: boolean;
}

// Pagination
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// API Response
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

// Filter Options
export interface DateRange {
  from: Date;
  to: Date;
}

export interface FilterOptions {
  search?: string;
  dateRange?: DateRange;
  status?: string;
  category?: string;
  [key: string]: any;
}

// Reports
export interface ReportConfig {
  id: string;
  name: string;
  description: string;
  module: string;
  type: 'summary' | 'detailed' | 'statistical';
  filters: string[];
  columns: string[];
  exportFormats: ('pdf' | 'excel' | 'csv')[];
}

export interface ReportData {
  title: string;
  subtitle?: string;
  generatedAt: string;
  filters: Record<string, any>;
  data: any[];
  summary?: Record<string, any>;
}

// Notification System
export interface Notification {
  id: number;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  userId?: number;
  actionUrl?: string;
}

// Audit Log
export interface AuditLog {
  id: number;
  action: string;
  module: string;
  entityId: number;
  entityType: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  userId: number;
  username: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

// File Management
export interface UploadedFile {
  id: number;
  originalName: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: number;
  uploadedAt: string;
}

// Common Status Options
export const COMMON_STATUSES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const;

// Common Error Types
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;