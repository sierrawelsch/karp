import { useEffect, useState } from 'react';
import { useCreateEvent } from '@/hooks/useEvents';
import type { CreateEventRequest, EventStatus, Event } from '@/types/event';
import { updateEvent } from '@/api/event';
import { useQueryClient } from '@tanstack/react-query';
import { eventKeys } from '@/hooks/useEvents';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { uploadImage } from '@/api/utils/image';

interface EventFormProps {
  onSuccess?: () => void;
  mode?: 'create' | 'edit';
  initialEvent?: Event | null;
}

export function EventForm({
  onSuccess,
  mode = 'create',
  initialEvent = null,
}: EventFormProps) {
  const [formData, setFormData] = useState<Partial<CreateEventRequest>>({
    name: '',
    address: '',
    start_date_time: '',
    end_date_time: '',
    max_volunteers: 0,
    manual_difficulty_coefficient: 0,
    description: '',
    keywords: [],
    age_min: 0,
    age_max: 0,
  });

  const createEventMutation = useCreateEvent();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submittingAction, setSubmittingAction] = useState<
    'create' | 'draft' | null
  >(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const queryClient = useQueryClient();
  const [keywordsInput, setKeywordsInput] = useState('');

  const isoToDatetimeLocal = (isoString: string): string => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const datetimeLocalToISO = (datetimeLocal: string): string => {
    const date = new Date(datetimeLocal);
    return date.toISOString();
  };

  // Pre-populate when editing
  useEffect(() => {
    if (!initialEvent) return;
    setFormData({
      name: initialEvent.name,
      address: initialEvent.address,
      start_date_time: initialEvent.start_date_time
        ? isoToDatetimeLocal(initialEvent.start_date_time)
        : '',
      end_date_time: initialEvent.end_date_time
        ? isoToDatetimeLocal(initialEvent.end_date_time)
        : '',
      max_volunteers: initialEvent.max_volunteers,
      manual_difficulty_coefficient: initialEvent.manual_difficulty_coefficient,
      description: initialEvent.description ?? '',
      keywords: initialEvent.keywords ?? [],
      age_min: initialEvent.age_min ?? 0,
      age_max: initialEvent.age_max ?? 0,
    });
    if (Array.isArray(initialEvent.keywords)) {
      setKeywordsInput(initialEvent.keywords.join(', '));
    } else {
      setKeywordsInput('');
    }
  }, [initialEvent]);

  async function submitEvent(action: 'create' | 'draft') {
    if (
      !formData.name ||
      !formData.address ||
      !formData.start_date_time ||
      !formData.end_date_time
    ) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setSubmittingAction(action);
      const statusOverride: EventStatus | undefined =
        action === 'draft' ? 'DRAFT' : undefined;
      const payload = { ...(formData as CreateEventRequest) } as Record<
        string,
        unknown
      >;
      payload.start_date_time = datetimeLocalToISO(formData.start_date_time);
      payload.end_date_time = datetimeLocalToISO(formData.end_date_time);
      if (statusOverride) {
        // Add status for draft without changing types
        payload.status = statusOverride;
      }
      const newEvent = await createEventMutation.mutateAsync(
        payload as unknown as CreateEventRequest
      );
      if (imageFile) {
        const uploadResult = await uploadImage('event', newEvent.id, imageFile);
        formData.image_url = uploadResult.upload_url;
      }
      alert('Event created successfully!');
      onSuccess?.();
    } catch (error) {
      console.error('Failed to create event:', error);
      alert('Failed to create event');
    } finally {
      setSubmittingAction(null);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'edit' && initialEvent) {
      // Call update endpoint
      try {
        setSavingEdit(true);
        const updatePayload = { ...(formData as Record<string, unknown>) };
        if (updatePayload.start_date_time) {
          updatePayload.start_date_time = datetimeLocalToISO(
            updatePayload.start_date_time as string
          );
        }
        if (updatePayload.end_date_time) {
          updatePayload.end_date_time = datetimeLocalToISO(
            updatePayload.end_date_time as string
          );
        }
        await updateEvent({
          id: initialEvent.id,
          ...updatePayload,
        } as never);
        // Ensure lists are refreshed
        queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
        alert('Event updated successfully!');
        onSuccess?.();
      } catch (error) {
        console.error('Failed to update event:', error);
        alert('Failed to update event');
      } finally {
        setSavingEdit(false);
      }
    } else {
      await submitEvent('create'); // default flow
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]:
        name === 'max_volunteers' || name === 'manual_difficulty_coefficient'
          ? Number(value)
          : value,
    }));
  };

  return (
    <Card className="bg-karp-background h-[90vh] flex flex-col scale-90 -mt-15">
      <CardHeader className="bg-karp-background">
        <CardTitle className="text-karp-font">
          {mode === 'edit' ? 'Edit Event' : 'Create New Event'}
        </CardTitle>
      </CardHeader>
      {/* <div className="h-screen p-6 bg-gray-50 overflow-y-auto"> */}
      <CardContent className="bg-karp-background h-full overflow-y-auto flex flex-col">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-karp-font">
              Event Name *
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter event name"
              className="bg-karp-background border-karp-font/20 text-karp-font"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-karp-font">
              Address *
            </Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="Enter event address"
              className="bg-karp-background border-karp-font/20 text-karp-font"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date_time" className="text-karp-font">
                Start Date & Time *
              </Label>
              <Input
                type="datetime-local"
                id="start_date_time"
                name="start_date_time"
                value={formData.start_date_time}
                onChange={handleChange}
                required
                className="bg-karp-background border-karp-font/20 text-karp-font"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date_time" className="text-karp-font">
                End Date & Time *
              </Label>
              <Input
                type="datetime-local"
                id="end_date_time"
                name="end_date_time"
                value={formData.end_date_time}
                onChange={handleChange}
                required
                className="bg-karp-background border-karp-font/20 text-karp-font"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="max_volunteers" className="text-karp-font">
                Max Volunteers
              </Label>
              <Input
                type="number"
                id="max_volunteers"
                name="max_volunteers"
                value={formData.max_volunteers}
                onChange={handleChange}
                min="0"
                placeholder="0"
                className="bg-karp-background border-karp-font/20 text-karp-font"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="manual_difficulty_coefficient"
                className="text-karp-font"
              >
                Difficulty
              </Label>
              <select
                id="manual_difficulty_coefficient"
                name="manual_difficulty_coefficient"
                value={String(formData.manual_difficulty_coefficient ?? 0)}
                onChange={handleChange}
                className="bg-karp-background border border-karp-font/20 text-karp-font rounded-md px-3 py-2"
              >
                <option value="0">Easy</option>
                <option value="1">Moderate</option>
                <option value="2">Difficult</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age_min" className="text-karp-font">
                Minimum Age
              </Label>
              <Input
                type="number"
                id="age_min"
                name="age_min"
                value={formData.age_min}
                onChange={handleChange}
                min="0"
                placeholder="0"
                className="bg-karp-background border-karp-font/20 text-karp-font"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age_max" className="text-karp-font">
                Maximum Age
              </Label>
              <Input
                type="number"
                id="age_max"
                name="age_max"
                value={formData.age_max}
                onChange={handleChange}
                min="0"
                placeholder="0"
                className="bg-karp-background border-karp-font/20 text-karp-font"
              />
            </div>
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
              placeholder="Enter event description"
              className="bg-karp-background border-karp-font/20 text-karp-font"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="keywords" className="text-karp-font">
              Keywords
            </Label>
            <Input
              id="keywords"
              name="keywords"
              value={keywordsInput}
              onChange={e => setKeywordsInput(e.target.value)}
              onBlur={() => {
                const keywords = keywordsInput
                  .split(',')
                  .map(k => k.trim())
                  .filter(k => k);
                setFormData(prev => ({ ...prev, keywords }));
              }}
              placeholder="Enter keywords separated by commas"
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

          <div className="mt-auto bg-karp-background p-4 flex gap-3 border-t border-gray-200 sticky bottom-0">
            {mode === 'edit' ? (
              <Button type="submit" disabled={savingEdit} className="flex-1">
                {savingEdit ? 'Saving...' : 'Save'}
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  variant="secondary"
                  disabled={createEventMutation.isPending}
                  className="flex-1"
                  onClick={() => submitEvent('draft')}
                >
                  {submittingAction === 'draft' && createEventMutation.isPending
                    ? 'Saving...'
                    : 'Save as Draft'}
                </Button>
                <Button
                  type="submit"
                  disabled={createEventMutation.isPending}
                  className="flex-1"
                >
                  {submittingAction === 'create' &&
                  createEventMutation.isPending
                    ? 'Creating...'
                    : 'Create Event'}
                </Button>
              </>
            )}
          </div>
        </form>
      </CardContent>
      {/* </div> */}
    </Card>
  );
}
