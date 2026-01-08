'use client';

import { useApiData } from './useApi';
import { useCallback } from 'react';

export interface ItemMaster {
  id: number;
  name: string;
  code: string;
  categoryId?: number;
  unitId: number;
  price: number;
  minStock: number;
  description?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  unit?: {
    id: number;
    name: string;
    abbreviation: string;
  };
  category?: {
    id: number;
    name: string;
  };
}

export interface CreateItemMasterDto {
  name: string;
  code: string;
  categoryId?: number;
  unitId: number;
  price: number;
  minStock: number;
  description?: string;
}

export interface UpdateItemMasterDto extends Partial<CreateItemMasterDto> {}

export const useItemMasters = () => {
  const {
    data,
    loading,
    fetchError,
    get,
    post,
    patch,
    delete: deleteItemMaster,
    refetch
  } = useApiData<ItemMaster>('/item-master', {
    enableFetch: true,
  });

  const createItemMaster = useCallback(async (itemData: CreateItemMasterDto) => {
    try {
      const result = await post({
        data: itemData,
        onSuccess: () => {
          refetch();
        }
      });
      return result;
    } catch (error) {
      console.error('Error creating item master:', error);
      throw error;
    }
  }, [post, refetch]);

  const updateItemMaster = useCallback(async (id: number, itemData: UpdateItemMasterDto) => {
    try {
      const result = await patch({
        customEndpoint: `/item-master/${id}`,
        data: itemData,
        onSuccess: () => {
          refetch();
        }
      });
      return result;
    } catch (error) {
      console.error('Error updating item master:', error);
      throw error;
    }
  }, [patch, refetch]);

  const removeItemMaster = useCallback(async (id: number) => {
    try {
      const result = await deleteItemMaster({
        customEndpoint: `/item-master/${id}`,
        onSuccess: () => {
          refetch();
        }
      });
      return result;
    } catch (error) {
      console.error('Error deleting item master:', error);
      throw error;
    }
  }, [deleteItemMaster, refetch]);

  const getItemMasterById = useCallback(async (id: number) => {
    try {
      const result = await get(`/item-master/${id}`);
      return result;
    } catch (error) {
      console.error('Error fetching item master:', error);
      throw error;
    }
  }, [get]);

  const getLowStockItems = useCallback(async () => {
    try {
      const result = await get('/item-master/low-stock');
      return result;
    } catch (error) {
      console.error('Error fetching low stock items:', error);
      throw error;
    }
  }, [get]);

  const getStockSummary = useCallback(async (id: number) => {
    try {
      const result = await get(`/item-master/${id}/stock-summary`);
      return result;
    } catch (error) {
      console.error('Error fetching stock summary:', error);
      throw error;
    }
  }, [get]);

  return {
    itemMasters: data,
    loading,
    error: fetchError,
    createItemMaster,
    updateItemMaster,
    deleteItemMaster: removeItemMaster,
    getItemMasterById,
    getLowStockItems,
    getStockSummary,
    refetch,
  };
};
