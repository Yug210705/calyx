import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAuthToken, removeAuthToken } from './api';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  session: { access_token: string } | null;
  user: User | null;
  isDemoMode: boolean;
  setDemoMode: (isDemo: boolean) => void;
  signOut: () => Promise<void>;
  isLoading: boolean;
  loginState: (token: string, user: User) => void;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isDemoMode: false,
  setDemoMode: () => {},
  signOut: async () => {},
  isLoading: true,
  loginState: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<{ access_token: string } | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    return localStorage.getItem('demo_mode') === 'true';
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = getAuthToken();
      if (token) {
        setSession({ access_token: token });
        try {
          let base64 = token.split('.')[1];
          base64 = base64.replace(/-/g, '+').replace(/_/g, '/');
          while (base64.length % 4) {
            base64 += '=';
          }
          const payload = JSON.parse(atob(base64));
          setUser({ id: payload.sub, email: payload.email || 'user@example.com' });
          
          // Hydrate full user from backend
          try {
            const { userService } = await import('./api');
            const userData = await userService.getMe();
            if (userData && userData.email) {
              setUser(userData);
            }
          } catch (apiErr) {
            console.error("Failed to fetch user profile", apiErr);
          }
        } catch (e) {
          console.error("Failed to decode token", e);
          removeAuthToken();
          setSession(null);
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const setDemoMode = (isDemo: boolean) => {
    setIsDemoMode(isDemo);
    localStorage.setItem('demo_mode', String(isDemo));
  };

  const loginState = (token: string, userData: User) => {
    setSession({ access_token: token });
    setUser(userData);
  };

  const signOut = async () => {
    removeAuthToken();
    setSession(null);
    setUser(null);
    setDemoMode(false);
  };

  return (
    <AuthContext.Provider value={{ session, user, isDemoMode, setDemoMode, signOut, isLoading, loginState }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
