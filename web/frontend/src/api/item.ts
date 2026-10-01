import { makeRequest } from './base';
import type {
  Item,
  CreateItemRequest,
  UpdateItemRequest,
  ItemSortParam,
  SortOrder,
  ItemStatus,
} from '@/types/item';

export const itemApi = {
  // Get all items with optional filters
  getItems: async (
    status?: ItemStatus,
    searchText?: string,
    vendorId?: string,
    sortBy?: ItemSortParam,
    sortOrder: SortOrder = 'asc'
  ): Promise<Item[]> => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (searchText) params.append('search_text', searchText);
    if (vendorId) params.append('vendor_id', vendorId);
    if (sortBy) {
      // params.append('sort_by', sortBy);
    }
    if (sortOrder) {
      // params.append('sort_order', sortOrder);
    }
    params.append('sort_by', 'created_at');
    params.append('sort_order', 'desc');

    return makeRequest<Item[]>(`/item/all?${params.toString()}`, 'GET');
  },

  getItem: async (id: string): Promise<Item> => {
    return makeRequest<Item>(`/item/${id}`, 'GET');
  },

  createItem: async (item: CreateItemRequest): Promise<Item> => {
    return makeRequest<Item>('/item/new', 'POST', item);
  },

  updateItem: async (id: string, item: UpdateItemRequest): Promise<void> => {
    await makeRequest<void>(`/item/edit/${id}`, 'PUT', item);
  },

  deactivateItem: async (id: string): Promise<void> => {
    await makeRequest<void>(`/item/deactivate/${id}`, 'PUT');
  },

  activateItem: async (id: string): Promise<void> => {
    await makeRequest<void>(`/item/activate/${id}`, 'PUT');
  },

  editItem: async (
    id: string,
    item: {
      name: string;
      price: number;
      expiration: string;
      status: ItemStatus;
    }
  ): Promise<void> => {
    await makeRequest<void>(`/item/edit/${id}`, 'PUT', item);
  },
};

export async function generateItemQRCode(itemId: string): Promise<Item> {
  console.log('generateItemQRCodes CALLED with:', itemId);
  const updatedItemData = await makeRequest<Item>(
    `/item/${itemId}/generate-qr-code`,
    'GET'
  );

  return updatedItemData;
}
