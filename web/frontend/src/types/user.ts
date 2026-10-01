export type UserType = 'VOLUNTEER' | 'VENDOR' | 'ORGANIZATION' | 'ADMIN';

export type AuthUser = {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  user_type: UserType;
  entity_id: string | null;
};

export type VolunteerProfile = {
  id: string;
  first_name: string;
  last_name: string;
  coins: number;
  preferred_name?: string | null;
  birth_date: string; // ISO datetime string
  preferences: string[];
  training_documents: { file_type: string; image_s3_key: string }[];
  qualifications: string[];
  preferred_days: string[];
  is_active: boolean;
  experience: number;
  location: { type: string; coordinates: number[] };
  image_s3_key?: string | null;
  current_level: number;
};

export type VendorProfile = {
  id: string;
  user_id: string;
  business_name: string;
  contact_name: string;
  email: string;
  phone: string;
  address: string;
  business_type: string;
  description: string;
  website: string;
  created_at: string;
  updated_at: string;
};

export type OrganizationProfile = {
  id: string;
  user_id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  created_at: string;
  updated_at: string;
};

export type AdminProfile = {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
  permissions: string[];
  created_at: string;
  updated_at: string;
};
