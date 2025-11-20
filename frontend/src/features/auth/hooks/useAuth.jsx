import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // 1. Initialize state from localStorage (Lazy initialization)
  const [admin, setAdmin] = useState(() => {
    const savedAdmin = localStorage.getItem('adminData');
    return savedAdmin ? JSON.parse(savedAdmin) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('accessToken') || null;
  });

  // 2. Login: Save to State AND localStorage
  const login = (adminData, authToken) => {
    setAdmin(adminData);
    setToken(authToken);
    localStorage.setItem('adminData', JSON.stringify(adminData));
    localStorage.setItem('accessToken', authToken);
  };

  // 3. Logout: Clear State AND localStorage
  const logout = () => {
    setAdmin(null);
    setToken(null);
    localStorage.removeItem('adminData');
    localStorage.removeItem('accessToken');
  };

  const value = {
    admin,
    token,
    isLoggedIn: !!token, // If we have a token, we are logged in
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};