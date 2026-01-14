'use client';

import { useApiData } from './useApi';
import { useCallback } from 'react';

// Stock Request interfaces based on Prisma schema
export interface StockRequestItem {
  itemInstanceId?: number;
  itemMasterId?: number;
  quantity: number;
  notes?: string;
}

export interface CreateStockRequestDto {
  documentNumber: string;
  date: Date | string;
  documentType: 2; // 2 = Issuance (stock request/inquiry)
  subType?: number; // Optional sub-type for requests
  warehouseId: number;
  departmentId?: number;
  divisionId?: number;
  unitId?: number;
  recipientId?: number;
  priority?: number; // 1=Low, 2=Normal, 3=High, 4=Urgent
  expectedCompletionDate?: Date | string;
  status?: number; // 1=Draft, 2=Submitted, 3=Approved, etc.
  notes?: string;
  items?: StockRequestItem[];
}

export interface UpdateStockRequestDto extends Partial<CreateStockRequestDto> {}

export interface StockRequest {
  id: number;
  documentNumber: string;
  date: string;
  documentType: number;
  subType?: number;
  warehouseId: number;
  warehouseName?: string;
  departmentId?: number;
  departmentName?: string;
  divisionId?: number;
  divisionName?: string;
  unitId?: number;
  unitName?: string;
  recipientId?: number;
  recipientName?: string;
  priority?: number;
  expectedCompletionDate?: string;
  actualCompletionDate?: string;
  status: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const useStockRequests = () => {
  const {
    data,
    loading,
    fetchError,
    get,
    post,
    put,
    delete: deleteStockRequest,
    refetch,
    updateParams
  } = useApiData<StockRequest>('/documents', {
    enableFetch: true,
    pagination: true,
    initialParams: {
      limit: 50,
      documentType: 2, // Filter for issuance/request documents
    },
  });

  const createStockRequest = useCallback(async (requestData: CreateStockRequestDto) => {
    try {
      const result = await post({
        data: {
          ...requestData,
          documentType: 2, // Ensure it's an issuance/request document
          status: requestData.status || 1, // Default to Draft if not specified
        },
        onSuccess: () => {
          refetch();
        }
      });
      return result;
    } catch (error) {
      console.error('Error creating stock request:', error);
      throw error;
    }
  }, [post, refetch]);

  const updateStockRequest = useCallback(async (id: number, requestData: UpdateStockRequestDto) => {
    try {
      const result = await put({
        customEndpoint: `/documents/${id}`,
        data: requestData,
        onSuccess: () => {
          refetch();
        }
      });
      return result;
    } catch (error) {
      console.error('Error updating stock request:', error);
      throw error;
    }
  }, [put, refetch]);

  const removeStockRequest = useCallback(async (id: number) => {
    try {
      const result = await deleteStockRequest({
        customEndpoint: `/documents/${id}`,
        onSuccess: () => {
          refetch();
        }
      });
      return result;
    } catch (error) {
      console.error('Error deleting stock request:', error);
      throw error;
    }
  }, [deleteStockRequest, refetch]);

  const submitStockRequest = useCallback(async (id: number) => {
    try {
      const result = await put({
        customEndpoint: `/documents/${id}`,
        data: {
          status: 2, // 2 = Submitted
          submittedAt: new Date().toISOString(),
        },
        onSuccess: () => {
          refetch();
        }
      });
      return result;
    } catch (error) {
      console.error('Error submitting stock request:', error);
      throw error;
    }
  }, [put, refetch]);

  const approveStockRequest = useCallback(async (id: number) => {
    try {
      const result = await put({
        customEndpoint: `/documents/${id}`,
        data: {
          status: 3, // 3 = Approved
          approvedAt: new Date().toISOString(),
        },
        onSuccess: () => {
          refetch();
        }
      });
      return result;
    } catch (error) {
      console.error('Error approving stock request:', error);
      throw error;
    }
  }, [put, refetch]);

  const rejectStockRequest = useCallback(async (id: number, rejectionReason: string) => {
    try {
      const result = await put({
        customEndpoint: `/documents/${id}`,
        data: {
          status: 6, // 6 = Rejected
          rejectedAt: new Date().toISOString(),
          rejectionReason,
        },
        onSuccess: () => {
          refetch();
        }
      });
      return result;
    } catch (error) {
      console.error('Error rejecting stock request:', error);
      throw error;
    }
  }, [put, refetch]);

  return {
    stockRequests: data,
    loading,
    error: fetchError,
    createStockRequest,
    updateStockRequest,
    deleteStockRequest: removeStockRequest,
    submitStockRequest,
    approveStockRequest,
    rejectStockRequest,
    refetch,
    updateParams,
  };
};
