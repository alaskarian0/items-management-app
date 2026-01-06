# Database Design - Inventory Management System

## Overview

This document describes the complete database design for the Inventory Management System, including all entities, their fields, relationships, and data types.

---

## Database Technology Stack

| Component | Technology |
|-----------|------------|
| Primary Database | Dexie (IndexedDB - client-side) |
| Backend Storage | Mock database (in-memory for authentication) |
| Schema Location | `src/lib/db.ts` |
| Auth Storage | `src/lib/mock-db.ts` |

---

## Entity Relationship Diagram

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Department    │────<│    Division     │────<│      Unit       │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                      │                       │
         └──────────────────────┼───────────────────────┘
                                │
                                ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│      User       │────>│    UserRole     │────<│   Permission    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Warehouse     │────<│InventoryRecord  │────>│      Item       │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                                              │
         ▼                                              ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    Document     │────<│  DocumentItem   │     │   FixedAsset    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                                              │
         ▼                                              ▼
┌─────────────────┐                             ┌─────────────────┐
│ MovementRecord  │                             │  AssetCustody   │
└─────────────────┘                             └─────────────────┘
```

---

## Core Entities

### 1. User Management

#### User
| Field | Type | Description |
|-------|------|-------------|
| `id` | `number` | Primary key |
| `userName` | `string` | Username |
| `fullName` | `string` | Full name |
| `role` | `string` | User role |
| `warehouse` | `string?` | Warehouse type (furniture, carpet, general, construction, dry, frozen, fuel, consumable, law_enforcement) |
| `isTempPass` | `boolean` | Temporary password flag |
| `createdAt` | `string?` | Creation timestamp |
| `updatedAt` | `string?` | Update timestamp |

#### SystemUser
*Extends BaseEntity*

| Field | Type | Description |
|-------|------|-------------|
| `username` | `string` | Username |
| `email` | `string` | Email address |
| `fullName` | `string` | Full name |
| `nationalId` | `string?` | National ID |
| `phone` | `string` | Phone number |
| `department` | `string` | Department |
| `division` | `string?` | Division |
| `unit` | `string?` | Unit |
| `position` | `string` | Job position |
| `role` | `string` | User role |
| `avatar` | `string?` | Avatar image path |
| `isActive` | `boolean` | Active status |
| `lastLogin` | `Date?` | Last login timestamp |
| `warehouse` | `string?` | Assigned warehouse |
| `permissions` | `string[]` | Permission list |
| `twoFactorEnabled` | `boolean` | 2FA enabled flag |
| `passwordChangeRequired` | `boolean` | Password change required |
| `notes` | `string?` | Notes |

#### UserRole
*Extends BaseEntity*

| Field | Type | Description |
|-------|------|-------------|
| `name` | `string` | Role name |
| `description` | `string` | Role description |
| `permissions` | `string[]` | Assigned permissions |
| `isSystem` | `boolean` | System role flag |
| `isActive` | `boolean` | Active status |
| `userCount` | `number?` | Number of users with this role |

#### Permission
*Extends BaseEntity*

| Field | Type | Description |
|-------|------|-------------|
| `name` | `string` | Permission name |
| `displayName` | `string` | Display name |
| `module` | `string` | Module name |
| `description` | `string` | Description |
| `group` | `string` | Permission group |
| `isSystem` | `boolean` | System permission flag |

---

### 2. Organizational Structure

#### Department
| Field | Type | Description |
|-------|------|-------------|
| `id` | `number` | Primary key |
| `name` | `string` | Department name (Arabic) |
| `description` | `string?` | Description |
| `headOfDepartment` | `string?` | Head of department |
| `employeeCount` | `number?` | Number of employees |
| `isActive` | `boolean?` | Active status |
| `divisions` | `Division[]?` | Related divisions |

#### Division
| Field | Type | Description |
|-------|------|-------------|
| `id` | `number` | Primary key |
| `name` | `string` | Division name (Arabic) |
| `description` | `string?` | Description |
| `departmentId` | `number` | FK to Department |
| `departmentName` | `string?` | Department name |
| `headOfDivision` | `string?` | Head of division |
| `employeeCount` | `number?` | Number of employees |
| `isActive` | `boolean?` | Active status |
| `units` | `Unit[]?` | Related units |

#### Unit
| Field | Type | Description |
|-------|------|-------------|
| `id` | `number` | Primary key |
| `name` | `string` | Unit name (Arabic) |
| `description` | `string?` | Description |
| `unitHead` | `string?` | Unit head |
| `employeeCount` | `number?` | Number of employees |
| `divisionId` | `number` | FK to Division |
| `divisionName` | `string?` | Division name |
| `departmentId` | `number?` | FK to Department |
| `departmentName` | `string?` | Department name |
| `isActive` | `boolean?` | Active status |

---

### 3. Warehouse Management

#### Warehouse
| Field | Type | Description |
|-------|------|-------------|
| `id` | `number` | Primary key |
| `name` | `string` | Warehouse name |
| `code` | `string` | Warehouse code |
| `address` | `string?` | Location address |
| `departmentId` | `number?` | FK to Department |
| `departmentName` | `string?` | Department name |
| `divisionId` | `number?` | FK to Division |
| `divisionName` | `string?` | Division name |
| `unitId` | `number?` | FK to Unit |
| `unitName` | `string?` | Unit name |
| `isActive` | `boolean` | Active status |
| `children` | `Warehouse[]?` | Sub-warehouses |
| `level` | `number?` | Hierarchy level |
| `itemCount` | `number?` | Count of items |

#### Item
| Field | Type | Description |
|-------|------|-------------|
| `id` | `number` | Primary key |
| `name` | `string` | Item name |
| `code` | `string` | Item code |
| `unit` | `string` | Measurement unit |
| `stock` | `number?` | Current stock quantity |
| `price` | `number?` | Unit price |
| `category` | `string?` | Item category |
| `description` | `string?` | Description |
| `minStock` | `number?` | Minimum stock level |

#### StockItem
*Extends Item*

| Field | Type | Description |
|-------|------|-------------|
| `stock` | `number` | Current stock (required) |
| `minStock` | `number` | Minimum stock (required) |
| `maxStock` | `number` | Maximum stock |
| `category` | `string` | Category (required) |
| `location` | `string?` | Physical location |
| `lastUpdated` | `string` | Last update timestamp |

#### Supplier
*Extends BaseEntity*

| Field | Type | Description |
|-------|------|-------------|
| `code` | `string` | Supplier code |
| `name` | `string` | Supplier name |
| `description` | `string?` | Description |
| `contactPerson` | `string` | Contact person |
| `phone` | `string` | Phone number |
| `email` | `string?` | Email address |
| `address` | `string?` | Address |
| `website` | `string?` | Website URL |
| `taxNumber` | `string?` | Tax registration number |
| `commercialNumber` | `string?` | Commercial registration |
| `bankAccount` | `string?` | Bank account number |
| `bankName` | `string?` | Bank name |
| `category` | `string` | Supplier category |
| `rating` | `number` | Supplier rating |
| `isActive` | `boolean` | Active status |
| `notes` | `string?` | Notes |

---

### 4. Document & Transaction Entities

#### DocumentItem
| Field | Type | Description |
|-------|------|-------------|
| `id` | `number` | Primary key |
| `itemId` | `number \| null` | FK to Item |
| `itemCode` | `string` | Item code |
| `itemName` | `string` | Item name |
| `unit` | `string` | Measurement unit |
| `quantity` | `number` | Quantity |
| `price` | `number?` | Unit price |
| `stock` | `number?` | Stock at transaction time |
| `warranty` | `string?` | Warranty info |
| `warrantyPeriod` | `number?` | Warranty period |
| `warrantyUnit` | `"day" \| "month" \| "year"?` | Warranty unit |
| `expiryDate` | `Date?` | Expiry date |
| `notes` | `string?` | Notes |
| `vendorName` | `string?` | Vendor name |
| `vendorId` | `number?` | FK to Vendor |
| `invoiceNumber` | `string?` | Invoice number |
| `approvalAuthority` | `string?` | Approval authority (fuel) |
| `vehicleOwnership` | `string?` | Vehicle ownership (fuel) |
| `vehicleType` | `string?` | Vehicle type (fuel) |
| `vehicleNumber` | `string?` | Vehicle number (fuel) |
| `itemRecipientName` | `string?` | Recipient name (fuel) |
| `signature` | `string?` | Signature (fuel) |

#### EntryDocument
| Field | Type | Description |
|-------|------|-------------|
| `id` | `number?` | Primary key |
| `docNumber` | `string` | Document number |
| `date` | `Date` | Entry date |
| `warehouseId` | `number` | FK to Warehouse |
| `departmentId` | `number?` | FK to Department |
| `divisionId` | `number?` | FK to Division |
| `unitId` | `number?` | FK to Unit |
| `supplierId` | `number?` | FK to Supplier |
| `entryType` | `"purchases" \| "gifts" \| "returns"` | Entry type |
| `notes` | `string?` | Notes |
| `items` | `DocumentItem[]` | Line items |
| `total` | `number?` | Total value |

#### IssuanceDocument
| Field | Type | Description |
|-------|------|-------------|
| `id` | `number?` | Primary key |
| `docNumber` | `string` | Document number |
| `date` | `Date` | Issuance date |
| `warehouseId` | `number` | FK to Warehouse |
| `departmentId` | `number?` | FK to Department |
| `divisionId` | `number?` | FK to Division |
| `unitId` | `number?` | FK to Unit |
| `recipientName` | `string` | Recipient name |
| `notes` | `string?` | Notes |
| `items` | `DocumentItem[]` | Line items |

#### WarehouseDocument
| Field | Type | Description |
|-------|------|-------------|
| `id` | `number` | Primary key |
| `docNumber` | `string` | Document number |
| `type` | `"entry" \| "issuance"` | Document type |
| `date` | `string` | Transaction date |
| `warehouseId` | `number` | FK to Warehouse |
| `warehouseName` | `string` | Warehouse name |
| `departmentId` | `number?` | FK to Department |
| `departmentName` | `string?` | Department name |
| `divisionId` | `number?` | FK to Division |
| `divisionName` | `string?` | Division name |
| `unitId` | `number?` | FK to Unit |
| `unitName` | `string?` | Unit name |
| `supplierId` | `number?` | FK to Supplier |
| `supplierName` | `string?` | Supplier name |
| `recipientName` | `string?` | Recipient name |
| `entryType` | `"purchases" \| "gifts" \| "returns"?` | Entry type |
| `itemCount` | `number` | Number of items |
| `totalValue` | `number` | Total value |
| `notes` | `string?` | Notes |
| `status` | `"draft" \| "approved" \| "cancelled"` | Document status |
| `createdAt` | `string` | Creation timestamp |
| `updatedAt` | `string` | Update timestamp |

#### ItemMovement
| Field | Type | Description |
|-------|------|-------------|
| `id` | `number` | Primary key |
| `itemCode` | `string` | Item code |
| `itemName` | `string` | Item name |
| `unit` | `string` | Measurement unit |
| `movementType` | `"إدخال" \| "إصدار"` | Movement type (Entry/Issuance) |
| `quantity` | `number` | Quantity |
| `balance` | `number` | Running balance |
| `referenceNumber` | `string` | Reference document number |
| `date` | `string` | Transaction date |
| `department` | `string?` | Department name |
| `division` | `string?` | Division name |
| `recipient` | `string?` | Recipient (for issuances) |
| `supplier` | `string?` | Supplier (for entries) |
| `notes` | `string?` | Notes |

---

### 5. Fixed Assets

#### FixedAsset
*Extends BaseEntity*

| Field | Type | Description |
|-------|------|-------------|
| `assetCode` | `string` | Global identifier (RQ Code) |
| `name` | `string` | Asset name |
| `description` | `string?` | Description |
| `category` | `string` | Asset category |
| `serialNumber` | `string?` | Serial number |
| `barcode` | `string?` | Barcode |
| `purchaseDate` | `Date` | Purchase date |
| `purchaseValue` | `number` | Purchase value |
| `currentValue` | `number?` | Depreciated value |
| `depreciation` | `number?` | Total depreciation |
| `location` | `string` | Physical location |
| `department` | `string` | Department |
| `division` | `string?` | Division |
| `unit` | `string?` | Unit |
| `responsiblePerson` | `string?` | Responsible person |
| `condition` | `'excellent' \| 'good' \| 'fair' \| 'poor'` | Asset condition |
| `status` | `'active' \| 'maintenance' \| 'retired' \| 'disposed'` | Asset status |
| `warranty` | `Date?` | Warranty expiration |
| `supplier` | `string?` | Supplier name |
| `notes` | `string?` | Notes |
| `images` | `string[]?` | Image paths |
| `documentNumber` | `string?` | Global tracking identifier |
| `registrationCount` | `number?` | Times in documents |

#### AssetCategory
| Field | Type | Description |
|-------|------|-------------|
| `id` | `number` | Primary key |
| `name` | `string` | Category name |
| `description` | `string?` | Description |
| `parentId` | `number?` | FK to parent category |
| `depreciationRate` | `number?` | Annual depreciation rate |
| `usefulLifeYears` | `number?` | Useful life in years |
| `isActive` | `boolean` | Active status |

#### AssetCustody
| Field | Type | Description |
|-------|------|-------------|
| `id` | `number` | Primary key |
| `assetId` | `number` | FK to FixedAsset |
| `custodyNumber` | `string` | Custody number |
| `employeeId` | `number` | FK to Employee |
| `employeeName` | `string` | Employee name |
| `department` | `string` | Department |
| `division` | `string?` | Division |
| `unit` | `string?` | Unit |
| `position` | `string` | Job position |
| `startDate` | `Date` | Custody start date |
| `endDate` | `Date?` | Custody end date |
| `condition` | `string` | Asset condition |
| `notes` | `string?` | Notes |
| `returnCondition` | `string?` | Condition upon return |
| `returnNotes` | `string?` | Return notes |
| `status` | `'active' \| 'returned' \| 'overdue'` | Custody status |

#### AssetMaintenance
| Field | Type | Description |
|-------|------|-------------|
| `id` | `number` | Primary key |
| `assetId` | `number` | FK to FixedAsset |
| `maintenanceType` | `'preventive' \| 'corrective' \| 'emergency'` | Maintenance type |
| `description` | `string` | Description |
| `startDate` | `Date` | Start date |
| `endDate` | `Date?` | End date |
| `cost` | `number?` | Maintenance cost |
| `vendor` | `string?` | Vendor name |
| `performedBy` | `string?` | Performed by |
| `status` | `'scheduled' \| 'in-progress' \| 'completed' \| 'cancelled'` | Status |
| `notes` | `string?` | Notes |

#### AssetMovement
| Field | Type | Description |
|-------|------|-------------|
| `id` | `number` | Primary key |
| `assetId` | `number` | FK to FixedAsset |
| `movementType` | `'transfer' \| 'maintenance' \| 'custody-assignment' \| 'custody-return'` | Movement type |
| `fromLocation` | `string?` | Origin location |
| `toLocation` | `string?` | Destination location |
| `fromPerson` | `string?` | From person |
| `toPerson` | `string?` | To person |
| `movementDate` | `Date` | Movement date |
| `reason` | `string` | Reason |
| `approvedBy` | `number?` | Approver ID |
| `notes` | `string?` | Notes |

---

### 6. Inventory Requests

#### RequestRecord
*Dexie Table*

| Field | Type | Description |
|-------|------|-------------|
| `id` | `number?` | Primary key (auto-increment) |
| `departmentId` | `number` | FK to Department |
| `divisionId` | `number?` | FK to Division |
| `unitId` | `number?` | FK to Unit |
| `requestedBy` | `string` | Requester name |
| `items` | `{ itemId: number; quantity: number; notes?: string }[]` | Requested items |
| `status` | `'pending' \| 'approved' \| 'rejected'` | Request status |
| `notes` | `string?` | Notes |
| `createdAt` | `Date` | Creation timestamp |
| `processedAt` | `Date?` | Processing timestamp |
| `processedBy` | `string?` | Processor name |

---

### 7. System Configuration

#### MeasurementUnit
*Extends BaseEntity*

| Field | Type | Description |
|-------|------|-------------|
| `code` | `string` | Unit code |
| `name` | `string` | Unit name (Arabic) |
| `nameEnglish` | `string?` | English name |
| `abbreviation` | `string` | Abbreviation |
| `abbreviationEnglish` | `string?` | English abbreviation |
| `type` | `'weight' \| 'length' \| 'volume' \| 'area' \| 'count' \| 'time' \| 'temperature'` | Unit type |
| `baseUnit` | `string?` | Reference base unit |
| `conversionFactor` | `number?` | Conversion factor |
| `isActive` | `boolean` | Active status |
| `description` | `string?` | Description |

#### SystemSetting
*Extends BaseEntity*

| Field | Type | Description |
|-------|------|-------------|
| `key` | `string` | Setting key |
| `value` | `string \| number \| boolean` | Setting value |
| `defaultValue` | `string \| number \| boolean?` | Default value |
| `displayName` | `string` | Display name |
| `description` | `string` | Description |
| `category` | `string` | Setting category |
| `type` | `'string' \| 'number' \| 'boolean' \| 'date' \| 'json' \| 'array'` | Value type |
| `isRequired` | `boolean` | Required flag |
| `isPublic` | `boolean` | Public visibility |
| `validation` | `{ min?: number; max?: number; pattern?: string; options?: string[] }?` | Validation rules |

#### ActivityLog
*Extends BaseEntity*

| Field | Type | Description |
|-------|------|-------------|
| `userId` | `number` | User ID |
| `username` | `string` | Username |
| `action` | `string` | Action performed |
| `module` | `string` | Module name |
| `description` | `string` | Description |
| `ipAddress` | `string?` | IP address |
| `userAgent` | `string?` | Browser user agent |
| `metadata` | `Record<string, any>?` | Additional metadata |
| `severity` | `'low' \| 'medium' \| 'high' \| 'critical'` | Severity level |

#### AuditLog
| Field | Type | Description |
|-------|------|-------------|
| `id` | `number` | Primary key |
| `action` | `string` | Action |
| `module` | `string` | Module |
| `entityId` | `number` | Entity ID |
| `entityType` | `string` | Entity type |
| `oldValues` | `Record<string, any>?` | Previous values |
| `newValues` | `Record<string, any>?` | New values |
| `userId` | `number` | User ID |
| `username` | `string` | Username |
| `ipAddress` | `string?` | IP address |
| `userAgent` | `string?` | User agent |
| `createdAt` | `string` | Timestamp |

---

