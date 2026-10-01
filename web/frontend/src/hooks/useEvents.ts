import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createEvent,
  getEvent,
  getAllEvents,
  updateEvent,
  deleteEvent,
  getEventsByOrganization,
  generateEventQRCodes,
} from '@/api/event';
import type { EventStatus } from '@/types/event';

export const eventKeys = {
  all: ['events'] as const,
  lists: () => [...eventKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) =>
    [...eventKeys.lists(), { filters }] as const,
  details: () => [...eventKeys.all, 'detail'] as const,
  detail: (id: string) => [...eventKeys.details(), id] as const,
  byOrganization: (organizationId: string) =>
    [...eventKeys.all, 'organization', organizationId] as const,
};

export function useEvents(
  status: EventStatus,
  organizationId: string | undefined
) {
  return useQuery({
    queryKey: ['event', status, organizationId],
    queryFn: () => getAllEvents(status, organizationId),
  });
}

export function useEvent(eventId: string) {
  return useQuery({
    queryKey: eventKeys.detail(eventId),
    queryFn: () => getEvent(eventId),
    enabled: !!eventId,
  });
}

export function useEventsByOrganization(organizationId: string) {
  return useQuery({
    queryKey: eventKeys.byOrganization(organizationId),
    queryFn: () => getEventsByOrganization(organizationId),
    enabled: !!organizationId,
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEvent,
    onSuccess: newEvent => {
      queryClient.invalidateQueries({ queryKey: ['event'] });

      queryClient.setQueryData(eventKeys.detail(newEvent.id), newEvent);

      if (newEvent.organization_id) {
        queryClient.invalidateQueries({
          queryKey: eventKeys.byOrganization(newEvent.organization_id),
        });
      }
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateEvent,
    onSuccess: updatedEvent => {
      queryClient.setQueryData(
        eventKeys.detail(updatedEvent.id!),
        updatedEvent
      );

      queryClient.invalidateQueries({ queryKey: ['event'] });

      if (updatedEvent.organization_id) {
        queryClient.invalidateQueries({
          queryKey: eventKeys.byOrganization(updatedEvent.organization_id),
        });
      }
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEvent,
    onSuccess: (_, eventId) => {
      queryClient.removeQueries({ queryKey: eventKeys.detail(eventId) });

      queryClient.invalidateQueries({ queryKey: ['event'] });

      queryClient.invalidateQueries({ queryKey: eventKeys.all });
    },
  });
}

export function useGenerateEventQrCodes() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: generateEventQRCodes,
    onSuccess: (updatedEvent, eventId) => {
      // Ensure the specific event detail is refreshed
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(eventId) });
      // Refresh all event list queries (these use the ['event', ...] key)
      queryClient.invalidateQueries({ queryKey: ['event'] });
      // Also refresh organization-scoped lists if org id is present
      if (updatedEvent?.organization_id) {
        queryClient.invalidateQueries({
          queryKey: eventKeys.byOrganization(updatedEvent.organization_id),
        });
      }
      // And refresh any 'events' keyed queries (safety for other consumers)
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
    },
    // eslint-disable-next-line
    onError: (err: any) => {
      alert(err.detail);
    },
  });
}
