import { createContext, useContext, useState } from 'react';

// 1. Create the context
const AuthContext = createContext(null);

// 2. Create the provider component
export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null); // Or load from localStorage
  const [token, setToken] = useState(null);

  const login = (adminData, authToken) => {
    setAdmin(adminData);
    setToken(authToken);
  };

  const logout = () => {
    setAdmin(null);
    setToken(null);
  };

  const value = {
    admin,
    token,
    isLoggedIn: !!admin,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 3. Create the custom hook to use the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};