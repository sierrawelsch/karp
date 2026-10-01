import { useState } from 'react';
import { useVendors, useUpdateVendor } from '@/hooks/useVendors';
import { Button } from '@/components/ui/button';
import type { VendorStatus } from '@/types/vendor';
import { useSearchParams } from 'react-router-dom';

export function VendorsList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const status = (searchParams.get('status') as VendorStatus) || 'APPROVED';
  const { data: vendors, isLoading, error } = useVendors(status);
  const updateVendor = useUpdateVendor();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  if (isLoading) {
    return <div className="p-4">Loading vendors...</div>;
  }

  if (error) {
    return <div className="p-4 text-karp-orange">Error loading vendors</div>;
  }

  const titleizedStatus =
    status.toLowerCase().charAt(0).toUpperCase() +
    status.toLowerCase().slice(1);

  const tabs: Array<{ label: string; value: VendorStatus }> = [
    { label: 'Approved', value: 'APPROVED' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Rejected', value: 'REJECTED' },
    { label: 'Deleted', value: 'DELETED' },
  ];

  const handleStatusChange = async (
    id: string,
    name: string,
    description: string | undefined,
    newStatus: VendorStatus
  ) => {
    setUpdatingId(id);
    try {
      await updateVendor.mutateAsync({
        id,
        data: {
          name,
          description,
          status: newStatus,
        },
      });
    } catch (e) {
      console.error('Failed to update vendor status', e);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-4">
      <div className="fixed top-[48px] left-0 right-0 z-30 px-4 md:px-8 py-3 bg-karp-background/95 supports-[backdrop-filter]:bg-karp-background/80 backdrop-blur border-b border-karp-font/10">
        <div className="mx-auto w-full min-w-[1100px]">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-foreground">
              {titleizedStatus} Vendors
            </h1>
          </div>
          <div className="mt-3 flex gap-2 flex-nowrap">
            {tabs.map(tab => {
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
      <div style={{ height: 130 }} />

      {vendors && vendors.length > 0 ? (
        <div className="mx-auto w-full min-w-[1100px] grid gap-4">
          {vendors.map(vendor => (
            <div
              key={vendor.id}
              className="bg-karp-background border border-karp-font/20 rounded-lg p-6 hover:shadow-lg transition-all duration-200 hover:border-karp-primary/50"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-karp-font">
                      {vendor.name}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        vendor.status === 'APPROVED'
                          ? 'bg-karp-green/20 text-karp-green'
                          : vendor.status === 'PENDING'
                            ? 'bg-karp-yellow/20 text-karp-yellow'
                            : vendor.status === 'REJECTED'
                              ? 'bg-karp-orange/20 text-karp-orange'
                              : 'bg-karp-font/10 text-karp-font'
                      }`}
                    >
                      {vendor.status}
                    </span>
                  </div>
                  <div className="text-sm text-karp-font/70 space-y-1">
                    {vendor.business_type && (
                      <p>Business Type: {vendor.business_type}</p>
                    )}
                    {vendor.created_at && (
                      <p>
                        Created:{' '}
                        {new Date(vendor.created_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  {vendor.description && (
                    <p className="text-karp-font/80 mt-2">
                      {vendor.description}
                    </p>
                  )}
                </div>
                <div className="ml-4 flex flex-col gap-2">
                  {vendor.status === 'APPROVED' && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        handleStatusChange(
                          vendor.id,
                          vendor.name,
                          vendor.description,
                          'DELETED'
                        )
                      }
                      disabled={updatingId === vendor.id}
                    >
                      {updatingId === vendor.id ? 'Deleting...' : 'Delete'}
                    </Button>
                  )}
                  {vendor.status === 'PENDING' && (
                    <>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() =>
                          handleStatusChange(
                            vendor.id,
                            vendor.name,
                            vendor.description,
                            'APPROVED'
                          )
                        }
                        disabled={updatingId === vendor.id}
                      >
                        {updatingId === vendor.id ? 'Approving...' : 'Approve'}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() =>
                          handleStatusChange(
                            vendor.id,
                            vendor.name,
                            vendor.description,
                            'REJECTED'
                          )
                        }
                        disabled={updatingId === vendor.id}
                      >
                        {updatingId === vendor.id ? 'Rejecting...' : 'Reject'}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-karp-font/70">
          <p>No vendors found.</p>
        </div>
      )}
    </div>
  );
}
