import React, { createContext, useContext, useMemo, useState } from 'react';
import { login as loginRequest } from '../api/auth.js';
import { getAuth, setAuth, clearAuth, getToken, getUser, isAuthenticated as storageIsAuth } from '../utils/authStorage.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const initial = getAuth();
  const [token, setToken] = useState(initial?.token || null);
  const [user, setUser] = useState(initial?.user || null);

  const isAuthenticated = Boolean(token);

  const login = async (email, password) => {
    const { token: tk, user: usr } = await loginRequest(email, password);
    setAuth({ token: tk, user: usr });
    setToken(tk);
    setUser(usr);
    return { token: tk, user: usr };
  };

  const logout = () => {
    clearAuth();
    setToken(null);
    setUser(null);
  };

  const hasRole = (roles) => {
    const currentRole = user?.role;
    if (!roles || roles.length === 0) return true;
    return roles.includes(currentRole);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated,
      login,
      logout,
      hasRole
    }),
    [token, user, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}


export const authHelpers = {
  getToken,
  getUser,
  isAuthenticated: storageIsAuth
};

export default AuthContext;
