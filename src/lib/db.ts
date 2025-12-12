
import Dexie, { Table } from 'dexie';
import {
    items as initialItems,
    warehouses as initialWarehouses,
    departments,
    divisions,
    units,
    suppliers
} from '@/lib/data/warehouse-data';
import { Item, Warehouse, DocumentItem } from '@/lib/types/warehouse';

// Define Interface for new Tables not in types yet
export interface InventoryRecord {
    id?: number;
    warehouseId: number;
    itemId: number;
    quantity: number;
    lastUpdated: Date;
}

export interface MovementRecord {
    id?: number;
    docId: number;
    itemId: number;
    type: 'entry' | 'issuance'; // 'entry' | 'issuance'
    quantity: number;
    date: Date;
    warehouseId: number;
    departmentId?: number;
}

export interface DocumentRecord {
    id?: number;
    docNumber: string;
    refDocNumber?: string;
    type: 'entry' | 'issuance';
    date: Date;
    warehouseId: number;
    departmentId?: number;
    divisionId?: number;
    unitId?: number;
    supplierId?: number;
    recipientName?: string;
    entryType?: string; // purchases, gifts, returned
    notes?: string;
    status: 'draft' | 'approved';
    itemCount: number;
    totalValue?: number;
    createdAt: Date;
}

export interface RequestRecord {
    id?: number;
    departmentId: number;
    divisionId?: number;
    unitId?: number;
    requestedBy: string;
    items: { itemId: number; quantity: number; notes?: string }[];
    status: 'pending' | 'approved' | 'rejected';
    notes?: string;
    createdAt: Date;
    processedAt?: Date;
    processedBy?: string;
}

export interface CustodyRecord {
    id?: number;
    itemId: number;
    itemCode: string;
    itemName: string;
    departmentId: number;
    divisionId?: number;
    unitId?: number;
    employeeId?: string;
    employeeName: string;
    quantity: number;
    receivedDate: Date;
    condition: 'excellent' | 'good' | 'fair' | 'poor';
    status: 'active' | 'transferred' | 'returned';
    notes?: string;
    docId?: number; // Reference to issuance document
}

export class InventoryDB extends Dexie {
    items!: Table<Item, number>;
    warehouses!: Table<Warehouse, number>;
    inventory!: Table<InventoryRecord, number>;
    documents!: Table<DocumentRecord, number>;
    movements!: Table<MovementRecord, number>;

    // Lookup tables
    departments!: Table<any, number>;
    divisions!: Table<any, number>;
    units!: Table<any, number>;
    suppliers!: Table<any, number>;

    // Department Portal tables
    requests!: Table<RequestRecord, number>;
    custody!: Table<CustodyRecord, number>;

    constructor() {
        super('InventoryDB');
        this.version(2).stores({
            items: '++id, code, name, category',
            warehouses: '++id, code, name',
            inventory: '++id, [warehouseId+itemId], warehouseId, itemId',
            documents: '++id, docNumber, type, date, warehouseId, entryType, status',
            movements: '++id, docId, itemId, type, date, warehouseId',
            departments: '++id, name',
            divisions: '++id, name, departmentId',
            units: '++id, name, divisionId',
            suppliers: '++id, name',
            requests: '++id, departmentId, status, createdAt',
            custody: '++id, itemId, departmentId, employeeId, status'
        });
    }

    async seed() {
        // Check if data exists
        const itemCount = await this.items.count();
        if (itemCount > 0) return; // Already seeded

        console.log("Seeding Database...");

        // Seed Lookups
        await this.items.bulkAdd(initialItems);
        await this.warehouses.bulkAdd(initialWarehouses);
        await this.departments.bulkAdd(departments);
        await this.divisions.bulkAdd(divisions);
        await this.units.bulkAdd(units);
        await this.suppliers.bulkAdd(suppliers);

        // Seed Initial Inventory (Random Stock)
        const inventoryData: InventoryRecord[] = [];

        // For each warehouse and each item, add some random stock
        // Flatten warehouses for simplicity in seeding
        const allWarehouses = [1, 2, 3, 4]; // Main IDs from mock data

        allWarehouses.forEach(whId => {
            initialItems.forEach(item => {
                if (Math.random() > 0.3) { // 70% chance to have stock
                    inventoryData.push({
                        warehouseId: whId,
                        itemId: item.id,
                        quantity: Math.floor(Math.random() * 100),
                        lastUpdated: new Date()
                    });
                }
            });
        });

        await this.inventory.bulkAdd(inventoryData);
        console.log("Database Seeded Successfully!");
    }
}

export const db = new InventoryDB();
