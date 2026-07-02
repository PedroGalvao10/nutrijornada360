import { useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import { AuthContext } from './AuthContextCore';

// STEP: Cache em escopo de módulo — o resultado de /api/auth/check vale por
// 60s entre remounts do provider (navegações), evitando requisição repetida.
// login/logout invalidam o cache explicitamente.
const AUTH_CACHE_TTL_MS = 60_000;
let cachedIsAdmin: boolean | null = null;
let cachedAt = 0;

export function invalidateAuthCache() {
  cachedIsAdmin = null;
  cachedAt = 0;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async (options?: { force?: boolean }) => {
    const cacheValido = cachedIsAdmin !== null && Date.now() - cachedAt < AUTH_CACHE_TTL_MS;
    if (cacheValido && !options?.force) {
      setIsAdmin(cachedIsAdmin as boolean);
      setIsLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/auth/check');
      cachedIsAdmin = res.ok;
      cachedAt = Date.now();
      setIsAdmin(res.ok);
    } catch {
      cachedIsAdmin = false;
      cachedAt = Date.now();
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      invalidateAuthCache();
      setIsAdmin(false);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const value = useMemo(() => ({
    isAdmin,
    isPremium,
    isLoading,
    setIsAdmin,
    setIsPremium,
    checkAuth,
    logout
  }), [isAdmin, isPremium, isLoading, checkAuth, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
