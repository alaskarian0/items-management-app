'use client';

import { useApiData } from './useApi';
import { useCallback, useMemo } from 'react';

export interface Employee {
  id: number;
  employeeId: string;
  firstName: string;
  lastName: string;
  fullName: string;
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
  isActive: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface EmployeeFilters {
  departmentId?: number;
  divisionId?: number;
  unitId?: number;
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export const useEmployees = (filters?: EmployeeFilters) => {
  const initialParams: Record<string, unknown> = {
    limit: filters?.limit ?? 50,
    page: filters?.page ?? 1,
  };

  if (filters?.departmentId) initialParams.departmentId = filters.departmentId;
  if (filters?.divisionId) initialParams.divisionId = filters.divisionId;
  if (filters?.unitId) initialParams.unitId = filters.unitId;
  if (filters?.search) initialParams.search = filters.search;
  if (filters?.isActive !== undefined) initialParams.isActive = filters.isActive;

  const {
    data,
    loading,
    fetchError,
    post,
    patch,
    delete: deleteEmployee,
    refetch,
    updateParams,
  } = useApiData<Employee>('/employees', {
    enableFetch: true,
    pagination: false,
    initialParams,
  });

  // Extract employees from API response
  const employees: Employee[] = useMemo(() => {
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
  const meta: EmployeeMeta | null = useMemo(() => {
    if (!data) return null;
    const responseData = data as any;
    return responseData?.data?.meta || null;
  }, [data]);

  // Create employee
  const createEmployee = useCallback(async (employeeData: {
    employeeId: string;
    firstName: string;
    lastName: string;
    departmentId?: number;
    divisionId?: number;
    unitId?: number;
    notes?: string;
  }) => {
    try {
      const result = await post({
        data: employeeData,
        onSuccess: () => {
          refetch();
        }
      });
      return result;
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error;
    }
  }, [post, refetch]);

  // Update employee
  const updateEmployee = useCallback(async (id: number, employeeData: Partial<Employee>) => {
    try {
      const result = await patch({
        customEndpoint: `/employees/${id}`,
        data: employeeData,
        onSuccess: () => {
          refetch();
        }
      });
      return result;
    } catch (error) {
      console.error('Error updating employee:', error);
      throw error;
    }
  }, [patch, refetch]);

  // Delete employee
  const removeEmployee = useCallback(async (id: number) => {
    try {
      const result = await deleteEmployee({
        customEndpoint: `/employees/${id}`,
        onSuccess: () => {
          refetch();
        }
      });
      return result;
    } catch (error) {
      console.error('Error deleting employee:', error);
      throw error;
    }
  }, [deleteEmployee, refetch]);

  // Update filters
  const setFilters = useCallback((newFilters: EmployeeFilters) => {
    updateParams(newFilters);
  }, [updateParams]);

  return {
    employees,
    meta,
    loading,
    error: fetchError,
    createEmployee,
    updateEmployee,
    deleteEmployee: removeEmployee,
    refetch,
    setFilters,
  };
};
