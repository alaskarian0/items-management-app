'use client';

import { useApiData } from './useApi';
import { useCallback, useMemo } from 'react';

export interface AssetCustody {
  id: number;
  custodyNumber: string;
  itemInstanceId: number;
  itemInstance?: {
    id: number;
    serialNumber: string;
    barcode?: string;
    status: number;
    condition?: string;
    itemMaster?: {
      id: number;
      name: string;
      code: string;
      unit?: {
        id: number;
        name: string;
        abbreviation: string;
      };
    };
  };
  employeeId: number;
  employee?: {
    id: number;
    employeeId: string;
    firstName: string;
    lastName: string;
    fullName: string;
    department?: {
      id: number;
      name: string;
    };
    division?: {
      id: number;
      name: string;
    };
    unit?: {
      id: number;
      name: string;
    };
  };
  departmentId?: string;
  divisionId?: string;
  unitId?: string;
  position?: string;
  startDate: string;
  endDate?: string;
  condition?: string;
  notes?: string;
  returnCondition?: string;
  returnNotes?: string;
  status: number;
  statusText: string;
}

export interface PendingItem {
  id: number;
  serialNumber: string;
  barcode?: string;
  status: number;
  condition?: string;
  purchaseDate?: string;
  purchasePrice?: number;
  itemMaster: {
    id: number;
    name: string;
    code: string;
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
  };
}

export interface CustodyMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CustodyFilters {
  employeeId?: number;
  itemInstanceId?: number;
  status?: number;
  page?: number;
  limit?: number;
}

// Status constants
export const CUSTODY_STATUS = {
  ACTIVE: 1,
  RETURNED: 2,
  OVERDUE: 3,
} as const;

export const CUSTODY_STATUS_TEXT: Record<number, string> = {
  1: 'نشط',
  2: 'تم الإرجاع',
  3: 'متأخر',
};

export const useAssetCustody = (filters?: CustodyFilters) => {
  const initialParams: Record<string, unknown> = {
    limit: filters?.limit ?? 50,
    page: filters?.page ?? 1,
  };

  if (filters?.employeeId) initialParams.employeeId = filters.employeeId;
  if (filters?.itemInstanceId) initialParams.itemInstanceId = filters.itemInstanceId;
  if (filters?.status) initialParams.status = filters.status;

  const {
    data,
    loading,
    fetchError,
    get,
    post,
    patch,
    delete: deleteCustody,
    refetch,
    updateParams,
  } = useApiData<AssetCustody>('/asset-custody', {
    enableFetch: true,
    pagination: false,
    initialParams,
  });

  // Extract custodies from API response
  const custodies: AssetCustody[] = useMemo(() => {
    if (!data) return [];
    const responseData = data as any;
    if (responseData?.data?.items && Array.isArray(responseData.data.items)) {
      return responseData.data.items;
    }
    if (Array.isArray(responseData?.data)) {
      return responseData.data;
    }
    return [];
  }, [data]);

  // Extract pagination meta
  const meta: CustodyMeta | null = useMemo(() => {
    if (!data) return null;
    const responseData = data as any;
    return responseData?.data?.meta || null;
  }, [data]);

  // Create asset custody (assign item to employee)
  const assignItem = useCallback(async (custodyData: {
    itemInstanceId: number;
    employeeId: number;
    departmentId: string;
    divisionId: string;
    unitId: string;
    position?: string;
    startDate: string;
    condition?: string;
    notes?: string;
  }) => {
    try {
      const result = await post({
        data: custodyData,
        onSuccess: () => {
          refetch();
        }
      });
      return result;
    } catch (error) {
      console.error('Error assigning item:', error);
      throw error;
    }
  }, [post, refetch]);

  // Return item (end custody)
  const returnItem = useCallback(async (id: number, returnData?: {
    returnCondition?: string;
    returnNotes?: string;
  }) => {
    try {
      const result = await post({
        customEndpoint: `/asset-custody/${id}/return`,
        data: returnData || {},
        onSuccess: () => {
          refetch();
        }
      });
      return result;
    } catch (error) {
      console.error('Error returning item:', error);
      throw error;
    }
  }, [post, refetch]);

  // Update custody
  const updateCustody = useCallback(async (id: number, updateData: {
    endDate?: string;
    returnCondition?: string;
    returnNotes?: string;
    status?: number;
  }) => {
    try {
      const result = await patch({
        customEndpoint: `/asset-custody/${id}`,
        data: updateData,
        onSuccess: () => {
          refetch();
        }
      });
      return result;
    } catch (error) {
      console.error('Error updating custody:', error);
      throw error;
    }
  }, [patch, refetch]);

  // Delete custody
  const removeCustody = useCallback(async (id: number) => {
    try {
      const result = await deleteCustody({
        customEndpoint: `/asset-custody/${id}`,
        onSuccess: () => {
          refetch();
        }
      });
      return result;
    } catch (error) {
      console.error('Error deleting custody:', error);
      throw error;
    }
  }, [deleteCustody, refetch]);

  // Update filters
  const setFilters = useCallback((newFilters: CustodyFilters) => {
    updateParams(newFilters);
  }, [updateParams]);

  return {
    custodies,
    meta,
    loading,
    error: fetchError,
    assignItem,
    returnItem,
    updateCustody,
    deleteCustody: removeCustody,
    refetch,
    setFilters,
  };
};

// Hook to get pending items (available for assignment)
export const usePendingItems = (warehouseId?: number) => {
  const initialParams: Record<string, unknown> = {};
  if (warehouseId) initialParams.warehouseId = warehouseId;

  const {
    data,
    loading,
    fetchError,
    refetch,
  } = useApiData<PendingItem>('/asset-custody/pending-items', {
    enableFetch: true,
    pagination: false,
    initialParams,
  });

  const pendingItems: PendingItem[] = useMemo(() => {
    if (!data) return [];
    const responseData = data as any;
    if (Array.isArray(responseData?.data)) {
      return responseData.data;
    }
    return [];
  }, [data]);

  return {
    pendingItems,
    loading,
    error: fetchError,
    refetch,
  };
};
