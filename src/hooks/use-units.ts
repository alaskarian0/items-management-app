'use client';

import { useApiData } from './useApi';
import { useCallback } from 'react';

export interface Unit {
  id: number;
  name: string;
  description?: string;
  unitHead?: string;
  employeeCount?: number;
  divisionId: number;
  departmentId: number;
  divisionName?: string;
  departmentName?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUnitDto {
  name: string;
  description?: string;
  unitHead?: string;
  employeeCount?: number;
  divisionId: number;
  departmentId: number;
  isActive?: boolean;
}

export interface UpdateUnitDto extends Partial<CreateUnitDto> {}

export const useUnits = (divisionId?: number, departmentId?: number) => {
  let endpoint = '/units';
  if (divisionId) {
    endpoint = `/units?divisionId=${divisionId}`;
  } else if (departmentId) {
    endpoint = `/units?departmentId=${departmentId}`;
  }

  const {
    data,
    loading,
    fetchError,
    get,
    post,
    put,
    delete: deleteUnit,
    refetch
  } = useApiData<Unit>(endpoint, {
    enableFetch: true,
  });

  const createUnit = useCallback(async (unitData: CreateUnitDto) => {
    try {
      const result = await post({
        data: unitData,
        onSuccess: () => {
          refetch();
        }
      });
      return result;
    } catch (error) {
      console.error('Error creating unit:', error);
      throw error;
    }
  }, [post, refetch]);

  const updateUnit = useCallback(async (id: number, unitData: UpdateUnitDto) => {
    try {
      const result = await put({
        customEndpoint: `/units/${id}`,
        data: unitData,
        onSuccess: () => {
          refetch();
        }
      });
      return result;
    } catch (error) {
      console.error('Error updating unit:', error);
      throw error;
    }
  }, [put, refetch]);

  const removeUnit = useCallback(async (id: number) => {
    try {
      const result = await deleteUnit({
        customEndpoint: `/units/${id}`,
        onSuccess: () => {
          refetch();
        }
      });
      return result;
    } catch (error) {
      console.error('Error deleting unit:', error);
      throw error;
    }
  }, [deleteUnit, refetch]);

  return {
    units: data,
    loading,
    error: fetchError,
    createUnit,
    updateUnit,
    deleteUnit: removeUnit,
    refetch,
  };
};
