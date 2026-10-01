import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllVendors, updateVendor } from '@/api/vendor';
import type { VendorStatus, UpdateVendorRequest } from '@/types/vendor';

export const vendorKeys = {
  all: ['vendors'] as const,
  lists: () => [...vendorKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) =>
    [...vendorKeys.lists(), { filters }] as const,
};

export function useVendors(status?: VendorStatus) {
  return useQuery({
    queryKey: vendorKeys.list({ status }),
    queryFn: () => getAllVendors(status),
  });
}

export function useUpdateVendor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateVendorRequest }) =>
      updateVendor(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vendorKeys.lists() });
    },
  });
}
