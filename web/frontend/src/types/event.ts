export type EventStatus =
  | 'PUBLISHED'
  | 'CANCELLED'
  | 'DRAFT'
  | 'DELETED'
  | 'APPROVED'
  | 'REJECTED';

export type Location = {
  latitude: number;
  longitude: number;
  address: string;
};

export type Event = {
  id: string;
  name: string;
  address: string;
  location?: Location;
  start_date_time: string; // ISO string format
  end_date_time: string; // ISO string format
  organization_id: string;
  status: EventStatus;
  max_volunteers: number;
  manual_difficulty_coefficient: number;
  coins: number;
  description?: string;
  keywords?: string[];
  age_min?: number;
  age_max?: number;
  created_at?: string; // ISO string format
  created_by: string;
  image_url?: string;
  check_in_qr_code_image?: string;
  check_out_qr_code_image?: string;
};

export type CreateEventRequest = Omit<
  Event,
  | 'id'
  | 'created_at'
  | 'organization_id'
  | 'created_by'
  | 'location'
  | 'created_at'
>;

export type UpdateEventRequest = Partial<CreateEventRequest> & {
  id: string;
};
