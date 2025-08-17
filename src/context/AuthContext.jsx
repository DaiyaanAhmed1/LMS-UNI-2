import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize role from localStorage if present
  const [role, setRole] = useState(() => localStorage.getItem('role') || null);

  const login = (userRole) => {
    setRole(userRole);
    localStorage.setItem('role', userRole);
  };
  const logout = () => {
    setRole(null);
    localStorage.removeItem('role');
  };

  return (
    <AuthContext.Provider value={{ role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
