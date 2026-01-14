'use client';

import { useApiData } from './useApi';
import { Warehouse } from '@/lib/types/warehouse';
import { useCallback } from 'react';

export interface CreateWarehouseDto {
  name: string;
  code?: string;
  address?: string;
  departmentId?: number;
  divisionId?: number;
  unitId?: number;
  isActive?: boolean;
  children?: number;
  level?: number;
  itemCount?: number;
}

export interface UpdateWarehouseDto extends Partial<CreateWarehouseDto> {}

export const useWarehouses = () => {
  const {
    data,
    loading,
    fetchError,
    get,
    post,
    put,
    delete: deleteWarehouse,
    refetch
  } = useApiData<Warehouse>('/warehouses', {
    enableFetch: true,
    pagination: true,
    initialParams: {
      limit: 50,
    },
  });

  const createWarehouse = useCallback(async (warehouseData: CreateWarehouseDto) => {
    try {
      const result = await post({
        data: warehouseData,
        onSuccess: () => {
          refetch();
        }
      });
      return result;
    } catch (error) {
      console.error('Error creating warehouse:', error);
      throw error;
    }
  }, [post, refetch]);

  const updateWarehouse = useCallback(async (id: number, warehouseData: UpdateWarehouseDto) => {
    try {
      const result = await put({
        customEndpoint: `/warehouses/${id}`,
        data: warehouseData,
        onSuccess: () => {
          refetch();
        }
      });
      return result;
    } catch (error) {
      console.error('Error updating warehouse:', error);
      throw error;
    }
  }, [put, refetch]);

  const removeWarehouse = useCallback(async (id: number) => {
    try {
      const result = await deleteWarehouse({
        customEndpoint: `/warehouses/${id}`,
        onSuccess: () => {
          refetch();
        }
      });
      return result;
    } catch (error) {
      console.error('Error deleting warehouse:', error);
      throw error;
    }
  }, [deleteWarehouse, refetch]);

  return {
    warehouses: data,
    loading,
    error: fetchError,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse: removeWarehouse,
    refetch,
  };
};
