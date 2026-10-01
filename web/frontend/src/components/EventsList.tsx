import { useState } from 'react';
import {
  useEvents,
  useGenerateEventQrCodes,
  useUpdateEvent,
} from '@/hooks/useEvents';
import { EventForm } from '@/components/EventForm';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/ui/button';
import type { UpdateEventRequest } from '@/types/event';
import { useAuth } from '@/context/AuthContext';
import type { EventStatus, Event } from '@/types/event';
import { EventPage } from './EventPage';
import { useSearchParams } from 'react-router-dom';

export function EventsList() {
  const { user, userProfile } = useAuth();
  const isAdmin = user?.user_type === 'ADMIN';

  const organizationId = isAdmin ? undefined : userProfile?.id;

  const [searchParams, setSearchParams] = useSearchParams();
  const status = (searchParams.get('status') || 'APPROVED') as EventStatus;

  const [showCreateModal, setShowCreateModal] = useState(false);
  const { data: events, isLoading, error } = useEvents(status, organizationId);
  const updateEvent = useUpdateEvent();
  const generateEventQRCodes = useGenerateEventQrCodes();
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [coinValue, setCoinValue] = useState<string>('');
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [displayingEvent, setDisplayingEvent] = useState<Event | null>(null);
  const [updatingEventId, setUpdatingEventId] = useState<string | null>(null);
  const [updatingAction, setUpdatingAction] = useState<
    'publish' | 'cancel' | 'approve' | 'reject' | null
  >(null);
  const [qrGeneratingIds, setQrGeneratingIds] = useState<Set<string>>(
    new Set()
  );

  function sendStatusUpdate(
    eventId: string,
    current: UpdateEventRequest,
    newStatus: EventStatus
  ) {
    setUpdatingEventId(eventId);
    setUpdatingAction(
      newStatus === 'CANCELLED'
        ? 'cancel'
        : newStatus === 'PUBLISHED'
          ? 'publish'
          : null
    );
    updateEvent.mutate(
      {
        id: eventId,
        coins: current.coins,
        name: current.name,
        address: current.address,
        start_date_time: current.start_date_time,
        end_date_time: current.end_date_time,
        max_volunteers: current.max_volunteers,
        description: current.description,
        keywords: current.keywords,
        age_min: current.age_min,
        age_max: current.age_max,
        status: newStatus,
      },
      {
        onSettled: () => {
          setUpdatingEventId(null);
          setUpdatingAction(null);
        },
      }
    );
  }

  if (isLoading) {
    return <div className="p-4">Loading events...</div>;
  }

  if (error) {
    return <div className="p-4 text-karp-orange">Error loading events</div>;
  }

  const titleizedStatus =
    status.toLowerCase().charAt(0).toUpperCase() +
    status.toLowerCase().slice(1);

  const tabs: Array<{ label: string; value: EventStatus }> = [
    { label: 'Approved', value: 'APPROVED' },
    { label: 'Published', value: 'PUBLISHED' },
    { label: 'Drafts', value: 'DRAFT' },
    { label: 'Rejected', value: 'REJECTED' },
    { label: 'Cancelled', value: 'CANCELLED' },
  ];

  return (
    <div className="p-4">
      <div className="fixed top-[48px] left-0 right-0 z-30 px-4 md:px-8 py-3 bg-karp-background/95 supports-[backdrop-filter]:bg-karp-background/80 backdrop-blur border-b border-karp-font/10">
        <div className="mx-auto w-full min-w-[1100px]">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-foreground">
              {titleizedStatus} Events
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
                Create Event
              </Button>
            )}
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
      {/* spacer to offset fixed title+tabs bar height */}
      <div style={{ height: 130 }} />

      <div className="mx-auto w-full min-w-[1100px]">
        {events && events.length > 0 ? (
          <div className="grid gap-4">
            {events.map(event => {
              return (
                <div
                  key={event.id}
                  className="bg-karp-background border border-karp-font/20 rounded-lg p-6 hover:shadow-lg transition-all duration-200 hover:border-karp-primary/50 cursor-pointer"
                  onClick={() => setDisplayingEvent(event)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-karp-font">
                        {event.name}
                      </h3>
                      <p className="text-karp-font/70">{event.address}</p>
                      <p className="text-sm text-karp-font/60">
                        {new Date(event.start_date_time).toLocaleDateString()} -{' '}
                        {new Date(event.end_date_time).toLocaleDateString()}
                      </p>
                      {event.description && (
                        <p className="text-karp-font/80 mt-2">
                          {event.description}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          status === 'PUBLISHED'
                            ? 'bg-karp-green/20 text-karp-green'
                            : status === 'DRAFT'
                              ? 'bg-karp-yellow/20 text-karp-yellow'
                              : status === 'CANCELLED'
                                ? 'bg-karp-orange/20 text-karp-orange'
                                : 'bg-karp-font/10 text-karp-font'
                        }`}
                      >
                        {event.status}
                      </span>

                      <div className="mt-2 text-sm text-karp-font/70">
                        <p>Max Volunteers: {event.max_volunteers}</p>
                        <p>Coins: {event.coins}</p>
                      </div>

                      <div className="mt-3 flex gap-2  justify-end">
                        {/* EDIT BUTTON — triggers setEditingEvent */}
                        <Button
                          size="sm"
                          onClick={e => {
                            e.stopPropagation(); // IMPORTANT: prevents triggering the card click
                            setEditingEvent(event);
                          }}
                        >
                          Edit
                        </Button>
                      </div>

                      {event.status === 'APPROVED' &&
                        !isAdmin &&
                        !event.check_in_qr_code_image &&
                        !event.check_out_qr_code_image && (
                          <div className="mt-3 flex gap-2  justify-end">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={e => {
                                e.stopPropagation(); // IMPORTANT: prevents triggering the card click
                                setQrGeneratingIds(prev => {
                                  const next = new Set(prev);
                                  next.add(event.id);
                                  return next;
                                });
                                generateEventQRCodes.mutate(event.id, {
                                  onSuccess: () => {
                                    alert('QR Codes Generated!');
                                  },
                                  onSettled: () => {
                                    setQrGeneratingIds(prev => {
                                      const next = new Set(prev);
                                      next.delete(event.id);
                                      return next;
                                    });
                                  },
                                });
                              }}
                              disabled={qrGeneratingIds.has(event.id)}
                            >
                              {qrGeneratingIds.has(event.id)
                                ? 'Generating...'
                                : 'Generate QR Codes'}
                            </Button>
                          </div>
                        )}

                      <div className="mt-3 flex gap-2 justify-end">
                        {!(status === 'REJECTED' || status === 'CANCELLED') && (
                          <>
                            {status === 'DRAFT' && (
                              <Button
                                size="sm"
                                variant="success"
                                onClick={e => {
                                  e.stopPropagation();
                                  sendStatusUpdate(
                                    event.id,
                                    event,
                                    'PUBLISHED'
                                  );
                                }}
                                disabled={updateEvent.isPending}
                              >
                                {updateEvent.isPending &&
                                updatingEventId === event.id &&
                                updatingAction === 'publish'
                                  ? 'Publishing...'
                                  : 'Publish'}
                              </Button>
                            )}
                            {isAdmin && status === 'PUBLISHED' && (
                              <Button
                                size="sm"
                                variant="success"
                                onClick={e => {
                                  e.stopPropagation();
                                  setUpdatingEventId(event.id);
                                  setUpdatingAction('approve');
                                  updateEvent.mutate(
                                    {
                                      id: event.id,
                                      coins: event.coins,
                                      name: event.name,
                                      address: event.address,
                                      start_date_time: event.start_date_time,
                                      end_date_time: event.end_date_time,
                                      max_volunteers: event.max_volunteers,
                                      description: event.description,
                                      keywords: event.keywords,
                                      age_min: event.age_min,
                                      age_max: event.age_max,
                                      status: 'APPROVED',
                                    } as never,
                                    {
                                      onSettled: () => {
                                        setUpdatingEventId(null);
                                        setUpdatingAction(null);
                                      },
                                    }
                                  );
                                }}
                                disabled={updateEvent.isPending}
                              >
                                {updateEvent.isPending &&
                                updatingEventId === event.id &&
                                updatingAction === 'approve'
                                  ? 'Approving...'
                                  : 'Approve'}
                              </Button>
                            )}
                            {isAdmin && status === 'PUBLISHED' && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={e => {
                                  e.stopPropagation();
                                  setUpdatingEventId(event.id);
                                  setUpdatingAction('reject');
                                  updateEvent.mutate(
                                    {
                                      id: event.id,
                                      coins: event.coins,
                                      name: event.name,
                                      address: event.address,
                                      start_date_time: event.start_date_time,
                                      end_date_time: event.end_date_time,
                                      max_volunteers: event.max_volunteers,
                                      description: event.description,
                                      keywords: event.keywords,
                                      age_min: event.age_min,
                                      age_max: event.age_max,
                                      status: 'REJECTED',
                                    } as never,
                                    {
                                      onSettled: () => {
                                        setUpdatingEventId(null);
                                        setUpdatingAction(null);
                                      },
                                    }
                                  );
                                }}
                                disabled={updateEvent.isPending}
                              >
                                {updateEvent.isPending &&
                                updatingEventId === event.id &&
                                updatingAction === 'reject'
                                  ? 'Rejecting...'
                                  : 'Reject'}
                              </Button>
                            )}
                            {/* Cancel available when not cancelled or rejected already */}
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={e => {
                                e.stopPropagation();
                                sendStatusUpdate(event.id, event, 'CANCELLED');
                              }}
                              disabled={updateEvent.isPending}
                            >
                              {updateEvent.isPending &&
                              updatingEventId === event.id &&
                              updatingAction === 'cancel'
                                ? 'Cancelling...'
                                : 'Cancel'}
                            </Button>
                            {/* Edit Coins hidden for cancelled/rejected via outer guard */}
                            {isAdmin && (
                              <Button
                                size="sm"
                                variant="warning"
                                onClick={e => {
                                  e.stopPropagation();
                                  setEditingEventId(event.id);
                                  setCoinValue(String(event.coins ?? 0));
                                }}
                                disabled={updateEvent.isPending}
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
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-karp-font/70">
            <p>No events found</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Event"
        size="2xl"
      >
        <EventForm onSuccess={() => setShowCreateModal(false)} />
      </Modal>

      <Modal
        isOpen={!!editingEvent}
        onClose={() => setEditingEvent(null)}
        title="Edit Event"
        size="2xl"
      >
        <EventForm
          mode="edit"
          initialEvent={editingEvent}
          onSuccess={() => setEditingEvent(null)}
        />
      </Modal>

      <Modal
        isOpen={!!displayingEvent}
        onClose={() => setDisplayingEvent(null)}
        title="Event"
        size="2xl"
      >
        <EventPage event={displayingEvent} />
      </Modal>
      <Modal
        isOpen={!!editingEventId}
        onClose={() => setEditingEventId(null)}
        title="Edit Event Coins"
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
            <Button variant="ghost" onClick={() => setEditingEventId(null)}>
              Cancel
            </Button>

            <Button
              onClick={() => {
                const ev = events?.find(e => e.id === editingEventId);
                if (!ev) return;
                updateEvent.mutate(
                  {
                    id: ev.id,
                    coins: Number(coinValue),
                  },
                  {
                    onSuccess: () => setEditingEventId(null),
                  }
                );
              }}
              disabled={updateEvent.isPending}
            >
              {updateEvent.isPending ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
