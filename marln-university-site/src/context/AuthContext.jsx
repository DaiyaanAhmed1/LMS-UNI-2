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
    
    // Clear Sage AI limits on logout
    try {
      localStorage.removeItem('sageAIRequests');
      console.log('🗑️ Sage AI limits cleared on logout');
    } catch (error) {
      console.warn('⚠️ Failed to clear Sage AI limits on logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
