import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { itemApi, generateItemQRCode } from '@/api/item';
import type {
  CreateItemRequest,
  UpdateItemRequest,
  ItemSortParam,
  SortOrder,
  ItemStatus,
} from '@/types/item';

export const itemKeys = {
  all: ['items'] as const,
  lists: () => [...itemKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) =>
    [...itemKeys.lists(), { filters }] as const,
  details: () => [...itemKeys.all, 'detail'] as const,
  detail: (id: string) => [...itemKeys.details(), id] as const,
  byVendor: (vendorId: string) =>
    [...itemKeys.all, 'vendor', vendorId] as const,
};

export function useItems(
  status?: ItemStatus,
  searchText?: string,
  vendorId?: string,
  sortBy?: ItemSortParam,
  sortOrder: SortOrder = 'asc'
) {
  return useQuery({
    queryKey: ['items', status, searchText, vendorId, sortBy, sortOrder],
    queryFn: () =>
      itemApi.getItems(status, searchText, vendorId, sortBy, sortOrder),
  });
}

export function useItem(id: string) {
  return useQuery({
    queryKey: ['item', id],
    queryFn: () => itemApi.getItem(id),
    enabled: !!id,
  });
}

export function useCreateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (item: CreateItemRequest) => itemApi.createItem(item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
}

export function useUpdateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, item }: { id: string; item: UpdateItemRequest }) =>
      itemApi.updateItem(id, item),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['item', id] });
    },
  });
}

export function useEditItemCoins() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: {
        name: string;
        price: number;
        expiration: string;
        status: string;
        description: string;
      };
    }) => itemApi.editItem(id, payload as never),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['item', id] });
    },
  });
}

export function useDeactivateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => itemApi.deactivateItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
}

export function useActivateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => itemApi.activateItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
}

export function useGenerateItemQrCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: generateItemQRCode,
    onSuccess: (_, itemId) => {
      queryClient.invalidateQueries({ queryKey: itemKeys.detail(itemId) });

      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
    // eslint-disable-next-line
    onError: (err: any) => {
      alert(err.detail);
    },
  });
}
