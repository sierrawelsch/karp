import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { achievementApi } from '@/api/achievement';
import type {
  CreateAchievementRequest,
  KarpEvent,
  UpdateAchievementRequest,
} from '@/types/achievement';

export function useAchievements(
  eventType?: KarpEvent,
  thresholdMin?: number,
  thresholdMax?: number
) {
  return useQuery({
    queryKey: ['achievements', eventType, thresholdMin, thresholdMax],
    queryFn: () =>
      achievementApi.getAllAchievements(eventType, thresholdMin, thresholdMax),
  });
}

export function useAchievement(id: string) {
  return useQuery({
    queryKey: ['achievement', id],
    queryFn: () => achievementApi.getAchievement(id),
    enabled: !!id,
  });
}

export function useCreateAchievement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (achievement: CreateAchievementRequest) =>
      achievementApi.createAchievement(achievement),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
    },
  });
}

export function useUpdateAchievement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      achievement,
    }: {
      id: string;
      achievement: UpdateAchievementRequest;
    }) => achievementApi.updateAchievement(id, achievement),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
      queryClient.invalidateQueries({ queryKey: ['achievement', id] });
    },
  });
}

export function useActivateAchievement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => achievementApi.activateAchievement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
    },
  });
}

export function useDeactivateAchievement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => achievementApi.deactivateAchievement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
    },
  });
}

export function useDeleteAchievement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => achievementApi.deleteAchievement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
    },
  });
}

export function useUploadAchievementImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      achievementId,
      imageFile,
    }: {
      achievementId: string;
      imageFile: File;
    }) => achievementApi.uploadAchievementImage(achievementId, imageFile),
    onSuccess: (_, { achievementId }) => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
      queryClient.invalidateQueries({
        queryKey: ['achievement', achievementId],
      });
    },
  });
}
