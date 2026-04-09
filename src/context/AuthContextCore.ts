import { createContext } from 'react';

export interface AuthContextType {
  isAdmin: boolean;
  isLoading: boolean;
  setIsAdmin: (value: boolean) => void;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  isAdmin: false,
  isLoading: true,
  setIsAdmin: () => {},
  checkAuth: async () => {},
  logout: async () => {} 
});
