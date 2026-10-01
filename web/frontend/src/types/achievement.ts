export type KarpEvent = 'USER_LEVEL_UP' | 'VOLUNTEER_EVENT_COMPLETION';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  event_type: KarpEvent;
  threshold: number;
  image_s3_key?: string | null;
  is_active: boolean;
}

export interface CreateAchievementRequest {
  name: string;
  description: string;
  event_type: KarpEvent;
  threshold: number;
  is_active?: boolean;
}

export interface UpdateAchievementRequest {
  name?: string;
  description?: string;
  event_type?: KarpEvent;
  threshold?: number;
  image_s3_key?: string | null;
}
