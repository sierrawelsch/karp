import { useState } from 'react';
import {
  useItems,
  useActivateItem,
  useDeactivateItem,
  useEditItemCoins,
  useGenerateItemQrCode,
} from '@/hooks/useItems';
import { ItemForm } from '@/components/ItemForm';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import type { Item, ItemStatus } from '@/types/item';
import { useUpdateItem } from '@/hooks/useItems';
import { ItemPage } from './ItemPage';

export function ItemsList() {
  const { user, userProfile } = useAuth();
  const isAdmin = user?.user_type === 'ADMIN';

  const vendorId = isAdmin ? undefined : userProfile?.id;

  const [searchParams, setSearchParams] = useSearchParams();
  const status = (searchParams.get('status') as ItemStatus) || 'APPROVED';
  const [showCreateModal, setShowCreateModal] = useState(false);
  const {
    data: items,
    isLoading,
    error,
  } = useItems(status, undefined, vendorId);
  const activateItem = useActivateItem();
  const deactivateItem = useDeactivateItem();
  const editItemCoins = useEditItemCoins();
  const updateItem = useUpdateItem();
  const generateItemQRCode = useGenerateItemQrCode();
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [displayingItem, setDisplayingItem] = useState<Item | null>(null);
  const [coinValue, setCoinValue] = useState<string>('');
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);
  const [updatingAction, setUpdatingAction] = useState<
    'activate' | 'deactivate' | null
  >(null);
  const [qrGeneratingIds, setQrGeneratingIds] = useState<Set<string>>(
    new Set()
  );

  if (isLoading) {
    return <div className="p-4">Loading items...</div>;
  }

  if (error) {
    return <div className="p-4 text-karp-orange">Error loading items</div>;
  }

  const anyPending =
    activateItem.isPending || deactivateItem.isPending || updateItem.isPending;

  return (
    <div className="p-4">
      <div className="fixed top-[48px] left-0 right-0 z-30 px-4 md:px-8 py-3 bg-karp-background/95 supports-[backdrop-filter]:bg-karp-background/80 backdrop-blur border-b border-karp-font/10">
        <div className="mx-auto w-full min-w-[1100px]">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-foreground">
              {status.toLowerCase().charAt(0).toUpperCase() +
                status.toLowerCase().slice(1)}{' '}
              Items
            </h1>
            {!isAdmin && (
              <Button onClick={() => setShowCreateModal(true)}>
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create Item
              </Button>
            )}
          </div>
          <div className="mt-3 flex gap-2 flex-nowrap">
            {[
              { label: 'Active', value: 'ACTIVE' },
              { label: 'Approved', value: 'APPROVED' },
              { label: 'Published', value: 'PUBLISHED' },
              { label: 'Draft', value: 'DRAFT' },
              { label: 'Rejected', value: 'REJECTED' },
              { label: 'Deleted', value: 'DELETED' },
            ].map(tab => {
              const isActive = status === tab.value;
              return (
                <Button
                  key={tab.value}
                  variant={isActive ? 'default' : 'outline'}
                  onClick={() => setSearchParams({ status: tab.value })}
                  className="w-full flex-1"
                >
                  {tab.label}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
      {/* spacer to offset the fixed title bar */}
      <div style={{ height: 130 }} />

      {items && items.length > 0 ? (
        <div className="mx-auto w-full min-w-[1100px] grid gap-4">
          {items.map(item => (
            <div
              key={item.id}
              className="bg-karp-background border border-karp-font/20 rounded-lg p-6 hover:shadow-lg transition-all duration-200 hover:border-karp-primary/50 cursor-pointer"
              onClick={() => setDisplayingItem(item)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-karp-font">
                    {item.name}
                  </h3>
                  <p className="text-sm text-karp-font/60">
                    Posted: {new Date(item.time_posted).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-karp-font/60">
                    Expires: {new Date(item.expiration).toLocaleDateString()}
                  </p>
                  <p className="text-karp-font/70 mt-2">
                    Price:{' '}
                    {isAdmin ? `${item.price} coins` : `$${item.price / 100}`}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.status === 'ACTIVE'
                        ? 'bg-karp-green/20 text-karp-green'
                        : item.status === 'APPROVED'
                          ? 'bg-karp-primary/20 text-karp-primary'
                          : item.status === 'REJECTED'
                            ? 'bg-karp-orange/20 text-karp-orange'
                            : 'bg-karp-font/10 text-karp-font'
                    }`}
                  >
                    {item.status}
                  </span>
                  {/* Why is the vendor ID being displayed?? */}
                  {/* <div className="mt-2 text-sm text-karp-font/70">
                    <p>Vendor ID: {item.vendor_id}</p>
                  </div> */}

                  <div className="mt-3 flex gap-2  justify-end">
                    {/* EDIT BUTTON — triggers setEditingItem */}
                    <Button
                      size="sm"
                      onClick={e => {
                        e.stopPropagation(); // IMPORTANT: prevents triggering the card click
                        setEditingItem(item);
                      }}
                    >
                      Edit
                    </Button>
                  </div>

                  {item.status === 'ACTIVE' && !item.qr_code_image && (
                    <div className="mt-3 flex gap-2  justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={e => {
                          e.stopPropagation(); // IMPORTANT: prevents triggering the card click
                          setQrGeneratingIds(prev => {
                            const next = new Set(prev);
                            next.add(item.id);
                            return next;
                          });
                          generateItemQRCode.mutate(item.id, {
                            onSuccess: () => {
                              alert('QR Codes Generated!');
                            },
                            onSettled: () => {
                              setQrGeneratingIds(prev => {
                                const next = new Set(prev);
                                next.delete(item.id);
                                return next;
                              });
                            },
                          });
                        }}
                        disabled={qrGeneratingIds.has(item.id)}
                      >
                        {qrGeneratingIds.has(item.id)
                          ? 'Generating...'
                          : 'Generate QR Code'}
                      </Button>
                    </div>
                  )}

                  <div className="mt-3 flex gap-2 justify-end">
                    {!isAdmin ? (
                      item.status === 'REJECTED' ||
                      item.status === 'DELETED' ? null : (
                        <>
                          {item.status === 'DRAFT' && (
                            <Button
                              size="sm"
                              variant="success"
                              onClick={e => {
                                e.stopPropagation();
                                setUpdatingItemId(item.id);
                                setUpdatingAction('activate'); // reuse pending tracker
                                updateItem.mutate(
                                  {
                                    id: item.id,
                                    item: { status: 'PUBLISHED' },
                                  },
                                  {
                                    onSettled: () => {
                                      setUpdatingItemId(null);
                                      setUpdatingAction(null);
                                    },
                                  }
                                );
                              }}
                              disabled={anyPending}
                            >
                              {updateItem.isPending &&
                              updatingItemId === item.id
                                ? 'Publishing...'
                                : 'Publish'}
                            </Button>
                          )}
                          {item.status === 'ACTIVE' ? (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={e => {
                                e.stopPropagation();
                                setUpdatingItemId(item.id);
                                setUpdatingAction('deactivate');
                                deactivateItem.mutate(item.id, {
                                  onSettled: () => {
                                    setUpdatingItemId(null);
                                    setUpdatingAction(null);
                                  },
                                });
                              }}
                              disabled={anyPending}
                            >
                              {anyPending &&
                              updatingItemId === item.id &&
                              updatingAction === 'deactivate'
                                ? 'Deactivating...'
                                : 'Deactivate'}
                            </Button>
                          ) : item.status === 'APPROVED' ? (
                            <Button
                              size="sm"
                              variant="success"
                              onClick={e => {
                                e.stopPropagation();
                                setUpdatingItemId(item.id);
                                setUpdatingAction('activate');
                                activateItem.mutate(item.id, {
                                  onSettled: () => {
                                    setUpdatingItemId(null);
                                    setUpdatingAction(null);
                                  },
                                });
                              }}
                              disabled={anyPending}
                            >
                              {anyPending &&
                              updatingItemId === item.id &&
                              updatingAction === 'activate'
                                ? 'Activating...'
                                : 'Activate'}
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={e => {
                                e.stopPropagation();
                                setUpdatingItemId(item.id);
                                setUpdatingAction('deactivate'); // reuse tracker
                                updateItem.mutate(
                                  { id: item.id, item: { status: 'DELETED' } },
                                  {
                                    onSettled: () => {
                                      setUpdatingItemId(null);
                                      setUpdatingAction(null);
                                    },
                                  }
                                );
                              }}
                              disabled={anyPending}
                            >
                              {updateItem.isPending &&
                              updatingItemId === item.id
                                ? 'Deleting...'
                                : 'Delete'}
                            </Button>
                          )}
                        </>
                      )
                    ) : item.status === 'DELETED' ? null : (
                      <>
                        {/* Admin Cancel available for all non-deleted statuses */}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={e => {
                            e.stopPropagation();
                            setUpdatingItemId(item.id);
                            updateItem.mutate(
                              { id: item.id, item: { status: 'DELETED' } },
                              {
                                onSettled: () => {
                                  setUpdatingItemId(null);
                                },
                              }
                            );
                          }}
                          disabled={anyPending}
                        >
                          {updateItem.isPending && updatingItemId === item.id
                            ? 'Deleting...'
                            : 'Delete'}
                        </Button>
                        {item.status === 'PUBLISHED' && (
                          <Button
                            size="sm"
                            variant="success"
                            onClick={e => {
                              e.stopPropagation();
                              setUpdatingItemId(item.id);
                              updateItem.mutate(
                                { id: item.id, item: { status: 'APPROVED' } },
                                {
                                  onSettled: () => {
                                    setUpdatingItemId(null);
                                  },
                                }
                              );
                            }}
                            disabled={anyPending}
                          >
                            {updateItem.isPending && updatingItemId === item.id
                              ? 'Approving...'
                              : 'Approve'}
                          </Button>
                        )}
                        {item.status === 'PUBLISHED' && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={e => {
                              e.stopPropagation();
                              setUpdatingItemId(item.id);
                              updateItem.mutate(
                                { id: item.id, item: { status: 'REJECTED' } },
                                {
                                  onSettled: () => {
                                    setUpdatingItemId(null);
                                  },
                                }
                              );
                            }}
                            disabled={anyPending}
                          >
                            {updateItem.isPending && updatingItemId === item.id
                              ? 'Rejecting...'
                              : 'Reject'}
                          </Button>
                        )}
                        {item.status === 'ACTIVE' && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={e => {
                              e.stopPropagation();
                              setUpdatingItemId(item.id);
                              setUpdatingAction('deactivate');
                              deactivateItem.mutate(item.id, {
                                onSettled: () => {
                                  setUpdatingItemId(null);
                                  setUpdatingAction(null);
                                },
                              });
                            }}
                            disabled={anyPending}
                          >
                            {anyPending &&
                            updatingItemId === item.id &&
                            updatingAction === 'deactivate'
                              ? 'Deactivating...'
                              : 'Deactivate'}
                          </Button>
                        )}
                        {/* Hide Edit Coins for rejected items */}
                        {isAdmin && item.status !== 'REJECTED' && (
                          <Button
                            size="sm"
                            variant="warning"
                            onClick={e => {
                              e.stopPropagation();
                              setEditingItemId(item.id);
                              setCoinValue(String(item.price ?? 0));
                            }}
                            disabled={anyPending}
                          >
                            Edit Coins
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-karp-font/70">
          <p>No items found</p>
        </div>
      )}

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Item"
        size="lg"
      >
        <ItemForm onSuccess={() => setShowCreateModal(false)} />
      </Modal>

      <Modal
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        title="Edit Item"
        size="lg"
      >
        <ItemForm
          mode="edit"
          initialItem={editingItem as Item}
          onSuccess={() => setEditingItem(null)}
        />
      </Modal>

      <Modal
        isOpen={!!displayingItem}
        onClose={() => setDisplayingItem(null)}
        title="Item"
        size="2xl"
      >
        <ItemPage item={displayingItem} />
      </Modal>

      <Modal
        isOpen={!!editingItemId}
        onClose={() => setEditingItemId(null)}
        title="Edit Item Coins"
        size="sm"
      >
        <div className="space-y-4">
          <label className="block text-sm font-medium text-karp-font">
            Coins
          </label>
          <input
            type="number"
            min={0}
            className="w-full border border-karp-font/20 rounded px-3 py-2 bg-karp-background text-karp-font"
            value={coinValue}
            onChange={e => setCoinValue(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setEditingItemId(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                const item = items?.find(i => i.id === editingItemId);
                if (!item) return;
                const payload = {
                  name: item.name,
                  price: Number(coinValue),
                  expiration: item.expiration,
                  status: item.status,
                  description: item.description ?? '',
                };
                editItemCoins.mutate(
                  { id: item.id, payload },
                  { onSuccess: () => setEditingItemId(null) }
                );
              }}
              disabled={editItemCoins.isPending}
            >
              {editItemCoins.isPending ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
