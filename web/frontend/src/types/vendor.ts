export type VendorStatus = 'APPROVED' | 'PENDING' | 'REJECTED' | 'DELETED';

export type Vendor = {
  id: string;
  name: string;
  business_type?: string;
  description?: string;
  status: VendorStatus;
  created_at?: string;
  updated_at?: string;
};

export type CreateVendorRequest = {
  name: string;
  business_type: string;
  address: string;
};

export type VendorResponse = {
  id: string;
  name: string;
  business_type: string;
  [key: string]: unknown;
};

export type UpdateVendorRequest = {
  name: string;
  description?: string;
  status: VendorStatus;
};
