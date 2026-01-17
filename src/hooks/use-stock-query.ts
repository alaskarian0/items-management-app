'use client';

import { useApiData } from './useApi';
import { useCallback, useMemo } from 'react';

// Stock Query Request interfaces
export interface StockQueryRequestItem {
  id?: number;
  itemMasterId: number;
  requestedQuantity: number;
  notes?: string;
  // Result fields (filled after approval)
  availableStock?: number | null;
  approvedQuantity?: number | null;
  resultNotes?: string | null;
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
}

export interface CreateStockQueryRequestDto {
  warehouseId: number;
  requestDate: string;
  purpose?: string;
  requesterId?: number;
  requesterName?: string;
  departmentId?: number;
  divisionId?: number;
  unitId?: number;
  notes?: string;
  items: {
    itemMasterId: number;
    requestedQuantity: number;
    notes?: string;
  }[];
}

export interface ApproveRequestDto {
  approverId: number;
  items?: {
    itemId: number;
    approvedQuantity?: number;
    resultNotes?: string;
  }[];
}

export interface RejectRequestDto {
  rejectorId: number;
  reason: string;
}

export interface StockQueryRequest {
  id: number;
  requestNumber: string;
  warehouseId: number;
  warehouse?: {
    id: number;
    name: string;
    code?: string;
  };
  requestDate: string;
  purpose?: string;
  requesterId?: number;
  requesterName?: string;
  departmentId?: number;
  department?: {
    id: number;
    name: string;
  };
  divisionId?: number;
  division?: {
    id: number;
    name: string;
  };
  unitId?: number;
  unit?: {
    id: number;
    name: string;
  };
  status: number;
  statusText: string;
  approvedBy?: number;
  approvedAt?: string;
  rejectedBy?: number;
  rejectedAt?: string;
  rejectionReason?: string;
  completedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  items: StockQueryRequestItem[];
  itemCount: number;
}

export interface StockQueryMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Status constants
export const STOCK_QUERY_STATUS = {
  PENDING: 1,
  APPROVED: 2,
  REJECTED: 3,
  COMPLETED: 4,
} as const;

export const STOCK_QUERY_STATUS_TEXT: Record<number, string> = {
  1: 'قيد الانتظار',
  2: 'تمت الموافقة',
  3: 'مرفوض',
  4: 'مكتمل',
};

export const useStockQuery = (filters?: {
  status?: number;
  warehouseId?: number;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}) => {
  const initialParams: Record<string, unknown> = {
    limit: filters?.limit ?? 20,
    page: filters?.page ?? 1,
  };

  if (filters?.status) initialParams.status = filters.status;
  if (filters?.warehouseId) initialParams.warehouseId = filters.warehouseId;
  if (filters?.fromDate) initialParams.fromDate = filters.fromDate;
  if (filters?.toDate) initialParams.toDate = filters.toDate;

  const {
    data,
    loading,
    fetchError,
    post,
    refetch,
    updateParams,
  } = useApiData<StockQueryRequest>('/stock-query/requests', {
    enableFetch: true,
    pagination: false,
    initialParams,
  });

  // Extract items from API response
  const requests: StockQueryRequest[] = useMemo(() => {
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
  const meta: StockQueryMeta | null = useMemo(() => {
    if (!data) return null;
    const responseData = data as any;
    return responseData?.data?.meta || null;
  }, [data]);

  // Create a new stock query request
  const createRequest = useCallback(async (requestData: CreateStockQueryRequestDto) => {
    try {
      const result = await post({
        customEndpoint: '/stock-query/request',
        data: requestData,
        onSuccess: () => {
          refetch();
        }
      });
      return result;
    } catch (error) {
      console.error('Error creating stock query request:', error);
      throw error;
    }
  }, [post, refetch]);

  // Approve a request
  const approveRequest = useCallback(async (requestId: number, dto: ApproveRequestDto) => {
    try {
      const result = await post({
        customEndpoint: `/stock-query/${requestId}/approve`,
        data: dto,
        onSuccess: () => {
          refetch();
        }
      });
      return result;
    } catch (error) {
      console.error('Error approving stock query request:', error);
      throw error;
    }
  }, [post, refetch]);

  // Reject a request
  const rejectRequest = useCallback(async (requestId: number, dto: RejectRequestDto) => {
    try {
      const result = await post({
        customEndpoint: `/stock-query/${requestId}/reject`,
        data: dto,
        onSuccess: () => {
          refetch();
        }
      });
      return result;
    } catch (error) {
      console.error('Error rejecting stock query request:', error);
      throw error;
    }
  }, [post, refetch]);

  // Update filters
  const setFilters = useCallback((newFilters: {
    status?: number;
    warehouseId?: number;
    fromDate?: string;
    toDate?: string;
    page?: number;
  }) => {
    updateParams(newFilters);
  }, [updateParams]);

  return {
    requests,
    meta,
    loading,
    error: fetchError,
    createRequest,
    approveRequest,
    rejectRequest,
    refetch,
    setFilters,
  };
};

// Hook for pending requests (for approvers)
export const usePendingStockQueries = (warehouseId?: number) => {
  const initialParams: Record<string, unknown> = {
    limit: 20,
    page: 1,
  };

  if (warehouseId) initialParams.warehouseId = warehouseId;

  const {
    data,
    loading,
    fetchError,
    refetch,
    updateParams,
  } = useApiData<StockQueryRequest>('/stock-query/pending', {
    enableFetch: true,
    pagination: false,
    initialParams,
  });

  const requests: StockQueryRequest[] = useMemo(() => {
    if (!data) return [];
    const responseData = data as any;
    if (responseData?.data?.items && Array.isArray(responseData.data.items)) {
      return responseData.data.items;
    }
    return [];
  }, [data]);

  const meta: StockQueryMeta | null = useMemo(() => {
    if (!data) return null;
    const responseData = data as any;
    return responseData?.data?.meta || null;
  }, [data]);

  return {
    requests,
    meta,
    loading,
    error: fetchError,
    refetch,
    updateParams,
  };
};

// Hook for my requests (for requesters)
export const useMyStockQueries = (requesterId: number, status?: number) => {
  const initialParams: Record<string, unknown> = {
    requesterId,
    limit: 20,
    page: 1,
  };

  if (status) initialParams.status = status;

  const {
    data,
    loading,
    fetchError,
    refetch,
    updateParams,
  } = useApiData<StockQueryRequest>('/stock-query/my-requests', {
    enableFetch: requesterId > 0,
    pagination: false,
    initialParams,
  });

  const requests: StockQueryRequest[] = useMemo(() => {
    if (!data) return [];
    const responseData = data as any;
    if (responseData?.data?.items && Array.isArray(responseData.data.items)) {
      return responseData.data.items;
    }
    return [];
  }, [data]);

  const meta: StockQueryMeta | null = useMemo(() => {
    if (!data) return null;
    const responseData = data as any;
    return responseData?.data?.meta || null;
  }, [data]);

  return {
    requests,
    meta,
    loading,
    error: fetchError,
    refetch,
    updateParams,
  };
};

// Hook to get a single request by ID
export const useStockQueryRequest = (requestId: number) => {
  const {
    data,
    loading,
    fetchError,
    refetch,
  } = useApiData<StockQueryRequest>(`/stock-query/${requestId}`, {
    enableFetch: requestId > 0,
    pagination: false,
  });

  const request: StockQueryRequest | null = useMemo(() => {
    if (!data) return null;
    const responseData = data as any;
    return responseData?.data || null;
  }, [data]);

  return {
    request,
    loading,
    error: fetchError,
    refetch,
  };
};
