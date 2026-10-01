import { makeRequest } from '@/api/base';
import type {
  Vendor,
  CreateVendorRequest,
  UpdateVendorRequest,
  VendorResponse,
} from '@/types/vendor';
import type { VendorStatus } from '@/types/vendor';

export async function createVendor(
  vendorData: CreateVendorRequest
): Promise<VendorResponse> {
  return makeRequest<VendorResponse>('/vendor/new', 'POST', vendorData);
}

export async function getAllVendors(status?: VendorStatus): Promise<Vendor[]> {
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  const query = params.toString();
  const path = query ? `/vendor/all?${query}` : '/vendor/all';
  return makeRequest<Vendor[]>(path, 'GET');
}

export async function updateVendor(
  vendorId: string,
  updateData: UpdateVendorRequest
): Promise<Vendor> {
  return makeRequest<Vendor>(`/vendor/${vendorId}`, 'PUT', updateData);
}
