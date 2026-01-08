"use client";

import { useApiData } from './useApi';

export interface VendorCategory {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function useVendorCategories() {
  const {
    data: categoriesData,
    isLoading,
    error,
    refetch,
  } = useApiData<{ status: string; data: VendorCategory[] }>('/vendor-categories');

  return {
    categories: categoriesData,
    isLoading,
    error,
    refetch,
  };
}
