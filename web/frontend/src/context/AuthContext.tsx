import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { loginApi } from '@/api/auth';
import { getUserProfile, getProfileByUserType } from '@/api/profile';
import { HttpError } from '@/api/base';
import type {
  AdminProfile,
  AuthUser,
  OrganizationProfile,
  VolunteerProfile,
  VendorProfile,
} from '@/types/user';

type AuthContextValue = {
  isAuthenticated: boolean;
  token: string | null;
  user: AuthUser | null;
  userProfile:
    | VolunteerProfile
    | VendorProfile
    | OrganizationProfile
    | AdminProfile
    | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('auth_token');
  });
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userProfile, setUserProfile] = useState<
    VolunteerProfile | VendorProfile | OrganizationProfile | AdminProfile | null
  >(null);

  const isAuthenticated = Boolean(token);

  // On initial mount, if a token exists, hydrate the user/profile
  useEffect(() => {
    async function hydrateFromToken() {
      if (!token || user) return;
      try {
        const userData = await getUserProfile();
        setUser(userData);
        if (userData.entity_id) {
          const profile = await getProfileByUserType(userData.user_type);
          setUserProfile(profile);
        }
      } catch (error) {
        // Only clear token if explicitly unauthorized
        console.error('Failed to hydrate user from token:', error);
        const status = (error as HttpError).status;
        if (status === 401 || status === 403) {
          localStorage.removeItem('auth_token');
          setToken(null);
          setUser(null);
          setUserProfile(null);
        }
      }
    }
    void hydrateFromToken();
    // Only run on mount and when token changes from storage
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }, [token]);

  useEffect(() => {
    const loadUserData = async () => {
      if (token && !user) {
        try {
          const userData = await getUserProfile();
          setUser(userData);

          if (userData.entity_id) {
            const profile = await getProfileByUserType(userData.user_type);
            setUserProfile(profile);
          }
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          // Only clear token if it's an authentication error (401/403)
          // The error message from makeRequest includes the status code
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          if (
            errorMessage.includes('401') ||
            errorMessage.includes('403') ||
            errorMessage.includes('Unauthorized') ||
            errorMessage.includes('Forbidden')
          ) {
            console.log('Authentication error detected, clearing token');
            setToken(null);
          } else {
            // For other errors (network, server errors, etc.), keep the token
            // but log the error - user might still be authenticated
            console.warn(
              'Non-authentication error when loading user profile, keeping token'
            );
          }
        }
      }
    };

    loadUserData();
  }, [token, user]);

  const login = useCallback(async (username: string, password: string) => {
    const res = await loginApi(username, password);
    const nextToken = res.access_token ?? '';
    if (!nextToken) {
      throw new Error('Login response missing token');
    }

    localStorage.setItem('auth_token', nextToken);
    setToken(nextToken);

    try {
      const userData = await getUserProfile();
      setUser(userData);

      if (userData.entity_id) {
        const profile = await getProfileByUserType(userData.user_type);
        setUserProfile(profile);
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
    setUserProfile(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ isAuthenticated, token, user, userProfile, login, logout }),
    [isAuthenticated, token, user, userProfile, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
