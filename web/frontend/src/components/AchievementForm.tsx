import { useState } from 'react';
import {
  useCreateAchievement,
  useUpdateAchievement,
  useUploadAchievementImage,
} from '@/hooks/useAchievements';
import type {
  CreateAchievementRequest,
  UpdateAchievementRequest,
  Achievement,
} from '@/types/achievement';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AchievementFormProps {
  achievement?: Achievement;
  onSuccess?: () => void;
}

export function AchievementForm({
  achievement,
  onSuccess,
}: AchievementFormProps) {
  const isEditing = !!achievement;
  const createMutation = useCreateAchievement();
  const updateMutation = useUpdateAchievement();
  const uploadImageMutation = useUploadAchievementImage();
  const [formData, setFormData] = useState<Partial<CreateAchievementRequest>>({
    name: achievement?.name || '',
    description: achievement?.description || '',
    event_type: achievement?.event_type || 'VOLUNTEER_EVENT_COMPLETION',
    threshold: achievement?.threshold || 0,
    is_active: achievement?.is_active ?? true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.description ||
      formData.threshold === undefined ||
      !formData.event_type
    ) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      if (isEditing && achievement) {
        const updateData: UpdateAchievementRequest = {
          name: formData.name,
          description: formData.description,
          event_type: formData.event_type,
          threshold: formData.threshold,
          image_s3_key: achievement.image_s3_key || null,
        };
        await updateMutation.mutateAsync({
          id: achievement.id,
          achievement: updateData,
        });
        if (imageFile) {
          await uploadImageMutation.mutateAsync({
            achievementId: achievement.id,
            imageFile,
          });
        }
        alert('Achievement updated successfully!');
      } else {
        const newAchievement = await createMutation.mutateAsync(
          formData as CreateAchievementRequest
        );
        if (imageFile) {
          await uploadImageMutation.mutateAsync({
            achievementId: newAchievement.id,
            imageFile,
          });
        }
        alert('Achievement created successfully!');
      }
      onSuccess?.();
    } catch (error) {
      console.error(
        `Failed to ${isEditing ? 'update' : 'create'} achievement:`,
        error
      );
      alert(`Failed to ${isEditing ? 'update' : 'create'} achievement`);
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
        name === 'threshold'
          ? parseInt(value, 10) || 0
          : name === 'is_active'
            ? (e.target as HTMLInputElement).checked
            : value,
    }));
  };

  return (
    <Card className="bg-karp-background">
      <CardHeader className="bg-karp-background">
        <CardTitle className="text-karp-font">
          {isEditing ? 'Edit Achievement' : 'Create New Achievement'}
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-karp-background">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-karp-font">
              Name *
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter achievement name"
              className="bg-karp-background border-karp-font/20 text-karp-font"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-karp-font">
              Description *
            </Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Enter achievement description"
              rows={4}
              className="w-full px-3 py-2 bg-karp-background border border-karp-font/20 rounded-md text-karp-font focus:outline-none focus:ring-2 focus:ring-karp-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="event_type" className="text-karp-font">
              Event Type *
            </Label>
            <select
              id="event_type"
              name="event_type"
              value={formData.event_type ?? ''}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-karp-background border border-karp-font/20 rounded-md text-karp-font focus:outline-none focus:ring-2 focus:ring-karp-primary"
            >
              <option value="VOLUNTEER_EVENT_COMPLETION">
                Volunteer Event Completion
              </option>
              <option value="USER_LEVEL_UP">User Level Up</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="threshold" className="text-karp-font">
              Threshold *
            </Label>
            <Input
              type="number"
              id="threshold"
              name="threshold"
              value={formData.threshold}
              onChange={handleChange}
              required
              min="0"
              placeholder="Enter threshold value"
              className="bg-karp-background border-karp-font/20 text-karp-font"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="is_active"
              className="text-karp-font flex items-center gap-2"
            >
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="w-4 h-4"
              />
              Active
            </Label>
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
            <Button
              type="submit"
              disabled={
                createMutation.isPending ||
                updateMutation.isPending ||
                uploadImageMutation.isPending
              }
              className="flex-1"
            >
              {createMutation.isPending ||
              updateMutation.isPending ||
              uploadImageMutation.isPending
                ? `${isEditing ? 'Updating' : 'Creating'}...`
                : isEditing
                  ? 'Update Achievement'
                  : 'Create Achievement'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
