'use client';

import { useApiData } from './useApi';
import { useCallback } from 'react';

export interface Division {
  id: number;
  name: string;
  description?: string;
  headOfDivision?: string;
  employeeCount?: number;
  departmentId: number;
  departmentName?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDivisionDto {
  name: string;
  description?: string;
  headOfDivision?: string;
  employeeCount?: number;
  departmentId: number;
  isActive?: boolean;
}

export interface UpdateDivisionDto extends Partial<CreateDivisionDto> {}

export const useDivisions = (departmentId?: number) => {
  const endpoint = departmentId ? `/divisions?departmentId=${departmentId}` : '/divisions';

  const {
    data,
    loading,
    fetchError,
    get,
    post,
    put,
    delete: deleteDivision,
    refetch
  } = useApiData<Division>(endpoint, {
    enableFetch: true,
  });

  const createDivision = useCallback(async (divisionData: CreateDivisionDto) => {
    try {
      const result = await post({
        data: divisionData,
        onSuccess: () => {
          refetch();
        }
      });
      return result;
    } catch (error) {
      console.error('Error creating division:', error);
      throw error;
    }
  }, [post, refetch]);

  const updateDivision = useCallback(async (id: number, divisionData: UpdateDivisionDto) => {
    try {
      const result = await put({
        customEndpoint: `/divisions/${id}`,
        data: divisionData,
        onSuccess: () => {
          refetch();
        }
      });
      return result;
    } catch (error) {
      console.error('Error updating division:', error);
      throw error;
    }
  }, [put, refetch]);

  const removeDivision = useCallback(async (id: number) => {
    try {
      const result = await deleteDivision({
        customEndpoint: `/divisions/${id}`,
        onSuccess: () => {
          refetch();
        }
      });
      return result;
    } catch (error) {
      console.error('Error deleting division:', error);
      throw error;
    }
  }, [deleteDivision, refetch]);

  return {
    divisions: data,
    loading,
    error: fetchError,
    createDivision,
    updateDivision,
    deleteDivision: removeDivision,
    refetch,
  };
};
