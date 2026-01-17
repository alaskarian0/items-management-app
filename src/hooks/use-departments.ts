'use client';

import { useApiData } from './useApi';
import { useCallback, useMemo } from 'react';

export interface Department {
  id: number;
  name: string;
  description?: string;
  headOfDepartment?: string;
  employeeCount?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDepartmentDto {
  name: string;
  description?: string;
  headOfDepartment?: string;
  employeeCount?: number;
  isActive?: boolean;
}

export interface UpdateDepartmentDto extends Partial<CreateDepartmentDto> {}

export const useDepartments = () => {
  const {
    data,
    loading,
    fetchError,
    get,
    post,
    put,
    delete: deleteDepartment,
    refetch
  } = useApiData<Department>('/departments', {
    enableFetch: true,
  });

  // Extract departments from API response
  const departments: Department[] = useMemo(() => {
    if (!data) return [];
    const responseData = data as any;
    if (responseData?.data?.items && Array.isArray(responseData.data.items)) {
      return responseData.data.items;
    }
    if (Array.isArray(responseData?.data)) {
      return responseData.data;
    }
    if (Array.isArray(responseData)) {
      return responseData;
    }
    return [];
  }, [data]);

  const createDepartment = useCallback(async (departmentData: CreateDepartmentDto) => {
    try {
      const result = await post({
        data: departmentData,
        onSuccess: () => {
          refetch();
        }
      });
      return result;
    } catch (error) {
      console.error('Error creating department:', error);
      throw error;
    }
  }, [post, refetch]);

  const updateDepartment = useCallback(async (id: number, departmentData: UpdateDepartmentDto) => {
    try {
      const result = await put({
        customEndpoint: `/departments/${id}`,
        data: departmentData,
        onSuccess: () => {
          refetch();
        }
      });
      return result;
    } catch (error) {
      console.error('Error updating department:', error);
      throw error;
    }
  }, [put, refetch]);

  const removeDepartment = useCallback(async (id: number) => {
    try {
      const result = await deleteDepartment({
        customEndpoint: `/departments/${id}`,
        onSuccess: () => {
          refetch();
        }
      });
      return result;
    } catch (error) {
      console.error('Error deleting department:', error);
      throw error;
    }
  }, [deleteDepartment, refetch]);

  return {
    departments,
    loading,
    error: fetchError,
    createDepartment,
    updateDepartment,
    deleteDepartment: removeDepartment,
    refetch,
  };
};
