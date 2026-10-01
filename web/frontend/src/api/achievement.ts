import { makeRequest } from './base';
import type {
  Achievement,
  CreateAchievementRequest,
  KarpEvent,
  UpdateAchievementRequest,
} from '@/types/achievement';

export const achievementApi = {
  getAllAchievements: async (
    eventType?: KarpEvent | null,
    thresholdMin?: number | null,
    thresholdMax?: number | null
  ): Promise<Achievement[]> => {
    const params = new URLSearchParams();
    if (eventType) params.append('event_type', eventType.toString());
    if (thresholdMin !== undefined && thresholdMin !== null) {
      params.append('threshold_min', thresholdMin.toString());
    }
    if (thresholdMax !== undefined && thresholdMax !== null) {
      params.append('threshold_max', thresholdMax.toString());
    }
    const queryString = params.toString();
    return makeRequest<Achievement[]>(
      `/achievement/all${queryString ? `?${queryString}` : ''}`,
      'GET'
    );
  },

  getAchievement: async (id: string): Promise<Achievement> => {
    return makeRequest<Achievement>(`/achievement/${id}`, 'GET');
  },

  createAchievement: async (
    achievement: CreateAchievementRequest
  ): Promise<Achievement> => {
    return makeRequest<Achievement>('/achievement/new', 'POST', achievement);
  },

  updateAchievement: async (
    id: string,
    achievement: UpdateAchievementRequest
  ): Promise<void> => {
    await makeRequest<void>(`/achievement/edit/${id}`, 'PUT', achievement);
  },

  activateAchievement: async (id: string): Promise<void> => {
    await makeRequest<void>(`/achievement/activate/${id}`, 'PUT');
  },

  deactivateAchievement: async (id: string): Promise<void> => {
    await makeRequest<void>(`/achievement/deactivate/${id}`, 'PUT');
  },

  deleteAchievement: async (id: string): Promise<void> => {
    await makeRequest<void>(`/achievement/${id}`, 'DELETE');
  },

  getImageUrl: async (achievementId: string): Promise<{ url: string }> => {
    return makeRequest<{ url: string }>(
      `/achievement/${achievementId}/image`,
      'GET'
    );
  },

  uploadAchievementImage: async (
    achievementId: string,
    imageFile: File
  ): Promise<{ upload_url: string }> => {
    const filename = encodeURIComponent(imageFile.name);
    const presignedData = makeRequest<{ upload_url: string; file_url: string }>(
      `/achievement/${achievementId}/upload-url?filename=${filename}&filetype=${imageFile.type}`,
      'GET'
    );

    const uploadResponse = await fetch((await presignedData).upload_url, {
      method: 'PUT',
      headers: {
        'Content-Type': imageFile.type,
      },
      body: imageFile,
    });

    if (!uploadResponse.ok) {
      throw new Error(
        `Failed to upload image to S3: ${uploadResponse.status} ${uploadResponse.statusText}`
      );
    }

    // Return the file URL (S3 key)
    return { upload_url: (await presignedData).upload_url };
  },
};
