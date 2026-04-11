import { createContext, useContext } from 'react';

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

export const useAuth = () => useContext(AuthContext);
