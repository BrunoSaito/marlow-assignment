import { useEffect } from 'react';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import { DepartureChecklistDatasource } from '../data/datasource';
import { ChecklistItemStatus, RequestHandlerProps } from '../model';

export const useGetDepartureChecklists = () => {
  const query = useQuery({
    queryKey: ['departure-checklist'],
    queryFn: async () => {
      return DepartureChecklistDatasource.getDepartureChecklists();
    },
  });

  return {
    loading: query.isLoading,
    data: query.data,
    error: query.error,
  };
};

export const useGetDepartureChecklistById = (id: string) => {
  const query = useQuery({
    queryKey: ['departure-checklist-by-id'],
    queryFn: async () => {
      return DepartureChecklistDatasource.getDepartureChecklistById(id);
    },
  });

  return {
    loading: query.isLoading,
    data: query.data,
    error: query.error,
  };
};

export const useUpdateDepartureChecklistItemStatus = (requestHandler?: RequestHandlerProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (params: { id: string, checklistItemId: string, newStatus: ChecklistItemStatus }) => {
      return DepartureChecklistDatasource.updateDepartureChecklistItemStatus(params.id, params.checklistItemId, params.newStatus);
    },
  })

  useEffect(() => {
    if (mutation.isSuccess) {
      requestHandler?.onSuccess?.(mutation.data);
      queryClient.invalidateQueries({
        predicate: query => (query.queryKey[0] as any)?.startsWith('departure'),
      });
    }
  }, [mutation.isSuccess, mutation.data]);

  return {
    loading: mutation.isLoading,
    error: mutation.error,
    updateDepartureChecklistItemStatus: mutation.mutate,
  };
};