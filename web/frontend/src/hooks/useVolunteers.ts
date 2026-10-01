import { useQuery } from '@tanstack/react-query';
import { getAllVolunteers } from '@/api/volunteer';

export const volunteerKeys = {
  all: ['volunteers'] as const,
  lists: () => [...volunteerKeys.all, 'list'] as const,
};

export function useVolunteers() {
  return useQuery({
    queryKey: volunteerKeys.lists(),
    queryFn: getAllVolunteers,
  });
}
