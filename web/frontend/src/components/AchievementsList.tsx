import { useState } from 'react';
import {
  useAchievements,
  useActivateAchievement,
  useDeactivateAchievement,
  useDeleteAchievement,
} from '@/hooks/useAchievements';
import { AchievementForm } from '@/components/AchievementForm';
import { AssignAchievementModal } from '@/components/AssignAchievementModal';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/ui/button';
import { achievementApi } from '@/api/achievement';
import type { Achievement } from '@/types/achievement';

export function AchievementsList() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAchievement, setEditingAchievement] =
    useState<Achievement | null>(null);
  const [assigningAchievement, setAssigningAchievement] =
    useState<Achievement | null>(null);
  const { data: achievements, isLoading, error } = useAchievements();
  const activateAchievement = useActivateAchievement();
  const deactivateAchievement = useDeactivateAchievement();
  const deleteAchievement = useDeleteAchievement();
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});

  const loadImageUrl = async (achievementId: string) => {
    if (imageUrls[achievementId]) return;
    try {
      const result = await achievementApi.getImageUrl(achievementId);
      setImageUrls(prev => ({ ...prev, [achievementId]: result.url }));
    } catch (error) {
      console.error('Failed to load image:', error);
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading achievements...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-karp-orange">Error loading achievements</div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6 w-full gap-4">
        <h1 className="text-2xl font-bold text-karp-font flex-1">
          Achievements
        </h1>
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
          Create Achievement
        </Button>
      </div>

      {achievements && achievements.length > 0 ? (
        <div className="grid gap-4">
          {achievements.map(achievement => {
            if (achievement.image_s3_key && !imageUrls[achievement.id]) {
              loadImageUrl(achievement.id);
            }

            return (
              <div
                key={achievement.id}
                className="bg-karp-background border border-karp-font/20 rounded-lg p-6 hover:shadow-lg transition-all duration-200 hover:border-karp-primary/50"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 mb-2 flex-wrap">
                      {imageUrls[achievement.id] && (
                        <img
                          src={imageUrls[achievement.id]}
                          alt={achievement.name}
                          className="w-16 h-16 object-cover rounded flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-karp-font break-words">
                          {achievement.name}
                        </h3>
                        <p className="text-sm text-karp-font/60">
                          {achievement.event_type} - Threshold:{' '}
                          {achievement.threshold}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                          achievement.is_active
                            ? 'bg-karp-green/20 text-karp-green'
                            : 'bg-karp-orange/20 text-karp-orange'
                        }`}
                      >
                        {achievement.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-karp-font/80 mt-2 break-words">
                      {achievement.description}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setAssigningAchievement(achievement)}
                    >
                      Assign
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingAchievement(achievement)}
                    >
                      Edit
                    </Button>
                    {achievement.is_active ? (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          deactivateAchievement.mutate(achievement.id)
                        }
                        disabled={deactivateAchievement.isPending}
                      >
                        {deactivateAchievement.isPending
                          ? 'Deactivating...'
                          : 'Deactivate'}
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() =>
                          activateAchievement.mutate(achievement.id)
                        }
                        disabled={activateAchievement.isPending}
                      >
                        {activateAchievement.isPending
                          ? 'Activating...'
                          : 'Activate'}
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        if (
                          confirm(
                            `Are you sure you want to delete "${achievement.name}"?`
                          )
                        ) {
                          deleteAchievement.mutate(achievement.id);
                        }
                      }}
                      disabled={deleteAchievement.isPending}
                    >
                      {deleteAchievement.isPending ? 'Deleting...' : 'Delete'}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-karp-font/70">
          <p>No achievements found.</p>
        </div>
      )}

      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create Achievement"
        >
          <AchievementForm
            onSuccess={() => {
              setShowCreateModal(false);
            }}
          />
        </Modal>
      )}

      {editingAchievement && (
        <Modal
          isOpen={!!editingAchievement}
          onClose={() => setEditingAchievement(null)}
          title="Edit Achievement"
        >
          <AchievementForm
            achievement={editingAchievement}
            onSuccess={() => {
              setEditingAchievement(null);
            }}
          />
        </Modal>
      )}

      {assigningAchievement && (
        <Modal
          isOpen={!!assigningAchievement}
          onClose={() => setAssigningAchievement(null)}
          title="Assign Achievement"
        >
          <AssignAchievementModal
            achievement={assigningAchievement}
            onSuccess={() => {
              setAssigningAchievement(null);
            }}
            onClose={() => setAssigningAchievement(null)}
          />
        </Modal>
      )}
    </div>
  );
}
