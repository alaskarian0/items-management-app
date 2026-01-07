'use client';

import { useApiData } from './useApi';
import { useCallback } from 'react';

export interface ItemInstance {
  id: number;
  itemMasterId: number;
  serialNumber: string;
  barcode?: string;
  warehouseId?: number;
  status: number; // 1: Available, 2: In Use, 3: Damaged, 4: Under Maintenance, 5: Disposed
  condition?: string;
  purchaseDate?: Date | string;
  purchasePrice?: number;
  warranty?: string;
  warrantyPeriod?: number;
  warrantyUnit?: string;
  expiryDate?: Date | string;
  notes?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  itemMaster?: {
    id: number;
    name: string;
    code: string;
    price: number;
    unit?: {
      id: number;
      name: string;
      abbreviation: string;
    };
    category?: {
      id: number;
      name: string;
    };
  };
  warehouse?: {
    id: number;
    name: string;
    code?: string;
  };
}

export interface CreateItemInstanceDto {
  itemMasterId: number;
  serialNumber?: string;
  warehouseId?: number;
  status?: number;
  condition?: string;
  purchaseDate?: Date | string;
  purchasePrice?: number;
  warranty?: string;
  warrantyPeriod?: number;
  warrantyUnit?: string;
  expiryDate?: Date | string;
  notes?: string;
}

export interface CreateBulkItemInstanceDto {
  itemMasterId: number;
  quantity: number;
  warehouseId?: number;
  purchaseDate?: Date | string;
  purchasePrice?: number;
  condition?: string;
}

export interface UpdateItemInstanceDto extends Partial<CreateItemInstanceDto> {}

export interface ItemInstanceFilters {
  itemMasterId?: number;
  warehouseId?: number;
  status?: number;
}

export const useItemInstances = (filters?: ItemInstanceFilters) => {
  // Build query params from filters
  const queryParams: Record<string, string> = {};
  if (filters?.itemMasterId) queryParams.itemMasterId = String(filters.itemMasterId);
  if (filters?.warehouseId) queryParams.warehouseId = String(filters.warehouseId);
  if (filters?.status) queryParams.status = String(filters.status);

  const endpoint = '/item-instance' + (Object.keys(queryParams).length > 0
    ? '?' + new URLSearchParams(queryParams).toString()
    : '');

  const {
    data,
    loading,
    fetchError,
    get,
    post,
    patch,
    delete: deleteItemInstance,
    refetch
  } = useApiData<ItemInstance>(endpoint, {
    enableFetch: true,
  });

  const createItemInstance = useCallback(async (instanceData: CreateItemInstanceDto) => {
    try {
      const result = await post({
        customEndpoint: '/item-instance',
        data: instanceData,
        onSuccess: () => {
          refetch();
        }
      });
      return result;
    } catch (error) {
      console.error('Error creating item instance:', error);
      throw error;
    }
  }, [post, refetch]);

  const createBulkItemInstances = useCallback(async (bulkData: CreateBulkItemInstanceDto) => {
    try {
      const result = await post({
        customEndpoint: '/item-instance/bulk',
        data: bulkData,
        onSuccess: () => {
          refetch();
        }
      });
      return result;
    } catch (error) {
      console.error('Error creating bulk item instances:', error);
      throw error;
    }
  }, [post, refetch]);

  const updateItemInstance = useCallback(async (id: number, instanceData: UpdateItemInstanceDto) => {
    try {
      const result = await patch({
        customEndpoint: `/item-instance/${id}`,
        data: instanceData,
        onSuccess: () => {
          refetch();
        }
      });
      return result;
    } catch (error) {
      console.error('Error updating item instance:', error);
      throw error;
    }
  }, [patch, refetch]);

  const updateItemInstanceStatus = useCallback(async (id: number, status: number, notes?: string) => {
    try {
      const result = await patch({
        customEndpoint: `/item-instance/${id}/status`,
        data: { status, notes },
        onSuccess: () => {
          refetch();
        }
      });
      return result;
    } catch (error) {
      console.error('Error updating item instance status:', error);
      throw error;
    }
  }, [patch, refetch]);

  const transferItemInstance = useCallback(async (id: number, toWarehouseId: number, notes?: string) => {
    try {
      const result = await post({
        customEndpoint: `/item-instance/${id}/transfer`,
        data: { toWarehouseId, notes },
        onSuccess: () => {
          refetch();
        }
      });
      return result;
    } catch (error) {
      console.error('Error transferring item instance:', error);
      throw error;
    }
  }, [post, refetch]);

  const removeItemInstance = useCallback(async (id: number) => {
    try {
      const result = await deleteItemInstance({
        customEndpoint: `/item-instance/${id}`,
        onSuccess: () => {
          refetch();
        }
      });
      return result;
    } catch (error) {
      console.error('Error deleting item instance:', error);
      throw error;
    }
  }, [deleteItemInstance, refetch]);

  const getItemInstanceById = useCallback(async (id: number) => {
    try {
      const result = await get(`/item-instance/${id}`);
      return result;
    } catch (error) {
      console.error('Error fetching item instance:', error);
      throw error;
    }
  }, [get]);

  const getItemInstanceBySerial = useCallback(async (serialNumber: string) => {
    try {
      const result = await get(`/item-instance/serial/${serialNumber}`);
      return result;
    } catch (error) {
      console.error('Error fetching item instance by serial:', error);
      throw error;
    }
  }, [get]);

  const getStatistics = useCallback(async () => {
    try {
      const result = await get('/item-instance/statistics');
      return result;
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw error;
    }
  }, [get]);

  return {
    itemInstances: data,
    loading,
    error: fetchError,
    createItemInstance,
    createBulkItemInstances,
    updateItemInstance,
    updateItemInstanceStatus,
    transferItemInstance,
    deleteItemInstance: removeItemInstance,
    getItemInstanceById,
    getItemInstanceBySerial,
    getStatistics,
    refetch,
  };
};
