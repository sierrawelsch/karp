export interface VolunteerAchievement {
  id: string;
  achievement_id: string;
  volunteer_id: string;
  received_at: string;
}

export interface CreateVolunteerAchievementRequest {
  achievement_id: string;
  volunteer_id: string;
}
