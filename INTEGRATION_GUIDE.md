# API Integration Guide

## Overview
This document explains the integration between the frontend pages and the backend API for the inventory management system.

## Created Hooks

### 1. `use-entry-documents.ts`
Manages entry/issuance document metadata.

**Key Functions:**
- `createEntryDocument(data)` - Create a new entry document
- `updateEntryDocument(id, data)` - Update existing document
- `deleteEntryDocument(id)` - Delete document
- `getEntryDocumentById(id)` - Fetch single document

**Types:**
```typescript
interface CreateEntryDocumentDto {
  documentNumber: string;
  date: Date | string;
  warehouseId: number;
  departmentId: number;
  divisionId?: number;
  unitId?: number;
  documentType: number; // 1: New Entry, 2: Issuance Document
  entryMethod: number;  // 1: direct, 2: indirect
  entryType: number;    // 1: Purchases, 2: gifts, 3: returns
  recipientName: string;
  notes?: string;
}
```

### 2. `use-item-instances.ts`
Manages individual serialized items.

**Key Functions:**
- `createItemInstance(data)` - Create a single item instance
- `createBulkItemInstances(data)` - Create multiple instances at once
- `updateItemInstance(id, data)` - Update instance
- `updateItemInstanceStatus(id, status, notes)` - Change status
- `transferItemInstance(id, toWarehouseId, notes)` - Transfer to another warehouse
- `deleteItemInstance(id)` - Delete instance
- `getItemInstanceBySerial(serialNumber)` - Find by serial number
- `getStatistics()` - Get inventory statistics

**Filter Options:**
```typescript
interface ItemInstanceFilters {
  itemMasterId?: number;
  warehouseId?: number;
  status?: number; // 1: Available, 2: In Use, 3: Damaged, 4: Under Maintenance, 5: Disposed
}
```

### 3. `use-item-masters.ts`
Manages product definitions (item templates).

**Key Functions:**
- `createItemMaster(data)` - Create product definition
- `updateItemMaster(id, data)` - Update product
- `deleteItemMaster(id)` - Delete product
- `getItemMasterById(id)` - Fetch single product
- `getLowStockItems()` - Get products below min stock
- `getStockSummary(id)` - Get detailed stock info

## Integration Pattern

### Entry Page Integration

The entry page handles creating new items in the warehouse. Here's the integration approach:

**Step 1: Create Item Master (Product Definition)**
If the item doesn't exist in the system:
```typescript
import { useItemMasters } from '@/hooks/use-item-masters';

const { createItemMaster } = useItemMasters();

const itemMaster = await createItemMaster({
  name: "Dell Laptop XPS 13",
  code: "LAP-XPS13",
  unitId: 1, // ID of measurement unit
  price: 899.99,
  minStock: 5,
  description: "Optional description",
  categoryId: 1 // Optional
});
```

**Step 2: Create Item Instances (Bulk)**
For each quantity, create serialized instances:
```typescript
import { useItemInstances } from '@/hooks/use-item-instances';

const { createBulkItemInstances } = useItemInstances();

const instances = await createBulkItemInstances({
  itemMasterId: itemMaster.id,
  quantity: 10, // Will create 10 instances with auto-generated serials
  warehouseId: selectedWarehouse.id,
  purchaseDate: new Date(),
  purchasePrice: 899.99,
  condition: "Good"
});
```

**Step 3: Create Entry Document (Metadata)**
Document the entry operation:
```typescript
import { useEntryDocuments } from '@/hooks/use-entry-documents';

const { createEntryDocument } = useEntryDocuments();

const document = await createEntryDocument({
  documentNumber: "DOC-1101",
  date: new Date(),
  warehouseId: selectedWarehouse.id,
  departmentId: 1,
  divisionId: 2,
  unitId: 3,
  documentType: 1, // 1: New Entry
  entryMethod: 1,  // 1: direct, 2: indirect
  entryType: 1,    // 1: Purchases
  recipientName: "John Doe",
  notes: "Purchase order #12345"
});
```

### Stores Page Integration

The stores page displays warehouse inventory and allows management:

```typescript
import { useItemInstances } from '@/hooks/use-item-instances';

// Get all items in a specific warehouse
const { itemInstances, loading } = useItemInstances({
  warehouseId: selectedWarehouse.id,
  status: 1 // Available items only
});

// Access the data
const items = itemInstances?.data?.items || [];
```

### Issuance Page Integration

The issuance page handles issuing items from warehouse:

**Step 1: Create Issuance Document**
```typescript
const { createEntryDocument } = useEntryDocuments();

const issuanceDoc = await createEntryDocument({
  documentNumber: "ISS-2305",
  date: new Date(),
  warehouseId: selectedWarehouse.id,
  departmentId: 1,
  documentType: 2, // 2: Issuance Document
  entryMethod: 1,
  entryType: 1,
  recipientName: "Department Manager",
  notes: "Monthly equipment issuance"
});
```

**Step 2: Update Item Status or Transfer**
```typescript
const { updateItemInstanceStatus, transferItemInstance } = useItemInstances();

// Option 1: Change status to "In Use"
await updateItemInstanceStatus(itemId, 2, "Issued to IT department");

// Option 2: Transfer to another warehouse
await transferItemInstance(itemId, targetWarehouseId, "Transfer to branch office");
```

## Data Model Mapping

### Current Dexie (IndexedDB) Schema
```typescript
{
  items: { name, code, unit, stock, price, category },
  documents: { docNumber, type, date, warehouseId, ... },
  inventory: { warehouseId, itemId, quantity },
  movements: { docId, itemId, type, quantity, date }
}
```

### API Schema
```typescript
{
  ItemMaster: { name, code, unitId, price, minStock },
  ItemInstance: { itemMasterId, serialNumber, warehouseId, status },
  EntryDocument: { documentNumber, date, warehouseId, documentType }
}
```

## Migration Strategy

### Option 1: Gradual Migration
Keep both Dexie and API calls, gradually phase out Dexie:
```typescript
const handleSave = async () => {
  // Save to API
  await createItemMaster(data);

  // Also save to Dexie for backward compatibility
  await db.items.add(data);
};
```

### Option 2: Full API Integration
Replace all Dexie calls with API calls immediately:
```typescript
// Remove: import { saveDocument, useItems } from "@/hooks/use-inventory";
// Add:
import { useItemMasters } from '@/hooks/use-item-masters';
import { useItemInstances } from '@/hooks/use-item-instances';
import { useEntryDocuments } from '@/hooks/use-entry-documents';
```

## Important Notes

### Serialization
The API uses a serialized inventory model where each physical item has a unique serial number. This means:
- 10 laptops = 10 ItemInstance records (LAP-0001, LAP-0002, ..., LAP-0010)
- Each has its own tracking (status, warranty, location)

### Measurement Units
The API requires `unitId` (integer) instead of unit name (string). You'll need to:
1. Fetch measurement units from `/measurement-units`
2. Map unit names to IDs
3. Use the existing `use-measurement-units` hook

### Example Complete Flow
```typescript
import { useItemMasters } from '@/hooks/use-item-masters';
import { useItemInstances } from '@/hooks/use-item-instances';
import { useEntryDocuments } from '@/hooks/use-entry-documents';
import { useMeasurementUnits } from '@/hooks/use-measurement-units';

const EntryPage = () => {
  const { itemMasters, createItemMaster } = useItemMasters();
  const { createBulkItemInstances } = useItemInstances();
  const { createEntryDocument } = useEntryDocuments();
  const { measurementUnits } = useMeasurementUnits();

  const handleSaveEntry = async (items) => {
    try {
      // Create entry document
      const doc = await createEntryDocument({
        documentNumber: docNumber,
        date: new Date(),
        warehouseId: selectedWarehouse.id,
        departmentId: Number(department),
        documentType: 1,
        entryMethod: entryMode === "direct" ? 1 : 2,
        entryType: Number(entryType),
        recipientName,
        notes
      });

      // Process each item
      for (const item of items) {
        // Create or get item master
        let itemMaster = item.itemId
          ? { id: item.itemId }
          : await createItemMaster({
              name: item.itemName,
              code: item.itemCode,
              unitId: getUnitIdByName(item.unit),
              price: item.price || 0,
              minStock: 0
            });

        // Create instances
        await createBulkItemInstances({
          itemMasterId: itemMaster.id,
          quantity: item.quantity,
          warehouseId: selectedWarehouse.id,
          purchaseDate: new Date(),
          purchasePrice: item.price,
          condition: "Good"
        });
      }

      toast.success("Entry saved successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save entry");
    }
  };
};
```

## API Base URL Configuration

Make sure your `.env.local` file has:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

The axios client in `src/lib/axiosClients.ts` will use this URL.

## Error Handling

All hooks include error handling. Wrap API calls in try-catch:
```typescript
try {
  await createItemMaster(data);
  toast.success("Item created!");
} catch (error) {
  console.error('Error creating item:', error);
  toast.error("Failed to create item");
}
```

## Next Steps

1. Update measurement units integration to map names to IDs
2. Modify entry page to use new hooks
3. Update stores page to display API data
4. Modify issuance page to use status updates
5. Test all CRUD operations
6. Remove Dexie dependencies when fully migrated
