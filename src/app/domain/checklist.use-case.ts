import { useEffect } from 'react';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import { ChecklistDatasource } from '../data/datasource';
import { ChecklistItemStatus, RequestHandlerProps } from '../model';
import { PersonalChecklist, PersonalChecklistItem } from '../providers';

export const useGetPersonalChecklists = () => {
  const query = useQuery({
    queryKey: ['personal-checklist'],
    queryFn: async () => {
      return ChecklistDatasource.getPersonalChecklists();
    },
  });

  return {
    loading: query.isLoading,
    data: query.data,
    error: query.error,
  };
};

export const useGetPersonalChecklistById = (id: string) => {
  const query = useQuery({
    queryKey: ['personal-checklist-by-id'],
    queryFn: async () => {
      return ChecklistDatasource.getPersonalChecklistById(id);
    },
  });

  return {
    loading: query.isLoading,
    data: query.data,
    error: query.error,
  };
};

export const useAddPersonalChecklist = (requestHandler?: RequestHandlerProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (checklistName: string) => {
      return ChecklistDatasource.addPersonalChecklist(checklistName);
    },
  })

  useEffect(() => {
    if (mutation.isSuccess) {
      requestHandler?.onSuccess?.(mutation.data);
      queryClient.invalidateQueries({
        predicate: query => (query.queryKey[0] as any)?.startsWith('personal'),
      })
    }
  }, [mutation.isSuccess]);

  return {
    loading: mutation.isLoading,
    error: mutation.error,
    addPersonalChecklist: mutation.mutate,
  };
};

export const useDeletePersonalChecklist = (requestHandler?: RequestHandlerProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => {
      return ChecklistDatasource.deletePersonalChecklist(id);
    },
  })

  useEffect(() => {
    if (mutation.isSuccess) {
      requestHandler?.onSuccess?.(mutation.data);
      queryClient.invalidateQueries({
        predicate: query => (query.queryKey[0] as any)?.startsWith('personal'),
      })
    }
  }, [mutation.isSuccess]);

  return {
    loading: mutation.isLoading,
    error: mutation.error,
    deletePersonalChecklist: mutation.mutate,
  };
};

export const useUpdatePersonalChecklist = (requestHandler?: RequestHandlerProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (params: { id: string, checklist: Partial<PersonalChecklist>}) => {
      return ChecklistDatasource.updatePersonalChecklist(params.id, params.checklist);
    },
  })

  useEffect(() => {
    if (mutation.isSuccess) {
      requestHandler.onSuccess?.(mutation.data);
      queryClient.invalidateQueries({
        predicate: query => (query.queryKey[0] as any)?.startsWith('personal'),
      })
    }
  }, [mutation.isSuccess, mutation.data]);

  return {
    loading: mutation.isLoading,
    error: mutation.error,
    updatePersonalChecklist: mutation.mutate,
  };
};

export const useUpdatePersonalChecklistItems = (requestHandler?: RequestHandlerProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (params: { id: string, checklistItems: Partial<PersonalChecklistItem>[] }) => {
      return ChecklistDatasource.updatePersonalChecklistItems(params.id, params.checklistItems);
    },
  })

  useEffect(() => {
    if (mutation.isSuccess) {
      requestHandler.onSuccess?.(mutation.data);
      queryClient.invalidateQueries({
        predicate: query => (query.queryKey[0] as any)?.startsWith('personal'),
      });
    }
  }, [mutation.isSuccess, mutation.data]);

  return {
    loading: mutation.isLoading,
    error: mutation.error,
    updatePersonalChecklistItems: mutation.mutate,
  };
};

export const useDeletePersonalChecklistItem = (requestHandler?: RequestHandlerProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (params: { id: string, checklistItemIdToDelete: string }) => {
      return ChecklistDatasource.deletePersonalChecklistItem(params.id, params.checklistItemIdToDelete);
    },
  })

  useEffect(() => {
    if (mutation.isSuccess) {
      requestHandler?.onSuccess?.(mutation.data);
      queryClient.invalidateQueries({
        predicate: query => (query.queryKey[0] as any)?.startsWith('personal'),
      });
    }
  }, [mutation.isSuccess, mutation.data]);

  return {
    loading: mutation.isLoading,
    error: mutation.error,
    deletePersonalChecklistItem: mutation.mutate,
  };
};

export const useUpdateChecklistItemStatus = (requestHandler?: RequestHandlerProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (params: { id: string, checklistItemId: string, newStatus: ChecklistItemStatus }) => {
      return ChecklistDatasource.updatePersonalChecklistItemStatus(params.id, params.checklistItemId, params.newStatus);
    },
  })

  useEffect(() => {
    if (mutation.isSuccess) {
      requestHandler?.onSuccess?.(mutation.data);
      queryClient.invalidateQueries({
        predicate: query => (query.queryKey[0] as any)?.startsWith('personal'),
      });
    }
  }, [mutation.isSuccess, mutation.data]);

  return {
    loading: mutation.isLoading,
    error: mutation.error,
    updatePersonalChecklistItemStatus: mutation.mutate,
  };
};