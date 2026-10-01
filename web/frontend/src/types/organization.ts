export type OrganizationStatus =
  | 'APPROVED'
  | 'PENDING'
  | 'REJECTED'
  | 'DELETED';

export type Organization = {
  id: string;
  name: string;
  description: string;
  status: OrganizationStatus;
  website?: string;
  phoneNumber?: string;
};

export type UpdateOrganizationRequest = {
  name: string;
  description: string;
  status: OrganizationStatus;
  website?: string;
  phoneNumber?: string;
};
