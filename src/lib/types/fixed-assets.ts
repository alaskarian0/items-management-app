// Fixed Assets Types
// Types for fixed assets management system

import type { BaseEntity, DateRange } from './common';

export interface FixedAsset extends BaseEntity {
  assetCode: string;
  name: string;
  description?: string;
  category: string;
  serialNumber?: string;
  barcode?: string;
  purchaseDate: Date;
  purchaseValue: number;
  currentValue?: number;
  depreciation?: number;
  location: string;
  department: string;
  division?: string;
  unit?: string;
  responsiblePerson?: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  status: 'active' | 'maintenance' | 'retired' | 'disposed';
  warranty?: Date;
  supplier?: string;
  notes?: string;
  images?: string[];
}

export interface AssetCoding {
  id: number;
  assetId: number;
  barcode: string;
  qrCode: string;
  codedBy: number;
  codedAt: Date;
  location: string;
}

export interface AssetCustody {
  id: number;
  assetId: number;
  custodyNumber: string;
  employeeId: number;
  employeeName: string;
  department: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  condition: string;
  notes?: string;
  returnCondition?: string;
  returnNotes?: string;
  status: 'active' | 'returned' | 'overdue';
}

export interface AssetConsumed {
  id: number;
  assetId: number;
  asset: FixedAsset;
  consumptionDate: Date;
  consumptionReason: string;
  consumptionMethod: 'damage' | 'theft' | 'loss' | 'end-of-life' | 'disposal';
  estimatedValue: number;
  approvedBy?: number;
  approvedAt?: Date;
  notes?: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface AssetDonated {
  id: number;
  assetId: number;
  asset: FixedAsset;
  donationDate: Date;
  donatedTo: string;
  donationType: 'individual' | 'organization' | 'government';
  donationReason: string;
  fairMarketValue: number;
  approvedBy?: number;
  approvedAt?: Date;
  receiptNumber?: string;
  notes?: string;
  status: 'pending' | 'approved' | 'completed';
}

export interface AssetCategory {
  id: number;
  name: string;
  description?: string;
  parentId?: number;
  depreciationRate?: number;
  usefulLifeYears?: number;
  isActive: boolean;
}

export interface AssetMovement {
  id: number;
  assetId: number;
  movementType: 'transfer' | 'maintenance' | 'custody-assignment' | 'custody-return';
  fromLocation?: string;
  toLocation?: string;
  fromPerson?: string;
  toPerson?: string;
  movementDate: Date;
  reason: string;
  approvedBy?: number;
  notes?: string;
}

export interface AssetMaintenance {
  id: number;
  assetId: number;
  maintenanceType: 'preventive' | 'corrective' | 'emergency';
  description: string;
  startDate: Date;
  endDate?: Date;
  cost?: number;
  vendor?: string;
  performedBy?: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
}

export interface AssetFilter {
  search?: string;
  category?: string;
  status?: string;
  condition?: string;
  department?: string;
  location?: string;
  purchaseDateRange?: DateRange;
  valueRange?: {
    min: number;
    max: number;
  };
  hasBarcode?: boolean;
  hasWarranty?: boolean;
}

export interface CodingBatch {
  id: number;
  batchNumber: string;
  assetIds: number[];
  codedBy: number;
  codedAt: Date;
  location: string;
  status: 'pending' | 'in-progress' | 'completed';
}

// Report Types
export interface FixedAssetsReport {
  totalAssets: number;
  totalValue: number;
  depreciatedValue: number;
  categories: Record<string, number>;
  conditions: Record<string, number>;
  departments: Record<string, number>;
  assetsByCategory: Array<{
    category: string;
    count: number;
    value: number;
  }>;
  assetsByDepartment: Array<{
    department: string;
    count: number;
    value: number;
  }>;
}

export interface AssetConsumptionReport {
  totalConsumed: number;
  totalValue: number;
  consumptionReasons: Record<string, number>;
  consumptionMethods: Record<string, number>;
  monthlyConsumption: Array<{
    month: string;
    count: number;
    value: number;
  }>;
  assets: AssetConsumed[];
}

export interface AssetCustodyReport {
  totalCustodyAssets: number;
  totalCustodyValue: number;
  activeCustody: number;
  overdueCustody: number;
  custodyByDepartment: Array<{
    department: string;
    count: number;
    value: number;
  }>;
  custodies: AssetCustody[];
}

export interface AssetDonationReport {
  totalDonated: number;
  totalDonationValue: number;
  donationTypes: Record<string, number>;
  donationRecipients: Record<string, number>;
  monthlyDonations: Array<{
    month: string;
    count: number;
    value: number;
  }>;
  donations: AssetDonated[];
}

// Form Types
export type FixedAssetFormData = Omit<FixedAsset, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>;
export type AssetCodingFormData = Omit<AssetCoding, 'id' | 'codedAt'>;
export type AssetCustodyFormData = Omit<AssetCustody, 'id' | 'status'>;
export type AssetConsumedFormData = Omit<AssetConsumed, 'id' | 'status'>;
export type AssetDonatedFormData = Omit<AssetDonated, 'id' | 'status'>;

// Asset Status Options
export const ASSET_STATUS = {
  ACTIVE: 'active',
  MAINTENANCE: 'maintenance',
  RETIRED: 'retired',
  DISPOSED: 'disposed'
} as const;

export const ASSET_CONDITION = {
  EXCELLENT: 'excellent',
  GOOD: 'good',
  FAIR: 'fair',
  POOR: 'poor'
} as const;

export const CUSTODY_STATUS = {
  ACTIVE: 'active',
  RETURNED: 'returned',
  OVERDUE: 'overdue'
} as const;

export const CONSUMPTION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
} as const;