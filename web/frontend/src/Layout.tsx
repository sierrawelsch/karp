import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import type { UserType } from '@/types/user';

const Layout = () => {
  const { isAuthenticated, logout, user, userProfile } = useAuth();
  const navigate = useNavigate();

  const canAccessEvents = (userType: UserType) =>
    ['ORGANIZATION', 'ADMIN'].includes(userType);

  const canAccessItems = (userType: UserType) =>
    ['VENDOR', 'ADMIN'].includes(userType);

  const canAccessOrganizations = (userType: UserType) =>
    ['ADMIN'].includes(userType);

  const canAccessVolunteers = (userType: UserType) => {
    return ['ADMIN'].includes(userType);
  };

  const canAccessAchievements = (userType: UserType) => {
    return ['ADMIN'].includes(userType);
  };
  const canAccessVendors = (userType: UserType) => {
    return ['ADMIN'].includes(userType);
  };

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <>
      <aside
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          padding: 12,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderBottom: '1px solid rgba(29, 15, 72, 0.2)',
          minWidth: '1100px',
        }}
      >
        <Link to="/">Home</Link>
        {user && userProfile && canAccessEvents(user.user_type) && (
          <Link to="/events">Events</Link>
        )}

        {user && userProfile && canAccessItems(user.user_type) && (
          <Link to="/items">Items</Link>
        )}

        {user && canAccessOrganizations(user.user_type) && (
          <Link to="/organizations">Organizations</Link>
        )}

        {user && canAccessVendors(user.user_type) && (
          <Link to="/vendors">Vendors</Link>
        )}

        {user && canAccessVolunteers(user.user_type) && (
          <Link to="/volunteers">Volunteers</Link>
        )}

        {user && canAccessAchievements(user.user_type) && (
          <Link to="/achievements">Achievements</Link>
        )}

        {isAuthenticated && (
          <Link to="/login" onClick={handleLogout}>
            Logout
          </Link>
        )}
      </aside>
      {/* spacer to offset fixed header height */}
      <div style={{ height: 48 }} />
      <Outlet />
    </>
  );
};

export default Layout;
