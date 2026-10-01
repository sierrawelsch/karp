import { useAuth } from '@/context/AuthContext';

export function UserProfile() {
  const { user, userProfile, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <div>Please log in to view your profile</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">User Profile</h2>

      <div className="bg-karp-font/5 p-4 rounded-lg mb-4">
        <h3 className="font-semibold mb-2">Basic Info</h3>
        <p>
          <strong>Name:</strong> {user.first_name} {user.last_name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Username:</strong> {user.username}
        </p>
        <p>
          <strong>User Type:</strong> {user.user_type}
        </p>
        <p>
          <strong>Entity ID:</strong> {user.entity_id || 'Not set'}
        </p>
      </div>

      {userProfile && (
        <div className="bg-karp-primary/10 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Detailed Profile</h3>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(userProfile, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
