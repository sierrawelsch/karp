import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { volunteerAchievementApi } from '@/api/volunteerAchievement';
import type { CreateVolunteerAchievementRequest } from '@/types/volunteerAchievement';

export function useVolunteerAchievementsByVolunteer(volunteerId: string) {
  return useQuery({
    queryKey: ['volunteer-achievements', 'volunteer', volunteerId],
    queryFn: () =>
      volunteerAchievementApi.getVolunteerAchievementsByVolunteer(volunteerId),
    enabled: !!volunteerId,
  });
}

export function useAllVolunteerAchievements() {
  return useQuery({
    queryKey: ['volunteer-achievements', 'all'],
    queryFn: () => volunteerAchievementApi.getAllVolunteerAchievements(),
  });
}

export function useAssignAchievement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateVolunteerAchievementRequest) =>
      volunteerAchievementApi.createVolunteerAchievement(request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          'volunteer-achievements',
          'volunteer',
          variables.volunteer_id,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: ['volunteer-achievements', 'all'],
      });
    },
  });
}

export function useDeleteVolunteerAchievement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (volunteerAchievementId: string) =>
      volunteerAchievementApi.deleteVolunteerAchievement(
        volunteerAchievementId
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['volunteer-achievements'] });
    },
  });
}
