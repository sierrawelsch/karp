import { makeRequest } from '@/api/base';
import type {
  AuthUser,
  VolunteerProfile,
  VendorProfile,
  OrganizationProfile,
  AdminProfile,
  UserType,
} from '@/types/user';

export async function getUserProfile(): Promise<AuthUser> {
  return makeRequest<AuthUser>('/user/me', 'GET');
}

export async function getVolunteerProfile(): Promise<VolunteerProfile> {
  return makeRequest<VolunteerProfile>('/volunteer/me', 'GET');
}

export async function getVendorProfile(): Promise<VendorProfile> {
  return makeRequest<VendorProfile>('/vendor/me', 'GET');
}

export async function getOrganizationProfile(): Promise<OrganizationProfile> {
  return makeRequest<OrganizationProfile>('/organization/me', 'GET');
}

export async function getAdminProfile(): Promise<AdminProfile> {
  return makeRequest<AdminProfile>('/admin/me', 'GET');
}

export async function getProfileByUserType(
  userType: UserType
): Promise<
  VolunteerProfile | VendorProfile | OrganizationProfile | AdminProfile
> {
  switch (userType) {
    case 'VOLUNTEER':
      return getVolunteerProfile();
    case 'VENDOR':
      return getVendorProfile();
    case 'ORGANIZATION':
      return getOrganizationProfile();
    case 'ADMIN':
      return getAdminProfile();
    default:
      throw new Error(`Unknown user type: ${userType}`);
  }
}
