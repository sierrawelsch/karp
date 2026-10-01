import { makeRequest } from '@/api/base';
import type { VolunteerProfile } from '@/types/user';

export async function getAllVolunteers(): Promise<VolunteerProfile[]> {
  return makeRequest<VolunteerProfile[]>('/volunteer/all', 'GET');
}
