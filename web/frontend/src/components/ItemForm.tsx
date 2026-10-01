import { useEffect, useState } from 'react';
import {
  useCreateItem,
  useUpdateItem,
  useEditItemCoins,
} from '@/hooks/useItems';
import type { CreateItemRequest, Item, ItemStatus } from '@/types/item';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { uploadImage } from '@/api/utils/image';
import { Textarea } from '@/components/ui/textarea';

interface ItemFormProps {
  onSuccess?: () => void;
  mode?: 'create' | 'edit';
  initialItem?: Item;
}

type ItemFormData = {
  name: string;
  expiration: string;
  price: string;
  image_url?: string;
  keywords?: string[];
  status?: ItemStatus;
  description?: string;
};

export function ItemForm({
  onSuccess,
  mode = 'create',
  initialItem,
}: ItemFormProps) {
  const [formData, setFormData] = useState<ItemFormData>(
    initialItem
      ? {
          name: initialItem.name,
          expiration: new Date(initialItem.expiration)
            .toISOString()
            .slice(0, 16),
          price: initialItem.price != null ? String(initialItem.price) : '',
          keywords: initialItem.keywords,
          description: initialItem.description,
        }
      : {
          name: '',
          expiration: '',
          price: '',
          keywords: [],
          description: '',
        }
  );

  const createItemMutation = useCreateItem();
  const updateItemMutation = useUpdateItem();
  const editItemCoinsMutation = useEditItemCoins();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submittingAction, setSubmittingAction] = useState<
    'create' | 'draft' | null
  >(null);

  useEffect(() => {
    if (initialItem) {
      setFormData({
        name: initialItem.name,
        expiration: new Date(initialItem.expiration).toISOString().slice(0, 16),
        price: initialItem.price != null ? String(initialItem.price) : '',
        keywords: initialItem.keywords ?? [],
        description: initialItem.description ?? '',
      });
    }
  }, [initialItem]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.expiration) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      if (mode === 'edit' && initialItem) {
        const parsedPrice = parseFloat(formData.price);
        await updateItemMutation.mutateAsync({
          id: initialItem.id,
          item: {
            name: formData.name,
            expiration: formData.expiration,
            price: isNaN(parsedPrice) ? 0 : parsedPrice,
            keywords: formData.keywords,
            description: formData.description,
          },
        });
        if (imageFile) {
          await uploadImage('item', initialItem.id, imageFile);
        }
        alert('Item updated successfully!');
        onSuccess?.();
      } else {
        await submitItem('create');
      }
    } catch (error) {
      console.error('Failed to create item:', error);
      alert('Failed to create item');
    }
  };

  async function submitItem(action: 'create' | 'draft') {
    try {
      setSubmittingAction(action);
      const payload: CreateItemRequest = {
        name: formData.name,
        expiration: formData.expiration,
        dollar_price: parseFloat(formData.price),
        keywords: formData.keywords ?? [],
        description: formData.description ?? '',
      };
      const newItem = await createItemMutation.mutateAsync(payload);
      // Immediately persist price and optional draft status via edit endpoint
      const parsedPrice = parseFloat(formData.price);
      await editItemCoinsMutation.mutateAsync({
        id: newItem.id,
        payload: {
          name: formData.name,
          price: isNaN(parsedPrice) ? 0 : parsedPrice,
          expiration: String(newItem.expiration),
          status: (action === 'draft'
            ? ('DRAFT' as ItemStatus)
            : newItem.status) as ItemStatus,
          description: formData.description ?? '',
        },
      });
      if (imageFile) {
        const uploadResult = await uploadImage('item', newItem.id, imageFile);
        formData.image_url = uploadResult.upload_url;
      }
      alert(
        action === 'draft'
          ? 'Item saved as draft!'
          : 'Item created successfully!'
      );
      onSuccess?.();
    } catch (error) {
      console.error('Failed to create item:', error);
      alert('Failed to create item');
    } finally {
      setSubmittingAction(null);
    }
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Card className="bg-karp-background">
      <CardHeader className="bg-karp-background">
        <CardTitle className="text-karp-font">
          {mode === 'edit' ? 'Edit Item' : 'Create New Item'}
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-karp-background">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-karp-font">
              Item Name *
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter item name"
              className="bg-karp-background border-karp-font/20 text-karp-font"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiration" className="text-karp-font">
              Expiration Date *
            </Label>
            <Input
              type="datetime-local"
              id="expiration"
              name="expiration"
              value={formData.expiration}
              onChange={handleChange}
              required
              className="bg-karp-background border-karp-font/20 text-karp-font"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price" className="text-karp-font">
              Dollar Cost ($) *
            </Label>
            <Input
              type="number"
              id="price"
              name="price"
              inputMode="decimal"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handleChange}
              required
              placeholder="Enter dollar price, e.g., 9.99"
              className="bg-karp-background border-karp-font/20 text-karp-font"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-karp-font">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              rows={4}
              placeholder="Enter item description"
              className="bg-karp-background border-karp-font/20 text-karp-font"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image" className="text-karp-font">
              Upload Image
            </Label>
            <Input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={e => {
                const file = e.target.files?.[0] || null;
                setImageFile(file);
              }}
              className="bg-karp-background border-karp-font/20 text-karp-font"
            />
          </div>

          <div className="flex gap-3 pt-4">
            {mode === 'edit' ? (
              <Button
                type="submit"
                disabled={updateItemMutation.isPending}
                className="flex-1"
              >
                {updateItemMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  variant="secondary"
                  disabled={createItemMutation.isPending}
                  className="flex-1"
                  onClick={() => submitItem('draft')}
                >
                  {submittingAction === 'draft' && createItemMutation.isPending
                    ? 'Saving...'
                    : 'Save as Draft'}
                </Button>
                <Button
                  type="submit"
                  disabled={createItemMutation.isPending}
                  className="flex-1"
                >
                  {submittingAction === 'create' && createItemMutation.isPending
                    ? 'Creating...'
                    : 'Create Item'}
                </Button>
              </>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
