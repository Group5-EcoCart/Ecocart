/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);
const getStoredJSON = (key) => {
  try {
    const value = localStorage.getItem(key);
    return value && value !== 'undefined' ? JSON.parse(value) : null;
  } catch (err) {
    console.error(`Error parsing ${key} from localStorage:`, err);
    return null;
  }
};
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStoredJSON('user'));
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);

  useEffect(() => {
    setUser(getStoredJSON('user'));
  }, [token]);

  const login = (userData, authToken) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', authToken);
    setUser(userData);
    setToken(authToken);
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export const useAuth = () => {
  return useContext(AuthContext);
};
