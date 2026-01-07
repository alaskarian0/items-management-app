'use client';

import { useApiData } from './useApi';
import { useCallback } from 'react';

export interface Vendor {
  id: number;
  name: string;
  contactPerson: string;
  description?: string;
  phone: string;
  address: string;
  website?: string;
  categoryId?: number;
  categoryName?: string;
  rating?: number;
  isActive: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVendorDto {
  name: string;
  contactPerson: string;
  description?: string;
  phone: string;
  address: string;
  website?: string;
  categoryId?: number;
  rating?: number;
  isActive?: boolean;
  notes?: string;
}

export interface UpdateVendorDto extends Partial<CreateVendorDto> {}

export const useVendors = (categoryId?: number) => {
  const endpoint = categoryId ? `/vendors?categoryId=${categoryId}` : '/vendors';

  const {
    data,
    loading,
    fetchError,
    get,
    post,
    put,
    delete: deleteVendor,
    refetch
  } = useApiData<Vendor>(endpoint, {
    enableFetch: true,
  });

  const createVendor = useCallback(async (vendorData: CreateVendorDto) => {
    try {
      const result = await post({
        data: vendorData,
        onSuccess: () => {
          refetch();
        }
      });
      return result;
    } catch (error) {
      console.error('Error creating vendor:', error);
      throw error;
    }
  }, [post, refetch]);

  const updateVendor = useCallback(async (id: number, vendorData: UpdateVendorDto) => {
    try {
      const result = await put({
        customEndpoint: `/vendors/${id}`,
        data: vendorData,
        onSuccess: () => {
          refetch();
        }
      });
      return result;
    } catch (error) {
      console.error('Error updating vendor:', error);
      throw error;
    }
  }, [put, refetch]);

  const removeVendor = useCallback(async (id: number) => {
    try {
      const result = await deleteVendor({
        customEndpoint: `/vendors/${id}`,
        onSuccess: () => {
          refetch();
        }
      });
      return result;
    } catch (error) {
      console.error('Error deleting vendor:', error);
      throw error;
    }
  }, [deleteVendor, refetch]);

  return {
    vendors: data,
    loading,
    error: fetchError,
    createVendor,
    updateVendor,
    deleteVendor: removeVendor,
    refetch,
  };
};
