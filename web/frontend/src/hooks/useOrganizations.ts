import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllOrganizations, updateOrganization } from '@/api/organization';
import type {
  UpdateOrganizationRequest,
  OrganizationStatus,
} from '@/types/organization';

export const organizationKeys = {
  all: ['organizations'] as const,
  lists: () => [...organizationKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) =>
    [...organizationKeys.lists(), { filters }] as const,
};

export function useOrganizations(status?: OrganizationStatus) {
  return useQuery({
    queryKey: organizationKeys.list({ status }),
    queryFn: () => getAllOrganizations(status),
  });
}

export function useUpdateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateOrganizationRequest;
    }) => updateOrganization(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.lists() });
    },
  });
}
