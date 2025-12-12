
import { useLiveQuery } from "dexie-react-hooks";
import { db, DocumentRecord, InventoryRecord, MovementRecord } from "@/lib/db";
import { DocumentItem } from "@/lib/types/warehouse";

export function useItems() {
    return useLiveQuery(() => db.items.toArray());
}

export function useWarehouses() {
    return useLiveQuery(() => db.warehouses.toArray());
}

export function useSuppliers() {
    return useLiveQuery(() => db.suppliers.toArray());
}

export function useStock(warehouseId: number, itemId: number | null) {
    return useLiveQuery(async () => {
        if (!warehouseId || !itemId) return 0;
        const record = await db.inventory.where({ warehouseId, itemId }).first();
        return record?.quantity ?? 0;
    }, [warehouseId, itemId]);
}

export function useItemSearch(query: string) {
    return useLiveQuery(async () => {
        if (!query) return [];
        const q = query.toLowerCase();
        return db.items
            .filter(i =>
                i.name.toLowerCase().includes(q) ||
                i.code.toLowerCase().includes(q)
            )
            .toArray();
    }, [query]);
}

// Transactional Save for Documents
export const saveDocument = async (
    docData: Omit<DocumentRecord, 'id' | 'createdAt'>,
    items: DocumentItem[]
) => {
    return db.transaction('rw', db.documents, db.movements, db.inventory, async () => {

        // 1. Save Document Header
        const docId = await db.documents.add({
            ...docData,
            createdAt: new Date(),
            status: 'approved' // Auto-approve for simplicity
        });

        // 2. Process Items
        for (const item of items) {
            if (!item.itemId) continue;

            // Create Movement Record
            await db.movements.add({
                docId,
                itemId: item.itemId,
                type: docData.type,
                quantity: item.quantity,
                date: docData.date,
                warehouseId: docData.warehouseId,
                departmentId: docData.departmentId
            });

            // Update Inventory
            const currentStock = await db.inventory.get({
                warehouseId: docData.warehouseId,
                itemId: item.itemId
            });

            let newQuantity = currentStock?.quantity ?? 0;

            if (docData.type === 'entry') {
                newQuantity += item.quantity;
            } else {
                newQuantity -= item.quantity;
            }

            if (currentStock) {
                await db.inventory.update(currentStock.id!, {
                    quantity: newQuantity,
                    lastUpdated: new Date()
                });
            } else {
                await db.inventory.add({
                    warehouseId: docData.warehouseId,
                    itemId: item.itemId,
                    quantity: newQuantity,
                    lastUpdated: new Date()
                });
            }
        }

        return docId;
    });
};

// Bulk Inventory Query for Reports
export function useInventoryStock(warehouseId: number) {
    return useLiveQuery(async () => {
        if (!warehouseId) return [];

        // Get all inventory records for this warehouse
        const stockRecords = await db.inventory
            .where("warehouseId")
            .equals(warehouseId)
            .toArray();

        // Get all items to join details
        const allItems = await db.items.toArray();

        // Join details
        return allItems.map(item => {
            const stock = stockRecords.find(r => r.itemId === item.id);
            return {
                ...item,
                stock: stock?.quantity ?? 0,
                lastUpdated: stock?.lastUpdated,
                // Mocking other fields for now if columns don't exist
                lastPurchaseDate: stock?.lastUpdated ?? new Date(),
                lastIssueDate: new Date(),
                totalValue: (item.price || 0) * (stock?.quantity ?? 0),
                status: (stock?.quantity ?? 0) <= (item.minStock ?? 10) ? 'low' : 'normal',
                maxStock: 100, // Mock
                group: item.category || 'عام',
                vendor: 'غير محدد'
            };
        }).filter(i => i.stock > 0 || true); // Optional: filter out zero stock?
    }, [warehouseId]);
}

// Fetch Movements for a Warehouse
export function useMovements(warehouseId: number) {
    return useLiveQuery(async () => {
        if (!warehouseId) return [];

        // Get movements for this warehouse
        const movements = await db.movements
            .where("warehouseId")
            .equals(warehouseId)
            .reverse() // Most recent first
            .toArray();

        // Get all items and documents to join details
        const allItems = await db.items.toArray();
        const allDocuments = await db.documents.toArray();
        const allDepartments = await db.departments.toArray();

        // Join and format
        return movements.map(movement => {
            const item = allItems.find(i => i.id === movement.itemId);
            const document = allDocuments.find(d => d.id === movement.docId);
            const department = allDepartments.find(d => d.id === movement.departmentId);

            return {
                id: movement.id!,
                itemCode: item?.code || 'N/A',
                itemName: item?.name || 'Unknown Item',
                unit: item?.unit || 'قطعة',
                movementType: movement.type === 'entry' ? 'إدخال' : 'إصدار',
                quantity: movement.quantity,
                balance: 0, // Would need to calculate running balance
                referenceNumber: document?.docNumber || 'N/A',
                date: movement.date.toISOString(),
                department: department?.name,
                division: undefined, // Would need division join
                recipient: document?.recipientName,
                supplier: undefined, // Would need supplier join
                notes: document?.notes
            };
        });
    }, [warehouseId]);
}

// Department Portal Hooks

// Fetch Requests for a Department
export function useRequests(departmentId?: number) {
    return useLiveQuery(async () => {
        if (!departmentId) return [];

        const requests = await db.requests
            .where("departmentId")
            .equals(departmentId)
            .reverse()
            .toArray();

        return requests;
    }, [departmentId]);
}

// Fetch All Pending Requests (for warehouse view)
export function useAllPendingRequests() {
    return useLiveQuery(async () => {
        return db.requests
            .where("status")
            .equals("pending")
            .reverse()
            .toArray();
    });
}

// Fetch Custody Records for a Department
export function useCustody(departmentId?: number) {
    return useLiveQuery(async () => {
        if (!departmentId) return [];

        return db.custody
            .where("departmentId")
            .equals(departmentId)
            .and(record => record.status === 'active')
            .toArray();
    }, [departmentId]);
}

// Save Request
export const saveRequest = async (requestData: Omit<import('@/lib/db').RequestRecord, 'id' | 'createdAt'>) => {
    return db.requests.add({
        ...requestData,
        createdAt: new Date(),
        status: 'pending'
    });
};
