import { useQuery } from '@tanstack/react-query';
import { getAllAdmins } from '@/api/admin';

export const adminKeys = {
  all: ['admins'] as const,
  lists: () => [...adminKeys.all, 'list'] as const,
};

export function useAdmins() {
  return useQuery({
    queryKey: adminKeys.lists(),
    queryFn: getAllAdmins,
  });
}
