import { useState } from 'react';
import { useVolunteers } from '@/hooks/useVolunteers';
import { useAssignAchievement } from '@/hooks/useVolunteerAchievements';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import type { Achievement } from '@/types/achievement';

interface AssignAchievementModalProps {
  achievement: Achievement;
  onSuccess?: () => void;
  onClose: () => void;
}

export function AssignAchievementModal({
  achievement,
  onSuccess,
  onClose,
}: AssignAchievementModalProps) {
  const { data: volunteers, isLoading } = useVolunteers();
  const assignAchievement = useAssignAchievement();
  const [selectedVolunteerId, setSelectedVolunteerId] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedVolunteerId) {
      alert('Please select a volunteer');
      return;
    }

    try {
      await assignAchievement.mutateAsync({
        achievement_id: achievement.id,
        volunteer_id: selectedVolunteerId,
      });
      alert('Achievement assigned successfully!');
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Failed to assign achievement:', error);
      alert('Failed to assign achievement');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-karp-font mb-4">
        Assign Achievement: {achievement.name}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="volunteer" className="text-karp-font">
            Select Volunteer *
          </Label>
          {isLoading ? (
            <div className="text-karp-font/60">Loading volunteers...</div>
          ) : (
            <select
              id="volunteer"
              value={selectedVolunteerId}
              onChange={e => setSelectedVolunteerId(e.target.value)}
              required
              className="w-full px-3 py-2 bg-karp-background border border-karp-font/20 rounded-md text-karp-font focus:outline-none focus:ring-2 focus:ring-karp-primary"
            >
              <option value="">-- Select a volunteer --</option>
              {volunteers?.map(volunteer => (
                <option key={volunteer.id} value={volunteer.id}>
                  {volunteer.first_name} {volunteer.last_name} ({volunteer.id})
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={assignAchievement.isPending || !selectedVolunteerId}
            className="flex-1"
          >
            {assignAchievement.isPending
              ? 'Assigning...'
              : 'Assign Achievement'}
          </Button>
        </div>
      </form>
    </div>
  );
}
