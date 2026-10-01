import { useVolunteers } from '@/hooks/useVolunteers';

export function VolunteersList() {
  const { data: volunteers, isLoading, error } = useVolunteers();

  if (isLoading) {
    return <div className="p-4">Loading volunteers...</div>;
  }

  if (error) {
    return <div className="p-4 text-karp-orange">Error loading volunteers</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">Volunteers</h1>
      </div>

      {volunteers && volunteers.length > 0 ? (
        <div className="grid gap-4">
          {volunteers.map(volunteer => (
            <div
              key={volunteer.id}
              className="bg-karp-background border border-karp-font/20 rounded-lg p-6 hover:shadow-lg transition-all duration-200 hover:border-karp-primary/50"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-karp-font">
                    {volunteer.preferred_name
                      ? `${volunteer.preferred_name} (${volunteer.first_name} ${volunteer.last_name})`
                      : `${volunteer.first_name} ${volunteer.last_name}`}
                  </h3>
                  <p className="text-sm text-karp-font/60">
                    Date of Birth:{' '}
                    {volunteer?.birth_date
                      ? new Date(volunteer.birth_date).toLocaleDateString()
                      : 'N/A'}
                  </p>
                  <p className="text-sm text-karp-font/70 mt-2">
                    Coins: {volunteer.coins}
                  </p>
                  <p className="text-sm text-karp-font/70">
                    Level: {volunteer.current_level}
                  </p>
                  <p className="text-sm text-karp-font/70">
                    Experience: {volunteer.experience}
                  </p>
                  <p className="text-sm text-karp-font/70">
                    Status: {volunteer.is_active ? 'Active' : 'Inactive'}
                  </p>
                </div>
                <div />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-karp-font/70">
          <p>No volunteers found.</p>
        </div>
      )}
    </div>
  );
}
