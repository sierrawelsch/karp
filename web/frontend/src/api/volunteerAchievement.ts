import { makeRequest } from './base';
import type {
  VolunteerAchievement,
  CreateVolunteerAchievementRequest,
} from '@/types/volunteerAchievement';

export const volunteerAchievementApi = {
  createVolunteerAchievement: async (
    request: CreateVolunteerAchievementRequest
  ): Promise<VolunteerAchievement> => {
    return makeRequest<VolunteerAchievement>(
      '/volunteer-achievement/new',
      'POST',
      request
    );
  },

  getVolunteerAchievementsByVolunteer: async (
    volunteerId: string
  ): Promise<VolunteerAchievement[]> => {
    return makeRequest<VolunteerAchievement[]>(
      `/volunteer-achievement/volunteer/${volunteerId}`,
      'GET'
    );
  },

  getAllVolunteerAchievements: async (): Promise<VolunteerAchievement[]> => {
    return makeRequest<VolunteerAchievement[]>(
      '/volunteer-achievement/all',
      'GET'
    );
  },

  deleteVolunteerAchievement: async (
    volunteerAchievementId: string
  ): Promise<VolunteerAchievement> => {
    return makeRequest<VolunteerAchievement>(
      `/volunteer-achievement/${volunteerAchievementId}`,
      'DELETE'
    );
  },
};
