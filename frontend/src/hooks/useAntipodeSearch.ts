import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../services/api/client';
import type {
  AntipodeSearchPayload,
  AntipodeSearchResponse,
} from '../types/antipode';

export function useAntipodeSearch() {
  return useMutation<AntipodeSearchResponse, Error, AntipodeSearchPayload>({
    mutationKey: ['antipode-search'],
    mutationFn: async (payload) => apiClient.post('/antipode/search', payload),
  });
}
