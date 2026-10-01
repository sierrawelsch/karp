import { useState } from 'react';
import {
  useOrganizations,
  useUpdateOrganization,
} from '@/hooks/useOrganizations';
import { Button } from '@/components/ui/button';
import type { OrganizationStatus } from '@/types/organization';
import { useSearchParams } from 'react-router-dom';

export function OrganizationsList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const status =
    (searchParams.get('status') as OrganizationStatus) || 'APPROVED';
  const { data: organizations, isLoading, error } = useOrganizations(status);
  const updateOrganization = useUpdateOrganization();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusChange = async (
    orgId: string,
    currentName: string,
    currentDescription: string,
    newStatus: OrganizationStatus
  ) => {
    setUpdatingId(orgId);
    try {
      await updateOrganization.mutateAsync({
        id: orgId,
        data: {
          name: currentName,
          description: currentDescription,
          status: newStatus,
        },
      });
    } catch (error) {
      console.error('Failed to update organization status:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading organizations...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-karp-orange">Error loading organizations</div>
    );
  }

  const titleizedStatus =
    status.toLowerCase().charAt(0).toUpperCase() +
    status.toLowerCase().slice(1);

  const tabs: Array<{ label: string; value: OrganizationStatus }> = [
    { label: 'Approved', value: 'APPROVED' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Rejected', value: 'REJECTED' },
    { label: 'Deleted', value: 'DELETED' },
  ];

  const filteredOrganizations =
    organizations?.filter(org => org.status === status) || [];

  return (
    <div className="p-4">
      <div className="fixed top-[48px] left-0 right-0 z-30 px-4 md:px-8 py-3 bg-karp-background/95 supports-[backdrop-filter]:bg-karp-background/80 backdrop-blur border-b border-karp-font/10">
        <div className="mx-auto w-full min-w-[1100px]">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-foreground">
              {titleizedStatus} Organizations
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
      {/* spacer to offset fixed title bar */}
      <div style={{ height: 130 }} />

      {filteredOrganizations.length > 0 ? (
        <div className="mx-auto w-full min-w-[1100px] grid gap-4">
          {filteredOrganizations.map(organization => (
            <div
              key={organization.id}
              className="bg-karp-background border border-karp-font/20 rounded-lg p-6 hover:shadow-lg transition-all duration-200 hover:border-karp-primary/50"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-karp-font">
                      {organization.name}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        organization.status === 'APPROVED'
                          ? 'bg-karp-green/20 text-karp-green'
                          : organization.status === 'PENDING'
                            ? 'bg-karp-yellow/20 text-karp-yellow'
                            : organization.status === 'REJECTED'
                              ? 'bg-karp-orange/20 text-karp-orange'
                              : 'bg-karp-font/10 text-karp-font'
                      }`}
                    >
                      {organization.status}
                    </span>
                  </div>
                  {organization.description && (
                    <p className="text-karp-font/80 mt-2">
                      {organization.description}
                    </p>
                  )}
                </div>
                <div className="ml-4 flex flex-col gap-2">
                  {organization.status === 'APPROVED' && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        handleStatusChange(
                          organization.id,
                          organization.name,
                          organization.description,
                          'DELETED'
                        )
                      }
                      disabled={updatingId === organization.id}
                    >
                      {updatingId === organization.id
                        ? 'Deleting...'
                        : 'Delete'}
                    </Button>
                  )}
                  {organization.status === 'PENDING' && (
                    <>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() =>
                          handleStatusChange(
                            organization.id,
                            organization.name,
                            organization.description,
                            'APPROVED'
                          )
                        }
                        disabled={updatingId === organization.id}
                      >
                        {updatingId === organization.id
                          ? 'Approving...'
                          : 'Approve'}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() =>
                          handleStatusChange(
                            organization.id,
                            organization.name,
                            organization.description,
                            'REJECTED'
                          )
                        }
                        disabled={updatingId === organization.id}
                      >
                        {updatingId === organization.id
                          ? 'Rejecting...'
                          : 'Reject'}
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
          <p>No organizations found.</p>
        </div>
      )}
    </div>
  );
}
