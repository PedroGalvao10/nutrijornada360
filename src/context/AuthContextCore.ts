import { createContext, useContext } from 'react';

export interface AuthContextType {
  isAdmin: boolean;
  isPremium: boolean;
  isLoading: boolean;
  setIsAdmin: (value: boolean) => void;
  setIsPremium: (value: boolean) => void;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  isAdmin: false,
  isPremium: false,
  isLoading: true,
  setIsAdmin: () => {},
  setIsPremium: () => {},
  checkAuth: async () => {},
  logout: async () => {} 
});

export const useAuth = () => useContext(AuthContext);
