'use client';

import { useApiData } from './useApi';
import { useCallback, useMemo } from 'react';

export type UnitType = 'weight' | 'length' | 'volume' | 'area' | 'count' | 'time' | 'temperature';

// Type mapping between frontend and backend
export const UNIT_TYPE_MAP = {
  weight: 1,
  length: 2,
  volume: 3,
  area: 4,
  count: 5,
  time: 6,
  temperature: 7
} as const;

export const UNIT_TYPE_REVERSE_MAP = {
  1: 'weight',
  2: 'length',
  3: 'volume',
  4: 'area',
  5: 'count',
  6: 'time',
  7: 'temperature'
} as const;

export interface MeasurementUnit {
  id: number;
  name: string;
  nameEnglish?: string;
  abbreviation: string;
  abbreviationEnglish?: string;
  type: UnitType;
  baseUnitId?: number;
  conversionFactor?: number;
  isActive: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMeasurementUnitDto {
  name: string;
  nameEnglish?: string;
  abbreviation: string;
  abbreviationEnglish?: string;
  type: UnitType;
  baseUnitId?: number;
  conversionFactor?: number;
  isActive?: boolean;
  description?: string;
}

export interface UpdateMeasurementUnitDto extends Partial<CreateMeasurementUnitDto> {}

export const useMeasurementUnits = (typeFilter?: UnitType) => {
  const endpoint = '/measurement-units';

  const {
    data,
    loading,
    fetchError,
    get,
    post,
    put,
    delete: deleteMeasurementUnit,
    refetch
  } = useApiData<any>(endpoint, {
    enableFetch: true,
  });

  const createMeasurementUnit = useCallback(async (unitData: CreateMeasurementUnitDto) => {
    try {
      // Convert type from string to number for backend
      const backendData = {
        ...unitData,
        type: UNIT_TYPE_MAP[unitData.type],
        isActive: unitData.isActive ?? true
      };

      const result = await post({
        data: backendData,
        onSuccess: () => {
          refetch();
        }
      });
      return result;
    } catch (error) {
      console.error('Error creating measurement unit:', error);
      throw error;
    }
  }, [post, refetch]);

  const updateMeasurementUnit = useCallback(async (id: number, unitData: UpdateMeasurementUnitDto) => {
    try {
      // Convert type from string to number for backend if provided
      const backendData: any = { ...unitData };
      if (unitData.type) {
        backendData.type = UNIT_TYPE_MAP[unitData.type];
      }

      const result = await put({
        customEndpoint: `/measurement-units/${id}`,
        data: backendData,
        onSuccess: () => {
          refetch();
        }
      });
      return result;
    } catch (error) {
      console.error('Error updating measurement unit:', error);
      throw error;
    }
  }, [put, refetch]);

  const removeMeasurementUnit = useCallback(async (id: number) => {
    try {
      const result = await deleteMeasurementUnit({
        customEndpoint: `/measurement-units/${id}`,
        onSuccess: () => {
          refetch();
        }
      });
      return result;
    } catch (error) {
      console.error('Error deleting measurement unit:', error);
      throw error;
    }
  }, [deleteMeasurementUnit, refetch]);

  // Convert backend data (type as number) to frontend format (type as string)
  const processedData = useMemo(() => {
    if (!data?.data) return data;

    return {
      ...data,
      data: Array.isArray(data.data)
        ? data.data.map((unit: any) => ({
            ...unit,
            type: UNIT_TYPE_REVERSE_MAP[unit.type as keyof typeof UNIT_TYPE_REVERSE_MAP] || 'count'
          })).filter((unit: any) => !typeFilter || unit.type === typeFilter)
        : 'items' in data.data
        ? data.data.items.map((unit: any) => ({
            ...unit,
            type: UNIT_TYPE_REVERSE_MAP[unit.type as keyof typeof UNIT_TYPE_REVERSE_MAP] || 'count'
          })).filter((unit: any) => !typeFilter || unit.type === typeFilter)
        : data.data
    };
  }, [data, typeFilter]);

  return {
    measurementUnits: processedData,
    loading,
    error: fetchError,
    createMeasurementUnit,
    updateMeasurementUnit,
    deleteMeasurementUnit: removeMeasurementUnit,
    refetch,
  };
};
