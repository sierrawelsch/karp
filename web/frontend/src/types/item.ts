export type ItemStatus =
  | 'PUBLISHED'
  | 'ACTIVE'
  | 'DRAFT'
  | 'DELETED'
  | 'APPROVED'
  | 'REJECTED';

export interface Item {
  id: string;
  name: string;
  status: ItemStatus;
  vendor_id: string;
  time_posted: string;
  expiration: string;
  price: number;
  image_url?: string;
  qr_code_image?: string;
  keywords?: string[];
  description?: string;
}

export interface CreateItemRequest {
  name: string;
  expiration: string;
  image_url?: string;
  dollar_price: number;
  status?: ItemStatus;
  keywords?: string[];
  description?: string;
}

export interface UpdateItemRequest {
  name?: string;
  price?: number;
  expiration?: string;
  status?: ItemStatus;
  qr_code_image?: string;
  keywords?: string[];
  description?: string;
}

export type ItemSortParam = 'date' | 'name' | 'coins';
export type SortOrder = 'asc' | 'desc';
