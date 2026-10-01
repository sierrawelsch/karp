import { makeRequest } from '@/api/base';
import type {
  Organization,
  UpdateOrganizationRequest,
} from '@/types/organization';
import type { OrganizationStatus } from '@/types/organization';

type CreateOrganizationRequest = {
  name: string;
  description: string;
  address: string;
  website?: string;
  phoneNumber?: string;
};

type OrganizationResponse = {
  id: string;
  name: string;
  description: string;
  address: string;
  website?: string;
  phoneNumber?: string;
  [key: string]: unknown;
};

export async function getAllOrganizations(
  status?: OrganizationStatus
): Promise<Organization[]> {
  const params = new URLSearchParams();
  if (status) params.append('statuses', status);
  const query = params.toString();
  const path = query ? `/organization/all?${query}` : '/organization/all';
  return makeRequest<Organization[]>(path, 'GET');
}

export async function createOrganization(
  organizationData: CreateOrganizationRequest
): Promise<OrganizationResponse> {
  return makeRequest<OrganizationResponse>(
    '/organization/new',
    'POST',
    organizationData
  );
}

export async function updateOrganization(
  organizationId: string,
  updateData: UpdateOrganizationRequest
): Promise<Organization> {
  return makeRequest<Organization>(
    `/organization/${organizationId}`,
    'PUT',
    updateData
  );
}
