'use client';

import { useApiData } from './useApi';
import { useCallback } from 'react';

export interface EntryDocument {
  id: number;
  documentNumber: string;
  date: Date | string;
  warehouseId: number;
  departmentId: number;
  divisionId?: number;
  unitId?: number;
  documentType: number; // 1: New Entry, 2: Issuance Document
  entryMethod: number;  // 1: direct, 2: indirect
  entryType: number;    // 1: Purchases, 2: gifts, 3: returns
  recipientName: string;
  notes?: string;
  warehouse?: {
    id: number;
    name: string;
    code?: string;
  };
}

export interface CreateEntryDocumentDto {
  documentNumber: string;
  date: Date | string;
  warehouseId: number;
  departmentId: number;
  divisionId?: number;
  unitId?: number;
  documentType: number;
  entryMethod: number;
  entryType: number;
  recipientName: string;
  notes?: string;
}

export interface UpdateEntryDocumentDto extends Partial<CreateEntryDocumentDto> {}

export const useEntryDocuments = () => {
  const {
    data,
    loading,
    fetchError,
    get,
    post,
    patch,
    delete: deleteEntryDocument,
    refetch
  } = useApiData<EntryDocument>('/entry-documents', {
    enableFetch: true,
  });

  const createEntryDocument = useCallback(async (documentData: CreateEntryDocumentDto) => {
    try {
      const result = await post({
        data: documentData,
        onSuccess: () => {
          refetch();
        }
      });
      return result;
    } catch (error) {
      console.error('Error creating entry document:', error);
      throw error;
    }
  }, [post, refetch]);

  const updateEntryDocument = useCallback(async (id: number, documentData: UpdateEntryDocumentDto) => {
    try {
      const result = await patch({
        customEndpoint: `/entry-documents/${id}`,
        data: documentData,
        onSuccess: () => {
          refetch();
        }
      });
      return result;
    } catch (error) {
      console.error('Error updating entry document:', error);
      throw error;
    }
  }, [patch, refetch]);

  const removeEntryDocument = useCallback(async (id: number) => {
    try {
      const result = await deleteEntryDocument({
        customEndpoint: `/entry-documents/${id}`,
        onSuccess: () => {
          refetch();
        }
      });
      return result;
    } catch (error) {
      console.error('Error deleting entry document:', error);
      throw error;
    }
  }, [deleteEntryDocument, refetch]);

  const getEntryDocumentById = useCallback(async (id: number) => {
    try {
      const result = await get(`/entry-documents/${id}`);
      return result;
    } catch (error) {
      console.error('Error fetching entry document:', error);
      throw error;
    }
  }, [get]);

  return {
    entryDocuments: data,
    loading,
    error: fetchError,
    createEntryDocument,
    updateEntryDocument,
    deleteEntryDocument: removeEntryDocument,
    getEntryDocumentById,
    refetch,
  };
};
