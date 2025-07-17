import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, getCurrentUser, setCurrentUser } from '@/lib/storage';

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isLoading: boolean;
  isAdmin: boolean;
  loginAdmin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = (user: User) => {
    setUser(user);
    setCurrentUser(user);
  };

  const loginAdmin = () => {
    setIsAdmin(true);
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    setCurrentUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isLoading,
    isAdmin,
    loginAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};